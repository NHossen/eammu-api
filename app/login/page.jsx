"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState("register"); // register | login
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { apiKey, error }

  async function handleSubmit() {
    if (!form.email) return;
    setLoading(true);
    setResult(null);

    try {
      if (mode === "register") {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: form.name, email: form.email }),
        });
        const data = await res.json();
        if (data.api_key) {
          setResult({ apiKey: data.api_key, plan: data.plan });
        } else {
          setResult({ error: data.error });
        }
      } else {
        // Login — get key by email (simple version)
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email }),
        });
        const data = await res.json();
        if (data.success) {
          setResult({ loginSuccess: true });
        } else {
          setResult({ error: data.error });
        }
      }
    } catch (e) {
      setResult({ error: "Network error. Try again." });
    }

    setLoading(false);
  }

  function copyKey(key) {
    navigator.clipboard.writeText(key);
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080C10",
      color: "#E8EDF2",
      fontFamily: "'Courier New', monospace",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
    }}>
      {/* Grid bg */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        backgroundImage: `linear-gradient(rgba(0,229,160,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,229,160,0.03) 1px, transparent 1px)`,
        backgroundSize: "40px 40px", pointerEvents: "none",
      }} />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 440 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: "linear-gradient(135deg, #00E5A0, #00C2FF)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, fontWeight: 700, color: "#080C10",
              }}>E</div>
              <span style={{ fontSize: 16, fontWeight: 600, color: "#E8EDF2" }}>
                EAMMU <span style={{ color: "#00E5A0" }}>API</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div style={{
          background: "#0D1117",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 14, padding: "36px",
        }}>

          {/* Show API key after register */}
          {result?.apiKey ? (
            <div>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: "rgba(0,229,160,0.1)", border: "1px solid rgba(0,229,160,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 24, marginBottom: 20,
              }}>✓</div>
              <h2 style={{ fontSize: 20, fontWeight: 600, margin: "0 0 8px", fontFamily: "'Georgia',serif" }}>
                Your API Key
              </h2>
              <p style={{ fontSize: 13, color: "#FF6B35", margin: "0 0 20px" }}>
                ⚠️ Save this now — it won't be shown again!
              </p>

              <div style={{
                background: "#080C10", border: "1px solid rgba(0,229,160,0.2)",
                borderRadius: 8, padding: "14px 16px", marginBottom: 16,
              }}>
                <code style={{ fontSize: 12, color: "#00E5A0", wordBreak: "break-all" }}>
                  {result.apiKey}
                </code>
              </div>

              <button
                onClick={() => copyKey(result.apiKey)}
                style={{
                  width: "100%", padding: "12px", borderRadius: 8,
                  background: "#00E5A0", color: "#080C10",
                  border: "none", fontSize: 14, fontWeight: 700,
                  cursor: "pointer", marginBottom: 12,
                  fontFamily: "'Courier New', monospace",
                }}
              >
                Copy API Key
              </button>

              <Link href="/dashboard" style={{
                display: "block", textAlign: "center", padding: "12px",
                borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)",
                color: "#E8EDF2", textDecoration: "none", fontSize: 14,
              }}>
                Go to Dashboard →
              </Link>

              <div style={{
                marginTop: 20, padding: 14,
                background: "rgba(0,194,255,0.05)", border: "1px solid rgba(0,194,255,0.15)",
                borderRadius: 8, fontSize: 12, color: "#8A9BB0",
              }}>
                Plan: <span style={{ color: "#00C2FF" }}>{result.plan}</span> &nbsp;·&nbsp;
                Daily limit: <span style={{ color: "#00C2FF" }}>100 requests</span>
              </div>
            </div>
          ) : result?.loginSuccess ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>📧</div>
              <h2 style={{ fontSize: 20, fontWeight: 600, margin: "0 0 12px" }}>Check Your Email</h2>
              <p style={{ fontSize: 13, color: "#8A9BB0" }}>
                We sent your API key to <strong style={{ color: "#E8EDF2" }}>{form.email}</strong>
              </p>
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div style={{
                display: "flex", background: "#080C10",
                borderRadius: 8, padding: 4, marginBottom: 28,
              }}>
                {["register", "login"].map(m => (
                  <button key={m} onClick={() => setMode(m)} style={{
                    flex: 1, padding: "9px", borderRadius: 6, border: "none",
                    background: mode === m ? "#0D1117" : "transparent",
                    color: mode === m ? "#E8EDF2" : "#8A9BB0",
                    fontSize: 13, cursor: "pointer", fontWeight: mode === m ? 500 : 400,
                    fontFamily: "'Courier New', monospace",
                    boxShadow: mode === m ? "0 1px 3px rgba(0,0,0,0.3)" : "none",
                    transition: "all 0.2s",
                    textTransform: "capitalize",
                  }}>
                    {m === "register" ? "Get Free Key" : "Login"}
                  </button>
                ))}
              </div>

              <h2 style={{
                fontSize: 22, fontWeight: 600, margin: "0 0 6px",
                fontFamily: "'Georgia',serif",
              }}>
                {mode === "register" ? "Create Account" : "Welcome Back"}
              </h2>
              <p style={{ fontSize: 13, color: "#8A9BB0", margin: "0 0 28px" }}>
                {mode === "register"
                  ? "Get your free API key instantly"
                  : "Enter your email to receive your API key"}
              </p>

              {/* Error */}
              {result?.error && (
                <div style={{
                  background: "rgba(255,107,53,0.08)", border: "1px solid rgba(255,107,53,0.2)",
                  borderRadius: 8, padding: "12px 14px", marginBottom: 20,
                  fontSize: 13, color: "#FF6B35",
                }}>
                  {result.error}
                </div>
              )}

              {/* Name field (register only) */}
              {mode === "register" && (
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, color: "#8A9BB0", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    style={{
                      width: "100%", padding: "12px 14px", borderRadius: 8,
                      background: "#080C10", border: "1px solid rgba(255,255,255,0.1)",
                      color: "#E8EDF2", fontSize: 14, outline: "none",
                      fontFamily: "'Courier New', monospace",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              )}

              {/* Email */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 12, color: "#8A9BB0", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  style={{
                    width: "100%", padding: "12px 14px", borderRadius: 8,
                    background: "#080C10", border: "1px solid rgba(255,255,255,0.1)",
                    color: "#E8EDF2", fontSize: 14, outline: "none",
                    fontFamily: "'Courier New', monospace",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  width: "100%", padding: "13px", borderRadius: 8,
                  background: loading ? "rgba(0,229,160,0.4)" : "#00E5A0",
                  color: "#080C10", border: "none", fontSize: 14,
                  fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: "'Courier New', monospace", letterSpacing: "0.04em",
                }}
              >
                {loading ? "Processing..." : mode === "register" ? "Get My API Key →" : "Send Key to Email →"}
              </button>

              <p style={{ textAlign: "center", fontSize: 12, color: "#8A9BB0", marginTop: 20, marginBottom: 0 }}>
                {mode === "register"
                  ? "Already have a key? "
                  : "Don't have a key? "}
                <button
                  onClick={() => { setMode(mode === "register" ? "login" : "register"); setResult(null); }}
                  style={{ background: "none", border: "none", color: "#00E5A0", cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}
                >
                  {mode === "register" ? "Login" : "Register free"}
                </button>
              </p>
            </>
          )}
        </div>

        <p style={{ textAlign: "center", fontSize: 12, color: "#8A9BB0", marginTop: 24 }}>
          By registering you agree to our{" "}
          <Link href="#" style={{ color: "#00E5A0", textDecoration: "none" }}>Terms of Service</Link>
        </p>
      </div>

      <style>{`* { box-sizing: border-box; } input:focus { border-color: rgba(0,229,160,0.4) !important; }`}</style>
    </div>
  );
}