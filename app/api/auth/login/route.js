import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import nodemailer from "nodemailer";

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

  // Send email with masked key info
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Eammu API" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "Your Eammu API Key",
      html: `
        <div style="font-family:monospace;background:#080C10;color:#E8EDF2;padding:32px;border-radius:12px;max-width:500px;">
          <h2 style="color:#00E5A0;">Eammu API</h2>
          <p>Hello ${user.name},</p>
          <p>Your API key starts with: <strong style="color:#00E5A0;">${user.keyMasked}</strong></p>
          <p style="color:#8A9BB0;font-size:13px;">
            For security, we don't store your full key. If you've lost it,
            please register again with a different email or contact support.
          </p>
          <a href="https://api.eammu.com/dashboard" 
             style="display:inline-block;background:#00E5A0;color:#080C10;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;margin-top:16px;">
            Go to Dashboard
          </a>
          <p style="color:#8A9BB0;font-size:12px;margin-top:24px;">
            Plan: ${user.plan} · Daily limit: 100 requests
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Email error:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}