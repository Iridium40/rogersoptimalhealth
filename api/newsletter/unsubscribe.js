import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

/*
 * One-click unsubscribe (RFC 8058).
 *
 * A one-click POST from a mail provider carries only
 * "List-Unsubscribe=One-Click" in the body — the address lives in the URL, so
 * it must be signed. The signature is produced by unsubscribeHeaders() in
 * api/newsletter.js; both sides must use the same algorithm and secret. An
 * unsigned ?e= would let anyone unsubscribe anyone.
 */
function verifiedOneClickEmail(query) {
  const secret = process.env.UNSUBSCRIBE_SECRET;
  if (!secret) return null;

  const q = query || {};
  const email = typeof q.e === "string" ? q.e : null;
  const token = typeof q.t === "string" ? q.t : null;
  if (!email || !token) return null;

  const expected = createHmac("sha256", secret)
    .update(email)
    .digest("hex")
    .slice(0, 32);

  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    console.warn("One-click unsubscribe: signature mismatch");
    return null;
  }
  return email;
}

/**
 * Marks a contact unsubscribed in the Resend audience.
 *
 * Resolves by email address rather than contact id, so no lookup is needed.
 * A 404 means the address was never subscribed — from the caller's point of
 * view that is the same end state, so it is reported as success.
 */
async function unsubscribeFromAudience(email) {
  const resendKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (!resendKey || !audienceId) {
    return { ok: false, error: "Newsletter service is not configured" };
  }

  const response = await fetch(
    `https://api.resend.com/audiences/${audienceId}/contacts/${encodeURIComponent(email)}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ unsubscribed: true }),
    },
  );

  if (response.ok || response.status === 404) return { ok: true };

  const detail = await response.text();
  console.error("Resend unsubscribe failed:", response.status, detail);
  return { ok: false, error: `Resend returned ${response.status}` };
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Accept, Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Only POST requests are supported" });
  }

  try {
    // Two callers: the mail provider's one-click POST (signed address in the
    // URL) and the on-site form (JSON body).
    const oneClick = verifiedOneClickEmail(req.query);

    let email;
    if (oneClick) {
      email = oneClick;
    } else {
      const validation = emailSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: "Please enter a valid email address",
        });
      }
      email = validation.data.email;
    }

    const result = await unsubscribeFromAudience(email);

    if (!result.ok) {
      return res.status(502).json({
        success: false,
        error: "We could not process that just now. Please try again.",
      });
    }

    // Deliberately uniform: never reveal whether an address was on the list.
    return res.json({
      success: true,
      message: "You have been unsubscribed.",
    });
  } catch (error) {
    console.error("Unsubscribe handler error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}
