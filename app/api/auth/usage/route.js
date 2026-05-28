import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { hashKey } from "@/lib/apiKey";
import { PLANS } from "@/lib/rateLimit";

export async function GET(request) {
  let apiKey = null;
try {
  const url = new URL(request.url);
  apiKey = request.headers.get("x-api-key") || url.searchParams.get("api_key");
} catch {
  apiKey = request.headers.get("x-api-key") || null;
}

  const db   = await getDb();
  const user = await db
    .collection("api-users")
    .findOne({ keyHash: hashKey(apiKey) });

  if (!user) {
    return NextResponse.json({ error: "Invalid key" }, { status: 401 });
  }

  const plan  = PLANS[user.plan];
  const limit = user.plan === "free" ? plan.daily : plan.monthly;
  const used  = user.plan === "free" ? user.usedToday : user.usedMonth;

  return NextResponse.json({
    name:        user.name,
    email:       user.email,
    key_masked:  user.keyMasked,
    plan:        user.plan,
    limit,
    used,
    remaining:   limit - used,
    reset_at:    user.resetAt,
    member_since: user.createdAt,
    upgrade:     "https://api.eammu.com/pricing",
  });
}