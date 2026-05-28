import { NextResponse } from "next/server";
import { checkLimit } from "@/lib/rateLimit";
import { getDb } from "@/lib/mongodb";

export async function GET(request) {
  // ✅ Rate limit check
  const limit = await checkLimit(request);
  if (!limit.ok) {
    return NextResponse.json({ error: limit.message }, { status: limit.status });
  }

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to   = searchParams.get("to");

  if (!from) {
    return NextResponse.json(
      { error: "?from= parameter required. Example: ?from=Bangladesh" },
      { status: 400 }
    );
  }

  const db = await getDb();

  // Visa data আনো
  const visaDoc = await db
    .collection("passport-index-matrix")
    .findOne({ Passport: { $regex: new RegExp(`^${from}$`, "i") } });

  if (!visaDoc) {
    return NextResponse.json({ error: `Passport '${from}' not found` }, { status: 404 });
  }

  // Countries collection থেকে flag আনো
  const allCountries = await db.collection("countries").find({}).toArray();
  const flagMap = {};
  allCountries.forEach((c) => {
    flagMap[c.country?.toLowerCase()] = { flag: c.flag, code: c.code };
  });

  const { _id, Passport, ...destinations } = visaDoc;

  // নির্দিষ্ট destination
if (to) {
    // Case insensitive destination match
    const toKey = Object.keys(destinations).find(
      k => k.toLowerCase() === to.toLowerCase()
    );
    const status = toKey ? destinations[toKey] : undefined;
    const toName = toKey || to;

    if (status === undefined) {
      return NextResponse.json({ error: `Destination '${to}' not found` }, { status: 404 });
    }
    const fromInfo = flagMap[from.toLowerCase()];
    const toInfo   = flagMap[toName.toLowerCase()];

    return NextResponse.json(
      {
        from:        { name: from, flag: fromInfo?.flag, code: fromInfo?.code },
        to:          { name: toName, flag: toInfo?.flag, code: toInfo?.code },
        visa_status: status === -1 ? "not_applicable" : status,
      },
      {
        headers: {
          "X-RateLimit-Remaining": String(limit.remaining),
          "X-Plan": limit.plan,
        },
      }
    );
  }

  // সব destination
  const result = Object.entries(destinations).map(([country, status]) => {
    const info = flagMap[country.toLowerCase()];
    return {
      country,
      flag:        info?.flag || null,
      code:        info?.code || null,
      visa_status: status === -1 ? "not_applicable" : status,
    };
  });

  // Group করো visa type অনুযায়ী
  const grouped = {
    visa_free:      result.filter((r) => typeof r.visa_status === "number"),
    visa_on_arrival: result.filter((r) => r.visa_status === "visa on arrival"),
    e_visa:         result.filter((r) => r.visa_status === "e-visa"),
    eta:            result.filter((r) => r.visa_status === "eta"),
    visa_required:  result.filter((r) => r.visa_status === "visa required"),
    no_admission:   result.filter((r) => r.visa_status === "no admission"),
  };

  return NextResponse.json(
    {
      passport:     from,
      flag:         flagMap[from.toLowerCase()]?.flag,
      total:        result.length,
      summary: {
        visa_free:       grouped.visa_free.length,
        visa_on_arrival: grouped.visa_on_arrival.length,
        e_visa:          grouped.e_visa.length,
        visa_required:   grouped.visa_required.length,
      },
      destinations: grouped,
    },
    {
      headers: {
        "X-RateLimit-Remaining": String(limit.remaining),
        "X-Plan": limit.plan,
      },
    }
  );
}