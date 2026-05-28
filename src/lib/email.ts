import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "Creatorshop <noreply@creatorshop.co>";

// ── Helpers ────────────────────────────────────────────────────────────────────

function fmt(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function daysLeft(deadline: Date) {
  const ms = deadline.getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

// Base HTML wrapper — minimal, on-brand
function html(body: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<style>
  body{margin:0;padding:0;background:#F5F5F5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
  .wrap{max-width:560px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e5e5e5}
  .header{background:#A3FF38;padding:28px 32px;display:flex;align-items:center;gap:10px}
  .logo{font-size:18px;font-weight:700;color:#1a1a1a;letter-spacing:-0.5px}
  .body{padding:32px}
  h1{font-size:22px;font-weight:700;color:#111;margin:0 0 8px}
  p{font-size:15px;color:#444;line-height:1.6;margin:0 0 16px}
  .key-box{background:#F6F6F6;border:1px solid #e5e5e5;border-radius:12px;padding:16px 20px;font-family:monospace;font-size:15px;color:#111;word-break:break-all;margin:16px 0}
  .btn{display:inline-block;padding:12px 24px;background:#A3FF38;border-radius:10px;font-size:14px;font-weight:600;color:#1a1a1a;text-decoration:none;margin:8px 0}
  .meta{font-size:13px;color:#999;padding:16px 32px 24px;border-top:1px solid #f0f0f0}
  .pill{display:inline-block;padding:4px 12px;background:#EDFFD0;border-radius:99px;font-size:12px;font-weight:600;color:#2A6000}
  .warning-pill{display:inline-block;padding:4px 12px;background:#FFF3CD;border-radius:99px;font-size:12px;font-weight:600;color:#856404}
  .danger-pill{display:inline-block;padding:4px 12px;background:#FDECEA;border-radius:99px;font-size:12px;font-weight:600;color:#b91c1c}
</style>
</head>
<body>
<div class="wrap">
  <div class="header"><span class="logo">Creatorshop</span></div>
  <div class="body">${body}</div>
  <div class="meta">You're receiving this because you have an account on Creatorshop.</div>
</div>
</body>
</html>`;
}

// ── Email senders ──────────────────────────────────────────────────────────────

/**
 * 1. Shop approved → Creator
 * Includes decrypted access key, what to deliver, and deadline.
 */
export async function sendShopApproved({
  to,
  creatorName,
  listingName,
  brandName,
  accessKey,
  deliverable,
  deadline,
  shopId,
}: {
  to: string;
  creatorName: string;
  listingName: string;
  brandName: string;
  accessKey: string;
  deliverable: string;
  deadline: Date;
  shopId: string;
}) {
  const body = `
<span class="pill">Application approved</span>
<h1 style="margin-top:16px">You're in, ${creatorName}!</h1>
<p>${brandName} approved your application for <strong>${listingName}</strong>. Your access key is below — it's yours to use immediately.</p>
<div class="key-box">${accessKey}</div>
<p>You need to deliver a <strong>${deliverable.replace(/_/g, " ").toLowerCase()}</strong> by <strong>${fmt(deadline)}</strong> (${daysLeft(deadline)} days from now).</p>
<a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://creatorshop.co"}/shops/${shopId}" class="btn">View your shop →</a>
<p style="margin-top:24px;font-size:13px;color:#999">Don't share this key with anyone. If you miss the deadline your shop will be automatically closed and the key burned.</p>`;

  return resend.emails.send({
    from: FROM,
    to,
    subject: `You're approved for ${listingName}`,
    html: html(body),
  });
}

/**
 * 2. Shop denied → Creator
 */
export async function sendShopDenied({
  to,
  creatorName,
  listingName,
}: {
  to: string;
  creatorName: string;
  listingName: string;
}) {
  const body = `
<h1>Thanks for applying, ${creatorName}</h1>
<p>${listingName} passed on your application this time. This isn't a reflection of your work — brands receive a lot of applications and can only accept a few.</p>
<p>Keep exploring — new listings drop regularly and there are plenty of brands looking for creators like you.</p>
<a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://creatorshop.co"}/explore" class="btn">Browse more listings →</a>`;

  return resend.emails.send({
    from: FROM,
    to,
    subject: `Update on your application for ${listingName}`,
    html: html(body),
  });
}

/**
 * 3. Listing closed → Creator (with pending shop)
 */
export async function sendListingClosed({
  to,
  creatorName,
  listingName,
}: {
  to: string;
  creatorName: string;
  listingName: string;
}) {
  const body = `
<h1>Hey ${creatorName}, a heads-up</h1>
<p>The listing for <strong>${listingName}</strong> has been closed by the brand. This isn't a reflection of your pitch — the listing is no longer active for everyone.</p>
<p>There are still plenty of other software listings waiting for creators like you.</p>
<a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://creatorshop.co"}/explore" class="btn">Explore open listings →</a>`;

  return resend.emails.send({
    from: FROM,
    to,
    subject: `${listingName} listing has closed`,
    html: html(body),
  });
}

/**
 * 4. Deadline reminder (halfway) → Creator
 */
export async function sendDeadlineReminder({
  to,
  creatorName,
  listingName,
  deadline,
  shopId,
}: {
  to: string;
  creatorName: string;
  listingName: string;
  deadline: Date;
  shopId: string;
}) {
  const days = daysLeft(deadline);
  const body = `
<span class="warning-pill">Delivery reminder</span>
<h1 style="margin-top:16px">Halfway there, ${creatorName}</h1>
<p>You're halfway through your delivery window for <strong>${listingName}</strong>. You have <strong>${days} day${days === 1 ? "" : "s"} left</strong> to submit your content link.</p>
<p>Once you've posted your content, come back and submit the link to complete your shop.</p>
<a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://creatorshop.co"}/shops/${shopId}" class="btn">Submit your delivery →</a>`;

  return resend.emails.send({
    from: FROM,
    to,
    subject: `Reminder: ${days} days left to deliver for ${listingName}`,
    html: html(body),
  });
}

/**
 * 5. Deadline final warning (24hrs) → Creator
 */
export async function sendDeadlineWarning({
  to,
  creatorName,
  listingName,
  shopId,
}: {
  to: string;
  creatorName: string;
  listingName: string;
  shopId: string;
}) {
  const body = `
<span class="danger-pill">24 hours left</span>
<h1 style="margin-top:16px">Last chance, ${creatorName}</h1>
<p>Your delivery deadline for <strong>${listingName}</strong> is in less than 24 hours. If you haven't submitted your content link by then, your shop will be automatically closed and your access key burned.</p>
<a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://creatorshop.co"}/shops/${shopId}" class="btn">Submit now →</a>`;

  return resend.emails.send({
    from: FROM,
    to,
    subject: `⚠️ 24 hours left to deliver for ${listingName}`,
    html: html(body),
  });
}

/**
 * 6a. Shop auto-revoked → Creator
 */
export async function sendShopRevokedCreator({
  to,
  creatorName,
  listingName,
}: {
  to: string;
  creatorName: string;
  listingName: string;
}) {
  const body = `
<span class="danger-pill">Shop closed</span>
<h1 style="margin-top:16px">Your shop for ${listingName} has been closed</h1>
<p>Hey ${creatorName}, your delivery deadline for <strong>${listingName}</strong> passed without a submission. Your access key has been burned and your shop is now closed.</p>
<p>You can still browse and apply for other listings.</p>
<a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://creatorshop.co"}/explore" class="btn">Browse listings →</a>`;

  return resend.emails.send({
    from: FROM,
    to,
    subject: `Your shop for ${listingName} has been closed`,
    html: html(body),
  });
}

/**
 * 6b. Shop auto-revoked → Brand
 */
export async function sendShopRevokedBrand({
  to,
  brandName,
  creatorName,
  listingName,
}: {
  to: string;
  brandName: string;
  creatorName: string;
  listingName: string;
}) {
  const body = `
<h1>Key returned: ${creatorName} missed the deadline</h1>
<p>Hey ${brandName}, ${creatorName}'s delivery deadline for <strong>${listingName}</strong> passed without a submission. Their shop has been automatically closed and their access key burned.</p>
<p>The slot is now freed up — you can top up keys on your listing to keep accepting creators.</p>
<a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://creatorshop.co"}/campaigns/listings" class="btn">View your listings →</a>`;

  return resend.emails.send({
    from: FROM,
    to,
    subject: `${creatorName} missed their deadline for ${listingName}`,
    html: html(body),
  });
}

/**
 * 7. New application received → Brand
 */
export async function sendNewApplication({
  to,
  brandName,
  creatorName,
  listingName,
}: {
  to: string;
  brandName: string;
  creatorName: string;
  listingName: string;
}) {
  const body = `
<span class="pill">New application</span>
<h1 style="margin-top:16px">${creatorName} wants to work with you</h1>
<p>Hey ${brandName}, <strong>${creatorName}</strong> just applied for your <strong>${listingName}</strong> listing. Review their pitch and profile to approve or pass.</p>
<a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://creatorshop.co"}/applications" class="btn">Review application →</a>`;

  return resend.emails.send({
    from: FROM,
    to,
    subject: `New application for ${listingName}`,
    html: html(body),
  });
}

/**
 * 8. Creator delivered → Brand
 */
export async function sendCreatorDelivered({
  to,
  brandName,
  creatorName,
  listingName,
  deliveryLink,
  shopId,
}: {
  to: string;
  brandName: string;
  creatorName: string;
  listingName: string;
  deliveryLink: string;
  shopId: string;
}) {
  const body = `
<span class="pill">Content submitted</span>
<h1 style="margin-top:16px">${creatorName} has delivered</h1>
<p>Hey ${brandName}, <strong>${creatorName}</strong> submitted their content for <strong>${listingName}</strong>. Review it and either confirm delivery or revoke the shop.</p>
<p><a href="${deliveryLink}" style="color:#555;word-break:break-all">${deliveryLink}</a></p>
<a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://creatorshop.co"}/shops/${shopId}" class="btn">Review delivery →</a>`;

  return resend.emails.send({
    from: FROM,
    to,
    subject: `${creatorName} delivered for ${listingName}`,
    html: html(body),
  });
}

/**
 * 9. Shop completed → Creator
 */
export async function sendShopCompleted({
  to,
  creatorName,
  listingName,
  brandName,
}: {
  to: string;
  creatorName: string;
  listingName: string;
  brandName: string;
}) {
  const body = `
<span class="pill">Shop complete</span>
<h1 style="margin-top:16px">You did it, ${creatorName}! 🎉</h1>
<p><strong>${brandName}</strong> confirmed your delivery for <strong>${listingName}</strong>. Your shop is complete.</p>
<p>Keep growing. More software listings are waiting.</p>
<a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://creatorshop.co"}/explore" class="btn">Browse more →</a>`;

  return resend.emails.send({
    from: FROM,
    to,
    subject: `Shop complete: ${listingName}`,
    html: html(body),
  });
}
