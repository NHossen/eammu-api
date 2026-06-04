"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const BASE_URL = "https://api.eammu.com";

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

const passportEndpoint = {
  id: "passport",
  method: "GET",
  path: "/api/v1/passport",
  color: "#00E5A0",
  badge: "TRAVEL",
  desc: "Core travel intelligence endpoint. Pass a passport country to get visa requirements for all destinations — or add ?to= for a single pair. The response includes a visa_guide_url field that points to the relevant visa-guides page, and a full grouped summary when no destination is specified.",
  params: [
    { name: "from",    type: "string", required: true,  desc: "Passport (origin) country name. Example: Bangladesh" },
    { name: "to",      type: "string", required: false, desc: "Destination country name. Omit to receive all destinations grouped by visa type." },
    { name: "api_key", type: "string", required: true,  desc: "Your API key. Can also be passed via x-api-key header." },
  ],
  playground: { from: "Bangladesh", to: "Japan" },
  examples: [
    { label: "Single destination",  url: `/api/v1/passport?from=Bangladesh&to=Japan&api_key=YOUR_KEY` },
    { label: "All destinations",    url: `/api/v1/passport?from=Bangladesh&api_key=YOUR_KEY` },
  ],
  responseSingle: `// Single destination — GET /api/v1/passport?from=Bangladesh&to=Turkey
{
  "from": {
    "name": "Bangladesh",
    "flag": "https://twemoji.maxcdn.com/2/svg/1f1e7-1f1e9.svg",
    "code": "bd"
  },
  "to": {
    "name": "Turkey",
    "flag": "https://twemoji.maxcdn.com/2/svg/1f1f9-1f1f7.svg",
    "code": "tr"
  },
  "visa_status": "e-visa",
  "visa_guide_url": "https://api.eammu.com/api/v1/visa-guides/e-visa"
}`,
  responseAll: `// All destinations — GET /api/v1/passport?from=Bangladesh
{
  "passport": "Bangladesh",
  "flag": "https://twemoji.maxcdn.com/2/svg/1f1e7-1f1e9.svg",
  "total": 195,
  "summary": {
    "visa_free":       41,
    "visa_on_arrival": 27,
    "e_visa":          12,
    "eta":              3,
    "visa_required":   98,
    "no_admission":     2
  },
  "visa_guides": {
    "visa_required":   "https://api.eammu.com/api/v1/visa-guides/visa-required",
    "e_visa":          "https://api.eammu.com/api/v1/visa-guides/e-visa",
    "visa_on_arrival": "https://api.eammu.com/api/v1/visa-guides/visa-on-arrival",
    "eta":             "https://api.eammu.com/api/v1/visa-guides/eta",
    "visa_free":       "https://api.eammu.com/api/v1/visa-guides/visa-free",
    "no_admission":    "https://api.eammu.com/api/v1/visa-guides/no-admission"
  },
  "destinations": {
    "visa_free": [
      {
        "country": "Haiti",
        "flag": "https://twemoji.maxcdn.com/2/svg/1f1ed-1f1f9.svg",
        "code": "ht",
        "visa_status": 90,
        "visa_guide_url": null
      }
    ],
    "e_visa": [
      {
        "country": "Turkey",
        "flag": "https://twemoji.maxcdn.com/2/svg/1f1f9-1f1f7.svg",
        "code": "tr",
        "visa_status": "e-visa",
        "visa_guide_url": "https://api.eammu.com/api/v1/visa-guides/e-visa"
      }
    ],
    "visa_required": [ "..." ],
    "visa_on_arrival": [ "..." ],
    "eta": [ "..." ],
    "no_admission": [ "..." ],
    "not_applicable": [ "..." ]
  }
}`,
};

const otherEndpoints = [
  {
    id: "countries",
    method: "GET",
    path: "/api/v1/countries",
    color: "#00C2FF",
    badge: "DATA",
    desc: "Get a full list of countries with flags and ISO codes. Supports partial name search and code filtering.",
    params: [
      { name: "name",    type: "string", required: false, desc: "Partial country name, case-insensitive. Example: bang" },
      { name: "code",    type: "string", required: false, desc: "ISO 2-letter code. Example: bd" },
      { name: "api_key", type: "string", required: true,  desc: "Your API key" },
    ],
    playground: { name: "Bangladesh" },
    examples: [
      { label: "Search by name", url: `/api/v1/countries?name=Bangladesh&api_key=YOUR_KEY` },
      { label: "Search by code", url: `/api/v1/countries?code=bd&api_key=YOUR_KEY` },
      { label: "All countries",  url: `/api/v1/countries?api_key=YOUR_KEY` },
    ],
    response: `{
  "total": 1,
  "countries": [
    {
      "country": "Bangladesh",
      "flag": "https://twemoji.maxcdn.com/2/svg/1f1e7-1f1e9.svg",
      "code": "bd"
    }
  ]
}`,
  },
  {
    id: "embassies",
    method: "GET",
    path: "/api/v1/embassies",
    color: "#FF6B35",
    badge: "LOCATION",
    desc: "Find embassy and consulate locations worldwide. Filter by operator country, host country, or city.",
    params: [
      { name: "operator", type: "string", required: false, desc: "Embassy home country. Example: Bangladesh" },
      { name: "country",  type: "string", required: false, desc: "Country where embassy is located. Example: Japan" },
      { name: "city",     type: "string", required: false, desc: "City filter. Example: Tokyo" },
      { name: "api_key",  type: "string", required: true,  desc: "Your API key" },
    ],
    playground: { operator: "Bangladesh", country: "Japan" },
    examples: [
      { label: "Bangladesh embassies abroad", url: `/api/v1/embassies?operator=Bangladesh&api_key=YOUR_KEY` },
      { label: "Embassies in Japan",          url: `/api/v1/embassies?country=Japan&api_key=YOUR_KEY` },
      { label: "Filter by city",              url: `/api/v1/embassies?city=Tokyo&api_key=YOUR_KEY` },
    ],
    response: `{
  "total": 1,
  "embassies": [
    {
      "operator": "Bangladesh",
      "country": "Japan",
      "city": "Tokyo",
      "type": "embassy",
      "website": "https://bdembassytokyo.org",
      "latitude": 35.6762,
      "longitude": 139.6503
    }
  ]
}`,
  },
  {
    id: "airports",
    method: "GET",
    path: "/api/v1/airports",
    color: "#A855F7",
    badge: "TRANSPORT",
    desc: "Search global airport data including IATA codes, coordinates, timezone, runway info, and direct flight counts.",
    params: [
      { name: "country", type: "string", required: false, desc: "Filter by country name. Example: Bangladesh" },
      { name: "city",    type: "string", required: false, desc: "Filter by city. Example: Dhaka" },
      { name: "code",    type: "string", required: false, desc: "IATA code. Example: DAC" },
      { name: "api_key", type: "string", required: true,  desc: "Your API key" },
    ],
    playground: { code: "DAC" },
    examples: [
      { label: "By IATA code", url: `/api/v1/airports?code=DAC&api_key=YOUR_KEY` },
      { label: "By country",   url: `/api/v1/airports?country=Bangladesh&api_key=YOUR_KEY` },
      { label: "By city",      url: `/api/v1/airports?city=Dhaka&api_key=YOUR_KEY` },
    ],
    response: `{
  "total": 1,
  "airports": [
    {
      "code": "DAC",
      "name": "Hazrat Shahjalal International Airport",
      "city": "Dhaka",
      "country": "Bangladesh",
      "lat": "23.8433",
      "lon": "90.3978",
      "tz": "Asia/Dhaka",
      "direct_flights": "37",
      "runway_length": "10500"
    }
  ]
}`,
  },
  {
    id: "suggest",
    method: "GET",
    path: "/api/v1/suggest",
    color: "#FEBC2E",
    badge: "UTILITY",
    desc: "Autocomplete country names with flags and ISO codes. Ideal for search inputs and dropdowns.",
    params: [
      { name: "q",       type: "string", required: true, desc: "Search query (min 1 character). Example: ban" },
      { name: "api_key", type: "string", required: true, desc: "Your API key" },
    ],
    playground: { q: "ban" },
    examples: [
      { label: "Autocomplete 'ban'", url: `/api/v1/suggest?q=ban&api_key=YOUR_KEY` },
      { label: "Autocomplete 'uni'", url: `/api/v1/suggest?q=uni&api_key=YOUR_KEY` },
    ],
    response: `{
  "suggestions": [
    {
      "name": "Bangladesh",
      "flag": "https://twemoji.maxcdn.com/2/svg/1f1e7-1f1e9.svg",
      "code": "bd"
    },
    {
      "name": "Barbados",
      "flag": "https://twemoji.maxcdn.com/2/svg/1f1e7-1f1e7.svg",
      "code": "bb"
    }
  ]
}`,
  },
];

