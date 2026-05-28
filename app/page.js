"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const endpoints = [
  { method: "GET", path: "/api/v1/passport", desc: "Visa requirements by passport", color: "#00E5A0" },
  { method: "GET", path: "/api/v1/countries", desc: "Countries with flags & codes", color: "#00C2FF" },
  { method: "GET", path: "/api/v1/embassies", desc: "Embassy locations worldwide", color: "#FF6B35" },
  { method: "GET", path: "/api/v1/airports", desc: "Airport data globally", color: "#A855F7" },
];

const stats = [
  { value: "195+", label: "Countries" },
  { value: "3.9K+", label: "Airports" },
  { value: "10K+", label: "Embassies" },
  { value: "99.9%", label: "Uptime" },
];

export default function LandingPage() {
  const [typed, setTyped] = useState("");
  const fullText = 'curl "https://api.eammu.com/api/v1/passport?from=Bangladesh&to=Japan" \\\n  -H "x-api-key: eak_your_key"';

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTyped(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 18);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080C10",
      color: "#E8EDF2",
      fontFamily: "'Courier New', monospace",
      overflow: "hidden",
    }}>

      {/* Grid background */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        backgroundImage: `linear-gradient(rgba(0,229,160,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,229,160,0.03) 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
        pointerEvents: "none",
      }} />

      {/* Glow */}
      <div style={{
        position: "fixed", top: "-200px", left: "50%", transform: "translateX(-50%)",
        width: "600px", height: "600px",
        background: "radial-gradient(circle, rgba(0,229,160,0.08) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* Nav */}
      <nav style={{
        position: "relative", zIndex: 10,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 48px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6,
            background: "linear-gradient(135deg, #00E5A0, #00C2FF)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 700, color: "#080C10",
          }}>E</div>
          <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: "0.05em" }}>
            EAMMU <span style={{ color: "#00E5A0" }}>API</span>
          </span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Link href="/docs" style={{
            padding: "8px 18px", borderRadius: 6, fontSize: 13,
            color: "#8A9BB0", textDecoration: "none",
            border: "1px solid transparent",
          }}>Docs</Link>
          <Link href="/login" style={{
            padding: "8px 18px", borderRadius: 6, fontSize: 13,
            color: "#E8EDF2", textDecoration: "none",
            border: "1px solid rgba(255,255,255,0.1)",
          }}>Login</Link>
          <Link href="/login" style={{
            padding: "8px 18px", borderRadius: 6, fontSize: 13,
            background: "#00E5A0", color: "#080C10",
            textDecoration: "none", fontWeight: 600,
          }}>Get Free Key →</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        position: "relative", zIndex: 1,
        maxWidth: 900, margin: "0 auto",
        padding: "100px 48px 60px",
        textAlign: "center",
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(0,229,160,0.08)", border: "1px solid rgba(0,229,160,0.2)",
          borderRadius: 100, padding: "6px 16px", fontSize: 12,
          color: "#00E5A0", marginBottom: 32, letterSpacing: "0.08em",
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00E5A0", display: "inline-block" }} />
          FREE TIER — 100 REQUESTS/DAY
        </div>

        <h1 style={{
          fontSize: "clamp(36px, 6vw, 72px)",
          fontWeight: 700, lineHeight: 1.1,
          letterSpacing: "-0.02em", margin: "0 0 24px",
          fontFamily: "'Georgia', serif",
        }}>
          Travel Data API<br />
          <span style={{ color: "#00E5A0" }}>for Developers</span>
        </h1>

        <p style={{
          fontSize: 18, color: "#8A9BB0", lineHeight: 1.7,
          maxWidth: 560, margin: "0 auto 48px",
        }}>
          Visa requirements, passport index, embassies & airports.
          One API. Free to start.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <Link href="/login" style={{
            padding: "14px 32px", borderRadius: 8, fontSize: 15,
            background: "#00E5A0", color: "#080C10",
            textDecoration: "none", fontWeight: 700, letterSpacing: "0.02em",
          }}>Start for Free</Link>
          <Link href="/docs" style={{
            padding: "14px 32px", borderRadius: 8, fontSize: 15,
            border: "1px solid rgba(255,255,255,0.12)",
            color: "#E8EDF2", textDecoration: "none",
          }}>View Docs</Link>
        </div>
      </section>

      {/* Terminal */}
      <section style={{ position: "relative", zIndex: 1, maxWidth: 760, margin: "0 auto 80px", padding: "0 48px" }}>
        <div style={{
          background: "#0D1117",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12, overflow: "hidden",
        }}>
          <div style={{
            padding: "12px 16px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex", gap: 6,
          }}>
            {["#FF5F57","#FEBC2E","#28C840"].map(c => (
              <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
            ))}
          </div>
          <pre style={{
            padding: "24px", margin: 0,
            fontSize: 13, lineHeight: 1.8,
            color: "#00E5A0", overflowX: "auto",
            whiteSpace: "pre-wrap",
          }}>
            <span style={{ color: "#8A9BB0" }}>$ </span>
            {typed}
            <span style={{ animation: "blink 1s infinite" }}>█</span>
          </pre>
        </div>
      </section>

      {/* Stats */}
      <section style={{
        position: "relative", zIndex: 1,
        display: "flex", justifyContent: "center", gap: 0,
        maxWidth: 700, margin: "0 auto 80px", padding: "0 48px",
      }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            flex: 1, textAlign: "center",
            padding: "28px 20px",
            borderRight: i < stats.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
          }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: "#00E5A0", fontFamily: "'Georgia',serif" }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#8A9BB0", marginTop: 4, letterSpacing: "0.06em" }}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* Endpoints */}
      <section style={{
        position: "relative", zIndex: 1,
        maxWidth: 900, margin: "0 auto 100px", padding: "0 48px",
      }}>
        <h2 style={{
          textAlign: "center", fontSize: 28, fontWeight: 600,
          marginBottom: 40, fontFamily: "'Georgia',serif",
        }}>4 Powerful Endpoints</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {endpoints.map((ep, i) => (
            <div key={i} style={{
              background: "#0D1117",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 10, padding: "20px 24px",
              transition: "border-color 0.2s",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
                  background: `${ep.color}18`, color: ep.color,
                  border: `1px solid ${ep.color}30`,
                  padding: "3px 8px", borderRadius: 4,
                }}>{ep.method}</span>
                <code style={{ fontSize: 13, color: "#E8EDF2" }}>{ep.path}</code>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: "#8A9BB0" }}>{ep.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section style={{
        position: "relative", zIndex: 1,
        maxWidth: 800, margin: "0 auto 100px", padding: "0 48px",
      }}>
        <h2 style={{
          textAlign: "center", fontSize: 28, fontWeight: 600,
          marginBottom: 40, fontFamily: "'Georgia',serif",
        }}>Simple Pricing</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          {[
            { name: "Free", price: "$0", req: "100 req/day", features: ["All endpoints", "JSON responses", "Community support"] },
            { name: "Pro", price: "$9/mo", req: "10,000 req/mo", features: ["All endpoints", "Priority support", "No rate limit headers"], hot: true },
            { name: "Enterprise", price: "Custom", req: "Unlimited", features: ["All endpoints", "SLA guarantee", "Dedicated support"] },
          ].map((plan, i) => (
            <div key={i} style={{
              background: plan.hot ? "rgba(0,229,160,0.06)" : "#0D1117",
              border: plan.hot ? "1px solid rgba(0,229,160,0.3)" : "1px solid rgba(255,255,255,0.06)",
              borderRadius: 10, padding: "24px",
            }}>
              {plan.hot && (
                <div style={{ fontSize: 10, color: "#00E5A0", letterSpacing: "0.1em", marginBottom: 12 }}>POPULAR</div>
              )}
              <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{plan.price}</div>
              <div style={{ fontSize: 13, color: "#8A9BB0", marginBottom: 4 }}>{plan.name}</div>
              <div style={{ fontSize: 12, color: "#00E5A0", marginBottom: 20 }}>{plan.req}</div>
              {plan.features.map((f, j) => (
                <div key={j} style={{ fontSize: 13, color: "#8A9BB0", marginBottom: 8, display: "flex", gap: 8 }}>
                  <span style={{ color: "#00E5A0" }}>✓</span> {f}
                </div>
              ))}
              <Link href="/login" style={{
                display: "block", textAlign: "center", marginTop: 20,
                padding: "10px", borderRadius: 6, fontSize: 13,
                background: plan.hot ? "#00E5A0" : "transparent",
                color: plan.hot ? "#080C10" : "#E8EDF2",
                border: plan.hot ? "none" : "1px solid rgba(255,255,255,0.1)",
                textDecoration: "none", fontWeight: plan.hot ? 600 : 400,
              }}>
                {plan.name === "Enterprise" ? "Contact Us" : "Get Started"}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        position: "relative", zIndex: 1,
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "32px 48px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        maxWidth: 900, margin: "0 auto",
      }}>
        <span style={{ fontSize: 13, color: "#8A9BB0" }}>
          © 2025 Eammu Holidays. All rights reserved.
        </span>
        <div style={{ display: "flex", gap: 24 }}>
          {["Docs", "Privacy", "Terms", "Contact"].map(l => (
            <Link key={l} href="#" style={{ fontSize: 13, color: "#8A9BB0", textDecoration: "none" }}>{l}</Link>
          ))}
        </div>
      </footer>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}