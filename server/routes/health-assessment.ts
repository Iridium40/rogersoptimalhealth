import type { RequestHandler } from "express";
import nodemailer from "nodemailer";
import { z } from "zod";
import type {
  HealthAssessmentRequest,
  HealthAssessmentResponse,
} from "@shared/api";

const schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional().default(""),
  date: z.string().optional().default(""),
  dob: z.string().optional().default(""),
  howHeard: z.string().optional().default(""),
  goalsCurrentState: z.string().min(1),
  goalsWhy: z.string().optional().default(""),
  pregnant: z.boolean().optional().default(false),
  nursing: z.boolean().optional().default(false),
  babyAgeMonths: z.string().optional().default(""),
  diabetesType1: z.boolean().optional().default(false),
  diabetesType2: z.boolean().optional().default(false),
  highBloodPressure: z.boolean().optional().default(false),
  highCholesterol: z.boolean().optional().default(false),
  gout: z.boolean().optional().default(false),
  ibs: z.boolean().optional().default(false),
  otherConditions: z.string().optional().default(""),
  onMedications: z.boolean().optional().default(false),
  medications: z.string().optional().default(""),
  sleepQuality: z.number().int().min(1).max(5).optional().default(0),
  energyLevel: z.number().int().min(1).max(5).optional().default(0),
  mealsPerDay: z.number().int().min(0).max(15).optional().default(0),
  snacksPerDay: z.number().int().min(0).max(20).optional().default(0),
  waterIntakeOz: z.number().int().min(0).max(1000).optional().default(0),
  caffeinePerDay: z.number().int().min(0).max(30).optional().default(0),
  alcoholPerWeek: z.number().int().min(0).max(50).optional().default(0),
  exerciseDaysPerWeek: z.number().int().min(0).max(14).optional().default(0),
  exerciseTypes: z.string().optional().default(""),
  wakeTime: z.string().optional().default(""),
  bedTime: z.string().optional().default(""),
  commitment: z.number().int().min(1).max(10).optional().default(0),
  additionalNotes: z.string().optional().default(""),
});

