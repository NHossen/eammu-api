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
    requirements: [
      "Valid passport (minimum 6 months validity recommended)",
      "Return or onward flight ticket",
      "Proof of sufficient funds for your stay",
      "Hotel booking or accommodation address",
      "Travel insurance (recommended)",
    ],
    steps: [
      "Book your flights and accommodation.",
      "Ensure your passport is valid for at least 6 months beyond your travel dates.",
      "Arrive at the port of entry with your documents.",
      "Fill out the arrival card (provided on the plane or at immigration).",
      "Present your passport to immigration — no visa stamp required.",
      "Enjoy your trip within the permitted stay duration.",
    ],
    fee:              "Free",
    processing_time:  "No application required",
    validity:         "Varies by country (typically 14–90 days)",
    tips: [
      "Even visa-free, you must not overstay the permitted duration.",
      "Some countries require proof of onward travel — carry your return ticket.",
      "Visa-free does NOT mean you can work — separate work permits are needed.",
      "Check if the visa-free allowance resets after leaving and re-entering.",
    ],
    related_links: {
      check_passport: "https://api.eammu.com/api/v1/passport",
    },
  });
}