// Visa-guide static info pages — no params, just static JSON
const visaGuidePages = [
  {
    id: "vg-e-visa",
    path: "/api/v1/visa-guides/e-visa",
    color: "#00C2FF",
    label: "E-Visa",
    icon: "💻",
    triggeredBy: "e-visa",
    desc: "Static guide page returned when a passport holder's visa_status is e-visa. Explains what e-visa is, requirements, step-by-step application process, typical fees, and processing time.",
    response: `{
  "visa_type":       "e-visa",
  "label":           "E-Visa",
  "color":           "#00C2FF",
  "description":     "Apply online before travel. No embassy visit required.",
  "requirements": [
    "Valid passport (minimum 6 months validity)",
    "Digital passport photo (JPEG, white background, under 1MB)",
    "Valid email address for confirmation",
    "Credit or debit card for online payment",
    "Return or onward flight ticket",
    "Hotel booking confirmation",
    "Proof of sufficient funds"
  ],
  "steps": [
    "Visit the official e-visa portal of your destination country.",
    "Create an account or proceed as a guest applicant.",
    "Fill out the online application form.",
    "Upload required documents.",
    "Pay the e-visa fee online.",
    "Wait for approval email (usually 24–72 hours).",
    "Download and print your e-visa approval letter.",
    "Present the printed e-visa at the port of entry."
  ],
  "fee":             "USD 20–80 (varies by country and nationality)",
  "processing_time": "24–72 hours (some instant approvals)",
  "validity":        "Usually 30–90 days from approval date",
  "tips": [
    "Only apply through the official government portal.",
    "Apply at least 72 hours before your travel date.",
    "Print multiple copies of your e-visa approval.",
    "Check if your nationality is eligible before applying."
  ],
  "related_links": {
    "check_passport":  "https://api.eammu.com/api/v1/passport",
    "country_details": "https://api.eammu.com/api/v1/countries"
  }
}`,
  },
  {
    id: "vg-eta",
    path: "/api/v1/visa-guides/eta",
    color: "#A855F7",
    label: "ETA",
    icon: "📋",
    triggeredBy: "eta",
    desc: "Static guide returned when visa_status is eta. Covers Electronic Travel Authorization requirements, how to apply, validity, and which countries require it.",
    response: `{
  "visa_type":       "eta",
  "label":           "Electronic Travel Authorization",
  "color":           "#A855F7",
  "description":     "An ETA is an electronic entry requirement linked to your passport. Must be obtained before boarding.",
  "requirements": [
    "Valid passport (min 6 months validity)",
    "Valid email address",
    "Credit or debit card",
    "Return flight ticket"
  ],
  "steps": [
    "Go to the official ETA portal of the destination country.",
    "Enter your passport details and travel dates.",
    "Pay the ETA fee.",
    "Receive approval by email (usually within minutes).",
    "ETA is linked electronically — no printout required in most cases."
  ],
  "fee":             "USD 7–30 (varies by country)",
  "processing_time": "Minutes to 72 hours",
  "validity":        "Usually 1–5 years or multiple trips",
  "tips": [
    "Apply well in advance — some processing can take up to 72 hours.",
    "ETA is linked to your passport number, so carry the same passport you applied with.",
    "Confirm ETA eligibility for your specific nationality."
  ],
  "related_links": {
    "check_passport":  "https://api.eammu.com/api/v1/passport",
    "country_details": "https://api.eammu.com/api/v1/countries"
  }
}`,
  },
  {
    id: "vg-visa-on-arrival",
    path: "/api/v1/visa-guides/visa-on-arrival",
    color: "#00E5A0",
    label: "Visa on Arrival",
    icon: "✅",
    triggeredBy: "visa on arrival",
    desc: "Static guide for visa-on-arrival destinations. Explains what to bring to the port of entry, fees to expect, and tips to avoid delays.",
    response: `{
  "visa_type":       "visa on arrival",
  "label":           "Visa on Arrival",
  "color":           "#00E5A0",
  "description":     "Get your visa stamp at the airport or border crossing upon arrival. No advance application required.",
  "requirements": [
    "Valid passport (min 6 months validity)",
    "Passport-size photo (usually 1–2 copies)",
    "Completed arrival card (available on plane or at border)",
    "Cash for visa fee (USD usually accepted)",
    "Return or onward ticket",
    "Proof of accommodation"
  ],
  "steps": [
    "Arrive at the port of entry.",
    "Proceed to the Visa on Arrival counter.",
    "Submit your passport, photo, and arrival card.",
    "Pay the visa fee in cash.",
    "Receive your visa stamp and proceed to immigration."
  ],
  "fee":             "USD 20–60 (varies by country)",
  "processing_time": "10–30 minutes at the counter",
  "validity":        "Usually 14–30 days",
  "tips": [
    "Carry exact change in USD — not all counters give change.",
    "Queues can be long; arrive early or use priority lanes.",
    "Some countries require a separate arrival card — fill it out on the plane."
  ],
  "related_links": {
    "check_passport":  "https://api.eammu.com/api/v1/passport",
    "country_details": "https://api.eammu.com/api/v1/countries"
  }
}`,
  },
  {
    id: "vg-no-admission",
    path: "/api/v1/visa-guides/no-admission",
    color: "#FF3B5C",
    label: "No Admission",
    icon: "🚫",
    triggeredBy: "no admission",
    desc: "Static guide returned when entry is not permitted. Explains what no-admission means, why it occurs, and what alternatives may exist.",
    response: `{
  "visa_type":    "no admission",
  "label":        "No Admission",
  "color":        "#FF3B5C",
  "description":  "Entry to this country is not permitted for your passport. This may be due to diplomatic restrictions or bilateral agreements.",
  "reasons": [
    "Absence of diplomatic relations between the two countries.",
    "Active travel ban or sanction.",
    "Bilateral travel restriction agreement."
  ],
  "alternatives": [
    "Check if entry is possible via a third country or special permit.",
    "Contact the destination country's embassy for exceptions.",
    "Consult your country's foreign affairs ministry for guidance."
  ],
  "tips": [
    "This restriction is at the country level — individual circumstances rarely override it.",
    "Attempting to enter may result in deportation and future travel bans.",
    "Restrictions can change — verify with official sources before planning."
  ],
  "related_links": {
    "check_passport":  "https://api.eammu.com/api/v1/passport",
    "embassy_lookup":  "https://api.eammu.com/api/v1/embassies"
  }
}`,
  },
  {
    id: "vg-visa-free",
    path: "/api/v1/visa-guides/visa-free",
    color: "#FEBC2E",
    label: "Visa Free",
    icon: "🆓",
    triggeredBy: "number (e.g. 30, 90)",
    desc: "Static guide for visa-free travel. Explains what visa-free access means, common stay limits, and what travelers still need to carry.",
    response: `{
  "visa_type":       "visa_free",
  "label":           "Visa Free",
  "color":           "#FEBC2E",
  "description":     "No visa required. You can enter and stay for the permitted number of days without any prior application.",
  "requirements": [
    "Valid passport (min 6 months validity beyond your stay)",
    "Return or onward flight ticket",
    "Proof of sufficient funds",
    "Hotel booking or proof of accommodation"
  ],
  "steps": [
    "Arrive at the destination country's port of entry.",
    "Proceed to immigration with your passport.",
    "Present your return ticket and accommodation proof if asked.",
    "Receive your entry stamp and note the permitted stay duration."
  ],
  "tips": [
    "Visa-free does not mean unlimited stay — respect the max days allowed.",
    "Overstaying can result in fines, deportation, or future bans.",
    "Some countries grant visa-free access but still require travel insurance."
  ],
  "related_links": {
    "check_passport":  "https://api.eammu.com/api/v1/passport",
    "country_details": "https://api.eammu.com/api/v1/countries"
  }
}`,
  },
  {
    id: "vg-visa-required",
    path: "/api/v1/visa-guides/visa-required",
    color: "#FF6B35",
    label: "Visa Required",
    icon: "🔴",
    triggeredBy: "visa required",
    desc: "Static guide for visa-required destinations. Covers embassy application steps, document checklist, and typical processing times.",
    response: `{
  "visa_type":       "visa required",
  "label":           "Visa Required",
  "color":           "#FF6B35",
  "description":     "You must obtain a visa from the destination country's embassy or consulate before travel.",
  "requirements": [
    "Valid passport (min 6 months validity)",
    "Completed visa application form",
    "Recent passport-size photographs",
    "Bank statements (last 3–6 months)",
    "Confirmed flight itinerary",
    "Hotel booking or invitation letter",
    "Travel insurance (some countries require it)",
    "Visa fee payment receipt"
  ],
  "steps": [
    "Locate the nearest embassy or consulate of your destination country.",
    "Download and complete the official visa application form.",
    "Gather all required supporting documents.",
    "Book an appointment at the embassy (if required).",
    "Submit your application and pay the visa fee.",
    "Wait for processing (typically 5–15 business days).",
    "Collect your passport with visa stamp or denial letter.",
    "Travel within the visa validity period."
  ],
  "fee":             "USD 30–200 (varies by country and visa type)",
  "processing_time": "5–15 business days",
  "validity":        "Varies — typically 30–180 days",
  "tips": [
    "Apply well in advance — at least 4–6 weeks before travel.",
    "Double-check document requirements on the official embassy website.",
    "Use the embassy locator to find the nearest office.",
    "Some countries offer express processing for an additional fee."
  ],
  "related_links": {
    "check_passport":  "https://api.eammu.com/api/v1/passport",
    "embassy_lookup":  "https://api.eammu.com/api/v1/embassies"
  }
}`,
  },
];

