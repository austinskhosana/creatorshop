import { validateWaitlistPayload } from "@/lib/waitlist";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] ?? character);
}

async function sendWaitlistEmails(data: { audience: "brand" | "creator"; email: string; name?: string; companyName?: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.WAITLIST_FROM_EMAIL;
  const notificationEmail = process.env.WAITLIST_NOTIFICATION_EMAIL;

  if (!apiKey || !from || !notificationEmail) return;

  const label = data.audience === "creator" ? "creator" : "brand";
  const greeting = data.name || data.companyName || "there";
  const headers = { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
  const messages = [
    {
      from,
      to: [data.email],
      subject: "You’re on the Creatorshop waitlist",
      html: `<p>Hi ${escapeHtml(greeting)},</p><p>You’re on the ${label} waitlist. We’ll be in touch when the next access batch opens.</p><p>— Creatorshop</p>`,
    },
    {
      from,
      to: [notificationEmail],
      subject: `New ${label} waitlist signup`,
      html: `<p>A new ${label} joined the waitlist.</p><p>Email: ${escapeHtml(data.email)}</p><p>Name or company: ${escapeHtml(greeting)}</p>`,
    },
  ];

  const responses = await Promise.all(
    messages.map((message) => fetch("https://api.resend.com/emails", { method: "POST", headers, body: JSON.stringify(message) })),
  );
  if (responses.some((response) => !response.ok)) throw new Error("Resend email failed");
}

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
    if (response.ok) {
      try {
        await sendWaitlistEmails(result.data);
      } catch {
        // Email delivery should not make a successful waitlist signup fail.
      }
    }
    return Response.json({ ok: true, duplicate: response.status === 409 });
  }

  return Response.json(
    { ok: false, message: "We could not save your spot. Try again in a moment." },
    { status: 502 },
  );
}
