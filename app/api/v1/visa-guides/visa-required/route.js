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
    requirements: [
      "Valid passport (minimum 6 months validity beyond travel dates)",
      "Completed visa application form",
      "Passport-sized photographs (usually 2, white background)",
      "Proof of accommodation (hotel booking or host invitation)",
      "Return or onward flight ticket",
      "Proof of sufficient funds (bank statement, last 3-6 months)",
      "Travel insurance (some countries require this)",
      "Purpose of visit documentation (business letter, university acceptance, etc.)",
    ],
    steps: [
      "Find the embassy or consulate of your destination country in your home country.",
      "Download and complete the official visa application form.",
      "Gather all required documents listed above.",
      "Book an appointment at the embassy (some accept walk-ins).",
      "Attend the interview or document submission appointment.",
      "Pay the visa application fee.",
      "Wait for processing (typically 5–15 business days).",
      "Collect your passport with visa stamp or receive e-visa confirmation.",
    ],
    fee:              "Varies by country and visa type ($20–$200+)",
    processing_time:  "5–15 business days (express services may be available)",
    validity:         "Usually 30–180 days (single or multiple entry)",
    tips: [
      "Apply at least 4–6 weeks before your travel date.",
      "Double-check the embassy's official website for the latest requirements.",
      "Ensure all documents are translated into the required language.",
      "Keep copies of all submitted documents.",
    ],
    related_links: {
      find_embassy: "https://api.eammu.com/api/v1/embassies",
      check_passport: "https://api.eammu.com/api/v1/passport",
    },
  });
}