import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { anthropic, CAMPAIGN_AI_MODEL } from "@/lib/anthropic";
import { DELIVERABLE_LABELS } from "@/lib/deliverables";

const TermsSchema = z.object({
  deliveryDays: z.number().int().min(1).max(60),
  deliverables: z.array(z.enum(DELIVERABLE_LABELS as [string, ...string[]])),
  reasoning: z.string(),
});

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { planValue, niches, productName } = await req.json();

  try {
    const response = await anthropic.messages.parse({
      model: CAMPAIGN_AI_MODEL,
      max_tokens: 512,
      system:
        "You set fair delivery terms for a software-for-content barter marketplace. " +
        "Creators get free software access in exchange for posting content within a delivery window. " +
        "Higher-value plans justify more deliverables and/or a slightly longer window; low-value plans should ask for one quick deliverable and a short window. " +
        "Recommend a delivery window in days (typically 7-21) and which deliverable types to request.",
      messages: [
        {
          role: "user",
          content: `Product: ${productName || "(unnamed product)"}\nMonthly plan value: ${planValue ? `$${planValue}` : "not specified"}\nNiches: ${niches?.length ? niches.join(", ") : "not specified"}`,
        },
      ],
      output_config: { format: zodOutputFormat(TermsSchema) },
    });

    if (!response.parsed_output) {
      return NextResponse.json({ error: "Couldn't suggest terms for that." }, { status: 502 });
    }
    return NextResponse.json(response.parsed_output);
  } catch (err) {
    if (err instanceof Error) console.error("suggest-terms failed:", err.message);
    return NextResponse.json({ error: "AI suggestions are unavailable right now." }, { status: 502 });
  }
}
