import { NextResponse } from "next/server";
import { checkLimit } from "@/lib/rateLimit";
import { getDb } from "@/lib/mongodb";

const statusSlugMap = {
  "visa required":   "visa-required",
  "e-visa":          "e-visa",
  "visa on arrival": "visa-on-arrival",
  "eta":             "eta",
  "no admission":    "no-admission",
};

function getGuideUrl(visaStatus) {
  const slug = statusSlugMap[visaStatus] || null;
  return slug ? `https://api.eammu.com/api/v1/visa-guides/${slug}` : null;
}

export async function GET(request) {
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

  const visaDoc = await db
    .collection("passport-index-matrix")
    .findOne({ Passport: { $regex: new RegExp(`^${from}$`, "i") } });

  if (!visaDoc) {
    return NextResponse.json({ error: `Passport '${from}' not found` }, { status: 404 });
  }

  const allCountries = await db.collection("countries").find({}).toArray();
  const flagMap = {};
  allCountries.forEach((c) => {
    flagMap[c.country?.toLowerCase()] = { flag: c.flag, code: c.code };
  });

  const { _id, Passport, ...destinations } = visaDoc;

  // ── Single destination ──────────────────────────────────────
  if (to) {
    const toKey     = Object.keys(destinations).find(k => k.toLowerCase() === to.toLowerCase());
    const status    = toKey ? destinations[toKey] : undefined;
    const toName    = toKey || to;

    if (status === undefined) {
      return NextResponse.json({ error: `Destination '${to}' not found` }, { status: 404 });
    }

    const fromInfo  = flagMap[from.toLowerCase()];
    const toInfo    = flagMap[toName.toLowerCase()];
    const visaStatus = status === -1 ? "not_applicable" : status;

    return NextResponse.json(
      {
        from: {
          name: from,
          flag: fromInfo?.flag || null,
          code: fromInfo?.code || null,
        },
        to: {
          name: toName,
          flag: toInfo?.flag || null,
          code: toInfo?.code || null,
        },
        visa_status:    visaStatus,
        visa_guide_url: getGuideUrl(visaStatus),
      },
      {
        headers: {
          "X-RateLimit-Remaining": String(limit.remaining),
          "X-Plan": limit.plan,
        },
      }
    );
  }

  // ── All destinations ────────────────────────────────────────
  const result = Object.entries(destinations).map(([country, status]) => {
    const info       = flagMap[country.toLowerCase()];
    const visaStatus = status === -1 ? "not_applicable" : status;
    return {
      country,
      flag:           info?.flag || null,
      code:           info?.code || null,
      visa_status:    visaStatus,
      visa_guide_url: getGuideUrl(visaStatus),
    };
  });

  const grouped = {
    visa_free:       result.filter(r => typeof r.visa_status === "number"),
    visa_on_arrival: result.filter(r => r.visa_status === "visa on arrival"),
    e_visa:          result.filter(r => r.visa_status === "e-visa"),
    eta:             result.filter(r => r.visa_status === "eta"),
    visa_required:   result.filter(r => r.visa_status === "visa required"),
    no_admission:    result.filter(r => r.visa_status === "no admission"),
    not_applicable:  result.filter(r => r.visa_status === "not_applicable"),
  };

  return NextResponse.json(
    {
      passport: from,
      flag:     flagMap[from.toLowerCase()]?.flag || null,
      total:    result.length,
      summary: {
        visa_free:       grouped.visa_free.length,
        visa_on_arrival: grouped.visa_on_arrival.length,
        e_visa:          grouped.e_visa.length,
        eta:             grouped.eta.length,
        visa_required:   grouped.visa_required.length,
        no_admission:    grouped.no_admission.length,
      },
      visa_guides: {
        visa_required:   "https://api.eammu.com/api/v1/visa-guides/visa-required",
        e_visa:          "https://api.eammu.com/api/v1/visa-guides/e-visa",
        visa_on_arrival: "https://api.eammu.com/api/v1/visa-guides/visa-on-arrival",
        eta:             "https://api.eammu.com/api/v1/visa-guides/eta",
        visa_free:       "https://api.eammu.com/api/v1/visa-guides/visa-free",
        no_admission:    "https://api.eammu.com/api/v1/visa-guides/no-admission",
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