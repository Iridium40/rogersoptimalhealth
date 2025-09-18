import { Resend } from "resend";
import { z } from "zod";

const subscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
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

function getWelcomeEmailTemplate(email) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Rogers Optimal Health!</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .highlight { background: #667eea; color: white; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .cta { background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🌟 Welcome to Rogers Optimal Health!</h1>
        <p>Your journey to optimal health starts now</p>
      </div>
      
      <div class="content">
        <p>Hi there!</p>
        
        <p>Thank you so much for subscribing to the Rogers Optimal Health newsletter! I'm Lenee Rogers, your Independent OPTAVIA Certified Health Coach, and I'm thrilled to have you join our community.</p>
        
        <div class="highlight">
          <h3>🎯 What to Expect:</h3>
          <ul>
            <li><strong>Weekly Health Tips:</strong> Practical advice for sustainable lifestyle changes</li>
            <li><strong>Lean & Green Recipes:</strong> Delicious, healthy meal ideas</li>
            <li><strong>Success Stories:</strong> Inspiration from our community</li>
            <li><strong>Exclusive Content:</strong> Early access to new programs and resources</li>
          </ul>
        </div>
        
        <p>As someone who has personally experienced the transformative power of optimal health, I understand the challenges and victories that come with this journey. Whether you're looking to:</p>
        
        <ul>
          <li>Lose weight sustainably</li>
          <li>Increase your energy levels</li>
          <li>Develop healthier habits</li>
          <li>Feel confident in your own skin</li>
        </ul>
        
        <p>I'm here to support you every step of the way!</p>
        
        <a href="https://rogersoptimalhealth.com/get-started" class="cta">🚀 Start Your Journey Today</a>
        
        <p>Feel free to reply to this email with any questions or just to say hello - I love hearing from our community members!</p>
        
        <p>To your optimal health,<br>
        <strong>Lenee Rogers</strong><br>
        Independent OPTAVIA Certified Health Coach</p>
      </div>
      
      <div class="footer">
        <p>Rogers Optimal Health | <a href="https://rogersoptimalhealth.com">rogersoptimalhealth.com</a></p>
        <p>You're receiving this because you subscribed to our newsletter at ${email}</p>
      </div>
    </body>
    </html>
  `;
}
