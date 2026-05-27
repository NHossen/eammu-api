import { NextResponse } from "next/server";
import { checkLimit } from "@/lib/rateLimit";
import { getDb } from "@/lib/mongodb";

export async function GET(request) {
  const limit = await checkLimit(request);
  if (!limit.ok) {
    return NextResponse.json({ error: limit.message }, { status: limit.status });
  }

  const { searchParams } = new URL(request.url);
  const operator = searchParams.get("operator");
  const country  = searchParams.get("country");
  const city     = searchParams.get("city");

  const db = await getDb();
  let query = {};
  if (operator) query.operator = { $regex: new RegExp(operator, "i") };
  if (country)  query.country  = { $regex: new RegExp(country,  "i") };
  if (city)     query.city     = { $regex: new RegExp(city,     "i") };

  const results = await db
    .collection("database-of-embassies")
    .find(query, { projection: { _id: 0 } })
    .limit(50)
    .toArray();

  return NextResponse.json({ total: results.length, embassies: results });
}