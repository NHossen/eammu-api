import { NextResponse } from "next/server";
import { checkLimit } from "@/lib/rateLimit";

export async function GET(request) {
  const limit = await checkLimit(request);
  if (!limit.ok) {
    return NextResponse.json({ error: limit.message }, { status: limit.status });
  }

  return NextResponse.json({
    visa_type:        "visa-free",
    label:            "Visa Free",
    color:            "#FEBC2E",
    description:      "No visa required! You can enter freely for tourism or short stays. Just carry your valid passport.",
    fee:              "Free",
    processing_time:  "No application needed",
    validity:         "Typically 30–90 days per visit",
    requirements: [
      "Valid passport (minimum 6 months validity beyond your stay)",
      "Return or onward flight ticket",
      "Proof of sufficient funds for your stay",
      "Proof of accommodation (hotel booking or host invitation)",
    ],
    steps: [
      "Ensure your passport is valid for at least 6 months beyond your intended stay.",
      "Book your flights and accommodation.",
      "Arrive at the port of entry with your valid passport.",
      "Proceed through standard immigration — no visa counter needed.",
      "Declare your intended length of stay to the immigration officer.",
      "Receive your entry stamp and enjoy your trip.",
    ],
    tips: [
      "Even though no visa is needed, immigration officers can still deny entry.",
      "Carry proof of accommodation and return ticket — you may be asked.",
      "Do not overstay the permitted duration — it can result in fines or future bans.",
      "Check if your destination requires travel insurance.",
    ],
  });
}