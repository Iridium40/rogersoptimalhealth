import { Request, Response } from "express";
import { Resend } from "resend";
import { Client } from "@hubspot/api-client";
import { z } from "zod";

const subscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const resend = new Resend(process.env.RESEND_API_KEY);
const hubspot = new Client({ accessToken: process.env.HUBSPOT_PRIVATE_APP_TOKEN });

export async function handleNewsletterSubscribe(req: Request, res: Response) {
  try {
    // Validate request body
    const { email } = subscribeSchema.parse(req.body);

    // Create or update contact in HubSpot
    try {
      await hubspot.crm.contacts.basicApi.create({
        properties: {
          email,
          lifecyclestage: "subscriber",
          hs_lead_status: "NEW",
          source: "Newsletter Signup",
          website: "rogersoptimalhealth.com",
        },
      });
    } catch (hubspotError: any) {
      // If contact already exists, update it
      if (hubspotError.code === 409) {
        try {
          const existingContact = await hubspot.crm.contacts.basicApi.getByEmail(email);
          await hubspot.crm.contacts.basicApi.update(existingContact.id, {
            properties: {
              lifecyclestage: "subscriber",
              hs_lead_status: "NEW",
              lastmodifieddate: new Date().toISOString(),
            },
          });
        } catch (updateError) {
          console.error("Error updating existing HubSpot contact:", updateError);
        }
      } else {
        console.error("Error creating HubSpot contact:", hubspotError);
        // Continue with email sending even if HubSpot fails
      }
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
