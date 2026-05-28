import { NextResponse } from "next/server";
import { checkLimit } from "@/lib/rateLimit";

export async function GET(request) {
  const limit = await checkLimit(request);
  if (!limit.ok) {
    return NextResponse.json({ error: limit.message }, { status: limit.status });
  }

  return NextResponse.json({
    visa_type:        "no-admission",
    label:            "No Admission",
    color:            "#FF3B5C",
    description:      "Entry is not permitted for your passport. This may be due to diplomatic restrictions or travel bans.",
    requirements:     [],
    steps: [
      "Entry is currently not possible with your passport.",
      "Check if there are any transit options through third countries.",
      "Contact the destination country's embassy for any exceptional cases.",
      "Monitor diplomatic news — restrictions can change.",
    ],
    fee:              "N/A",
    processing_time:  "N/A",
    validity:         "N/A",
    tips: [
      "Check your country's foreign affairs ministry for travel advisories.",
      "Some restrictions are temporary — check for updates regularly.",
      "In rare cases, special humanitarian or diplomatic visas may be available.",
      "Consider alternative destinations in the region.",
    ],
    related_links: {
      check_passport:  "https://api.eammu.com/api/v1/passport",
      find_embassy:    "https://api.eammu.com/api/v1/embassies",
    },
  });
}