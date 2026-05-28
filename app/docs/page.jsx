"use client";
import { useState } from "react";
import Link from "next/link";

const endpoints = [
  {
    id: "passport",
    method: "GET",
    path: "/api/v1/passport",
    color: "#00E5A0",
    desc: "Get visa requirements for a passport holder traveling to any country.",
    params: [
      { name: "from", required: true, desc: "Passport country name. Example: Bangladesh" },
      { name: "to", required: false, desc: "Destination country. If omitted, returns all destinations." },
      { name: "api_key", required: true, desc: "Your API key (or use x-api-key header)" },
    ],
    example: `curl "https://api.eammu.com/api/v1/passport?from=Bangladesh&to=Japan" \\
  -H "x-api-key: eak_your_key"`,
    response: `{
  "from": {
    "name": "Bangladesh",
    "flag": "https://twemoji.../1f1e7-1f1e9.svg",
    "code": "bd"
  },
  "to": {
    "name": "Japan",
    "flag": "https://twemoji.../1f1ef-1f1f5.svg",
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
    desc: "Get country list with flags and ISO codes.",
    params: [
      { name: "name", required: false, desc: "Filter by country name (partial match)" },
      { name: "code", required: false, desc: "Filter by ISO 2-letter code. Example: bd" },
      { name: "api_key", required: true, desc: "Your API key" },
    ],
    example: `curl "https://api.eammu.com/api/v1/countries?name=Bangladesh" \\
  -H "x-api-key: eak_your_key"`,
    response: `{
  "total": 1,
  "countries": [
    {
      "country": "Bangladesh",
      "flag": "https://twemoji.../1f1e7-1f1e9.svg",
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
    desc: "Find embassy and consulate locations worldwide.",
    params: [
      { name: "operator", required: false, desc: "Embassy's home country. Example: Bangladesh" },
      { name: "country", required: false, desc: "Country where embassy is located" },
      { name: "city", required: false, desc: "City filter" },
      { name: "api_key", required: true, desc: "Your API key" },
    ],
    example: `curl "https://api.eammu.com/api/v1/embassies?operator=Bangladesh&country=Japan" \\
  -H "x-api-key: eak_your_key"`,
    response: `{
  "total": 1,
  "embassies": [
    {
      "operator": "Bangladesh",
      "country": "Japan",
      "city": "Tokyo",
      "type": "embassy",
      "website": "https://...",
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
    desc: "Search airport data including IATA codes, coordinates, and routes.",
    params: [
      { name: "country", required: false, desc: "Filter by country name" },
      { name: "city", required: false, desc: "Filter by city" },
      { name: "code", required: false, desc: "IATA airport code. Example: DAC" },
      { name: "api_key", required: true, desc: "Your API key" },
    ],
    example: `curl "https://api.eammu.com/api/v1/airports?code=DAC" \\
  -H "x-api-key: eak_your_key"`,
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
      "direct_flights": "37"
    }
  ]
}`,
  },
];

const visaStatuses = [
  { value: "visa required", color: "#FF6B35", desc: "Must apply for visa in advance" },
  { value: "e-visa", color: "#00C2FF", desc: "Apply online before travel" },
  { value: "visa on arrival", color: "#00E5A0", desc: "Get visa at the border" },
  { value: "eta", color: "#A855F7", desc: "Electronic travel authorization required" },
  { value: "no admission", color: "#FF3B5C", desc: "Entry not permitted" },
  { value: "number (e.g. 90)", color: "#FEBC2E", desc: "Visa-free days allowed" },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("intro");
  const [copied, setCopied] = useState("");

  function copy(text, id) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(""), 2000);
  }

  const navItems = [
    { id: "intro", label: "Introduction" },
    { id: "auth", label: "Authentication" },
    { id: "passport", label: "Passport API" },
    { id: "countries", label: "Countries API" },
    { id: "embassies", label: "Embassies API" },
    { id: "airports", label: "Airports API" },
    { id: "errors", label: "Error Codes" },
    { id: "visa-status", label: "Visa Status Values" },
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
        padding: "18px 48px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(8,12,16,0.95)", backdropFilter: "blur(10px)",
      }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 26, height: 26, borderRadius: 6,
            background: "linear-gradient(135deg, #00E5A0, #00C2FF)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 700, color: "#080C10",
          }}>E</div>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#E8EDF2" }}>
            EAMMU <span style={{ color: "#00E5A0" }}>API</span>
            <span style={{ color: "#8A9BB0", fontWeight: 400 }}> / docs</span>
          </span>
        </Link>
        <Link href="/login" style={{
          padding: "7px 16px", borderRadius: 6, fontSize: 12,
          background: "#00E5A0", color: "#080C10", textDecoration: "none", fontWeight: 600,
        }}>Get API Key →</Link>
      </nav>

      <div style={{ display: "flex", flex: 1, maxWidth: 1100, margin: "0 auto", width: "100%", padding: "0 24px" }}>

        {/* Sidebar */}
        <aside style={{
          width: 200, flexShrink: 0, padding: "32px 0 32px",
          position: "sticky", top: 61, height: "calc(100vh - 61px)",
          overflowY: "auto",
        }}>
          <div style={{ fontSize: 10, color: "#8A9BB0", letterSpacing: "0.1em", marginBottom: 12 }}>REFERENCE</div>
          {navItems.map(item => (
            <button key={item.id} onClick={() => {
              setActiveSection(item.id);
              document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
            }} style={{
              display: "block", width: "100%", textAlign: "left",
              padding: "7px 12px", borderRadius: 6, marginBottom: 2,
              background: activeSection === item.id ? "rgba(0,229,160,0.08)" : "transparent",
              color: activeSection === item.id ? "#00E5A0" : "#8A9BB0",
              border: "none", cursor: "pointer", fontSize: 13,
              fontFamily: "inherit",
              borderLeft: activeSection === item.id ? "2px solid #00E5A0" : "2px solid transparent",
            }}>
              {item.label}
            </button>
          ))}
        </aside>

        {/* Content */}
        <main style={{ flex: 1, padding: "32px 0 80px 48px", maxWidth: 800 }}>

          {/* Intro */}
          <section id="intro" style={{ marginBottom: 64 }}>
            <h1 style={{ fontSize: 32, fontWeight: 700, margin: "0 0 16px", fontFamily: "'Georgia',serif" }}>
              Eammu API Documentation
            </h1>
            <p style={{ fontSize: 15, color: "#8A9BB0", lineHeight: 1.8, margin: "0 0 24px" }}>
              The Eammu Travel API provides real-time access to visa requirements, country data,
              embassy locations, and airport information. Built for travel apps, visa consultancies,
              and developers worldwide.
            </p>
            <div style={{
              background: "#0D1117", border: "1px solid rgba(0,229,160,0.15)",
              borderRadius: 10, padding: "20px 24px",
            }}>
              <div style={{ fontSize: 12, color: "#8A9BB0", marginBottom: 8 }}>BASE URL</div>
              <code style={{ fontSize: 14, color: "#00E5A0" }}>https://api.eammu.com</code>
            </div>
          </section>

          {/* Auth */}
          <section id="auth" style={{ marginBottom: 64 }}>
            <h2 style={{ fontSize: 22, fontWeight: 600, margin: "0 0 16px", fontFamily: "'Georgia',serif" }}>
              Authentication
            </h2>
            <p style={{ fontSize: 14, color: "#8A9BB0", lineHeight: 1.8, margin: "0 0 20px" }}>
              All API requests require an API key. Pass it as a header or query parameter.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Header (Recommended)", code: `-H "x-api-key: eak_your_key"` },
                { label: "Query Parameter", code: `?api_key=eak_your_key` },
              ].map((item, i) => (
                <div key={i} style={{
                  background: "#0D1117", border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 8, overflow: "hidden",
                }}>
                  <div style={{
                    padding: "8px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)",
                    fontSize: 11, color: "#8A9BB0", letterSpacing: "0.06em",
                    display: "flex", justifyContent: "space-between",
                  }}>
                    <span>{item.label}</span>
                    <button onClick={() => copy(item.code, item.label)} style={{
                      background: "none", border: "none", color: copied === item.label ? "#00E5A0" : "#8A9BB0",
                      cursor: "pointer", fontSize: 11, fontFamily: "inherit",
                    }}>
                      {copied === item.label ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <pre style={{ padding: "14px 16px", margin: 0, fontSize: 13, color: "#00E5A0" }}>
                    {item.code}
                  </pre>
                </div>
              ))}
            </div>
          </section>

          {/* Endpoints */}
          {endpoints.map(ep => (
            <section key={ep.id} id={ep.id} style={{ marginBottom: 64 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <span style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
                  background: `${ep.color}18`, color: ep.color,
                  border: `1px solid ${ep.color}30`,
                  padding: "4px 10px", borderRadius: 4,
                }}>{ep.method}</span>
                <code style={{ fontSize: 16, color: "#E8EDF2" }}>{ep.path}</code>
              </div>
              <p style={{ fontSize: 14, color: "#8A9BB0", lineHeight: 1.8, margin: "0 0 24px" }}>
                {ep.desc}
              </p>

              {/* Params */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 12, color: "#8A9BB0", letterSpacing: "0.06em", marginBottom: 10 }}>PARAMETERS</div>
                <div style={{ border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, overflow: "hidden" }}>
                  {ep.params.map((p, i) => (
                    <div key={i} style={{
                      display: "flex", gap: 16, padding: "12px 16px",
                      borderBottom: i < ep.params.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                      background: i % 2 === 0 ? "#0D1117" : "#0A0F14",
                    }}>
                      <code style={{ fontSize: 12, color: ep.color, minWidth: 80 }}>{p.name}</code>
                      <span style={{
                        fontSize: 10, color: p.required ? "#FF6B35" : "#8A9BB0",
                        border: `1px solid ${p.required ? "rgba(255,107,53,0.3)" : "rgba(255,255,255,0.1)"}`,
                        borderRadius: 3, padding: "2px 6px", height: "fit-content",
                        alignSelf: "flex-start", minWidth: 60, textAlign: "center",
                      }}>
                        {p.required ? "required" : "optional"}
                      </span>
                      <span style={{ fontSize: 13, color: "#8A9BB0" }}>{p.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Example */}
              <div style={{ marginBottom: 16 }}>
                <div style={{
                  background: "#0D1117", border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 8, overflow: "hidden",
                }}>
                  <div style={{
                    padding: "8px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)",
                    fontSize: 11, color: "#8A9BB0", letterSpacing: "0.06em",
                    display: "flex", justifyContent: "space-between",
                  }}>
                    <span>REQUEST</span>
                    <button onClick={() => copy(ep.example, ep.id + "req")} style={{
                      background: "none", border: "none", color: copied === ep.id + "req" ? "#00E5A0" : "#8A9BB0",
                      cursor: "pointer", fontSize: 11, fontFamily: "inherit",
                    }}>
                      {copied === ep.id + "req" ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <pre style={{ padding: "16px", margin: 0, fontSize: 12, color: "#00E5A0", overflowX: "auto", lineHeight: 1.8 }}>
                    {ep.example}
                  </pre>
                </div>
              </div>

              {/* Response */}
              <div style={{
                background: "#0D1117", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 8, overflow: "hidden",
              }}>
                <div style={{
                  padding: "8px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)",
                  fontSize: 11, color: "#8A9BB0", letterSpacing: "0.06em",
                }}>
                  RESPONSE
                </div>
                <pre style={{ padding: "16px", margin: 0, fontSize: 12, color: "#A8B8CC", overflowX: "auto", lineHeight: 1.8 }}>
                  {ep.response}
                </pre>
              </div>
            </section>
          ))}

          {/* Errors */}
          <section id="errors" style={{ marginBottom: 64 }}>
            <h2 style={{ fontSize: 22, fontWeight: 600, margin: "0 0 20px", fontFamily: "'Georgia',serif" }}>
              Error Codes
            </h2>
            <div style={{ border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, overflow: "hidden" }}>
              {[
                { code: "400", text: "Bad Request", desc: "Missing required parameter (e.g. ?from=)" },
                { code: "401", text: "Unauthorized", desc: "Missing or invalid API key" },
                { code: "403", text: "Forbidden", desc: "Account suspended" },
                { code: "404", text: "Not Found", desc: "Country or resource not found" },
                { code: "429", text: "Too Many Requests", desc: "Daily or monthly limit reached" },
                { code: "500", text: "Server Error", desc: "Internal error — contact support" },
              ].map((e, i) => (
                <div key={i} style={{
                  display: "flex", gap: 20, padding: "12px 16px",
                  borderBottom: i < 5 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  background: i % 2 === 0 ? "#0D1117" : "#0A0F14",
                }}>
                  <code style={{ fontSize: 13, color: e.code.startsWith("2") ? "#00E5A0" : e.code.startsWith("4") ? "#FF6B35" : "#FF3B5C", minWidth: 40 }}>
                    {e.code}
                  </code>
                  <span style={{ fontSize: 13, color: "#E8EDF2", minWidth: 140 }}>{e.text}</span>
                  <span style={{ fontSize: 13, color: "#8A9BB0" }}>{e.desc}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Visa status values */}
          <section id="visa-status" style={{ marginBottom: 64 }}>
            <h2 style={{ fontSize: 22, fontWeight: 600, margin: "0 0 20px", fontFamily: "'Georgia',serif" }}>
              Visa Status Values
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {visaStatuses.map((v, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 16,
                  background: "#0D1117", border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 8, padding: "12px 16px",
                }}>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 4,
                    background: `${v.color}15`, color: v.color, border: `1px solid ${v.color}30`,
                    minWidth: 130, textAlign: "center",
                  }}>
                    {v.value}
                  </span>
                  <span style={{ fontSize: 13, color: "#8A9BB0" }}>{v.desc}</span>
                </div>
              ))}
            </div>
          </section>

        </main>
      </div>
      <style>{`* { box-sizing: border-box; } ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #080C10; } ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }`}</style>
    </div>
  );
}