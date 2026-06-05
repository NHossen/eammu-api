import { NextResponse } from "next/server";
import { checkLimit } from "@/lib/rateLimit";

export async function GET(request) {
  const limit = await checkLimit(request);
  if (!limit.ok) {
    return NextResponse.json({ error: limit.message }, { status: limit.status });
  }

  return NextResponse.json({
    visa_type:        "eta",
    label:            "ETA (Electronic Travel Authorization)",
    color:            "#A855F7",
    description:      "An ETA is an electronic authorization linked to your passport. Required before boarding — not a visa, but mandatory.",
    fee:              "USD 7–30 (varies by country)",
    processing_time:  "Minutes to 72 hours",
    validity:         "Usually 1–5 years or multiple trips",
    requirements: [
      "Valid passport (minimum 6 months validity)",
      "Valid email address for confirmation",
      "Credit or debit card for payment",
      "Return or onward flight ticket",
    ],
    steps: [
      "Go to the official ETA portal of the destination country.",
      "Enter your passport details and travel dates.",
      "Pay the ETA fee online.",
      "Receive approval by email (usually within minutes).",
      "ETA is linked electronically to your passport — no printout required in most cases.",
    ],
    tips: [
      "Apply well in advance — some processing can take up to 72 hours.",
      "ETA is linked to your passport number, so carry the same passport you applied with.",
      "Confirm ETA eligibility for your specific nationality before applying.",
    ],
  });
}