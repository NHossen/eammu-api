import { NextResponse } from "next/server";
import { checkLimit } from "@/lib/rateLimit";
import { getDb } from "@/lib/mongodb";

export async function GET(request) {
  const limit = await checkLimit(request);
  if (!limit.ok) {
    return NextResponse.json({ error: limit.message }, { status: limit.status });
  }

  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  const code = searchParams.get("code");

  const db = await getDb();
  let query = {};

  if (name) query.country = { $regex: new RegExp(name, "i") };
  if (code) query.code = code.toLowerCase();

  const results = await db
    .collection("countries")
    .find(query, { projection: { _id: 0 } })
    .sort({ country: 1 })
    .toArray();

  return NextResponse.json({
    total: results.length,
    countries: results,
  });
}