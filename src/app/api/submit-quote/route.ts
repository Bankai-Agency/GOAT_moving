import { after } from "next/server";

/* Lead handling runs AFTER the response is sent (via `after`), so the
   visitor isn't kept waiting on the CRM round-trip. Email notifications
   were removed — leads go to the MoveBoard CRM only. */

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

  /* Send to CRM AFTER responding so the visitor gets an instant
     confirmation while the lead is delivered in the background. */
  after(async () => {
    try {
      await sendToCrm(lead);
    } catch (err) {
      console.error("CRM send failed:", err);
    }
  });

  return Response.json({ success: true });
}
