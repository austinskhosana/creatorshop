export const WAITLIST_AUDIENCES = ["brand", "creator"] as const;

export type WaitlistAudience = (typeof WAITLIST_AUDIENCES)[number];

export type WaitlistPayload = {
  audience: WaitlistAudience;
  email: string;
  name?: string;
  companyName?: string;
  website?: string;
  socialHandle?: string;
  platform?: string;
  audienceSize?: string;
  sourcePath?: string;
};

export type WaitlistFieldError = Partial<Record<keyof WaitlistPayload, string>>;

export type WaitlistValidationResult =
  | { ok: true; data: WaitlistPayload }
  | { ok: false; errors: WaitlistFieldError };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function optionalText(value: unknown) {
  const normalized = text(value);
  return normalized ? normalized : undefined;
}

function isWaitlistAudience(value: unknown): value is WaitlistAudience {
  return WAITLIST_AUDIENCES.includes(value as WaitlistAudience);
}

export function validateWaitlistPayload(input: unknown): WaitlistValidationResult {
  if (!input || typeof input !== "object") {
    return { ok: false, errors: { email: "Add a valid email." } };
  }

  const payload = input as Record<string, unknown>;
  const audience = payload.audience;
  const email = text(payload.email).toLowerCase();
  const name = optionalText(payload.name);
  const companyName = optionalText(payload.companyName);
  const website = optionalText(payload.website);
  const socialHandle = optionalText(payload.socialHandle);
  const platform = optionalText(payload.platform);
  const audienceSize = optionalText(payload.audienceSize);
  const sourcePath = optionalText(payload.sourcePath);

  const errors: WaitlistFieldError = {};

  if (!isWaitlistAudience(audience)) {
    errors.audience = "Choose a waitlist.";
  }

  if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Add a valid email.";
  }

  if (audience === "brand") {
    if (!companyName) errors.companyName = "Add your company name.";
    if (!website || !website.includes(".")) errors.website = "Add your website.";
  }

  if (audience === "creator") {
    if (!name) errors.name = "Add your name.";
    if (!socialHandle) errors.socialHandle = "Add your social handle.";
  }

  if (Object.values(errors).some(Boolean)) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      audience: audience as WaitlistAudience,
      email,
      name,
      companyName,
      website,
      socialHandle,
      platform,
      audienceSize,
      sourcePath,
    },
  };
}
