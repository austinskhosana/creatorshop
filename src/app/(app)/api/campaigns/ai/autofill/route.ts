import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { anthropic, CAMPAIGN_AI_MODEL } from "@/lib/anthropic";

const ListingSchema = z.object({
  productName: z.string().nullable(),
  planName: z.string().nullable(),
  planValue: z.number().nullable(),
  description: z.string().nullable(),
});

function isPrivateHost(hostname: string) {
  const h = hostname.toLowerCase();
  if (h === "localhost" || h === "127.0.0.1" || h === "0.0.0.0" || h === "::1") return true;
  if (/^10\.\d+\.\d+\.\d+$/.test(h)) return true;
  if (/^192\.168\.\d+\.\d+$/.test(h)) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\.\d+\.\d+$/.test(h)) return true;
  if (/^169\.254\.\d+\.\d+$/.test(h)) return true; // incl. cloud metadata endpoint
  return false;
}

function htmlToText(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { url } = await req.json();
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return NextResponse.json({ error: "That doesn't look like a valid URL." }, { status: 400 });
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return NextResponse.json({ error: "Only http/https URLs are supported." }, { status: 400 });
  }
  if (isPrivateHost(parsed.hostname)) {
    return NextResponse.json({ error: "That URL isn't reachable." }, { status: 400 });
  }

  let pageText: string;
  try {
    const pageRes = await fetch(parsed.toString(), {
      signal: AbortSignal.timeout(8000),
      headers: { "User-Agent": "Mozilla/5.0 (compatible; CreatorshopBot/1.0)" },
    });
    if (!pageRes.ok) throw new Error(`Page returned ${pageRes.status}`);
    const html = await pageRes.text();
    pageText = htmlToText(html).slice(0, 15000);
  } catch (err) {
    if (err instanceof Error) console.error("autofill fetch failed:", err.message);
    return NextResponse.json({ error: "Couldn't load that page." }, { status: 502 });
  }

  try {
    const response = await anthropic.messages.parse({
      model: CAMPAIGN_AI_MODEL,
      max_tokens: 1024,
      system:
        "Extract software listing details from raw webpage text for a marketplace where brands offer software access in exchange for content. " +
        "Find the product name, the specific plan/tier name being advertised, its monthly price in USD (a plain number, no currency symbol — null if not found or not a recurring price), " +
        "and a short 1-2 sentence description of what the product does. Use null for any field you can't find — never guess.",
      messages: [
        { role: "user", content: `URL: ${parsed.toString()}\n\nPage content:\n${pageText}` },
      ],
      output_config: { format: zodOutputFormat(ListingSchema) },
    });

    if (!response.parsed_output) {
      return NextResponse.json({ error: "Couldn't extract listing details from that page." }, { status: 502 });
    }
    return NextResponse.json(response.parsed_output);
  } catch (err) {
    if (err instanceof Error) console.error("autofill extraction failed:", err.message);
    return NextResponse.json({ error: "AI extraction is unavailable right now." }, { status: 502 });
  }
}
