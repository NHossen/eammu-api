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

  });
}