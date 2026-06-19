import Anthropic from "@anthropic-ai/sdk";

export const anthropic = new Anthropic();

// Sonnet 4.6 — these are bounded extraction/drafting tasks (not deep
// reasoning), so the cheaper tier is the right default here.
export const CAMPAIGN_AI_MODEL = "claude-sonnet-4-6";
