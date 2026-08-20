import { createHmac } from "node:crypto";
import { Resend } from "resend";
import { z } from "zod";

const subscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
  // Turnstile token. nullish, not optional: the client sends `token: null`
  // when no site key is configured, and .optional() only accepts undefined.
  token: z.string().nullish(),
});

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate request body
    const { email, token } = subscribeSchema.parse(req.body);

    // 1. Verify Turnstile token if configured
    if (process.env.TURNSTILE_SECRET_KEY) {
      if (!token) {
        return res.status(400).json({
          error: "Verification failed. Please try again.",
        });
      }

      try {
        const turnstileResponse = await fetch(
          "https://challenges.cloudflare.com/turnstile/v0/siteverify",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              secret: process.env.TURNSTILE_SECRET_KEY,
              response: token,
            }),
          }
        );

        const turnstileData = await turnstileResponse.json();

        if (!turnstileData.success) {
          console.error("Turnstile verification failed:", turnstileData);
          return res.status(400).json({
            error: "Verification failed. Please try again.",
          });
        }

        console.log("Turnstile verification successful");
      } catch (turnstileError) {
        console.error("Turnstile verification error:", turnstileError);
        return res.status(500).json({
          error: "Verification service error. Please try again later.",
        });
      }
    }

    // 2. Basic email format validation (already done by Zod, but additional regex check)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Invalid email format",
      });
    }

    // 3. Verify email with Emailable (if configured)
    if (process.env.EMAILABLE_API_KEY) {
      try {
        const emailableResponse = await fetch(
          `https://api.emailable.com/v1/verify?email=${encodeURIComponent(email)}&api_key=${process.env.EMAILABLE_API_KEY}`
        );

        if (!emailableResponse.ok) {
          console.error(
            `Emailable API error: ${emailableResponse.status} ${emailableResponse.statusText}`
          );
          // Continue with subscription if API call fails (graceful fallback)
        } else {
          const emailableResult = await emailableResponse.json();

          // Reject invalid emails based on Emailable verification
          if (
            emailableResult.state === "undeliverable" ||
            emailableResult.state === "risky"
          ) {
            console.log(
              `Email rejected by Emailable: ${email} - state: ${emailableResult.state}`
            );
            return res.status(400).json({
              error: "Please enter a valid email address",
            });
          }

          // Log verification result for monitoring
          console.log(
            `Email verified by Emailable: ${email} - state: ${emailableResult.state}`
          );
        }
      } catch (emailableError) {
        console.error("Emailable verification error:", emailableError);
        // Continue with subscription even if Emailable verification fails
        // to avoid blocking legitimate users due to service issues
      }
    }

    // Create contact in Resend audience
    try {
      const audienceId = process.env.RESEND_AUDIENCE_ID;
      if (audienceId && process.env.RESEND_API_KEY) {
        const response = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            unsubscribed: false,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error creating Resend contact:", errorData);
          // Continue with email sending even if contact creation fails
        } else {
          console.log(`Successfully added ${email} to Resend audience`);
        }
      } else {
        console.log(`New newsletter subscription: ${email} (audience creation skipped - missing config)`);
      }
    } catch (contactError) {
      console.error("Error creating Resend contact:", contactError);
      // Continue with email sending even if contact creation fails
    }

    // Send welcome email via Resend
    try {
      const fromEmail = process.env.FROM_EMAIL || "lenee@rogersoptimalhealth.com";
      await resend.emails.send({
        from: `Lenee Rogers <${fromEmail}>`,
        to: [email],
        replyTo: fromEmail,
        subject: "Welcome — I'm so glad you're here",
        html: getWelcomeEmailTemplate(email),
        text: getWelcomeEmailText(email),
        headers: unsubscribeHeaders(email),
      });
    } catch (emailError) {
      console.error("Error sending welcome email:", emailError);
      return res.status(500).json({
        error: "Failed to send welcome email. Please try again.",
      });
    }

    res.json({
      success: true,
      message: "Successfully subscribed to newsletter",
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    
    if (error instanceof z.ZodError) {
      // Report the field that actually failed — a blanket "Invalid email
      // address" is misleading when the problem is another field.
      const emailFailed = error.errors.some((e) => e.path[0] === "email");
      return res.status(400).json({
        error: emailFailed ? "Invalid email address" : "Invalid request",
        details: error.errors,
      });
    }

    res.status(500).json({
      error: "Internal server error. Please try again.",
    });
  }
}

const BRAND = {
  site: "https://rogersoptimalhealth.com",
  logo: "https://vnxhtswabbhasfgtydvt.supabase.co/storage/v1/object/public/brand_media_assets/239e8c79-f5fd-466c-944f-772eed670dfa/239e8c79-f5fd-466c-944f-772eed670dfa-1787247916956-ovveed.jpg",
  primary: "#5B8C5A",
  secondary: "#2D5A4A",
  accent: "#E8A54B",
  muted: "#78716C",
  body: "#3F3F46",
  page: "#FAFAF9",
};

