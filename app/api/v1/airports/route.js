import { NextResponse } from "next/server";
import { checkLimit } from "@/lib/rateLimit";
import { getDb } from "@/lib/mongodb";

export async function GET(request) {
  const limit = await checkLimit(request);
  if (!limit.ok) {
    return NextResponse.json({ error: limit.message }, { status: limit.status });
  }

  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country");
  const city    = searchParams.get("city");
  const code    = searchParams.get("code");

  const db = await getDb();
  let query = {};
  if (country) query.country = { $regex: new RegExp(country, "i") };
  if (city)    query.city    = { $regex: new RegExp(city,    "i") };
  if (code)    query.code    = code.toUpperCase();

  const results = await db
    .collection("airports")
    .find(query, { projection: { _id: 0 } })
    .limit(100)
    .toArray();

  return NextResponse.json({ total: results.length, airports: results });
}