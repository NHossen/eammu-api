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
    requirements: [
      "Valid passport (minimum 6 months validity)",
      "Valid email address",
      "Credit or debit card for payment",
      "Return flight ticket",
      "Basic travel itinerary",
    ],
    steps: [
      "Visit the official ETA application website of your destination country.",
      "Enter your passport details and travel information.",
      "Pay the ETA fee (usually small — $7–$23).",
      "Receive ETA approval via email (usually within minutes to hours).",
      "The ETA is electronically linked to your passport — no need to print.",
      "Present your passport at check-in and border control.",
    ],
    fee:              "USD 7–23 (varies by country)",
    processing_time:  "Immediate to 72 hours",
    validity:         "Usually 1–2 years (multiple entries)",
    tips: [
      "Apply well in advance — though fast, some ETAs can be delayed.",
      "Ensure your email is correct — the approval is sent electronically.",
      "ETA is NOT a visa — it only authorizes you to board and arrive.",
      "Airlines check ETA before boarding — apply before airport check-in.",
    ],
    related_links: {
      check_passport: "https://api.eammu.com/api/v1/passport",
    },
  });
}