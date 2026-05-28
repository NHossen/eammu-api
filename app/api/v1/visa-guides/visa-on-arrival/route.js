import { NextResponse } from "next/server";
import { checkLimit } from "@/lib/rateLimit";

export async function GET(request) {
  const limit = await checkLimit(request);
  if (!limit.ok) {
    return NextResponse.json({ error: limit.message }, { status: limit.status });
  }

  return NextResponse.json({
    visa_type:        "visa-on-arrival",
    label:            "Visa on Arrival",
    color:            "#00E5A0",
    description:      "Get your visa at the port of entry. No advance application needed — just arrive with required documents.",
    requirements: [
      "Valid passport (minimum 6 months validity)",
      "Return or onward flight ticket",
      "Proof of sufficient funds (cash or card statement)",
      "Hotel booking confirmation or invitation letter",
      "Completed arrival form (provided on the plane or at immigration)",
      "Passport-sized photographs (carry 2 just in case)",
      "Visa fee in accepted currency (USD, EUR, or local currency)",
    ],
    steps: [
      "Upon arrival, proceed to the 'Visa on Arrival' counter (separate from regular immigration).",
      "Collect and fill out the visa application form available at the counter.",
      "Submit your passport, photo, and supporting documents.",
      "Pay the visa fee at the counter (cash preferred; check accepted currencies).",
      "Wait for your visa stamp — usually takes 15–30 minutes.",
      "Proceed to immigration and customs with your stamped passport.",
    ],
    fee:              "USD 25–75 (varies by nationality and destination)",
    processing_time:  "Immediate (15–30 minutes at the counter)",
    validity:         "Usually 15–30 days",
    tips: [
      "Carry USD cash as it is the most widely accepted currency at VOA counters.",
      "Have all documents ready to avoid delays at the counter.",
      "Arrive during off-peak hours to avoid long queues.",
      "Some airports have separate fast-track lanes for an extra fee.",
      "Extension of VOA is possible in some countries — check local rules.",
    ],
    related_links: {
      check_passport:   "https://api.eammu.com/api/v1/passport",
      find_airport:     "https://api.eammu.com/api/v1/airports",
    },
  });
}