// Must appear verbatim at the end of every email.
const TRILIVY_DISCLOSURE =
  "This content is provided by an independent Trilivy health coach and is for general informational purposes only. It is not medical advice, and your coach is not a medical provider. The Trilivy 5&1 Reset is not appropriate for everyone — it is not intended for women who are pregnant or nursing, people under 18, sedentary adults 65+, people with gout, or those managing Type 1 diabetes. Consult your healthcare provider before starting this or any weight-loss program, especially if you take medications for diabetes, blood pressure, or thyroid conditions, or medications such as Coumadin (warfarin), lithium, or diuretics. Individual results vary. If you experience unusual symptoms or unusually rapid weight loss, stop and contact your healthcare provider.";

const FONT =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

function unsubscribeUrl(email) {
  return `${BRAND.site}/unsubscribe?email=${encodeURIComponent(email)}`;
}

function unsubscribeMailto(email) {
  return `mailto:lenee@rogersoptimalhealth.com?subject=${encodeURIComponent(
    "Unsubscribe",
  )}&body=${encodeURIComponent(`Please unsubscribe ${email} from the newsletter.`)}`;
}

/*
 * One-click unsubscribe (RFC 8058).
 *
 * A one-click POST carries only "List-Unsubscribe=One-Click" in the body — the
 * recipient is identified entirely by the URL. So the address is signed here
 * and verified in api/newsletter/unsubscribe.js, which must use the same
 * algorithm and secret.
 *
 * Without UNSUBSCRIBE_SECRET we cannot sign, so List-Unsubscribe-Post is
 * omitted and the header points at the page instead. Declaring one-click
 * against a URL that cannot honour it is worse than not declaring it: the mail
 * provider reports success to the reader while nothing is unsubscribed.
 */
