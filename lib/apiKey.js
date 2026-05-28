import crypto from "crypto";

export function generateApiKey() {
  const prefix = "eak_";
  const random = crypto.randomBytes(32).toString("hex");
  return prefix + random;
}

export function hashKey(key) {
  const secret = process.env.API_SECRET || "fallback_secret";
  return crypto
    .createHmac("sha256", secret)
    .update(key)
    .digest("hex");
}

export function maskKey(key) {
  return key.substring(0, 8) + "••••••••" + key.slice(-4);
}