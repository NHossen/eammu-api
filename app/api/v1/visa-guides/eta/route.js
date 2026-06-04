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
  });
}