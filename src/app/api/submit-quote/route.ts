import { after } from "next/server";
import nodemailer from "nodemailer";

/* Lead handling runs AFTER the response is sent (via `after`), so the
   visitor isn't kept waiting on a slow SMTP handshake + CRM round-trip.
   Previously both ran sequentially and were fully awaited before the
   response, so the form spinner = email time + CRM time (often 5–10s).
   On Vercel `after` keeps the function alive until these settle, so the
   email + CRM lead still go out reliably. */

type QuoteBody = {
  fullName: string;
  email: string;
  phone: string;
  movingFrom: string;
  movingTo: string;
  moveDate: string;
  moveSize: string;
  message: string;
};

async function sendEmail(b: QuoteBody) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"GOAT Moving" <${process.env.SMTP_USER}>`,
    to: process.env.NOTIFICATION_EMAIL,
    subject: `New Quote Request from ${b.fullName}`,
    html: `
      <h2>New Quote Request</h2>
      <table style="border-collapse:collapse;font-family:sans-serif;">
        <tr><td style="padding:6px 12px;font-weight:bold;">Name</td><td style="padding:6px 12px;">${b.fullName}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:bold;">Email</td><td style="padding:6px 12px;">${b.email || "N/A"}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:bold;">Phone</td><td style="padding:6px 12px;">${b.phone}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:bold;">Moving From</td><td style="padding:6px 12px;">${b.movingFrom || "N/A"}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:bold;">Moving To</td><td style="padding:6px 12px;">${b.movingTo || "N/A"}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:bold;">Move Date</td><td style="padding:6px 12px;">${b.moveDate || "N/A"}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:bold;">Move Size</td><td style="padding:6px 12px;">${b.moveSize || "N/A"}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:bold;">Message</td><td style="padding:6px 12px;">${b.message || "N/A"}</td></tr>
      </table>
    `,
  });
}

async function sendToCrm(b: QuoteBody) {
  // Convert MM/DD/YYYY → YYYY-MM-DD for CRM
  let crmDate = "";
  if (b.moveDate) {
    const parts = b.moveDate.split("/");
    if (parts.length === 3) {
      crmDate = `${parts[2]}-${parts[0]}-${parts[1]}`;
    }
  }

  const crmPayload = {
    data: {
      field_first_name: b.fullName,
      field_e_mail: b.email || "",
      field_phone: b.phone,
      company_name: "source-website",
      thoroughfare_from: b.movingFrom,
      thoroughfare_to: b.movingTo,
      moving_from_zip: "",
      moving_to_zip: "",
      field_date: crmDate,
      field_move_service_type: b.moveSize,
      field_additional_comments: b.message,
      field_last_name: "n/a",
      provider_id: 50,
    },
  };

  const crmRes = await fetch(
    "https://api.goatmovers.org/server/parser/get_lead_parsing",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(crmPayload),
    },
  );

  if (!crmRes.ok) {
    throw new Error(`CRM response not ok: ${crmRes.status} ${await crmRes.text()}`);
  }
}

export async function POST(request: Request) {
  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const lead: QuoteBody = {
    fullName: body.fullName ?? "",
    email: body.email ?? "",
    phone: body.phone ?? "",
    movingFrom: body.movingFrom ?? "",
    movingTo: body.movingTo ?? "",
    moveDate: body.moveDate ?? "",
    moveSize: body.moveSize ?? "",
    message: body.message ?? "",
  };

  if (!lead.fullName || !lead.phone) {
    return Response.json(
      { error: "Name and phone are required" },
      { status: 400 },
    );
  }

  /* Fire email + CRM in parallel AFTER responding — the visitor gets an
     instant confirmation while delivery happens in the background. */
  after(async () => {
    const [emailResult, crmResult] = await Promise.allSettled([
      sendEmail(lead),
      sendToCrm(lead),
    ]);
    if (emailResult.status === "rejected") {
      console.error("Email send failed:", emailResult.reason);
    }
    if (crmResult.status === "rejected") {
      console.error("CRM send failed:", crmResult.reason);
    }
  });

  return Response.json({ success: true });
}