function unsubscribeHeaders(email) {
  const secret = process.env.UNSUBSCRIBE_SECRET;
  const mailto = `<${unsubscribeMailto(email)}>`;

  if (!secret) {
    return {
      "List-Unsubscribe": `${mailto}, <${unsubscribeUrl(email)}>`,
    };
  }

  const token = createHmac("sha256", secret)
    .update(email)
    .digest("hex")
    .slice(0, 32);
  const url =
    `${BRAND.site}/api/newsletter/unsubscribe` +
    `?e=${encodeURIComponent(email)}&t=${token}`;

  return {
    "List-Unsubscribe": `${mailto}, <${url}>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
  };
}

function getWelcomeEmailTemplate(email) {
  // Gold (#E8A54B) is decorative only: it sits at 2.1:1 on white, so it never
  // carries text. Each checkmark is paired with a word, never colour alone.
  const check = `<span style="color:${BRAND.accent};font-weight:700;" aria-hidden="true">&#10003;</span>`;

  const bullet = (title, text) => `
              <tr>
                <td style="padding:0 0 14px 0;font-family:${FONT};font-size:16px;line-height:1.6;color:${BRAND.body};">
                  ${check}&nbsp;<strong style="color:${BRAND.secondary};">${title}</strong><br>
                  <span style="color:${BRAND.body};">${text}</span>
                </td>
              </tr>`;

  return `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>Welcome to the Rogers Optimal Health newsletter</title>
</head>
<body style="margin:0;padding:0;background-color:${BRAND.page};">
  <div lang="en" dir="ltr" style="margin:0;padding:0;">

    <!-- Preheader: shown in the inbox preview, hidden in the body. -->
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">
      I'm so glad you're here. Here's what to expect — and there's no rush.
    </div>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:${BRAND.page};">
      <tr>
        <td align="center" style="padding:24px 12px;">

          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px;max-width:600px;background-color:#FFFFFF;border-radius:12px;">

            <!-- Header: white background, logo linked to the site -->
            <tr>
              <td align="center" style="padding:32px 32px 8px 32px;">
                <a href="${BRAND.site}" style="text-decoration:none;">
                  <img src="${BRAND.logo}" width="132" height="132" alt="Rogers Optimal Health" style="display:block;width:132px;height:132px;border:0;outline:none;">
                </a>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding:8px 32px 0 32px;">
                <h1 style="margin:0;font-family:${FONT};font-size:26px;line-height:1.3;font-weight:700;color:${BRAND.primary};">
                  Welcome — I'm so glad you're here
                </h1>
              </td>
            </tr>

            <!-- Accent rule -->
            <tr>
              <td align="center" style="padding:18px 32px 0 32px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                  <tr><td style="width:56px;height:3px;background-color:${BRAND.accent};border-radius:2px;font-size:0;line-height:0;">&nbsp;</td></tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:24px 32px 0 32px;font-family:${FONT};font-size:16px;line-height:1.65;color:${BRAND.body};">
                <p style="margin:0 0 16px 0;">Hi there,</p>
                <p style="margin:0 0 16px 0;">
                  Thank you for subscribing. I'm Lenee Rogers, an Independent Trilivy
                  Certified Health Coach — and someone who has walked this road myself,
                  so I know how it feels to start again.
                </p>
                <p style="margin:0 0 24px 0;">
                  This isn't about doing everything at once. It's about small,
                  sustainable changes that hold up on ordinary weeks.
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:0 32px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#F5F7F4;border-radius:10px;">
                  <tr>
                    <td style="padding:22px 22px 8px 22px;">
                      <h2 style="margin:0 0 14px 0;font-family:${FONT};font-size:18px;line-height:1.4;font-weight:700;color:${BRAND.secondary};">
                        What lands in your inbox
                      </h2>
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
${bullet("Practical tips", "Small changes you can actually keep, without overhauling your life.")}
${bullet("Lean &amp; Green recipes", "Simple meals worth repeating on a busy weeknight.")}
${bullet("Encouragement", "Including the wins the scale never shows you.")}
${bullet("Coaching resources", "Shared as they're ready — no pressure to use them.")}
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:24px 32px 0 32px;font-family:${FONT};font-size:16px;line-height:1.65;color:${BRAND.body};">
                <p style="margin:0;">
                  If and when you'd like to talk through what this could look like for
                  you, I'd love to hear from you. There's no rush, and no pressure —
                  whenever you're ready.
                </p>
              </td>
            </tr>

            <!-- CTA: primary green, white text, rounded -->
            <tr>
              <td align="center" style="padding:26px 32px 4px 32px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td align="center" style="background-color:${BRAND.primary};border-radius:8px;">
                      <a href="${BRAND.site}/book-assessment" style="display:inline-block;padding:15px 30px;font-family:${FONT};font-size:19px;line-height:1.2;font-weight:700;color:#FFFFFF;text-decoration:none;">
                        Book a free health assessment
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding:14px 32px 0 32px;font-family:${FONT};font-size:14px;line-height:1.6;color:${BRAND.muted};">
                Or just reply to this email — it comes straight to me.
              </td>
            </tr>

            <!-- Signature -->
            <tr>
              <td style="padding:28px 32px 32px 32px;font-family:${FONT};font-size:16px;line-height:1.6;color:${BRAND.body};">
                <p style="margin:0;">Warmly,</p>
                <p style="margin:4px 0 0 0;font-weight:700;color:${BRAND.secondary};">Lenee Rogers</p>
                <p style="margin:2px 0 0 0;font-size:14px;color:${BRAND.muted};">Independent Trilivy Certified Health Coach</p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:0 32px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr><td style="height:1px;background-color:#E7E5E4;font-size:0;line-height:0;">&nbsp;</td></tr>
                </table>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding:24px 32px 0 32px;">
                <img src="${BRAND.logo}" width="56" height="56" alt="" style="display:block;width:56px;height:56px;border:0;outline:none;">
              </td>
            </tr>

            <tr>
              <td align="center" style="padding:12px 32px 0 32px;font-family:${FONT};font-size:13px;line-height:1.6;color:${BRAND.muted};">
                <a href="${BRAND.site}" style="color:${BRAND.muted};text-decoration:underline;">rogersoptimalhealth.com</a>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding:10px 32px 0 32px;font-family:${FONT};font-size:13px;line-height:1.6;color:${BRAND.muted};">
                You're receiving this because you subscribed at ${email}.<br>
                <a href="${unsubscribeUrl(email)}" style="color:${BRAND.muted};text-decoration:underline;">Unsubscribe from these emails</a>
              </td>
            </tr>

            <tr>
              <td style="padding:18px 32px 32px 32px;font-family:${FONT};font-size:12px;line-height:1.6;color:${BRAND.muted};">
                ${TRILIVY_DISCLOSURE}
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>`;
}

function getWelcomeEmailText(email) {
  return `Welcome — I'm so glad you're here

Hi there,

Thank you for subscribing. I'm Lenee Rogers, an Independent Trilivy Certified
Health Coach — and someone who has walked this road myself, so I know how it
feels to start again.

This isn't about doing everything at once. It's about small, sustainable
changes that hold up on ordinary weeks.

WHAT LANDS IN YOUR INBOX

* Practical tips - Small changes you can actually keep, without overhauling
  your life.
* Lean & Green recipes - Simple meals worth repeating on a busy weeknight.
* Encouragement - Including the wins the scale never shows you.
* Coaching resources - Shared as they're ready, no pressure to use them.

If and when you'd like to talk through what this could look like for you, I'd
love to hear from you. There's no rush, and no pressure — whenever you're ready.

Book a free health assessment: ${BRAND.site}/book-assessment

Or just reply to this email — it comes straight to me.

Warmly,
Lenee Rogers
Independent Trilivy Certified Health Coach

${BRAND.site}

You're receiving this because you subscribed at ${email}.
To unsubscribe: ${unsubscribeUrl(email)}

${TRILIVY_DISCLOSURE}
`;
}
