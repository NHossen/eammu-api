import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { generateApiKey, hashKey, maskKey } from "@/lib/apiKey";

export async function POST(request) {
  const { email, name } = await request.json();

  if (!email || !name) {
    return NextResponse.json(
      { error: "name and email required" },
      { status: 400 }
    );
  }

  const db = await getDb();
  const users = db.collection("api-users");

  // Already registered?
  const existing = await users.findOne({ email });
  if (existing) {
    return NextResponse.json(
      { error: "Email already registered. Login to get your key." },
      { status: 409 }
    );
  }

  const rawKey = generateApiKey();
  const now    = new Date();

  await users.insertOne({
    email,
    name,
    keyHash:    hashKey(rawKey),
    keyMasked:  maskKey(rawKey),
    plan:       "free",
    status:     "active",
    usedToday:  0,
    usedMonth:  0,
    resetAt:    now,
    lastUsed:   null,
    createdAt:  now,
  });

  // ⚠️ একবারই দেখাবে এই key — save করতে বলো
  return NextResponse.json({
    success:     true,
    api_key:     rawKey,
    warning:     "⚠️ Save this key now! It will never be shown again.",
    plan:        "free",
    daily_limit: 100,
    docs:        "https://api.eammu.com/docs",
  });
}