import { NextResponse } from "next/server";
import { checkLimit } from "@/lib/rateLimit";

export async function GET(request) {
  const limit = await checkLimit(request);
  if (!limit.ok) {
    return NextResponse.json({ error: limit.message }, { status: limit.status });
  }

  return NextResponse.json({
    visa_type:        "visa-required",
    label:            "Visa Required",
    color:            "#FF6B35",
    description:      "You must apply for a visa before traveling. Visit the embassy or consulate of your destination country.",
    fee:              "USD 30–200+ (varies by country and visa category)",
    processing_time:  "5–15 business days (varies by embassy)",
    validity:         "Single or multiple entry, typically 30–180 days",
    requirements: [
      "Valid passport (minimum 6 months validity, with blank pages)",
      "Completed visa application form (from embassy website)",
      "Recent passport-size photos (usually 2 copies)",
      "Proof of sufficient funds (bank statements, last 3–6 months)",
      "Return or onward flight ticket",
      "Hotel booking or invitation letter from a host",
      "Travel insurance covering the full duration of stay",
      "Supporting documents per visa type (employment letter, enrollment letter, etc.)",
    ],
    steps: [
      "Determine the correct visa type for your purpose of travel (tourism, business, study, etc.).",
      "Download and complete the visa application form from the official embassy website.",
      "Gather all required documents and make clear photocopies of each.",
      "Book an appointment at the embassy or consulate (some walk-in, most require booking).",
      "Attend your appointment and submit your application along with the visa fee.",
      "Track your application status online, by phone, or via the embassy portal.",
      "Collect your passport with the visa stamp once approved.",
      "Review the visa carefully — check dates, entry type, and conditions before travel.",
    ],
    tips: [
      "Apply at least 4–6 weeks before your intended travel date.",
      "Double-check document requirements — they vary by nationality and destination.",
      "Carry original documents AND photocopies to your appointment.",
      "Ensure your passport has at least 2 blank pages for the visa stamp.",
      "Never misrepresent your travel purpose — it can result in permanent bans.",
    ],
  });
}