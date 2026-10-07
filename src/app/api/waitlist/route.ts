import { validateWaitlistPayload } from "@/lib/waitlist";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, message: "Send valid JSON." }, { status: 400 });
  }

  const result = validateWaitlistPayload(body);

  if (!result.ok) {
    return Response.json({ ok: false, errors: result.errors }, { status: 400 });
  }

  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return Response.json(
      { ok: false, message: "Waitlist storage is not configured yet." },
      { status: 503 },
    );
  }

  const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/waitlist_entries`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      audience: result.data.audience,
      email: result.data.email,
      name: result.data.name,
      company_name: result.data.companyName,
      website: result.data.website,
      social_handle: result.data.socialHandle,
      platform: result.data.platform,
      audience_size: result.data.audienceSize,
      source_path: result.data.sourcePath,
      metadata: {},
    }),
  });

  if (response.ok || response.status === 409) {
    return Response.json({ ok: true, duplicate: response.status === 409 });
  }

  return Response.json(
    { ok: false, message: "We could not save your spot. Try again in a moment." },
    { status: 502 },
  );
}