function htmlEscape(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export const handleHealthAssessment: RequestHandler = async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ ok: false, error: parsed.error.flatten() });
  }
  const data = parsed.data as HealthAssessmentRequest;

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT
    ? Number(process.env.SMTP_PORT)
    : undefined;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || smtpUser || "no-reply@example.com";
  const to = "Leneerogers@gmail.com";

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
    return res.status(500).json({
      ok: false,
      error: "SMTP not configured (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS)",
    });
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465, // true for 465, false for other ports
    auth: { user: smtpUser, pass: smtpPass },
  });

  const fullName = `${data.firstName} ${data.lastName}`.trim();
  const subject = `${fullName} + Health Assessment`;

  const bool = (v?: boolean) => (v ? "Yes" : "No");

  const html = `
  <div style="font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; line-height:1.5; color:#111">
    <h2 style="margin:0 0 12px">New Health Assessment</h2>
    <p style="margin:0 0 16px">Submitted on ${htmlEscape(data.date || new Date().toLocaleString())}</p>
    <h3 style="margin:24px 0 8px">Contact</h3>
    <table style="border-collapse:collapse; width:100%" border="0" cellpadding="6">
      <tr><td><strong>Name</strong></td><td>${htmlEscape(fullName)}</td></tr>
      <tr><td><strong>Email</strong></td><td>${htmlEscape(data.email)}</td></tr>
      <tr><td><strong>Phone</strong></td><td>${htmlEscape(data.phone || "")}</td></tr>
      <tr><td><strong>Date of Birth</strong></td><td>${htmlEscape(data.dob || "")}</td></tr>
      <tr><td><strong>How did you hear?</strong></td><td>${htmlEscape(data.howHeard || "")}</td></tr>
    </table>
    <h3 style="margin:24px 0 8px">Goals</h3>
    <p><strong>Current state:</strong><br/>${htmlEscape(data.goalsCurrentState)}</p>
    ${data.goalsWhy ? `<p><strong>Why / Dream Goals:</strong><br/>${htmlEscape(data.goalsWhy)}</p>` : ""}

    <h3 style="margin:24px 0 8px">Medical</h3>
    <table style="border-collapse:collapse; width:100%" border="0" cellpadding="6">
      <tr><td>Pregnant</td><td>${bool(data.pregnant)}</td></tr>
      <tr><td>Nursing</td><td>${bool(data.nursing)}${data.babyAgeMonths ? ` (Baby age: ${htmlEscape(data.babyAgeMonths)} months)` : ""}</td></tr>
      <tr><td>Diabetes</td><td>${data.diabetesType1 ? "Type 1" : ""}${data.diabetesType1 && data.diabetesType2 ? ", " : ""}${data.diabetesType2 ? "Type 2" : ""}</td></tr>
      <tr><td>High Blood Pressure</td><td>${bool(data.highBloodPressure)}</td></tr>
      <tr><td>High Cholesterol</td><td>${bool(data.highCholesterol)}</td></tr>
      <tr><td>Gout</td><td>${bool(data.gout)}</td></tr>
      <tr><td>IBS</td><td>${bool(data.ibs)}</td></tr>
      ${data.otherConditions ? `<tr><td>Other Conditions</td><td>${htmlEscape(data.otherConditions)}</td></tr>` : ""}
      <tr><td>On Medications</td><td>${bool(data.onMedications)}</td></tr>
      ${data.medications ? `<tr><td>Medications</td><td>${htmlEscape(data.medications)}</td></tr>` : ""}
    </table>

    <h3 style="margin:24px 0 8px">Habits</h3>
    <table style="border-collapse:collapse; width:100%" border="0" cellpadding="6">
      ${data.sleepQuality ? `<tr><td>Sleep Quality (1-5)</td><td>${data.sleepQuality}</td></tr>` : ""}
      ${data.energyLevel ? `<tr><td>Energy Level (1-5)</td><td>${data.energyLevel}</td></tr>` : ""}
      ${data.mealsPerDay ? `<tr><td>Meals Per Day</td><td>${data.mealsPerDay}</td></tr>` : ""}
      ${data.snacksPerDay ? `<tr><td>Snacks Per Day</td><td>${data.snacksPerDay}</td></tr>` : ""}
      ${data.waterIntakeOz ? `<tr><td>Water Intake (oz)</td><td>${data.waterIntakeOz}</td></tr>` : ""}
      ${data.caffeinePerDay ? `<tr><td>Caffeine (cups/day)</td><td>${data.caffeinePerDay}</td></tr>` : ""}
      ${data.alcoholPerWeek ? `<tr><td>Alcohol (drinks/week)</td><td>${data.alcoholPerWeek}</td></tr>` : ""}
      ${data.exerciseDaysPerWeek ? `<tr><td>Exercise Days / Week</td><td>${data.exerciseDaysPerWeek}</td></tr>` : ""}
      ${data.exerciseTypes ? `<tr><td>Exercise Types</td><td>${htmlEscape(data.exerciseTypes)}</td></tr>` : ""}
      ${data.wakeTime ? `<tr><td>Wake Time</td><td>${htmlEscape(data.wakeTime)}</td></tr>` : ""}
      ${data.bedTime ? `<tr><td>Bed Time</td><td>${htmlEscape(data.bedTime)}</td></tr>` : ""}
      ${data.commitment ? `<tr><td>Commitment (1-10)</td><td>${data.commitment}</td></tr>` : ""}
    </table>

    ${data.additionalNotes ? `<h3 style=\"margin:24px 0 8px\">Additional Notes</h3><p>${htmlEscape(data.additionalNotes)}</p>` : ""}
  </div>`;

  try {
    await transporter.sendMail({
      from,
      to,
      subject,
      html,
      replyTo: data.email,
    });
    const resp: HealthAssessmentResponse = { ok: true };
    return res.json(resp);
  } catch (err) {
    console.error("Error sending email:", err);
    return res.status(500).json({ ok: false, error: "Failed to send email" });
  }
};
