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
  });
}