const visaStatuses = [
  { value: "visa required",   color: "#FF6B35", icon: "🔴", desc: "Must apply at embassy/consulate before travel" },
  { value: "e-visa",          color: "#00C2FF", icon: "💻", desc: "Apply online before travel — no embassy visit needed" },
  { value: "visa on arrival", color: "#00E5A0", icon: "✅", desc: "Obtain visa at port of entry on arrival" },
  { value: "eta",             color: "#A855F7", icon: "📋", desc: "Electronic Travel Authorization — apply online before boarding" },
  { value: "no admission",    color: "#FF3B5C", icon: "🚫", desc: "Entry not permitted for this passport" },
  { value: "30 / 60 / 90…",  color: "#FEBC2E", icon: "🆓", desc: "Visa-free — number indicates max stay in days" },
  { value: "not_applicable",  color: "#8A9BB0", icon: "➖", desc: "Same country or special territory — not applicable" },
];

const codeExamples = {
  curl:   (path, qs) => `curl "${BASE_URL}${path}?${qs}"`,
  js:     (path, qs) => `const res = await fetch(\n  "${BASE_URL}${path}?${qs}"\n);\nconst data = await res.json();\nconsole.log(data);`,
  python: (path, qs) => `import requests\n\nres = requests.get(\n  "${BASE_URL}${path}?${qs}"\n)\nprint(res.json())`,
  php:    (path, qs) => `$response = file_get_contents(\n  "${BASE_URL}${path}?${qs}"\n);\n$data = json_decode($response, true);\nprint_r($data);`,
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function Playground({ path, params, playground, color }) {
  const [values, setValues]   = useState(playground || {});
  const [apiKey, setApiKey]   = useState("");
  const [response, setResp]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus]   = useState(null);
  const [time, setTime]       = useState(null);

  async function run() {
    if (!apiKey) { setResp({ error: "Enter your API key to test" }); return; }
    setLoading(true); setResp(null);
    const qs  = new URLSearchParams({ ...values, api_key: apiKey }).toString();
    const url = `${BASE_URL}${path}?${qs}`;
    const t0  = Date.now();
    try {
      const res  = await fetch(url);
      const data = await res.json();
      setStatus(res.status);
      setTime(Date.now() - t0);
      setResp(data);
    } catch (e) {
      setStatus(500); setResp({ error: e.message });
    }
    setLoading(false);
  }

  const nonKeyParams = params.filter(p => p.name !== "api_key");

  return (
    <div className="mt-6 rounded-xl overflow-hidden border border-white/8 bg-[#080C10]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/6">
        <span className="text-[11px] text-[#8A9BB0] tracking-widest font-mono">▶ LIVE PLAYGROUND</span>
        {status && (
          <span className={`text-[11px] font-bold px-2 py-1 rounded font-mono border ${
            status === 200
              ? "bg-[#00E5A0]/10 text-[#00E5A0] border-[#00E5A0]/20"
              : "bg-[#FF6B35]/10 text-[#FF6B35] border-[#FF6B35]/20"
          }`}>
            {status} · {time}ms
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-[#FF6B35] w-20 shrink-0 font-mono tracking-wider">api_key</span>
          <input
            type="password"
            placeholder="eak_your_api_key"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            className="flex-1 px-3 py-2 rounded-md bg-[#0D1117] border border-[#FF6B35]/20 text-[#E8EDF2] text-xs font-mono outline-none focus:border-[#00E5A0]/40 transition-colors"
          />
        </div>
        {nonKeyParams.map(p => (
          <div key={p.name} className="flex items-center gap-3">
            <span className="text-[11px] w-20 shrink-0 font-mono tracking-wider" style={{ color: p.required ? color : "#8A9BB0" }}>
              {p.name}
            </span>
            <input
              placeholder={p.desc.split(".")[0]}
              value={values[p.name] || ""}
              onChange={e => setValues(prev => ({ ...prev, [p.name]: e.target.value }))}
              className="flex-1 px-3 py-2 rounded-md bg-[#0D1117] border border-white/8 text-[#E8EDF2] text-xs font-mono outline-none focus:border-[#00E5A0]/40 transition-colors"
            />
          </div>
        ))}
        <button
          onClick={run}
          disabled={loading}
          className="self-start mt-1 px-5 py-2 rounded-md text-xs font-bold text-[#080C10] font-mono"
          style={{ background: loading ? `${color}80` : color, cursor: loading ? "not-allowed" : "pointer" }}
        >
          {loading ? "Running..." : "▶ Send Request"}
        </button>
      </div>
      {response && (
        <div className="border-t border-white/6">
          <pre className="p-4 m-0 text-xs text-[#A8B8CC] font-mono overflow-x-auto leading-relaxed max-h-80 overflow-y-auto">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

function CodeBlock({ path, qs, color }) {
  const [lang, setLang]     = useState("curl");
  const [copied, setCopied] = useState(false);
  const langs = ["curl", "js", "python", "php"];

  function copy() {
    navigator.clipboard.writeText(codeExamples[lang](path, qs));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-lg overflow-hidden border border-white/6 bg-[#0D1117]">
      <div className="flex items-center justify-between border-b border-white/6">
        <div className="flex">
          {langs.map(l => (
            <button key={l} onClick={() => setLang(l)}
              className="px-4 py-2.5 text-[11px] font-mono tracking-wider border-none bg-transparent cursor-pointer transition-colors"
              style={{ color: lang === l ? "#E8EDF2" : "#8A9BB0", borderBottom: lang === l ? `2px solid ${color}` : "2px solid transparent" }}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <button onClick={copy} className="mr-4 text-[11px] font-mono bg-transparent border-none cursor-pointer"
          style={{ color: copied ? "#00E5A0" : "#8A9BB0" }}>
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
      <pre className="p-4 m-0 text-xs font-mono overflow-x-auto leading-relaxed" style={{ color }}>
        {codeExamples[lang](path, qs)}
      </pre>
    </div>
  );
}

function ParamTable({ params, color }) {
  return (
    <div className="rounded-lg overflow-hidden border border-white/6">
      <div className="grid px-4 py-2 bg-[#0A0F14] border-b border-white/6 text-[10px] text-[#8A9BB0] tracking-widest font-mono"
        style={{ gridTemplateColumns: "120px 70px 80px 1fr" }}>
        <span>PARAMETER</span><span>TYPE</span><span>REQUIRED</span><span>DESCRIPTION</span>
      </div>
      {params.map((p, i) => (
        <div key={i} className="grid px-4 py-3 items-center"
          style={{
            gridTemplateColumns: "120px 70px 80px 1fr",
            background: i % 2 === 0 ? "#0D1117" : "#0A0F14",
            borderBottom: i < params.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
          }}>
          <code className="text-xs font-mono" style={{ color }}>{p.name}</code>
          <span className="text-xs text-[#8A9BB0] font-mono">{p.type}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded font-mono w-fit border"
            style={{
              background: p.required ? "rgba(255,107,53,0.08)" : "rgba(255,255,255,0.04)",
              color: p.required ? "#FF6B35" : "#8A9BB0",
              borderColor: p.required ? "rgba(255,107,53,0.2)" : "rgba(255,255,255,0.08)",
            }}>
            {p.required ? "required" : "optional"}
          </span>
          <span className="text-xs text-[#8A9BB0]">{p.desc}</span>
        </div>
      ))}
    </div>
  );
}

function ResponseBlock({ code, label, onCopy, copied, copyId }) {
  return (
    <div className="rounded-lg overflow-hidden border border-white/6 bg-[#0D1117]">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/6">
        <span className="text-[11px] text-[#8A9BB0] font-mono">{label}</span>
        <button onClick={() => onCopy(code, copyId)}
          className="text-[11px] font-mono bg-transparent border-none cursor-pointer"
          style={{ color: copied === copyId ? "#00E5A0" : "#8A9BB0" }}>
          {copied === copyId ? "✓ Copied" : "Copy"}
        </button>
      </div>
      <pre className="p-4 m-0 text-xs text-[#A8B8CC] font-mono overflow-x-auto leading-relaxed">{code}</pre>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("intro");
  const [copied, setCopied]               = useState("");
  const observerRef = useRef();

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    observerRef.current = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); }),
      { rootMargin: "-20% 0px -70% 0px" }
    );
    sections.forEach(s => observerRef.current.observe(s));
    return () => observerRef.current?.disconnect();
  }, []);

  function copy(text, id) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(""), 2000);
  }

  const navItems = [
    { id: "intro",              label: "Introduction",       icon: "◎",  group: null },
    { id: "quickstart",         label: "Quick Start",         icon: "⚡",  group: null },
    { id: "auth",               label: "Authentication",      icon: "🔑",  group: null },
    { id: "flow",               label: "How It Works",        icon: "🔄",  group: null },
    { id: "passport",           label: "Passport API",        icon: "🛂",  group: "ENDPOINTS" },
    { id: "countries",          label: "Countries API",       icon: "🌍",  group: null },
    { id: "embassies",          label: "Embassies API",       icon: "🏛",  group: null },
    { id: "airports",           label: "Airports API",        icon: "✈️",  group: null },
    { id: "suggest",            label: "Suggest API",         icon: "🔍",  group: null },
    { id: "vg-e-visa",          label: "e-Visa Guide",        icon: "💻",  group: "VISA GUIDES" },
    { id: "vg-eta",             label: "ETA Guide",           icon: "📋",  group: null },
    { id: "vg-visa-on-arrival", label: "Visa on Arrival",     icon: "✅",  group: null },
    { id: "vg-no-admission",    label: "No Admission",        icon: "🚫",  group: null },
    { id: "vg-visa-free",       label: "Visa Free",           icon: "🆓",  group: null },
    { id: "vg-visa-required",   label: "Visa Required",       icon: "🔴",  group: null },
    { id: "errors",             label: "Error Codes",         icon: "⚠️",  group: "REFERENCE" },
    { id: "visa-status",        label: "Visa Status Values",  icon: "📋",  group: null },
    { id: "limits",             label: "Rate Limits",         icon: "📊",  group: null },
  ];

  return (
    <div className="min-h-screen bg-[#080C10] text-[#E8EDF2] font-mono flex flex-col">

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-10 py-4 border-b border-white/6 bg-[#080C10]/97 backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <Link href="/" className="no-underline flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#00E5A0] to-[#00C2FF] flex items-center justify-center text-sm font-bold text-[#080C10]">E</div>
            <span className="text-sm font-semibold">EAMMU <span className="text-[#00E5A0]">API</span></span>
          </Link>
          <span className="text-white/15 text-base">/</span>
          <span className="text-sm text-[#8A9BB0]">Documentation</span>
          <span className="text-[10px] px-2 py-0.5 rounded border bg-[#00E5A0]/8 border-[#00E5A0]/20 text-[#00E5A0] tracking-widest">v1</span>
          <span className="text-[10px] px-2 py-0.5 rounded border bg-[#A855F7]/10 border-[#A855F7]/25 text-[#A855F7] tracking-widest animate-pulse">✦ VISA GUIDES NEW</span>
        </div>
        <div className="flex gap-2">
          <Link href="/" className="px-3 py-1.5 rounded-md text-xs text-[#8A9BB0] no-underline hover:text-[#E8EDF2] transition-colors">← Home</Link>
          <Link href="/login" className="px-4 py-1.5 rounded-md text-xs bg-[#00E5A0] text-[#080C10] no-underline font-bold hover:opacity-90 transition-opacity">Get API Key →</Link>
        </div>
      </nav>

      <div className="flex flex-1 max-w-[1200px] mx-auto w-full px-6">

        {/* ── Sidebar ── */}
        <aside className="w-52 shrink-0 py-8 sticky top-[57px] h-[calc(100vh-57px)] overflow-y-auto">
          {navItems.map(item => (
            <div key={item.id}>
              {item.group && (
                <div className="text-[10px] text-[#8A9BB0] tracking-widest mb-1 mt-5 pl-3">{item.group}</div>
              )}
              <button
                onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
                className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-md mb-0.5 border-none cursor-pointer text-[13px] font-mono transition-all"
                style={{
                  background: activeSection === item.id ? "rgba(0,229,160,0.07)" : "transparent",
                  color:      activeSection === item.id ? "#00E5A0" : "#8A9BB0",
                  borderLeft: activeSection === item.id ? "2px solid #00E5A0" : "2px solid transparent",
                }}>
                <span className="text-xs">{item.icon}</span>
                {item.label}
              </button>
            </div>
          ))}

          <div className="mx-3 mt-6 p-3 rounded-lg bg-[#00E5A0]/5 border border-[#00E5A0]/12">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00E5A0]" />
              <span className="text-[11px] text-[#00E5A0] font-bold">All Systems Operational</span>
            </div>
            <a href="https://api.eammu.com" target="_blank" className="text-[10px] text-[#8A9BB0] no-underline hover:text-[#00E5A0] transition-colors">Status page →</a>
          </div>
        </aside>

        {/* ── Content ── */}
        <main className="flex-1 pl-14 py-10 pb-32 max-w-[820px] min-w-0">

          {/* ── Intro ── */}
          <section id="intro" className="mb-20">
            <div className="inline-flex items-center gap-2 bg-[#00E5A0]/6 border border-[#00E5A0]/15 rounded-full px-3.5 py-1 text-[11px] text-[#00E5A0] mb-5 tracking-widest">
              EAMMU TRAVEL API — VERSION 1.0
            </div>
            <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: "Georgia, serif", lineHeight: 1.2 }}>
              API Documentation
            </h1>
            <p className="text-sm text-[#8A9BB0] leading-relaxed mb-7 max-w-xl">
              The Eammu Travel API provides real-time visa requirements, passport index data,
              embassy locations, airport information, and step-by-step visa guides for 195+ countries.
              Built for travel apps, visa consultancies, and developers.
            </p>

            {/* Stats */}
            <div className="flex mb-7 border border-white/6 rounded-lg overflow-hidden">
              {[
                { v: "195+",  l: "Countries" },
                { v: "3.9K+", l: "Airports"  },
                { v: "10K+",  l: "Embassies" },
                { v: "99.9%", l: "Uptime"    },
                { v: "10",    l: "Endpoints" },
              ].map((s, i) => (
                <div key={i} className="flex-1 py-4 text-center bg-[#0D1117]"
                  style={{ borderRight: i < 4 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                  <div className="text-xl font-bold text-[#00E5A0]">{s.v}</div>
                  <div className="text-[11px] text-[#8A9BB0] mt-0.5">{s.l}</div>
                </div>
              ))}
            </div>

            {/* Changelog */}
            <div className="mb-6 rounded-lg border border-[#A855F7]/20 bg-[#A855F7]/5 px-5 py-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold tracking-widest text-[#A855F7] border border-[#A855F7]/30 px-2 py-0.5 rounded">CHANGELOG</span>
                <span className="text-[11px] text-[#8A9BB0]">Latest update</span>
              </div>
              <p className="text-sm text-[#E8EDF2] font-semibold mb-1">✦ Visa Guides are now live</p>
              <p className="text-xs text-[#8A9BB0] leading-relaxed">
                6 static guide pages under <code className="text-[#A855F7]">/api/v1/visa-guides/</code>.
                The Passport API now returns a <code className="text-[#A855F7]">visa_guide_url</code> field
                that links directly to the relevant guide based on visa status.
              </p>
            </div>

            {/* Base URL */}
            <div className="bg-[#0D1117] border border-[#00E5A0]/15 rounded-xl px-5 py-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-[#8A9BB0] tracking-widest mb-1">BASE URL</div>
                <code className="text-base text-[#00E5A0]">{BASE_URL}</code>
              </div>
              <button onClick={() => copy(BASE_URL, "baseurl")}
                className="px-3.5 py-1.5 rounded-md text-[11px] cursor-pointer border font-mono bg-[#00E5A0]/8 border-[#00E5A0]/20"
                style={{ color: copied === "baseurl" ? "#00E5A0" : "#8A9BB0" }}>
                {copied === "baseurl" ? "✓ Copied" : "Copy"}
              </button>
            </div>
          </section>

          {/* ── Quick Start ── */}
          <section id="quickstart" className="mb-20">
            <h2 className="text-2xl font-semibold mb-2" style={{ fontFamily: "Georgia, serif" }}>⚡ Quick Start</h2>
            <p className="text-sm text-[#8A9BB0] leading-relaxed mb-6">Get your first API response in under 60 seconds.</p>
            {[
              { step: "1", title: "Get a free API key", desc: "No credit card required. 100 requests/day free forever.", code: null, link: { href: "/login", label: "Get Free API Key →" } },
              { step: "2", title: "Make your first request", desc: "Check visa requirements for Bangladesh → Japan:", code: `curl "${BASE_URL}/api/v1/passport?from=Bangladesh&to=Japan&api_key=eak_your_key"`, link: null },
              { step: "3", title: "Read the response", desc: "You'll get visa_status and a visa_guide_url ready to use:", code: `{\n  "visa_status": "e-visa",\n  "visa_guide_url": "https://api.eammu.com/api/v1/visa-guides/e-visa",\n  "from": { "name": "Bangladesh", "code": "bd" },\n  "to":   { "name": "Turkey",     "code": "tr" }\n}`, link: null },
              { step: "4", title: "Redirect to the guide", desc: "Use visa_guide_url to show a full step-by-step visa guide to your user. The guide URL already encodes the visa type — no extra param needed.", code: null, link: null },
            ].map((s, i) => (
              <div key={i} className="flex gap-5 mb-6">
                <div className="w-8 h-8 rounded-full shrink-0 bg-[#00E5A0]/10 border border-[#00E5A0]/20 flex items-center justify-center text-[13px] font-bold text-[#00E5A0]">{s.step}</div>
                <div className="flex-1">
                  <div className="text-sm font-medium mb-1.5 text-[#E8EDF2]">{s.title}</div>
                  <div className="text-xs text-[#8A9BB0] mb-2">{s.desc}</div>
                  {s.code && <pre className="bg-[#0D1117] border border-white/6 rounded-lg px-4 py-3 m-0 text-xs text-[#00E5A0] font-mono overflow-x-auto">{s.code}</pre>}
                  {s.link && <Link href={s.link.href} className="inline-block mt-2.5 px-4 py-2 rounded-md text-xs bg-[#00E5A0] text-[#080C10] no-underline font-bold">{s.link.label}</Link>}
                </div>
              </div>
            ))}
          </section>

          {/* ── Auth ── */}
          <section id="auth" className="mb-20">
            <h2 className="text-2xl font-semibold mb-2" style={{ fontFamily: "Georgia, serif" }}>🔑 Authentication</h2>
            <p className="text-sm text-[#8A9BB0] leading-relaxed mb-5">Every request requires an API key. Pass it as a header (recommended) or query parameter.</p>
            <div className="flex flex-col gap-3 mb-5">
              {[
                { label: "Header — Recommended", code: `x-api-key: eak_your_key`, color: "#00E5A0" },
                { label: "Query Parameter",       code: `?api_key=eak_your_key`,  color: "#00C2FF" },
              ].map((item, i) => (
                <div key={i} className="rounded-lg overflow-hidden border border-white/6 bg-[#0D1117]">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-white/6">
                    <span className="text-[11px] text-[#8A9BB0] tracking-wider font-mono">{item.label}</span>
                    <button onClick={() => copy(item.code, item.label)} className="text-[11px] font-mono bg-transparent border-none cursor-pointer"
                      style={{ color: copied === item.label ? "#00E5A0" : "#8A9BB0" }}>
                      {copied === item.label ? "✓ Copied" : "Copy"}
                    </button>
                  </div>
                  <pre className="px-4 py-3 m-0 text-sm font-mono" style={{ color: item.color }}>{item.code}</pre>
                </div>
              ))}
            </div>
            <div className="bg-[#FEBC2E]/5 border border-[#FEBC2E]/15 rounded-lg px-4 py-3 text-xs text-[#FEBC2E] font-mono">
              ⚠️ Never expose your API key in client-side code. Use server-side routes or environment variables.
            </div>
          </section>

          {/* ── How It Works ── */}
          <section id="flow" className="mb-20">
            <h2 className="text-2xl font-semibold mb-2" style={{ fontFamily: "Georgia, serif" }}>🔄 How It Works</h2>
            <p className="text-sm text-[#8A9BB0] leading-relaxed mb-6">
              The passport and visa-guides endpoints are designed to work together in a two-step flow.
              Start with the Passport API to get visa requirements, then use the returned
              <code className="text-[#00E5A0] mx-1">visa_guide_url</code>
              to show users a full guide for their specific visa type.
            </p>

            {/* Flow diagram */}
            <div className="relative mb-8">
              {/* Step 1 */}
              <div className="flex gap-4 mb-3">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[#00E5A0]/10 border border-[#00E5A0]/30 flex items-center justify-center text-xs font-bold text-[#00E5A0] shrink-0">1</div>
                  <div className="w-px flex-1 bg-[#00E5A0]/20 mt-1" style={{ minHeight: 24 }} />
                </div>
                <div className="flex-1 pb-4">
                  <div className="text-sm font-semibold text-[#E8EDF2] mb-1">User selects passport + destination</div>
                  <div className="text-xs text-[#8A9BB0] mb-2">Your app calls the Passport API with <code className="text-[#00E5A0]">?from=</code> and <code className="text-[#00E5A0]">?to=</code></div>
                  <pre className="bg-[#0D1117] border border-white/6 rounded-lg px-4 py-2.5 m-0 text-xs text-[#00E5A0] font-mono">
GET /api/v1/passport?from=Bangladesh&to=Turkey&api_key=eak_…</pre>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4 mb-3">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[#00C2FF]/10 border border-[#00C2FF]/30 flex items-center justify-center text-xs font-bold text-[#00C2FF] shrink-0">2</div>
                  <div className="w-px flex-1 bg-[#00C2FF]/20 mt-1" style={{ minHeight: 24 }} />
                </div>
                <div className="flex-1 pb-4">
                  <div className="text-sm font-semibold text-[#E8EDF2] mb-1">API returns visa_status + visa_guide_url</div>
                  <div className="text-xs text-[#8A9BB0] mb-2">The response tells you the visa type and gives you the exact guide URL to use.</div>
                  <pre className="bg-[#0D1117] border border-white/6 rounded-lg px-4 py-2.5 m-0 text-xs font-mono text-[#A8B8CC]">
{`{
  "visa_status":    "e-visa",
  "visa_guide_url": "https://api.eammu.com/api/v1/visa-guides/e-visa"
}`}</pre>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4 mb-3">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[#A855F7]/10 border border-[#A855F7]/30 flex items-center justify-center text-xs font-bold text-[#A855F7] shrink-0">3</div>
                  <div className="w-px flex-1 bg-[#A855F7]/20 mt-1" style={{ minHeight: 24 }} />
                </div>
                <div className="flex-1 pb-4">
                  <div className="text-sm font-semibold text-[#E8EDF2] mb-1">Your app redirects to the guide page</div>
                  <div className="text-xs text-[#8A9BB0] mb-2">
                    Redirect the user to the visa guide URL — either as an API call (to render your own UI) or directly as a page in your app at
                    <code className="text-[#A855F7] mx-1">yourapp.com/visa-guides/e-visa</code>.
                  </div>
                  <pre className="bg-[#0D1117] border border-white/6 rounded-lg px-4 py-2.5 m-0 text-xs text-[#A855F7] font-mono">
GET /api/v1/visa-guides/e-visa   → static JSON guide</pre>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[#FEBC2E]/10 border border-[#FEBC2E]/30 flex items-center justify-center text-xs font-bold text-[#FEBC2E] shrink-0">4</div>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-[#E8EDF2] mb-1">User sees full step-by-step visa guide</div>
                  <div className="text-xs text-[#8A9BB0]">
                    The guide returns structured JSON: requirements checklist, step-by-step process, fees, processing time, tips, and related links.
                    Render it however suits your UI.
                  </div>
                </div>
              </div>
            </div>

            {/* Visa guide URL map */}
            <div className="text-[11px] text-[#8A9BB0] tracking-widest font-mono mb-2">VISA STATUS → GUIDE URL MAPPING</div>
            <div className="rounded-lg overflow-hidden border border-white/6">
              <div className="grid px-4 py-2 bg-[#0A0F14] border-b border-white/6 text-[10px] text-[#8A9BB0] tracking-widest font-mono"
                style={{ gridTemplateColumns: "160px 1fr" }}>
                <span>visa_status VALUE</span><span>visa_guide_url</span>
              </div>
              {[
                { status: "visa required",   slug: "visa-required",   color: "#FF6B35" },
                { status: "e-visa",          slug: "e-visa",          color: "#00C2FF" },
                { status: "visa on arrival", slug: "visa-on-arrival", color: "#00E5A0" },
                { status: "eta",             slug: "eta",             color: "#A855F7" },
                { status: "no admission",    slug: "no-admission",    color: "#FF3B5C" },
                { status: "30 / 60 / 90…",  slug: null,              color: "#FEBC2E", note: "null — visa-free has no guide URL" },
                { status: "not_applicable",  slug: null,              color: "#8A9BB0", note: "null — same country / territory" },
              ].map((r, i) => (
                <div key={i} className="grid px-4 py-2.5 items-center"
                  style={{
                    gridTemplateColumns: "160px 1fr",
                    background: i % 2 === 0 ? "#0D1117" : "#0A0F14",
                    borderBottom: i < 6 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  }}>
                  <code className="text-xs font-mono" style={{ color: r.color }}>{r.status}</code>
                  {r.slug
                    ? <code className="text-xs font-mono text-[#8A9BB0]">{BASE_URL}/api/v1/visa-guides/{r.slug}</code>
                    : <span className="text-xs text-[#8A9BB0] italic">{r.note}</span>
                  }
                </div>
              ))}
            </div>
          </section>

          {/* ── Passport API ── */}
          <section id="passport" className="mb-20">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold tracking-widest px-2 py-1 rounded font-mono border bg-[#00E5A0]/15 text-[#00E5A0] border-[#00E5A0]/30">GET</span>
              <span className="text-[10px] tracking-widest px-2 py-1 rounded font-mono border border-white/8 bg-white/4 text-[#8A9BB0]">TRAVEL</span>
            </div>
            <code className="text-lg text-[#E8EDF2] font-mono tracking-tight mb-3 block">{passportEndpoint.path}</code>
            <p className="text-sm text-[#8A9BB0] leading-relaxed mb-6 max-w-xl">{passportEndpoint.desc}</p>

            <div className="mb-6">
              <div className="text-[11px] text-[#8A9BB0] tracking-widest font-mono mb-2">PARAMETERS</div>
              <ParamTable params={passportEndpoint.params} color="#00E5A0" />
            </div>

            {/* Example URLs */}
            <div className="mb-6">
              <div className="text-[11px] text-[#8A9BB0] tracking-widest font-mono mb-2">EXAMPLE URLS</div>
              <div className="flex flex-col gap-2">
                {passportEndpoint.examples.map((ex, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-md bg-[#0D1117] border border-white/6">
                    <div>
                      <div className="text-[10px] text-[#8A9BB0] mb-1 font-mono">{ex.label}</div>
                      <code className="text-[11px] font-mono text-[#00E5A0] break-all">{BASE_URL}{ex.url}</code>
                    </div>
                    <button onClick={() => copy(`${BASE_URL}${ex.url}`, ex.label)}
                      className="shrink-0 text-[10px] font-mono bg-transparent border-none cursor-pointer"
                      style={{ color: copied === ex.label ? "#00E5A0" : "#8A9BB0" }}>
                      {copied === ex.label ? "✓" : "Copy"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Code examples */}
            <div className="mb-6">
              <div className="text-[11px] text-[#8A9BB0] tracking-widest font-mono mb-2">CODE EXAMPLES</div>
              <CodeBlock
                path={passportEndpoint.path}
                qs="from=Bangladesh&to=Japan&api_key=eak_your_key"
                color="#00E5A0"
              />
            </div>

            {/* Two response tabs */}
            <div className="mb-6">
              <div className="text-[11px] text-[#8A9BB0] tracking-widest font-mono mb-3">RESPONSE SCHEMA</div>
              <PassportResponseTabs
                responseSingle={passportEndpoint.responseSingle}
                responseAll={passportEndpoint.responseAll}
                copied={copied}
                onCopy={copy}
              />
            </div>

            {/* Response headers */}
            <div className="mb-6">
              <div className="text-[11px] text-[#8A9BB0] tracking-widest font-mono mb-2">RESPONSE HEADERS</div>
              <div className="rounded-lg overflow-hidden border border-white/6">
                {[
                  { h: "X-RateLimit-Remaining", v: "Number of requests remaining in the current period" },
                  { h: "X-Plan",                v: "Your current plan: free | pro | enterprise" },
                ].map((r, i) => (
                  <div key={i} className="flex gap-6 px-4 py-3 items-center"
                    style={{ background: i % 2 === 0 ? "#0D1117" : "#0A0F14", borderBottom: i === 0 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                    <code className="text-xs font-mono text-[#00C2FF] min-w-[220px]">{r.h}</code>
                    <span className="text-xs text-[#8A9BB0]">{r.v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Playground */}
            <div className="text-[11px] text-[#8A9BB0] tracking-widest font-mono">TRY IT LIVE</div>
            <Playground
              path={passportEndpoint.path}
              params={passportEndpoint.params}
              playground={passportEndpoint.playground}
              color="#00E5A0"
            />
          </section>

          {/* ── Other Endpoints ── */}
          {otherEndpoints.map(ep => (
            <section key={ep.id} id={ep.id} className="mb-20">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold tracking-widest px-2 py-1 rounded font-mono border"
                  style={{ background: `${ep.color}15`, color: ep.color, borderColor: `${ep.color}30` }}>GET</span>
                <span className="text-[10px] tracking-widest px-2 py-1 rounded font-mono border border-white/8 bg-white/4 text-[#8A9BB0]">{ep.badge}</span>
              </div>
              <code className="text-lg text-[#E8EDF2] font-mono tracking-tight mb-3 block">{ep.path}</code>
              <p className="text-sm text-[#8A9BB0] leading-relaxed mb-6 max-w-xl">{ep.desc}</p>

              <div className="mb-6">
                <div className="text-[11px] text-[#8A9BB0] tracking-widest font-mono mb-2">PARAMETERS</div>
                <ParamTable params={ep.params} color={ep.color} />
              </div>

              <div className="mb-6">
                <div className="text-[11px] text-[#8A9BB0] tracking-widest font-mono mb-2">EXAMPLE URLS</div>
                <div className="flex flex-col gap-2">
                  {ep.examples.map((ex, i) => (
                    <div key={i} className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-md bg-[#0D1117] border border-white/6">
                      <div>
                        <div className="text-[10px] text-[#8A9BB0] mb-1 font-mono">{ex.label}</div>
                        <code className="text-[11px] font-mono break-all" style={{ color: ep.color }}>{BASE_URL}{ex.url}</code>
                      </div>
                      <button onClick={() => copy(`${BASE_URL}${ex.url}`, ex.label)}
                        className="shrink-0 text-[10px] font-mono bg-transparent border-none cursor-pointer"
                        style={{ color: copied === ex.label ? "#00E5A0" : "#8A9BB0" }}>
                        {copied === ex.label ? "✓" : "Copy"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <div className="text-[11px] text-[#8A9BB0] tracking-widest font-mono mb-2">CODE EXAMPLES</div>
                <CodeBlock
                  path={ep.path}
                  qs={new URLSearchParams({ ...ep.playground, api_key: "eak_your_key" }).toString()}
                  color={ep.color}
                />
              </div>

              <div className="mb-6">
                <div className="text-[11px] text-[#8A9BB0] tracking-widest font-mono mb-2">RESPONSE SCHEMA</div>
                <ResponseBlock code={ep.response} label="JSON" onCopy={copy} copied={copied} copyId={ep.id + "res"} />
              </div>

              <div>
                <div className="text-[11px] text-[#8A9BB0] tracking-widest font-mono">TRY IT LIVE</div>
                <Playground path={ep.path} params={ep.params} playground={ep.playground} color={ep.color} />
              </div>
            </section>
          ))}

          {/* ── Visa Guides Divider ── */}
          <div className="mb-12 mt-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#A855F7]/30 to-transparent" />
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#A855F7]/25 bg-[#A855F7]/8">
                <span className="text-[10px] tracking-widest text-[#A855F7] font-bold">✦ NEW</span>
                <span className="text-xs text-[#E8EDF2] font-semibold">Visa Guide Pages</span>
              </div>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#A855F7]/30 to-transparent" />
            </div>
            <div className="rounded-lg border border-[#A855F7]/15 bg-[#A855F7]/5 px-5 py-4">
              <p className="text-sm text-[#E8EDF2] font-semibold mb-2">Static guide endpoints — no parameters required</p>
              <p className="text-xs text-[#8A9BB0] leading-relaxed">
                These endpoints return static JSON content describing a visa type: requirements, step-by-step process, fees, processing time, and tips.
                They are triggered automatically via the <code className="text-[#A855F7]">visa_guide_url</code> field
                in Passport API responses. You can call them directly or render their content in your app's guide pages.
                <span className="block mt-1.5">
                  <strong className="text-[#E8EDF2]">No api_key required</strong> — these are public static info endpoints.
                </span>
              </p>
            </div>
          </div>

          {/* ── Visa Guide Static Pages ── */}
          {visaGuidePages.map(vg => (
            <section key={vg.id} id={vg.id} className="mb-20">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold tracking-widest px-2 py-1 rounded font-mono border"
                  style={{ background: `${vg.color}15`, color: vg.color, borderColor: `${vg.color}30` }}>GET</span>
                <span className="text-[10px] tracking-widest px-2 py-1 rounded font-mono border border-white/8 bg-white/4 text-[#8A9BB0]">VISA GUIDE</span>
                <span className="text-[10px] tracking-widest px-2 py-1 rounded font-mono border bg-[#A855F7]/10 border-[#A855F7]/20 text-[#A855F7]">STATIC</span>
              </div>
              <code className="text-lg text-[#E8EDF2] font-mono tracking-tight mb-3 block">{vg.path}</code>

              <p className="text-sm text-[#8A9BB0] leading-relaxed mb-4 max-w-xl">{vg.desc}</p>

              {/* Triggered by */}
              <div className="mb-6 flex items-center gap-3 text-xs text-[#8A9BB0]">
                <span className="font-mono tracking-wider text-[10px]">TRIGGERED WHEN</span>
                <code className="px-2.5 py-1 rounded border font-mono text-[11px]"
                  style={{ background: `${vg.color}10`, color: vg.color, borderColor: `${vg.color}25` }}>
                  visa_status = "{vg.triggeredBy}"
                </code>
                <span>in Passport API response</span>
              </div>

              {/* No params notice */}
              <div className="mb-6 flex items-center gap-2 text-xs text-[#8A9BB0] bg-[#0D1117] border border-white/6 rounded-lg px-4 py-3">
                <span className="text-[#00E5A0]">✓</span>
                <span>No parameters required. No API key needed. Call with a plain GET request.</span>
              </div>

              {/* Example URL */}
              <div className="mb-6">
                <div className="text-[11px] text-[#8A9BB0] tracking-widest font-mono mb-2">EXAMPLE URL</div>
                <div className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-md bg-[#0D1117] border border-white/6">
                  <code className="text-[11px] font-mono break-all" style={{ color: vg.color }}>{BASE_URL}{vg.path}</code>
                  <button onClick={() => copy(`${BASE_URL}${vg.path}`, vg.id + "url")}
                    className="shrink-0 text-[10px] font-mono bg-transparent border-none cursor-pointer"
                    style={{ color: copied === vg.id + "url" ? "#00E5A0" : "#8A9BB0" }}>
                    {copied === vg.id + "url" ? "✓" : "Copy"}
                  </button>
                </div>
              </div>

              {/* Code examples */}
              <div className="mb-6">
                <div className="text-[11px] text-[#8A9BB0] tracking-widest font-mono mb-2">CODE EXAMPLES</div>
                <CodeBlock path={vg.path} qs="" color={vg.color} />
              </div>

              {/* Response */}
              <div>
                <div className="text-[11px] text-[#8A9BB0] tracking-widest font-mono mb-2">RESPONSE</div>
                <ResponseBlock code={vg.response} label="JSON — static content" onCopy={copy} copied={copied} copyId={vg.id + "res"} />
              </div>
            </section>
          ))}

          {/* ── Errors ── */}
          <section id="errors" className="mb-20">
            <h2 className="text-2xl font-semibold mb-2" style={{ fontFamily: "Georgia, serif" }}>⚠️ Error Codes</h2>
            <p className="text-sm text-[#8A9BB0] leading-relaxed mb-5">
              All errors return JSON with an <code className="text-[#FF6B35]">error</code> field.
            </p>
            <div className="rounded-lg overflow-hidden border border-white/6">
              <div className="grid px-4 py-2 bg-[#0A0F14] border-b border-white/6 text-[10px] text-[#8A9BB0] tracking-widest font-mono"
                style={{ gridTemplateColumns: "60px 140px 1fr" }}>
                <span>CODE</span><span>STATUS</span><span>DESCRIPTION</span>
              </div>
              {[
                { code: "400", text: "Bad Request",       desc: "Missing required parameter. Example: ?from= is required on the passport endpoint." },
                { code: "401", text: "Unauthorized",      desc: "Missing or invalid API key." },
                { code: "403", text: "Forbidden",         desc: "Account suspended. Contact support@eammu.com." },
                { code: "404", text: "Not Found",         desc: "Country or passport not found. Check spelling — names are case-insensitive." },
                { code: "429", text: "Too Many Requests", desc: "Rate limit exceeded. Upgrade plan or wait for daily reset." },
                { code: "500", text: "Internal Error",    desc: "Server error. Try again or contact support." },
              ].map((e, i) => (
                <div key={i} className="grid px-4 py-3 items-center"
                  style={{
                    gridTemplateColumns: "60px 140px 1fr",
                    background: i % 2 === 0 ? "#0D1117" : "#0A0F14",
                    borderBottom: i < 5 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  }}>
                  <code className="text-sm font-bold font-mono"
                    style={{ color: e.code === "400" || e.code === "404" ? "#FF6B35" : e.code === "401" || e.code === "403" ? "#FF3B5C" : e.code === "429" ? "#FEBC2E" : "#8A9BB0" }}>
                    {e.code}
                  </code>
                  <span className="text-xs text-[#E8EDF2]">{e.text}</span>
                  <span className="text-xs text-[#8A9BB0]">{e.desc}</span>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <div className="text-[11px] text-[#8A9BB0] tracking-widest font-mono mb-2">ERROR RESPONSE FORMAT</div>
              <pre className="bg-[#0D1117] border border-[#FF6B35]/15 rounded-lg px-4 py-3.5 m-0 text-xs text-[#FF6B35] font-mono leading-relaxed">
{`{
  "error": "Passport 'xyz' not found"
}`}
              </pre>
            </div>
          </section>

          {/* ── Visa Status ── */}
          <section id="visa-status" className="mb-20">
            <h2 className="text-2xl font-semibold mb-2" style={{ fontFamily: "Georgia, serif" }}>📋 Visa Status Values</h2>
            <p className="text-sm text-[#8A9BB0] leading-relaxed mb-5">
              The <code className="text-[#00E5A0]">visa_status</code> field in Passport API responses is one of the following.
              Numeric values (30, 60, 90…) indicate visa-free entry for that many days.
            </p>
            <div className="flex flex-col gap-2">
              {visaStatuses.map((v, i) => (
                <div key={i} className="flex items-center gap-4 bg-[#0D1117] border border-white/6 rounded-lg px-4 py-3">
                  <span className="text-base shrink-0">{v.icon}</span>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded font-mono min-w-[140px] text-center shrink-0 border"
                    style={{ background: `${v.color}10`, color: v.color, borderColor: `${v.color}25` }}>
                    {v.value}
                  </span>
                  <span className="text-xs text-[#8A9BB0]">{v.desc}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── Rate Limits ── */}
          <section id="limits" className="mb-20">
            <h2 className="text-2xl font-semibold mb-2" style={{ fontFamily: "Georgia, serif" }}>📊 Rate Limits</h2>
            <p className="text-sm text-[#8A9BB0] leading-relaxed mb-6">Rate limit info is returned in response headers on every request.</p>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { name: "Free",       price: "$0",     req: "100 req/day",   color: "#8A9BB0", hot: false },
                { name: "Pro",        price: "$9/mo",  req: "10,000 req/mo", color: "#00E5A0", hot: true  },
                { name: "Enterprise", price: "Custom", req: "Unlimited",     color: "#A855F7", hot: false },
              ].map((p, i) => (
                <div key={i} className="rounded-xl p-5 border"
                  style={{ background: p.hot ? "rgba(0,229,160,0.05)" : "#0D1117", borderColor: p.hot ? "rgba(0,229,160,0.2)" : "rgba(255,255,255,0.06)" }}>
                  {p.hot && <div className="text-[9px] text-[#00E5A0] tracking-widest mb-2 font-mono">MOST POPULAR</div>}
                  <div className="text-xl font-bold mb-1" style={{ color: p.color }}>{p.price}</div>
                  <div className="text-sm text-[#E8EDF2] mb-1">{p.name}</div>
                  <div className="text-xs text-[#8A9BB0]">{p.req}</div>
                </div>
              ))}
            </div>

            <div className="text-[11px] text-[#8A9BB0] tracking-widest font-mono mb-2">RATE LIMIT HEADERS</div>
            <div className="rounded-lg overflow-hidden border border-white/6">
              {[
                { header: "X-RateLimit-Remaining", desc: "Requests remaining in current period" },
                { header: "X-Plan",                desc: "Your current plan: free | pro | enterprise" },
              ].map((h, i) => (
                <div key={i} className="flex gap-6 px-4 py-3 items-center"
                  style={{ background: i % 2 === 0 ? "#0D1117" : "#0A0F14", borderBottom: i === 0 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                  <code className="text-xs font-mono text-[#00C2FF] min-w-[200px]">{h.header}</code>
                  <span className="text-xs text-[#8A9BB0]">{h.desc}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 text-center">
              <Link href="/login" className="inline-block px-6 py-2.5 rounded-lg bg-[#00E5A0] text-[#080C10] no-underline text-sm font-bold hover:opacity-90 transition-opacity">
                Upgrade Plan →
              </Link>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}

// ─── Passport dual-response tabs ─────────────────────────────────────────────
function PassportResponseTabs({ responseSingle, responseAll, copied, onCopy }) {
  const [tab, setTab] = useState("single");
  return (
    <div className="rounded-lg overflow-hidden border border-white/6 bg-[#0D1117]">
      <div className="flex items-center justify-between border-b border-white/6">
        <div className="flex">
          {[
            { key: "single", label: "Single destination (?to= provided)" },
            { key: "all",    label: "All destinations (no ?to=)" },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="px-4 py-2.5 text-[11px] font-mono tracking-wide border-none bg-transparent cursor-pointer transition-colors"
              style={{ color: tab === t.key ? "#E8EDF2" : "#8A9BB0", borderBottom: tab === t.key ? "2px solid #00E5A0" : "2px solid transparent" }}>
              {t.label}
            </button>
          ))}
        </div>
        <button onClick={() => onCopy(tab === "single" ? responseSingle : responseAll, "passport-" + tab)}
          className="mr-4 text-[11px] font-mono bg-transparent border-none cursor-pointer"
          style={{ color: copied === "passport-" + tab ? "#00E5A0" : "#8A9BB0" }}>
          {copied === "passport-" + tab ? "✓ Copied" : "Copy"}
        </button>
      </div>
      <pre className="p-4 m-0 text-xs text-[#A8B8CC] font-mono overflow-x-auto leading-relaxed max-h-[520px] overflow-y-auto">
        {tab === "single" ? responseSingle : responseAll}
      </pre>
    </div>
  );
}