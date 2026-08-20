import { z } from "zod";

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

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
    const validation = emailSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: "Please enter a valid email address",
      });
    }

    const result = await unsubscribeFromAudience(validation.data.email);

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
