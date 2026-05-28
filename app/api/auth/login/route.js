import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { Resend } from "resend";

// GET request এলে redirect করো
export async function GET() {
  return NextResponse.json(
    { error: "Use POST method. Example: POST /api/auth/login with {email}" },
    { status: 405 }
  );
}

export async function POST(request) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const db = await getDb();
  const user = await db.collection("api-users").findOne({ email });

  if (!user) {
    return NextResponse.json(
      { error: "Email not found. Please register first." },
      { status: 404 }
    );
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const result = await resend.emails.send({
      from: "Eammu API <noreply@eammu.com>",
      to: email,
      subject: "Your Eammu API Key Info",
      html: `
        <div style="font-family:monospace;background:#080C10;color:#E8EDF2;padding:32px;border-radius:12px;max-width:500px;">
          <h2 style="color:#00E5A0;margin:0 0 16px;">Eammu API</h2>
          <p>Hello <strong>${user.name}</strong>,</p>
          <p>Your API key starts with:</p>
          <div style="background:#0D1117;border:1px solid rgba(0,229,160,0.3);border-radius:8px;padding:12px 16px;margin:16px 0;">
            <code style="color:#00E5A0;font-size:14px;">${user.keyMasked}</code>
          </div>
          <p style="color:#FF6B35;font-size:13px;">
            ⚠️ For security we only store a masked version.
            If you lost your full key, please register with a new email.
          </p>
          <a href="https://api.eammu.com/dashboard"
             style="display:inline-block;background:#00E5A0;color:#080C10;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;margin-top:8px;">
            Go to Dashboard →
          </a>
          <p style="color:#8A9BB0;font-size:12px;margin-top:24px;">
            Plan: <strong style="color:#00C2FF;">${user.plan}</strong> &nbsp;·&nbsp;
            Daily limit: <strong style="color:#00C2FF;">100 requests</strong>
          </p>
        </div>
      `,
    });

    console.log("Resend result:", JSON.stringify(result));

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("Email error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}