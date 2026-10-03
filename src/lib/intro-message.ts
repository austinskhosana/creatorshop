import type { BrandAccount, ProductPage, Shopper } from "@/lib/data/brand-schema";

/**
 * The intro a brand sends when it swipes right on a creator. The brand writes it once as a template,
 * and `{first name}` becomes each creator's first name as it goes out.
 */

export const FIRST_NAME_TOKEN = "{first name}";
export const INTRO_MAX_LENGTH = 500;

export const firstNameOf = (name: string) => name.trim().split(/\s+/)[0] ?? name;

/** A starting draft in the brand's own name, for a brand that hasn't written an intro yet. */
export function draftIntro({ ownerName, companyName }: Pick<BrandAccount, "ownerName" | "companyName">) {
  return `Hi ${FIRST_NAME_TOKEN}! I'm ${firstNameOf(ownerName)} from ${companyName}. We came across your profile and think you'd be a great fit — we'd love to collaborate with you.`;
}

/** The template as one creator reads it. Forgiving about spacing and case inside the braces. */
export function fillIntro(template: string, shopper: Pick<Shopper, "name">) {
  return template.replace(/\{\s*first\s+name\s*\}/gi, firstNameOf(shopper.name)).trim();
}

const article = (word: string) => (/^[aeiou]/i.test(word) ? "an" : "a");

/** The message that carries a campaign into the thread, straight after the intro. */
export function campaignMessage(product: Pick<ProductPage, "name" | "tiers">) {
  const tiers = product.tiers.map((tier) => tier.name);
  return `Here's the campaign we have in mind: ${product.name}. Shop it with ${article(tiers[0] ?? "")} ${tiers.join(" or ")} — it's on our storefront whenever you're ready.`;
}
