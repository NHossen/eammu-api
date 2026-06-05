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
    fee:              "N/A",
    processing_time:  "N/A",
    validity:         "N/A",
    requirements: [
      "Entry is currently not permitted for your passport nationality.",
      "No visa or authorization can be obtained for this destination.",
    ],
    steps: [
      "Verify the restriction with the official embassy of the destination country.",
      "Consult an immigration lawyer to check for any possible exemptions.",
      "Check whether holding a third-country residency permit changes your eligibility.",
      "Monitor for changes — diplomatic restrictions can be lifted over time.",
    ],
    tips: [
      "Check whether a third-country residency or citizenship changes your eligibility.",
      "Some restrictions are temporary due to diplomatic relations.",
      "Always verify with the official embassy before making any travel plans.",
      "Attempting entry without authorization may result in deportation and future bans.",
    ],
  });
}