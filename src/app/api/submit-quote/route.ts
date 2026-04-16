import nodemailer from "nodemailer";

export async function POST(request: Request) {
  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    fullName = "",
    email = "",
    phone = "",
    movingFrom = "",
    movingTo = "",
    moveDate = "",
    moveSize = "",
    message = "",
  } = body;

  if (!fullName || !phone) {
    return Response.json(
      { error: "Name and phone are required" },
      { status: 400 },
    );
  }

  const errors: string[] = [];

  // ── 1. Send email notification ──────────────────────────────────────
  try {
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
      subject: `New Quote Request from ${fullName}`,
      html: `
        <h2>New Quote Request</h2>
        <table style="border-collapse:collapse;font-family:sans-serif;">
          <tr><td style="padding:6px 12px;font-weight:bold;">Name</td><td style="padding:6px 12px;">${fullName}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:bold;">Email</td><td style="padding:6px 12px;">${email || "N/A"}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:bold;">Phone</td><td style="padding:6px 12px;">${phone}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:bold;">Moving From</td><td style="padding:6px 12px;">${movingFrom || "N/A"}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:bold;">Moving To</td><td style="padding:6px 12px;">${movingTo || "N/A"}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:bold;">Move Date</td><td style="padding:6px 12px;">${moveDate || "N/A"}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:bold;">Move Size</td><td style="padding:6px 12px;">${moveSize || "N/A"}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:bold;">Message</td><td style="padding:6px 12px;">${message || "N/A"}</td></tr>
        </table>
      `,
    });
  } catch (err) {
    console.error("Email send failed:", err);
    errors.push("email");
  }

  // ── 2. Send lead to MoveBoard CRM ───────────────────────────────────
  // Convert MM/DD/YYYY → YYYY-MM-DD for CRM
  let crmDate = "";
  if (moveDate) {
    const parts = moveDate.split("/");
    if (parts.length === 3) {
      crmDate = `${parts[2]}-${parts[0]}-${parts[1]}`;
    }
  }

  try {
    const crmPayload = {
      data: {
        field_first_name: fullName,
        field_e_mail: email || "",
        field_phone: phone,
        company_name: "source-website",
        thoroughfare_from: movingFrom,
        thoroughfare_to: movingTo,
        moving_from_zip: "",
        moving_to_zip: "",
        field_date: crmDate,
        field_move_service_type: moveSize,
        field_additional_comments: message,
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
      console.error("CRM response not ok:", crmRes.status, await crmRes.text());
      errors.push("crm");
    }
  } catch (err) {
    console.error("CRM send failed:", err);
    errors.push("crm");
  }

  if (errors.length === 2) {
    return Response.json(
      { error: "Failed to process request" },
      { status: 500 },
    );
  }

  return Response.json({ success: true, warnings: errors });
}
