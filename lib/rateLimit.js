import { getDb } from "./mongodb";
import crypto from "crypto";

export const PLANS = {
  free:       { name: "Free",       daily: 100,   monthly: 0,       price: 0  },
  pro:        { name: "Pro",        daily: 1000,  monthly: 30000,   price: 9  },
  enterprise: { name: "Enterprise", daily: 0,     monthly: 500000,  price: 49 },
};

function hashKey(key) {
  const secret = process.env.API_SECRET || "fallback_secret";
  return crypto
    .createHmac("sha256", secret)
    .update(key)
    .digest("hex");
}

export async function checkLimit(request) {
  let apiKey = null;
  
  // 1. Extract the key
  try {
    const url = new URL(request.url, `https://${request.headers.get("host")}`);
    apiKey = request.headers.get("x-api-key") || url.searchParams.get("api_key");
  } catch {
    apiKey = request.headers.get("x-api-key");
  }

  // 2. Critical Validation: Ensure apiKey is a valid string before hashing
  if (!apiKey || typeof apiKey !== 'string') {
    return { ok: false, status: 401, message: "API key is required" };
  }

  const db = await getDb();
  const users = db.collection("api-users");
  
  // Now safe to hash
  const hashedKey = hashKey(apiKey);

  const user = await users.findOne({ keyHash: hashedKey });

  if (!user) {
    return { ok: false, status: 401, message: "Invalid API key" };
  }

  if (user.status !== "active") {
    return { ok: false, status: 403, message: "Account suspended" };
  }

  const now = new Date();
  const plan = PLANS[user.plan];

  // 3. Reset logic for daily/monthly counters
  const lastReset = new Date(user.resetAt || now);
  if (now.toDateString() !== lastReset.toDateString()) {
    await users.updateOne(
      { _id: user._id },
      { $set: { usedToday: 0, resetAt: now } }
    );
    user.usedToday = 0;
  }

  // Enterprise = unlimited
  if (user.plan === "enterprise") {
    return {
      ok: true,
      userId: user._id,
      plan: "enterprise",
      remaining: 999999,
    };
  }

  const limit = user.plan === "free" ? plan.daily : plan.monthly;
  const used = user.plan === "free" ? (user.usedToday || 0) : (user.usedMonth || 0);

  if (used >= limit) {
    return {
      ok: false,
      status: 429,
      message: `Limit reached. Upgrade at api.eammu.com/pricing`,
      used,
      limit,
    };
  }

  // 4. Increment usage
  await users.updateOne(
    { _id: user._id },
    {
      $inc: { usedToday: 1, usedMonth: 1 },
      $set: { lastUsed: now },
    }
  );

  return {
    ok: true,
    userId: user._id,
    plan: user.plan,
    remaining: limit - used - 1,
  };
}