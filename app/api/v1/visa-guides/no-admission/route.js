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
  });
}