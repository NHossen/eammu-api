import { NextResponse } from "next/server";
import { checkLimit } from "@/lib/rateLimit";

const guides = [
  { slug: "visa-required",   label: "Visa Required (Sticker Visa)",   color: "#FF0000" },
  { slug: "e-visa",          label: "E-Visa",           color: "#00C2FF" },
  { slug: "visa-on-arrival", label: "Visa on Arrival",  color: "#00E5A0" },
  { slug: "eta",             label: "ETA (Electronic Travel Authorisation)",              color: "#A855F7" },
  { slug: "visa-free",       label: "Visa Free",        color: "#FFA500" },
  { slug: "no-admission",    label: "No Admission",     color: "#ff002b" },
];

export async function GET(request) {
  const limit = await checkLimit(request);
  if (!limit.ok) {
    return NextResponse.json({ error: limit.message }, { status: limit.status });
  }

  return NextResponse.json({
    total: guides.length,
    guides: guides.map(g => ({
      ...g,
      url: `https://api.eammu.com/api/v1/visa-guides/${g.slug}`,
    })),
  });
}