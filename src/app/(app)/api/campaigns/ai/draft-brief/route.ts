import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { anthropic, CAMPAIGN_AI_MODEL } from "@/lib/anthropic";
import { DELIVERABLE_LABELS } from "@/lib/deliverables";

const BriefSchema = z.object({
  brief: z.string(),
  deliverables: z.array(z.enum(DELIVERABLE_LABELS as [string, ...string[]])),
});

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { description, productName, planName } = await req.json();
  if (!description?.trim()) {
    return NextResponse.json({ error: "Describe the campaign first." }, { status: 400 });
  }

  try {
    const response = await anthropic.messages.parse({
      model: CAMPAIGN_AI_MODEL,
      max_tokens: 1024,
      system:
        "You write creator briefs for a software-for-content barter marketplace. " +
        "A brief tells a creator exactly what to make in exchange for free software access — tone, key messages, what to show, what to avoid. " +
        "Keep it concrete and specific, 3-6 sentences. Also pick the deliverable types that best match the offer.",
      messages: [
        {
          role: "user",
          content: `Product: ${productName || "(unnamed product)"}${planName ? ` — ${planName} plan` : ""}\n\nWhat the brand wants, in their own words:\n${description}`,
        },
      ],
      output_config: { format: zodOutputFormat(BriefSchema) },
    });

    if (!response.parsed_output) {
      return NextResponse.json({ error: "Couldn't draft a brief from that." }, { status: 502 });
    }
    return NextResponse.json(response.parsed_output);
  } catch (err) {
    if (err instanceof Error) console.error("draft-brief failed:", err.message);
    return NextResponse.json({ error: "AI drafting is unavailable right now." }, { status: 502 });
  }
}
