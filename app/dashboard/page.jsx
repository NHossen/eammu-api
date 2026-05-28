"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [apiKey, setApiKey] = useState("");
  const [inputKey, setInputKey] = useState("");
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("eammu_api_key");
    if (saved) { setApiKey(saved); fetchUsage(saved); }
  }, []);

  async function fetchUsage(key) {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/usage", {
        headers: { "x-api-key": key },
      });
      const data = await res.json();
      if (data.plan) {
        setUsage(data);
        setApiKey(key);
        localStorage.setItem("eammu_api_key", key);
      } else {
        setError(data.error || "Invalid key");
      }
    } catch {
      setError("Network error");
    }
    setLoading(false);
  }

  const usedPct = usage ? Math.min((usage.used / usage.limit) * 100, 100) : 0;

  return (
    <div style={{
      minHeight: "100vh", background: "#080C10",
      color: "#E8EDF2", fontFamily: "'Courier New', monospace",
    }}>
      {/* Grid bg */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        backgroundImage: `linear-gradient(rgba(0,229,160,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,229,160,0.03) 1px, transparent 1px)`,
        backgroundSize: "40px 40px", pointerEvents: "none",
      }} />

      {/* Nav */}
      <nav style={{
        position: "relative", zIndex: 10,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 48px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6,
            background: "linear-gradient(135deg, #00E5A0, #00C2FF)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 700, color: "#080C10",
          }}>E</div>
          <span style={{ fontSize: 15, fontWeight: 600, color: "#E8EDF2" }}>
            EAMMU <span style={{ color: "#00E5A0" }}>API</span>
          </span>
        </Link>
        <div style={{ display: "flex", gap: 8 }}>
          <Link href="/docs" style={{ padding: "8px 18px", borderRadius: 6, fontSize: 13, color: "#8A9BB0", textDecoration: "none" }}>Docs</Link>
          {usage && (
            <button onClick={() => { localStorage.removeItem("eammu_api_key"); setUsage(null); setApiKey(""); }}
              style={{ padding: "8px 18px", borderRadius: 6, fontSize: 13, background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#8A9BB0", cursor: "pointer", fontFamily: "inherit" }}>
              Logout
            </button>
          )}
        </div>
      </nav>

      <main style={{ position: "relative", zIndex: 1, maxWidth: 860, margin: "0 auto", padding: "48px 48px" }}>

        {/* No key yet */}
        {!usage && (
          <div style={{
            background: "#0D1117", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 14, padding: "40px", maxWidth: 440, margin: "60px auto",
            textAlign: "center",
          }}>
            <h2 style={{ fontSize: 22, fontWeight: 600, margin: "0 0 8px", fontFamily: "'Georgia',serif" }}>
              Enter Your API Key
            </h2>
            <p style={{ fontSize: 13, color: "#8A9BB0", margin: "0 0 24px" }}>
              Paste your key to view usage & stats
            </p>
            {error && (
              <div style={{ background: "rgba(255,107,53,0.08)", border: "1px solid rgba(255,107,53,0.2)", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#FF6B35" }}>
                {error}
              </div>
            )}
            <input
              type="text"
              placeholder="eak_xxxxxxxxxxxxxxxx"
              value={inputKey}
              onChange={e => setInputKey(e.target.value)}
              onKeyDown={e => e.key === "Enter" && fetchUsage(inputKey.trim())}
              style={{
                width: "100%", padding: "12px 14px", borderRadius: 8,
                background: "#080C10", border: "1px solid rgba(255,255,255,0.1)",
                color: "#E8EDF2", fontSize: 13, outline: "none",
                fontFamily: "'Courier New', monospace", marginBottom: 12,
                boxSizing: "border-box",
              }}
            />
            <button
              onClick={() => fetchUsage(inputKey.trim())}
              disabled={loading}
              style={{
                width: "100%", padding: "12px", borderRadius: 8,
                background: "#00E5A0", color: "#080C10", border: "none",
                fontSize: 14, fontWeight: 700, cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {loading ? "Loading..." : "View Dashboard →"}
            </button>
            <p style={{ marginTop: 16, fontSize: 12, color: "#8A9BB0" }}>
              No key?{" "}
              <Link href="/login" style={{ color: "#00E5A0", textDecoration: "none" }}>Register free →</Link>
            </p>
          </div>
        )}

        {/* Dashboard */}
        {usage && (
          <>
            <div style={{ marginBottom: 36 }}>
              <h1 style={{ fontSize: 26, fontWeight: 600, margin: "0 0 4px", fontFamily: "'Georgia',serif" }}>
                Dashboard
              </h1>
              <p style={{ fontSize: 13, color: "#8A9BB0", margin: 0 }}>
                Welcome back, <span style={{ color: "#E8EDF2" }}>{usage.name}</span>
              </p>
            </div>

            {/* Stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 14, marginBottom: 24 }}>
              {[
                { label: "Plan", value: usage.plan.toUpperCase(), color: "#00E5A0" },
                { label: "Used Today", value: usage.used, color: "#E8EDF2" },
                { label: "Remaining", value: usage.remaining, color: usage.remaining < 20 ? "#FF6B35" : "#00C2FF" },
                { label: "Daily Limit", value: usage.limit, color: "#E8EDF2" },
              ].map((s, i) => (
                <div key={i} style={{
                  background: "#0D1117", border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 10, padding: "20px",
                }}>
                  <div style={{ fontSize: 11, color: "#8A9BB0", letterSpacing: "0.06em", marginBottom: 8 }}>{s.label}</div>
                  <div style={{ fontSize: 26, fontWeight: 700, color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Usage bar */}
            <div style={{
              background: "#0D1117", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 10, padding: "24px", marginBottom: 24,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>Daily Usage</span>
                <span style={{ fontSize: 13, color: "#8A9BB0" }}>{usage.used} / {usage.limit}</span>
              </div>
              <div style={{ height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 4,
                  width: `${usedPct}%`,
                  background: usedPct > 80 ? "#FF6B35" : "linear-gradient(90deg, #00E5A0, #00C2FF)",
                  transition: "width 0.5s ease",
                }} />
              </div>
              {usedPct > 80 && (
                <p style={{ fontSize: 12, color: "#FF6B35", marginTop: 10, marginBottom: 0 }}>
                  ⚠️ Running low —{" "}
                  <Link href="/login" style={{ color: "#FF6B35" }}>upgrade to Pro</Link>
                </p>
              )}
            </div>

            {/* API Key display */}
            <div style={{
              background: "#0D1117", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 10, padding: "24px", marginBottom: 24,
            }}>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12 }}>Your API Key</div>
              <div style={{
                background: "#080C10", border: "1px solid rgba(0,229,160,0.15)",
                borderRadius: 8, padding: "12px 16px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <code style={{ fontSize: 12, color: "#00E5A0" }}>{usage.key_masked}</code>
                <span style={{ fontSize: 11, color: "#8A9BB0" }}>masked for security</span>
              </div>
            </div>

            {/* Quick test */}
            <div style={{
              background: "#0D1117", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 10, padding: "24px",
            }}>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 16 }}>Quick Test</div>
              <pre style={{
                background: "#080C10", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 8, padding: "16px", fontSize: 12, color: "#00E5A0",
                overflowX: "auto", margin: 0, lineHeight: 1.8,
              }}>
{`curl "https://api.eammu.com/api/v1/passport?from=Bangladesh&to=Japan" \\
  -H "x-api-key: ${usage.key_masked}"`}
              </pre>
              <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
                <Link href="/docs" style={{
                  padding: "9px 20px", borderRadius: 6, fontSize: 13,
                  background: "#00E5A0", color: "#080C10", textDecoration: "none", fontWeight: 600,
                }}>View Full Docs</Link>
                <Link href="/" style={{
                  padding: "9px 20px", borderRadius: 6, fontSize: 13,
                  border: "1px solid rgba(255,255,255,0.1)", color: "#E8EDF2", textDecoration: "none",
                }}>← Home</Link>
              </div>
            </div>
          </>
        )}
      </main>
      <style>{`* { box-sizing: border-box; } input:focus { border-color: rgba(0,229,160,0.4) !important; }`}</style>
    </div>
  );
}