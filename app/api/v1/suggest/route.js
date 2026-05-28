import { NextResponse } from "next/server";
import { checkLimit } from "@/lib/rateLimit";
import { getDb } from "@/lib/mongodb";

export async function GET(request) {
  const limit = await checkLimit(request);
  if (!limit.ok) {
    return NextResponse.json({ error: limit.message }, { status: limit.status });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";

  if (q.length < 1) {
    return NextResponse.json({ suggestions: [] });
  }

  const db = await getDb();

  const results = await db
    .collection("countries")
    .find(
      { country: { $regex: new RegExp(`^${q}`, "i") } },
      { projection: { _id: 0, country: 1, flag: 1, code: 1 } }
    )
    .sort({ country: 1 })
    .limit(8)
    .toArray();

  return NextResponse.json({
    suggestions: results.map(r => ({
      name: r.country,
      flag: r.flag,
      code: r.code,
    })),
  });
}