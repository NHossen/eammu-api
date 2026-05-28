"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const BASE_URL = "https://api.eammu.com";

const endpoints = [
  {
    id: "passport",
    method: "GET",
    path: "/api/v1/passport",
    color: "#00E5A0",
    badge: "TRAVEL",
    desc: "Get visa requirements for a passport holder. Returns visa status, entry type, and country flags for any origin → destination pair.",
    params: [
      { name: "from", type: "string", required: true,  desc: "Passport country. Example: Bangladesh" },
      { name: "to",   type: "string", required: false, desc: "Destination country. Omit to get all destinations grouped by visa type." },
      { name: "api_key", type: "string", required: true, desc: "Your API key (or use x-api-key header)" },
    ],
    playground: { from: "Bangladesh", to: "Japan" },
    examples: [
      { label: "Single destination", url: `/api/v1/passport?from=Bangladesh&to=Japan&api_key=YOUR_KEY` },
      { label: "All destinations",   url: `/api/v1/passport?from=Bangladesh&api_key=YOUR_KEY` },
    ],
    response: `{
  "from": {
    "name": "Bangladesh",
    "flag": "https://twemoji.maxcdn.com/2/svg/1f1e7-1f1e9.svg",
    "code": "bd"
  },
  "to": {
    "name": "Japan",
    "flag": "https://twemoji.maxcdn.com/2/svg/1f1ef-1f1f5.svg",
    "code": "jp"
  },
  "visa_status": "visa required"
}`,
  },
  {
    id: "countries",
    method: "GET",
    path: "/api/v1/countries",
    color: "#00C2FF",
    badge: "DATA",
    desc: "Get a full list of countries with flags, ISO codes, and names. Supports partial name search and code filtering.",
    params: [
      { name: "name",    type: "string", required: false, desc: "Filter by country name (partial, case-insensitive). Example: bang" },
      { name: "code",    type: "string", required: false, desc: "Filter by ISO 2-letter code. Example: bd" },
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
    desc: "Find embassy and consulate locations worldwide. Filter by operator country, host country, or city. Returns coordinates, website, and type.",
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
      { label: "By city",                     url: `/api/v1/embassies?city=Tokyo&api_key=YOUR_KEY` },
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
      { name: "code",    type: "string", required: false, desc: "IATA airport code. Example: DAC" },
      { name: "api_key", type: "string", required: true,  desc: "Your API key" },
    ],
    playground: { code: "DAC" },
    examples: [
      { label: "By IATA code",    url: `/api/v1/airports?code=DAC&api_key=YOUR_KEY` },
      { label: "By country",      url: `/api/v1/airports?country=Bangladesh&api_key=YOUR_KEY` },
      { label: "By city",         url: `/api/v1/airports?city=Dhaka&api_key=YOUR_KEY` },
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
    desc: "Autocomplete country names with flags and ISO codes. Useful for building search inputs and dropdowns in your app.",
    params: [
      { name: "q",       type: "string", required: true, desc: "Search query (minimum 1 character). Example: ban" },
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

const visaStatuses = [
  { value: "visa required",   color: "#FF6B35", icon: "🔴", desc: "Must apply for visa before travel at embassy or consulate" },
  { value: "e-visa",          color: "#00C2FF", icon: "💻", desc: "Apply online before travel. No embassy visit needed" },
  { value: "visa on arrival", color: "#00E5A0", icon: "✅", desc: "Get visa at the port of entry. May require fee" },
  { value: "eta",             color: "#A855F7", icon: "📋", desc: "Electronic Travel Authorization required before boarding" },
  { value: "no admission",    color: "#FF3B5C", icon: "🚫", desc: "Entry not permitted for this passport" },
  { value: "90 (number)",     color: "#FEBC2E", icon: "🆓", desc: "Visa-free entry for the given number of days" },
  { value: "not_applicable",  color: "#8A9BB0", icon: "➖", desc: "Same country or special territory — not applicable" },
];

const codeExamples = {
  curl: (ep) => `curl "${BASE_URL}${ep.examples[0].url.replace("YOUR_KEY", "eak_your_key")}"`,
  js: (ep) => `const res = await fetch(
  "${BASE_URL}${ep.examples[0].url.replace("YOUR_KEY", "eak_your_key")}"
);
const data = await res.json();
console.log(data);`,
  python: (ep) => `import requests

res = requests.get(
  "${BASE_URL}${ep.examples[0].url.replace("YOUR_KEY", "eak_your_key")}"
)
print(res.json())`,
  php: (ep) => `$response = file_get_contents(
  "${BASE_URL}${ep.examples[0].url.replace("YOUR_KEY", "eak_your_key")}"
);
$data = json_decode($response, true);
print_r($data);`,
};

// ─── Playground Component ──────────────────────────────────────────────────
function Playground({ ep }) {
  const [params, setParams]   = useState(ep.playground || {});
  const [apiKey, setApiKey]   = useState("");
  const [response, setResp]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus]   = useState(null);
  const [time, setTime]       = useState(null);

  async function run() {
    if (!apiKey) { setResp({ error: "Enter your API key to test" }); return; }
    setLoading(true); setResp(null);
    const qs = new URLSearchParams({ ...params, api_key: apiKey }).toString();
    const url = `${BASE_URL}${ep.path}?${qs}`;
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

  const nonKeyParams = ep.params.filter(p => p.name !== "api_key");

  return (
    <div style={{
      background: "#080C10", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 10, overflow: "hidden", marginTop: 24,
    }}>
      <div style={{
        padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ fontSize: 11, color: "#8A9BB0", letterSpacing: "0.08em" }}>
          ▶ LIVE PLAYGROUND
        </span>
        {status && (
          <span style={{
            fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4,
            background: status === 200 ? "rgba(0,229,160,0.1)" : "rgba(255,107,53,0.1)",
            color: status === 200 ? "#00E5A0" : "#FF6B35",
            border: `1px solid ${status === 200 ? "rgba(0,229,160,0.2)" : "rgba(255,107,53,0.2)"}`,
          }}>
            {status} · {time}ms
          </span>
        )}
      </div>

      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
        {/* API Key */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "#FF6B35", minWidth: 70, letterSpacing: "0.04em" }}>api_key</span>
          <input
            type="password"
            placeholder="eak_your_api_key"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            style={{
              flex: 1, padding: "7px 12px", borderRadius: 6,
              background: "#0D1117", border: "1px solid rgba(255,107,53,0.2)",
              color: "#E8EDF2", fontSize: 12, outline: "none",
              fontFamily: "'Courier New', monospace",
            }}
          />
        </div>

        {/* Params */}
        {nonKeyParams.map(p => (
          <div key={p.name} style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{
              fontSize: 11, minWidth: 70, letterSpacing: "0.04em",
              color: p.required ? ep.color : "#8A9BB0",
            }}>{p.name}</span>
            <input
              placeholder={p.desc.split(".")[0]}
              value={params[p.name] || ""}
              onChange={e => setParams(prev => ({ ...prev, [p.name]: e.target.value }))}
              style={{
                flex: 1, padding: "7px 12px", borderRadius: 6,
                background: "#0D1117", border: `1px solid rgba(255,255,255,0.08)`,
                color: "#E8EDF2", fontSize: 12, outline: "none",
                fontFamily: "'Courier New', monospace",
              }}
            />
          </div>
        ))}

        <button
          onClick={run}
          disabled={loading}
          style={{
            padding: "9px 20px", borderRadius: 6, border: "none",
            background: loading ? `${ep.color}50` : ep.color,
            color: "#080C10", fontSize: 12, fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            alignSelf: "flex-start", fontFamily: "inherit",
            marginTop: 4,
          }}
        >
          {loading ? "Running..." : "▶ Send Request"}
        </button>
      </div>

      {response && (
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <pre style={{
            padding: 16, margin: 0,
            fontSize: 12, color: "#A8B8CC",
            overflowX: "auto", lineHeight: 1.8,
            maxHeight: 320, overflowY: "auto",
          }}>
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

// ─── Code Tabs ─────────────────────────────────────────────────────────────
function CodeBlock({ ep }) {
  const [lang, setLang] = useState("curl");
  const [copied, setCopied] = useState(false);
  const langs = ["curl", "js", "python", "php"];

  function copy() {
    navigator.clipboard.writeText(codeExamples[lang](ep));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={{
      background: "#0D1117", border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 8, overflow: "hidden",
    }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 16px", borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ display: "flex" }}>
          {langs.map(l => (
            <button key={l} onClick={() => setLang(l)} style={{
              padding: "10px 14px", border: "none", background: "transparent",
              fontSize: 11, fontFamily: "inherit", cursor: "pointer",
              color: lang === l ? "#E8EDF2" : "#8A9BB0",
              borderBottom: lang === l ? `2px solid ${ep.color}` : "2px solid transparent",
              letterSpacing: "0.04em",
            }}>{l.toUpperCase()}</button>
          ))}
        </div>
        <button onClick={copy} style={{
          background: "none", border: "none", color: copied ? "#00E5A0" : "#8A9BB0",
          cursor: "pointer", fontSize: 11, fontFamily: "inherit",
        }}>
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
      <pre style={{
        padding: "16px", margin: 0,
        fontSize: 12, color: "#00E5A0",
        overflowX: "auto", lineHeight: 1.8,
      }}>
        {codeExamples[lang](ep)}
      </pre>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("intro");
  const [copied, setCopied] = useState("");
  const observerRef = useRef();

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    observerRef.current = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
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
    { id: "intro",       label: "Introduction",    icon: "◎" },
    { id: "quickstart",  label: "Quick Start",      icon: "⚡" },
    { id: "auth",        label: "Authentication",   icon: "🔑" },
    { id: "passport",    label: "Passport API",     icon: "🛂" },
    { id: "countries",   label: "Countries API",    icon: "🌍" },
    { id: "embassies",   label: "Embassies API",    icon: "🏛" },
    { id: "airports",    label: "Airports API",     icon: "✈️" },
    { id: "suggest",     label: "Suggest API",      icon: "🔍" },
    { id: "errors",      label: "Error Codes",      icon: "⚠️" },
    { id: "visa-status", label: "Visa Status",      icon: "📋" },
    { id: "limits",      label: "Rate Limits",      icon: "📊" },
  ];

  return (
    <div style={{
      minHeight: "100vh", background: "#080C10",
      color: "#E8EDF2", fontFamily: "'Courier New', monospace",
      display: "flex", flexDirection: "column",
    }}>
      {/* Nav */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 40px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(8,12,16,0.97)", backdropFilter: "blur(12px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 26, height: 26, borderRadius: 6,
              background: "linear-gradient(135deg, #00E5A0, #00C2FF)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700, color: "#080C10",
            }}>E</div>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#E8EDF2" }}>
              EAMMU <span style={{ color: "#00E5A0" }}>API</span>
            </span>
          </Link>
          <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 16 }}>/</span>
          <span style={{ fontSize: 13, color: "#8A9BB0" }}>Documentation</span>
          <span style={{
            fontSize: 10, padding: "2px 8px", borderRadius: 4,
            background: "rgba(0,229,160,0.08)", border: "1px solid rgba(0,229,160,0.2)",
            color: "#00E5A0", letterSpacing: "0.08em",
          }}>v1</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Link href="/" style={{ padding: "7px 14px", borderRadius: 6, fontSize: 12, color: "#8A9BB0", textDecoration: "none" }}>
            ← Home
          </Link>
          <Link href="/login" style={{
            padding: "7px 16px", borderRadius: 6, fontSize: 12,
            background: "#00E5A0", color: "#080C10", textDecoration: "none", fontWeight: 600,
          }}>Get API Key →</Link>
        </div>
      </nav>

      <div style={{ display: "flex", flex: 1, maxWidth: 1200, margin: "0 auto", width: "100%", padding: "0 24px" }}>

        {/* Sidebar */}
        <aside style={{
          width: 220, flexShrink: 0, padding: "32px 0",
          position: "sticky", top: 57, height: "calc(100vh - 57px)",
          overflowY: "auto",
        }}>
          <div style={{ fontSize: 10, color: "#8A9BB0", letterSpacing: "0.1em", marginBottom: 10, paddingLeft: 12 }}>
            REFERENCE
          </div>
          {navItems.map(item => (
            <button key={item.id} onClick={() => {
              document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
            }} style={{
              display: "flex", alignItems: "center", gap: 8,
              width: "100%", textAlign: "left",
              padding: "8px 12px", borderRadius: 6, marginBottom: 1,
              background: activeSection === item.id ? "rgba(0,229,160,0.07)" : "transparent",
              color: activeSection === item.id ? "#00E5A0" : "#8A9BB0",
              border: "none", cursor: "pointer", fontSize: 13,
              fontFamily: "inherit",
              borderLeft: activeSection === item.id ? "2px solid #00E5A0" : "2px solid transparent",
              transition: "all 0.15s",
            }}>
              <span style={{ fontSize: 12 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}

          {/* Status */}
          <div style={{
            margin: "24px 12px 0", padding: "12px",
            background: "rgba(0,229,160,0.05)", border: "1px solid rgba(0,229,160,0.12)",
            borderRadius: 8,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00E5A0" }} />
              <span style={{ fontSize: 11, color: "#00E5A0", fontWeight: 600 }}>All Systems Operational</span>
            </div>
            <a href="https://api.eammu.com/api/v1/countries?api_key=test" target="_blank"
              style={{ fontSize: 10, color: "#8A9BB0", textDecoration: "none" }}>
              Status page →
            </a>
          </div>
        </aside>

        {/* Content */}
        <main style={{ flex: 1, padding: "40px 0 120px 56px", maxWidth: 820, minWidth: 0 }}>

          {/* ── Intro ── */}
          <section id="intro" style={{ marginBottom: 72 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(0,229,160,0.06)", border: "1px solid rgba(0,229,160,0.15)",
              borderRadius: 100, padding: "4px 14px", fontSize: 11,
              color: "#00E5A0", marginBottom: 20, letterSpacing: "0.08em",
            }}>
              EAMMU TRAVEL API — VERSION 1.0
            </div>
            <h1 style={{ fontSize: 36, fontWeight: 700, margin: "0 0 16px", fontFamily: "'Georgia',serif", lineHeight: 1.2 }}>
              API Documentation
            </h1>
            <p style={{ fontSize: 15, color: "#8A9BB0", lineHeight: 1.9, margin: "0 0 28px", maxWidth: 600 }}>
              The Eammu Travel API gives you real-time access to visa requirements,
              passport index data, embassy locations, and airport information for
              195+ countries. Built for travel apps, visa consultancies, and developers.
            </p>

            {/* Stats row */}
            <div style={{ display: "flex", gap: 0, marginBottom: 28 }}>
              {[
                { v: "195+",  l: "Countries" },
                { v: "3.9K+", l: "Airports" },
                { v: "10K+",  l: "Embassies" },
                { v: "99.9%", l: "Uptime" },
              ].map((s, i) => (
                <div key={i} style={{
                  padding: "16px 24px", textAlign: "center",
                  borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none",
                  background: "#0D1117",
                  borderRadius: i === 0 ? "8px 0 0 8px" : i === 3 ? "0 8px 8px 0" : 0,
                  border: "1px solid rgba(255,255,255,0.06)",
                  marginRight: i < 3 ? -1 : 0,
                }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: "#00E5A0" }}>{s.v}</div>
                  <div style={{ fontSize: 11, color: "#8A9BB0", marginTop: 2 }}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* Base URL */}
            <div style={{
              background: "#0D1117", border: "1px solid rgba(0,229,160,0.15)",
              borderRadius: 10, padding: "16px 20px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div>
                <div style={{ fontSize: 11, color: "#8A9BB0", letterSpacing: "0.06em", marginBottom: 4 }}>BASE URL</div>
                <code style={{ fontSize: 15, color: "#00E5A0" }}>{BASE_URL}</code>
              </div>
              <button onClick={() => copy(BASE_URL, "baseurl")} style={{
                background: "rgba(0,229,160,0.08)", border: "1px solid rgba(0,229,160,0.2)",
                borderRadius: 6, padding: "6px 14px", fontSize: 11,
                color: copied === "baseurl" ? "#00E5A0" : "#8A9BB0",
                cursor: "pointer", fontFamily: "inherit",
              }}>
                {copied === "baseurl" ? "✓ Copied" : "Copy"}
              </button>
            </div>
          </section>

          {/* ── Quick Start ── */}
          <section id="quickstart" style={{ marginBottom: 72 }}>
            <h2 style={{ fontSize: 24, fontWeight: 600, margin: "0 0 8px", fontFamily: "'Georgia',serif" }}>
              ⚡ Quick Start
            </h2>
            <p style={{ fontSize: 14, color: "#8A9BB0", lineHeight: 1.8, margin: "0 0 24px" }}>
              Get your first API response in under 60 seconds.
            </p>
            {[
              {
                step: "1",
                title: "Register for a free API key",
                desc: "No credit card required. 100 requests/day free forever.",
                code: null,
                link: { href: "/login", label: "Get Free API Key →" },
              },
              {
                step: "2",
                title: "Make your first request",
                desc: "Check visa requirements for Bangladesh → Japan:",
                code: `curl "${BASE_URL}/api/v1/passport?from=Bangladesh&to=Japan&api_key=eak_your_key"`,
                link: null,
              },
              {
                step: "3",
                title: "Parse the response",
                desc: "You'll get a JSON response with visa status and flags:",
                code: `{\n  "visa_status": "visa required",\n  "from": { "name": "Bangladesh", "code": "bd" },\n  "to":   { "name": "Japan", "code": "jp" }\n}`,
                link: null,
              },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 20, marginBottom: 24 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                  background: "rgba(0,229,160,0.1)", border: "1px solid rgba(0,229,160,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 700, color: "#00E5A0",
                }}>{s.step}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 6, color: "#E8EDF2" }}>{s.title}</div>
                  <div style={{ fontSize: 13, color: "#8A9BB0", marginBottom: s.code ? 10 : 0 }}>{s.desc}</div>
                  {s.code && (
                    <pre style={{
                      background: "#0D1117", border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: 8, padding: "12px 16px", margin: 0,
                      fontSize: 12, color: "#00E5A0", overflowX: "auto",
                    }}>{s.code}</pre>
                  )}
                  {s.link && (
                    <Link href={s.link.href} style={{
                      display: "inline-block", marginTop: 10,
                      padding: "8px 18px", borderRadius: 6, fontSize: 12,
                      background: "#00E5A0", color: "#080C10",
                      textDecoration: "none", fontWeight: 600,
                    }}>{s.link.label}</Link>
                  )}
                </div>
              </div>
            ))}
          </section>

          {/* ── Auth ── */}
          <section id="auth" style={{ marginBottom: 72 }}>
            <h2 style={{ fontSize: 24, fontWeight: 600, margin: "0 0 8px", fontFamily: "'Georgia',serif" }}>
              🔑 Authentication
            </h2>
            <p style={{ fontSize: 14, color: "#8A9BB0", lineHeight: 1.8, margin: "0 0 20px" }}>
              Every request requires an API key. Pass it as a header (recommended) or query parameter.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
              {[
                { label: "Header — Recommended", code: `x-api-key: eak_your_key`, color: "#00E5A0" },
                { label: "Query Parameter",       code: `?api_key=eak_your_key`,  color: "#00C2FF" },
              ].map((item, i) => (
                <div key={i} style={{
                  background: "#0D1117", border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 8, overflow: "hidden",
                }}>
                  <div style={{
                    padding: "8px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)",
                    fontSize: 11, color: "#8A9BB0", letterSpacing: "0.06em",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}>
                    <span>{item.label}</span>
                    <button onClick={() => copy(item.code, item.label)} style={{
                      background: "none", border: "none",
                      color: copied === item.label ? "#00E5A0" : "#8A9BB0",
                      cursor: "pointer", fontSize: 11, fontFamily: "inherit",
                    }}>
                      {copied === item.label ? "✓ Copied" : "Copy"}
                    </button>
                  </div>
                  <pre style={{ padding: "12px 16px", margin: 0, fontSize: 13, color: item.color }}>
                    {item.code}
                  </pre>
                </div>
              ))}
            </div>
            <div style={{
              background: "rgba(254,188,46,0.05)", border: "1px solid rgba(254,188,46,0.15)",
              borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "#FEBC2E",
            }}>
              ⚠️ Never expose your API key in client-side code. Use server-side routes or environment variables.
            </div>
          </section>

          {/* ── Endpoints ── */}
          {endpoints.map(ep => (
            <section key={ep.id} id={ep.id} style={{ marginBottom: 80 }}>
              {/* Header */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
                      background: `${ep.color}15`, color: ep.color,
                      border: `1px solid ${ep.color}25`,
                      padding: "3px 8px", borderRadius: 4,
                    }}>{ep.method}</span>
                    <span style={{
                      fontSize: 10, letterSpacing: "0.08em",
                      background: "rgba(255,255,255,0.04)", color: "#8A9BB0",
                      border: "1px solid rgba(255,255,255,0.08)",
                      padding: "3px 8px", borderRadius: 4,
                    }}>{ep.badge}</span>
                  </div>
                  <code style={{ fontSize: 18, color: "#E8EDF2", letterSpacing: "-0.01em" }}>{ep.path}</code>
                </div>
              </div>

              <p style={{ fontSize: 14, color: "#8A9BB0", lineHeight: 1.8, margin: "0 0 24px", maxWidth: 580 }}>
                {ep.desc}
              </p>

              {/* Parameters table */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 11, color: "#8A9BB0", letterSpacing: "0.08em", marginBottom: 10 }}>
                  PARAMETERS
                </div>
                <div style={{ border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, overflow: "hidden" }}>
                  <div style={{
                    display: "grid", gridTemplateColumns: "120px 70px 60px 1fr",
                    padding: "8px 16px", background: "#0A0F14",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    fontSize: 10, color: "#8A9BB0", letterSpacing: "0.06em",
                  }}>
                    <span>PARAMETER</span><span>TYPE</span><span>REQUIRED</span><span>DESCRIPTION</span>
                  </div>
                  {ep.params.map((p, i) => (
                    <div key={i} style={{
                      display: "grid", gridTemplateColumns: "120px 70px 60px 1fr",
                      gap: 0, padding: "12px 16px",
                      borderBottom: i < ep.params.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                      background: i % 2 === 0 ? "#0D1117" : "#0A0F14",
                      alignItems: "center",
                    }}>
                      <code style={{ fontSize: 12, color: ep.color }}>{p.name}</code>
                      <span style={{ fontSize: 11, color: "#8A9BB0" }}>{p.type}</span>
                      <span style={{
                        fontSize: 10, padding: "2px 6px", borderRadius: 3,
                        background: p.required ? "rgba(255,107,53,0.08)" : "rgba(255,255,255,0.04)",
                        color: p.required ? "#FF6B35" : "#8A9BB0",
                        border: `1px solid ${p.required ? "rgba(255,107,53,0.2)" : "rgba(255,255,255,0.08)"}`,
                        width: "fit-content",
                      }}>
                        {p.required ? "required" : "optional"}
                      </span>
                      <span style={{ fontSize: 12, color: "#8A9BB0" }}>{p.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Example URLs */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 11, color: "#8A9BB0", letterSpacing: "0.08em", marginBottom: 10 }}>
                  EXAMPLE URLS
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {ep.examples.map((ex, i) => (
                    <div key={i} style={{
                      background: "#0D1117", border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: 6, padding: "10px 14px",
                      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                    }}>
                      <div>
                        <div style={{ fontSize: 10, color: "#8A9BB0", marginBottom: 4 }}>{ex.label}</div>
                        <code style={{ fontSize: 11, color: ep.color, wordBreak: "break-all" }}>
                          {BASE_URL}{ex.url}
                        </code>
                      </div>
                      <button onClick={() => copy(`${BASE_URL}${ex.url}`, ex.label)} style={{
                        background: "none", border: "none", color: copied === ex.label ? "#00E5A0" : "#8A9BB0",
                        cursor: "pointer", fontSize: 10, fontFamily: "inherit", flexShrink: 0,
                      }}>
                        {copied === ex.label ? "✓" : "Copy"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Code examples */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 11, color: "#8A9BB0", letterSpacing: "0.08em", marginBottom: 10 }}>
                  CODE EXAMPLES
                </div>
                <CodeBlock ep={ep} />
              </div>

              {/* Response */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 11, color: "#8A9BB0", letterSpacing: "0.08em", marginBottom: 10 }}>
                  RESPONSE SCHEMA
                </div>
                <div style={{
                  background: "#0D1117", border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 8, overflow: "hidden",
                }}>
                  <div style={{
                    padding: "8px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)",
                    fontSize: 11, color: "#8A9BB0", display: "flex", justifyContent: "space-between",
                  }}>
                    <span>JSON</span>
                    <button onClick={() => copy(ep.response, ep.id + "res")} style={{
                      background: "none", border: "none",
                      color: copied === ep.id + "res" ? "#00E5A0" : "#8A9BB0",
                      cursor: "pointer", fontSize: 11, fontFamily: "inherit",
                    }}>
                      {copied === ep.id + "res" ? "✓ Copied" : "Copy"}
                    </button>
                  </div>
                  <pre style={{ padding: "16px", margin: 0, fontSize: 12, color: "#A8B8CC", overflowX: "auto", lineHeight: 1.8 }}>
                    {ep.response}
                  </pre>
                </div>
              </div>

              {/* Live Playground */}
              <div>
                <div style={{ fontSize: 11, color: "#8A9BB0", letterSpacing: "0.08em", marginBottom: 0 }}>
                  TRY IT LIVE
                </div>
                <Playground ep={ep} />
              </div>
            </section>
          ))}

          {/* ── Errors ── */}
          <section id="errors" style={{ marginBottom: 72 }}>
            <h2 style={{ fontSize: 24, fontWeight: 600, margin: "0 0 8px", fontFamily: "'Georgia',serif" }}>
              ⚠️ Error Codes
            </h2>
            <p style={{ fontSize: 14, color: "#8A9BB0", lineHeight: 1.8, margin: "0 0 20px" }}>
              All errors return JSON with an <code style={{ color: "#FF6B35" }}>error</code> field describing the issue.
            </p>
            <div style={{ border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, overflow: "hidden" }}>
              <div style={{
                display: "grid", gridTemplateColumns: "60px 140px 1fr",
                padding: "8px 16px", background: "#0A0F14",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                fontSize: 10, color: "#8A9BB0", letterSpacing: "0.06em",
              }}>
                <span>CODE</span><span>STATUS</span><span>DESCRIPTION</span>
              </div>
              {[
                { code: "400", text: "Bad Request",        desc: "Missing required parameter. Check ?from= and other required params." },
                { code: "401", text: "Unauthorized",       desc: "Missing or invalid API key. Register at api.eammu.com/login." },
                { code: "403", text: "Forbidden",          desc: "Account suspended. Contact support@eammu.com." },
                { code: "404", text: "Not Found",          desc: "Country, passport, or resource not found. Check spelling." },
                { code: "429", text: "Too Many Requests",  desc: "Rate limit reached. Upgrade plan or wait for daily reset." },
                { code: "500", text: "Internal Error",     desc: "Server error. Try again or contact support." },
              ].map((e, i) => (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "60px 140px 1fr",
                  padding: "12px 16px", alignItems: "center",
                  borderBottom: i < 5 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  background: i % 2 === 0 ? "#0D1117" : "#0A0F14",
                }}>
                  <code style={{
                    fontSize: 13, fontWeight: 700,
                    color: e.code === "400" || e.code === "404" ? "#FF6B35"
                      : e.code === "401" || e.code === "403" ? "#FF3B5C"
                      : e.code === "429" ? "#FEBC2E" : "#8A9BB0",
                  }}>{e.code}</code>
                  <span style={{ fontSize: 12, color: "#E8EDF2" }}>{e.text}</span>
                  <span style={{ fontSize: 12, color: "#8A9BB0" }}>{e.desc}</span>
                </div>
              ))}
            </div>

            {/* Error response example */}
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 11, color: "#8A9BB0", letterSpacing: "0.06em", marginBottom: 8 }}>
                ERROR RESPONSE FORMAT
              </div>
              <pre style={{
                background: "#0D1117", border: "1px solid rgba(255,107,53,0.15)",
                borderRadius: 8, padding: "14px 16px", margin: 0,
                fontSize: 12, color: "#FF6B35", lineHeight: 1.8,
              }}>
{`{
  "error": "Passport 'xyz' not found"
}`}
              </pre>
            </div>
          </section>

          {/* ── Visa Status ── */}
          <section id="visa-status" style={{ marginBottom: 72 }}>
            <h2 style={{ fontSize: 24, fontWeight: 600, margin: "0 0 8px", fontFamily: "'Georgia',serif" }}>
              📋 Visa Status Values
            </h2>
            <p style={{ fontSize: 14, color: "#8A9BB0", lineHeight: 1.8, margin: "0 0 20px" }}>
              The <code style={{ color: "#00E5A0" }}>visa_status</code> field returns one of these values:
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {visaStatuses.map((v, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 16,
                  background: "#0D1117", border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 8, padding: "12px 16px",
                }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{v.icon}</span>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 4,
                    background: `${v.color}10`, color: v.color, border: `1px solid ${v.color}25`,
                    minWidth: 140, textAlign: "center", flexShrink: 0,
                  }}>
                    {v.value}
                  </span>
                  <span style={{ fontSize: 13, color: "#8A9BB0" }}>{v.desc}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── Rate Limits ── */}
          <section id="limits" style={{ marginBottom: 72 }}>
            <h2 style={{ fontSize: 24, fontWeight: 600, margin: "0 0 8px", fontFamily: "'Georgia',serif" }}>
              📊 Rate Limits
            </h2>
            <p style={{ fontSize: 14, color: "#8A9BB0", lineHeight: 1.8, margin: "0 0 24px" }}>
              Rate limit info is returned in response headers on every request.
            </p>

            {/* Plans */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
              {[
                { name: "Free",       price: "$0",     req: "100 req/day",    color: "#8A9BB0" },
                { name: "Pro",        price: "$9/mo",  req: "10,000 req/mo",  color: "#00E5A0", hot: true },
                { name: "Enterprise", price: "Custom", req: "Unlimited",      color: "#A855F7" },
              ].map((p, i) => (
                <div key={i} style={{
                  background: p.hot ? "rgba(0,229,160,0.05)" : "#0D1117",
                  border: `1px solid ${p.hot ? "rgba(0,229,160,0.2)" : "rgba(255,255,255,0.06)"}`,
                  borderRadius: 10, padding: "20px",
                }}>
                  {p.hot && <div style={{ fontSize: 9, color: "#00E5A0", letterSpacing: "0.1em", marginBottom: 8 }}>MOST POPULAR</div>}
                  <div style={{ fontSize: 20, fontWeight: 700, color: p.color, marginBottom: 2 }}>{p.price}</div>
                  <div style={{ fontSize: 13, color: "#E8EDF2", marginBottom: 4 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: "#8A9BB0" }}>{p.req}</div>
                </div>
              ))}
            </div>

            {/* Headers */}
            <div style={{ fontSize: 11, color: "#8A9BB0", letterSpacing: "0.06em", marginBottom: 10 }}>
              RATE LIMIT HEADERS
            </div>
            <div style={{ border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, overflow: "hidden" }}>
              {[
                { header: "X-RateLimit-Remaining", desc: "Requests remaining in current period" },
                { header: "X-Plan",                desc: "Your current plan (free / pro / enterprise)" },
              ].map((h, i) => (
                <div key={i} style={{
                  display: "flex", gap: 24, padding: "12px 16px", alignItems: "center",
                  borderBottom: i === 0 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  background: i % 2 === 0 ? "#0D1117" : "#0A0F14",
                }}>
                  <code style={{ fontSize: 12, color: "#00C2FF", minWidth: 200 }}>{h.header}</code>
                  <span style={{ fontSize: 12, color: "#8A9BB0" }}>{h.desc}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 16, textAlign: "center" }}>
              <Link href="/login" style={{
                display: "inline-block", padding: "10px 24px", borderRadius: 8,
                background: "#00E5A0", color: "#080C10",
                textDecoration: "none", fontSize: 13, fontWeight: 600,
              }}>
                Upgrade Plan →
              </Link>
            </div>
          </section>

        </main>
      </div>

      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: #080C10; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
        input:focus { border-color: rgba(0,229,160,0.3) !important; }
      `}</style>
    </div>
  );
}