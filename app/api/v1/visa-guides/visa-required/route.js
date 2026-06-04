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
  });
}