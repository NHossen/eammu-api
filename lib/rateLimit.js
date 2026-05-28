import { getDb } from "./mongodb";
import crypto from "crypto";

export const PLANS = {
  free:       { name: "Free",       daily: 100,  monthly: 0,      price: 0  },
  pro:        { name: "Pro",        daily: 1000, monthly: 30000,  price: 9  },
  enterprise: { name: "Enterprise", daily: 0,    monthly: 500000, price: 49 },
};

function hashKey(key) {
  return crypto
    .createHmac("sha256", process.env.API_SECRET)
    .update(key)
    .digest("hex");
}

export async function checkLimit(request) {
  let apiKey = null;
  
  try {
    const url = new URL(request.url);
    apiKey =
      request.headers.get("x-api-key") ||
      url.searchParams.get("api_key");
  } catch {
    apiKey = request.headers.get("x-api-key") || null;
  }

  const db = await getDb();
  const users = db.collection("api-users");
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

  // নতুন দিন হলে daily counter reset করো
  const lastReset = new Date(user.resetAt);
  if (now.toDateString() !== lastReset.toDateString()) {
    await users.updateOne(
      { _id: user._id },
      { $set: { usedToday: 0, resetAt: now } }
    );
    user.usedToday = 0;
  }

  // Limit চেক
  const limit = user.plan === "free" ? plan.daily : plan.monthly;
  const used = user.plan === "free" ? user.usedToday : user.usedMonth;

  if (used >= limit) {
    return {
      ok: false,
      status: 429,
      message: `Limit reached. Upgrade at api.eammu.com/pricing`,
      used,
      limit,
    };
  }

  // Counter বাড়াও
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