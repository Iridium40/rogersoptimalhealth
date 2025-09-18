import { Request, Response } from "express";
import { Resend } from "resend";
import { z } from "zod";

const subscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function handleNewsletterSubscribe(req: Request, res: Response) {
  try {
    // Validate request body
    const { email } = subscribeSchema.parse(req.body);

    // Create contact in Resend audience (if you have audience management)
    // For now, we'll just log the subscription and send the welcome email
    console.log(`New newsletter subscription: ${email}`);

    // Send welcome email via Resend
    try {
      const fromEmail = process.env.FROM_EMAIL || "hello@rogersoptimalhealth.com";
      await resend.emails.send({
        from: `Lenee Rogers <${fromEmail}>`,
        to: [email],
        subject: "Welcome to Rogers Optimal Health! 🌟",
        html: getWelcomeEmailTemplate(email),
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
      return res.status(400).json({
        error: "Invalid email address",
        details: error.errors,
      });
    }

    res.status(500).json({
      error: "Internal server error. Please try again.",
    });
  }
}

{{ ... }}
