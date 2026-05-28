import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import crypto from "crypto";

function hashKey(key) {
  return crypto
    .createHmac("sha256", process.env.API_SECRET)
    .update(key)
    .digest("hex");
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

  return NextResponse.json({
    success: true,
    name: user.name,
    plan: user.plan,
    key_masked: user.keyMasked,
    note: "Your full key was shown only at registration time.",
  });
}