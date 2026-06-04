import { NextResponse } from "next/server";
import { checkLimit } from "@/lib/rateLimit";

export async function GET(request) {
  const limit = await checkLimit(request);
  if (!limit.ok) {
    return NextResponse.json({ error: limit.message }, { status: limit.status });
  }

  return NextResponse.json({
    visa_type:        "e-visa",
    label:            "E-Visa",
    color:            "#00C2FF",
    description:      "Apply online before travel. No embassy visit required. You'll receive approval via email.",
  });
}