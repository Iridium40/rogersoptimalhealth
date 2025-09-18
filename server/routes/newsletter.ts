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
