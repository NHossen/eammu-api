import crypto from "crypto";

// নতুন API key generate করো
export function generateApiKey() {
  const prefix = "eak_";
  const random = crypto.randomBytes(32).toString("hex");
  return prefix + random;
}

// Database এ hash করে save করো (security)
export function hashKey(key) {
  return crypto
    .createHmac("sha256", process.env.API_SECRET)
    .update(key)
    .digest("hex");
}

// Response header এর জন্য masked key
export function maskKey(key) {
  return key.substring(0, 8) + "••••••••" + key.slice(-4);
}