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
    fee:              "USD 20–60 (varies by country)",
    processing_time:  "10–30 minutes at the counter",
    validity:         "Usually 14–30 days",
    requirements: [
      "Valid passport (minimum 6 months validity)",
      "Passport-size photo (usually 1–2 copies)",
      "Completed arrival card (available on the plane or at the border)",
      "Cash for visa fee (USD usually accepted)",
      "Return or onward ticket",
      "Proof of accommodation (hotel booking or host details)",
    ],
    steps: [
      "Arrive at the port of entry (airport or border crossing).",
      "Proceed to the Visa on Arrival counter — separate from regular immigration.",
      "Submit your passport, photo, and completed arrival card.",
      "Pay the visa fee in cash at the counter.",
      "Receive your visa stamp and proceed to the main immigration queue.",
      "Present your stamped passport at the immigration officer's desk.",
    ],
    tips: [
      "Carry exact change in USD — not all counters give change.",
      "Queues can be long; arrive early or use priority lanes if available.",
      "Fill out the arrival card on the plane to save time at the counter.",
      "Some countries require proof of accommodation — have it ready.",
    ],
  });
}