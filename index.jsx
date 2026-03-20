import { useState, useEffect, useRef, useCallback } from "react";

// ─── PALETTE ────────────────────────────────────────────────────────────────
const C = {
  ivory: "#F8FAFC",
  silver: "#E2E8F0",
  slate: "#0F172A",
  teal: "#14B8A6",
  indigo: "#6366F1",
  coral: "#F97316",
  red: "#EF4444",
  slateLight: "#1E293B",
  silverDark: "#CBD5E1",
};

// ─── INLINE STYLES ──────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ivory: #F8FAFC;
    --silver: #E2E8F0;
    --slate: #0F172A;
    --teal: #14B8A6;
    --indigo: #6366F1;
    --coral: #F97316;
    --red: #EF4444;
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--ivory);
    color: var(--slate);
    overflow-x: hidden;
  }

  .serif { font-family: 'DM Serif Display', serif; }

  /* Hero animation */
  @keyframes dropFall {
    0% { transform: translateY(-20px) scale(0.8); opacity: 0; }
    60% { transform: translateY(4px) scale(1.05); opacity: 1; }
    100% { transform: translateY(0) scale(1); opacity: 1; }
  }
  @keyframes ripple {
    0% { transform: scale(0.8); opacity: 0.8; }
    100% { transform: scale(2.5); opacity: 0; }
  }
  @keyframes pulse-dot {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.4); opacity: 0.6; }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-16px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes flowDot {
    0% { left: -8px; opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { left: calc(100% + 8px); opacity: 0; }
  }
  @keyframes spinSlow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes beatHeart {
    0%, 100% { transform: scale(1); }
    15% { transform: scale(1.15); }
    30% { transform: scale(1); }
    45% { transform: scale(1.08); }
    60% { transform: scale(1); }
  }
  @keyframes waveFlow {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes blinkCursor {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
  @keyframes gaugeFill {
    from { stroke-dashoffset: 283; }
  }
  @keyframes particleFloat {
    0% { transform: translateY(0px) translateX(0px); opacity: 0.6; }
    33% { transform: translateY(-12px) translateX(6px); opacity: 1; }
    66% { transform: translateY(-6px) translateX(-4px); opacity: 0.8; }
    100% { transform: translateY(0px) translateX(0px); opacity: 0.6; }
  }

  .drop-anim { animation: dropFall 0.8s cubic-bezier(.34,1.56,.64,1) forwards; }
  .fade-up { animation: fadeUp 0.7s ease forwards; }
  .slide-in { animation: slideIn 0.5s ease forwards; }

  .swipe-container { overflow-x: auto; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
  .swipe-container::-webkit-scrollbar { display: none; }
  .swipe-card { scroll-snap-align: start; flex-shrink: 0; }

  .nav-dot { transition: all 0.3s ease; }
  .nav-dot.active { background: var(--teal); transform: scale(1.3); }

  .slider-track { appearance: none; -webkit-appearance: none; width: 100%; height: 6px; border-radius: 9999px; outline: none; cursor: pointer; }
  .slider-track::-webkit-slider-thumb { appearance: none; width: 20px; height: 20px; border-radius: 50%; background: var(--teal); cursor: pointer; box-shadow: 0 2px 8px rgba(20,184,166,0.4); transition: transform 0.2s; }
  .slider-track::-webkit-slider-thumb:hover { transform: scale(1.2); }

  .gauge-circle { transition: stroke-dashoffset 1s cubic-bezier(.4,0,.2,1); }

  .card-hover { transition: transform 0.3s ease, box-shadow 0.3s ease; }
  .card-hover:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(15,23,42,0.1); }

  .btn-primary {
    background: linear-gradient(135deg, var(--teal), var(--indigo));
    color: white;
    border: none;
    padding: 14px 32px;
    border-radius: 100px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.3s ease;
    letter-spacing: 0.01em;
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(20,184,166,0.35); }
  .btn-primary:active { transform: translateY(0); }

  .choice-btn {
    border: 1.5px solid var(--silver);
    background: white;
    padding: 12px 20px;
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.25s ease;
    color: var(--slate);
  }
  .choice-btn:hover { border-color: var(--teal); color: var(--teal); }
  .choice-btn.selected { border-color: var(--teal); background: rgba(20,184,166,0.08); color: var(--teal); font-weight: 600; }

  .section-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--teal);
  }

  .tag {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 100px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.04em;
  }

  .particle {
    position: absolute;
    border-radius: 50%;
    animation: particleFloat ease-in-out infinite;
  }
`;

// ─── SECTION WRAPPER ─────────────────────────────────────────────────────────
function Section({ id, children, bg = "var(--ivory)", className = "" }) {
  return (
    <section id={id} style={{ background: bg, padding: "80px 0" }} className={className}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 20px" }}>
        {children}
      </div>
    </section>
  );
}

// ─── 1. HERO ─────────────────────────────────────────────────────────────────
function Hero() {
  const [dropped, setDropped] = useState(false);
  const [signalOn, setSignalOn] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setDropped(true), 400);
    const t2 = setTimeout(() => setSignalOn(true), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <section style={{
      minHeight: "100vh",
      background: `linear-gradient(160deg, ${C.slate} 0%, #1a2744 60%, #0f2030 100%)`,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "60px 20px", position: "relative", overflow: "hidden", textAlign: "center"
    }}>
      {/* Background particles */}
      {[...Array(8)].map((_, i) => (
        <div key={i} className="particle" style={{
          width: 4 + (i % 3) * 3, height: 4 + (i % 3) * 3,
          background: i % 2 === 0 ? `${C.teal}40` : `${C.indigo}40`,
          top: `${10 + i * 11}%`, left: `${5 + i * 12}%`,
          animationDuration: `${3 + i * 0.7}s`,
          animationDelay: `${i * 0.4}s`
        }} />
      ))}

      {/* Sweat drop + signal animation */}
      <div style={{ position: "relative", width: 160, height: 160, marginBottom: 40 }}>
        {/* Outer ring */}
        {signalOn && (
          <>
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              width: 100, height: 100, borderRadius: "50%",
              border: `2px solid ${C.teal}`,
              transform: "translate(-50%,-50%)",
              animation: "ripple 2s ease-out infinite"
            }} />
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              width: 100, height: 100, borderRadius: "50%",
              border: `2px solid ${C.teal}`,
              transform: "translate(-50%,-50%)",
              animation: "ripple 2s ease-out 0.6s infinite"
            }} />
          </>
        )}

        {/* Central drop */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: 64, height: 64,
          background: signalOn
            ? `linear-gradient(135deg, ${C.teal}, ${C.indigo})`
            : `linear-gradient(135deg, #60b8ff, #a0d8ff)`,
          borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
          display: "flex", alignItems: "center", justifyContent: "center",
          opacity: dropped ? 1 : 0,
          transition: "all 1s cubic-bezier(.34,1.56,.64,1)",
          boxShadow: signalOn ? `0 0 30px ${C.teal}60` : `0 0 20px rgba(96,184,255,0.4)`
        }}>
          {/* Lactate molecule dot */}
          <div style={{
            width: 10, height: 10, borderRadius: "50%", background: "white",
            animation: signalOn ? "pulse-dot 1.5s ease-in-out infinite" : "none"
          }} />
        </div>

        {/* Signal waves */}
        {signalOn && [30, 50, 70].map((size, i) => (
          <div key={i} style={{
            position: "absolute", top: "50%", left: "50%",
            width: size, height: size, borderRadius: "50%",
            border: `1px solid ${C.teal}30`,
            transform: "translate(-50%,-50%)",
          }} />
        ))}
      </div>

      <div style={{ animation: "fadeUp 0.8s 0.6s both" }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: C.teal, marginBottom: 16 }}>
          Sweat-Based Lactate Biosensing
        </p>
        <h1 className="serif" style={{ fontSize: "clamp(28px,7vw,52px)", color: "white", lineHeight: 1.15, marginBottom: 20, maxWidth: 560 }}>
          Understanding Your Metabolism,<br />
          <em style={{ color: C.teal }}>One Drop of Sweat</em> Away
        </h1>
        <p style={{ color: "#94A3B8", fontSize: 16, lineHeight: 1.7, maxWidth: 480, margin: "0 auto 36px" }}>
          A non-invasive approach to early detection of cardiometabolic disorders through real-time sweat lactate monitoring.
        </p>
        <button className="btn-primary" onClick={() => document.getElementById("what-is")?.scrollIntoView({ behavior: "smooth" })}>
          Explore the Science →
        </button>
      </div>

      {/* Scroll indicator */}
      <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", opacity: 0.4 }}>
        <div style={{ width: 1, height: 40, background: C.teal, margin: "0 auto 6px", animation: "pulse-dot 2s infinite" }} />
        <p style={{ fontSize: 10, color: "white", letterSpacing: "0.1em" }}>SCROLL</p>
      </div>
    </section>
  );
}

// ─── 2. WHAT IS CMD ──────────────────────────────────────────────────────────
const CMD_CARDS = [
  {
    icon: "♥",
    title: "Heart Disease",
    color: C.red,
    desc: "Conditions affecting the heart's structure and function — including coronary artery disease, heart failure, and arrhythmias. Globally responsible for over 17 million deaths per year.",
    stat: "#1 cause of death worldwide"
  },
  {
    icon: "⬡",
    title: "Type 2 Diabetes",
    color: C.coral,
    desc: "A chronic metabolic condition where cells become resistant to insulin, causing elevated blood glucose. Affects 537 million adults worldwide and rising rapidly.",
    stat: "537M affected globally"
  },
  {
    icon: "⚖",
    title: "Metabolic Syndrome",
    color: C.indigo,
    desc: "A cluster of conditions — abdominal obesity, high blood pressure, high blood sugar, and abnormal lipid levels — that occur together, increasing your risk of heart disease and stroke.",
    stat: "1 in 3 adults in some regions"
  }
];

function WhatIs() {
  const [active, setActive] = useState(0);
  const ref = useRef(null);

  const handleScroll = useCallback(() => {
    if (!ref.current) return;
    const idx = Math.round(ref.current.scrollLeft / (ref.current.offsetWidth - 40));
    setActive(Math.min(idx, CMD_CARDS.length - 1));
  }, []);

  return (
    <Section id="what-is" bg={C.ivory}>
      <p className="section-label" style={{ marginBottom: 12 }}>01 — Cardiometabolic Disorders</p>
      <h2 className="serif" style={{ fontSize: "clamp(24px,5vw,38px)", lineHeight: 1.2, marginBottom: 8 }}>
        When the body's balance breaks
      </h2>
      <p style={{ color: "#64748B", fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
        Cardiometabolic disorders are interconnected conditions that disrupt the heart, blood vessels, and metabolic system — often developing silently for years.
      </p>

      <div ref={ref} className="swipe-container" style={{ display: "flex", gap: 16, paddingBottom: 8 }} onScroll={handleScroll}>
        {CMD_CARDS.map((card, i) => (
          <div key={i} className="swipe-card card-hover" style={{
            width: "calc(100vw - 56px)", maxWidth: 480,
            background: "white", borderRadius: 20, padding: "28px 24px",
            border: `1px solid ${C.silver}`, flex: "none"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: `${card.color}15`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, color: card.color
              }}>{card.icon}</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: card.color, letterSpacing: "0.06em", marginBottom: 2 }}>
                  {["CARDIOVASCULAR", "METABOLIC", "SYNDROME"][i]}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 600 }}>{card.title}</h3>
              </div>
            </div>
            <p style={{ color: "#475569", fontSize: 14, lineHeight: 1.75, marginBottom: 16 }}>{card.desc}</p>
            <div style={{
              background: `${card.color}10`, borderRadius: 10, padding: "8px 14px",
              display: "inline-block"
            }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: card.color }}>{card.stat}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 16 }}>
        {CMD_CARDS.map((_, i) => (
          <div key={i} className={`nav-dot ${active === i ? "active" : ""}`} style={{
            width: 7, height: 7, borderRadius: "50%",
            background: active === i ? C.teal : C.silver, cursor: "pointer"
          }} onClick={() => {
            ref.current?.scrollTo({ left: i * (ref.current.offsetWidth - 40), behavior: "smooth" });
            setActive(i);
          }} />
        ))}
      </div>
    </Section>
  );
}

// ─── 3. WHAT GOES WRONG ──────────────────────────────────────────────────────
function WhatGoesWrong() {
  const [sugar, setSugar] = useState(50);
  const [activity, setActivity] = useState(50);
  const [oxygen, setOxygen] = useState(50);

  const riskScore = Math.round((sugar * 0.4) + ((100 - activity) * 0.35) + ((100 - oxygen) * 0.25));
  const riskColor = riskScore < 35 ? C.teal : riskScore < 60 ? C.coral : C.red;
  const riskLabel = riskScore < 35 ? "Low Risk" : riskScore < 60 ? "Moderate Risk" : "High Risk";

  const sliders = [
    { label: "Blood Sugar", val: sugar, set: setSugar, color: C.coral, icon: "🩸", unit: "↑ elevated" },
    { label: "Physical Activity", val: activity, set: setActivity, color: C.teal, icon: "🏃", unit: "↓ sedentary" },
    { label: "Tissue Oxygenation", val: oxygen, set: setOxygen, color: C.indigo, icon: "💨", unit: "↓ hypoxic" },
  ];

  return (
    <Section id="what-goes-wrong" bg="white">
      <p className="section-label" style={{ marginBottom: 12 }}>02 — Metabolic Disruption</p>
      <h2 className="serif" style={{ fontSize: "clamp(24px,5vw,38px)", lineHeight: 1.2, marginBottom: 8 }}>
        What goes wrong inside
      </h2>
      <p style={{ color: "#64748B", fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
        Adjust the sliders to simulate how lifestyle factors shift your metabolic risk profile.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 24, marginBottom: 32 }}>
        {sliders.map((s, i) => (
          <div key={i} style={{ background: C.ivory, borderRadius: 16, padding: "20px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 18 }}>{s.icon}</span>
                <span style={{ fontWeight: 600, fontSize: 15 }}>{s.label}</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontWeight: 700, fontSize: 18, color: s.color }}>{s.val}</span>
                <span style={{ fontSize: 11, color: "#94A3B8", marginLeft: 4 }}>{s.unit}</span>
              </div>
            </div>
            <input
              type="range" min={0} max={100} value={s.val}
              onChange={e => s.set(Number(e.target.value))}
              className="slider-track"
              style={{ background: `linear-gradient(to right, ${s.color} ${s.val}%, ${C.silver} ${s.val}%)` }}
            />
          </div>
        ))}
      </div>

      {/* Risk indicator */}
      <div style={{
        background: `${riskColor}12`, border: `1.5px solid ${riskColor}30`,
        borderRadius: 16, padding: "20px 24px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        transition: "all 0.4s ease"
      }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#64748B", marginBottom: 4 }}>METABOLIC RISK SCORE</div>
          <div className="serif" style={{ fontSize: 32, color: riskColor, lineHeight: 1 }}>{riskScore}</div>
          <div style={{ fontSize: 13, color: "#64748B", marginTop: 4 }}>out of 100</div>
        </div>
        <div style={{
          background: `${riskColor}20`, borderRadius: 100,
          padding: "8px 18px", fontWeight: 700, color: riskColor, fontSize: 14
        }}>{riskLabel}</div>
      </div>
    </Section>
  );
}

// ─── 4. WHY LACTATE ──────────────────────────────────────────────────────────
function WhyLactate() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(s => (s + 1) % 4);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const pathway = [
    { label: "Glucose", icon: "⬡", color: C.coral, desc: "Energy substrate" },
    { label: "Pyruvate", icon: "◈", color: C.indigo, desc: "Intermediate" },
    { label: "ATP", icon: "⚡", color: C.teal, desc: "Energy produced" },
    { label: "Lactate ↑", icon: "⬡", color: C.red, desc: "Disruption signal" },
  ];

  const normal = [0, 1, 2];
  const disrupted = [0, 1, 3];

  return (
    <Section id="why-lactate" bg={C.ivory}>
      <p className="section-label" style={{ marginBottom: 12 }}>03 — The Lactate Signal</p>
      <h2 className="serif" style={{ fontSize: "clamp(24px,5vw,38px)", lineHeight: 1.2, marginBottom: 8 }}>
        Why lactate tells the story
      </h2>
      <p style={{ color: "#64748B", fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
        Lactate is your body's metabolic distress signal — produced when cells can't get enough oxygen or metabolize glucose normally.
      </p>

      {/* Normal pathway */}
      <div style={{ background: "white", borderRadius: 20, padding: "24px 20px", marginBottom: 16, border: `1px solid ${C.silver}` }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: C.teal, marginBottom: 16 }}>✓ NORMAL PATHWAY</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          {normal.map((idx, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                background: `${pathway[idx].color}15`, border: `1.5px solid ${pathway[idx].color}40`,
                borderRadius: 10, padding: "8px 14px", display: "flex", alignItems: "center", gap: 6,
                opacity: step >= i ? 1 : 0.3, transition: "opacity 0.5s ease"
              }}>
                <span style={{ fontSize: 14 }}>{pathway[idx].icon}</span>
                <span style={{ fontWeight: 600, fontSize: 13, color: pathway[idx].color }}>{pathway[idx].label}</span>
              </div>
              {i < normal.length - 1 && <span style={{ color: "#CBD5E1", fontWeight: 300, fontSize: 18 }}>→</span>}
            </div>
          ))}
        </div>
        <p style={{ marginTop: 12, fontSize: 13, color: "#64748B" }}>Cells efficiently convert glucose → energy with adequate oxygen.</p>
      </div>

      {/* Disrupted pathway */}
      <div style={{ background: `${C.red}08`, borderRadius: 20, padding: "24px 20px", border: `1px solid ${C.red}20` }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: C.red, marginBottom: 16 }}>⚠ DISRUPTED PATHWAY</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          {disrupted.map((idx, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                background: `${pathway[idx].color}15`, border: `1.5px solid ${pathway[idx].color}40`,
                borderRadius: 10, padding: "8px 14px", display: "flex", alignItems: "center", gap: 6,
              }}>
                <span style={{ fontSize: 14 }}>{pathway[idx].icon}</span>
                <span style={{ fontWeight: 600, fontSize: 13, color: pathway[idx].color }}>{pathway[idx].label}</span>
              </div>
              {i < disrupted.length - 1 && (
                <span style={{ color: i === 1 ? C.red : "#CBD5E1", fontWeight: i === 1 ? 700 : 300, fontSize: 18 }}>
                  {i === 1 ? "⟶" : "→"}
                </span>
              )}
            </div>
          ))}
        </div>
        <p style={{ marginTop: 12, fontSize: 13, color: "#64748B" }}>When oxygen is limited or metabolism is impaired, lactate accumulates as a byproduct.</p>
      </div>

      {/* Sweat bridge */}
      <div style={{ marginTop: 24, textAlign: "center", padding: "20px", background: `linear-gradient(135deg, ${C.teal}10, ${C.indigo}10)`, borderRadius: 16 }}>
        <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7 }}>
          🩺 <strong style={{ color: C.teal }}>Lactate crosses into sweat</strong> in concentrations proportional to blood levels — making sweat an accessible, non-invasive window into your metabolic state.
        </p>
      </div>
    </Section>
  );
}

// ─── 5. HIGH LACTATE ≠ ONE DISEASE ───────────────────────────────────────────
const INTERPRETATIONS = {
  cardiovascular: {
    title: "Cardiovascular Disease",
    color: C.red,
    icon: "♥",
    body: "Elevated lactate in CVD often reflects poor cardiac output, reduced tissue perfusion, or ischemia. The heart muscle itself can become lactate-producing rather than consuming — a key marker of heart failure severity.",
    indicators: ["Elevated resting lactate >2.0 mmol/L", "Reduced cardiac output", "Peripheral ischemia signs"],
    certainty: 68
  },
  diabetes: {
    title: "Metabolic Dysfunction",
    color: C.coral,
    icon: "⬡",
    body: "In insulin-resistant states, impaired glucose uptake forces cells toward anaerobic metabolism. Additionally, some glucose-lowering medications (like metformin at high doses) can independently elevate lactate levels.",
    indicators: ["Insulin resistance pattern", "HbA1c correlation needed", "Medication interaction possible"],
    certainty: 55
  },
  fatigue: {
    title: "Physiological Fatigue",
    color: C.indigo,
    icon: "⚡",
    body: "Post-exercise or chronic fatigue syndrome shows elevated lactate due to mitochondrial dysfunction or overexertion. Importantly, athletic individuals may show elevated sweat lactate that reflects high aerobic performance — not pathology.",
    indicators: ["Recent intense exercise?", "Chronic fatigue syndrome?", "Mitochondrial disorder?"],
    certainty: 40
  }
};

function HighLactate() {
  const [selected, setSelected] = useState("cardiovascular");
  const interp = INTERPRETATIONS[selected];

  return (
    <Section id="high-lactate" bg="white">
      <p className="section-label" style={{ marginBottom: 12 }}>04 — Context Matters</p>
      <h2 className="serif" style={{ fontSize: "clamp(24px,5vw,38px)", lineHeight: 1.2, marginBottom: 8 }}>
        High lactate ≠ one diagnosis
      </h2>
      <p style={{ color: "#64748B", fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>
        The same elevated lactate reading can mean very different things. Clinical context transforms a data point into insight.
      </p>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24 }}>
        {Object.entries(INTERPRETATIONS).map(([key, val]) => (
          <button key={key} className={`choice-btn ${selected === key ? "selected" : ""}`}
            onClick={() => setSelected(key)}
            style={{ borderColor: selected === key ? val.color : undefined, color: selected === key ? val.color : undefined }}>
            {val.icon} {val.title}
          </button>
        ))}
      </div>

      <div style={{
        background: `${interp.color}08`, border: `1.5px solid ${interp.color}25`,
        borderRadius: 20, padding: "24px 20px",
        animation: "fadeUp 0.4s ease"
      }} key={selected}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: interp.color }}>{interp.icon} {interp.title}</h3>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, color: "#94A3B8", letterSpacing: "0.08em" }}>LACTATE SPECIFICITY</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: interp.color }}>{interp.certainty}%</div>
          </div>
        </div>
        <p style={{ color: "#475569", fontSize: 14, lineHeight: 1.75, marginBottom: 16 }}>{interp.body}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {interp.indicators.map((ind, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: interp.color, flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: "#475569" }}>{ind}</span>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ─── 6. WHY MORE DATA ─────────────────────────────────────────────────────────
function WhyMoreData() {
  const limitations = [
    { icon: "🔁", title: "Confounding Variables", desc: "Exercise, diet, stress, and medications all independently elevate lactate, making isolated readings ambiguous." },
    { icon: "📍", title: "No Disease Specificity", desc: "Lactate elevation is a non-specific signal. Without supporting biomarkers, a definitive diagnosis cannot be made." },
    { icon: "🧠", title: "Missing the Cognitive Link", desc: "Cardiometabolic disorders significantly impair cognitive function — a dimension lactate alone cannot capture." },
    { icon: "📈", title: "Threshold Variability", desc: "\"Normal\" lactate ranges differ by age, fitness level, and individual baseline — static thresholds risk misclassification." },
  ];

  return (
    <Section id="why-more-data" bg={C.ivory}>
      <p className="section-label" style={{ marginBottom: 12 }}>05 — The Limitation</p>
      <h2 className="serif" style={{ fontSize: "clamp(24px,5vw,38px)", lineHeight: 1.2, marginBottom: 8 }}>
        Why lactate alone isn't enough
      </h2>
      <p style={{ color: "#64748B", fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
        Powerful as it is, sweat lactate is one piece of a complex puzzle. Robust screening requires multiple data dimensions.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {limitations.map((l, i) => (
          <div key={i} className="card-hover" style={{
            background: "white", borderRadius: 16, padding: "20px",
            border: `1px solid ${C.silver}`, display: "flex", gap: 16, alignItems: "flex-start"
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, background: C.ivory,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0
            }}>{l.icon}</div>
            <div>
              <h4 style={{ fontWeight: 600, marginBottom: 6, fontSize: 15 }}>{l.title}</h4>
              <p style={{ color: "#64748B", fontSize: 13, lineHeight: 1.7 }}>{l.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24, padding: "18px 20px", background: `linear-gradient(135deg, ${C.indigo}15, ${C.teal}10)`, borderRadius: 16 }}>
        <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7 }}>
          💡 <strong style={{ color: C.indigo }}>Solution:</strong> Pairing sweat lactate with <strong>cognitive performance testing</strong> creates a two-dimensional biomarker profile — metabolic + neurological — substantially improving diagnostic utility.
        </p>
      </div>
    </Section>
  );
}

// ─── 7. COGNITIVE TESTS ──────────────────────────────────────────────────────
function CognitiveTests({ onScore }) {
  const [test, setTest] = useState(null); // null | 'reaction' | 'stroop' | 'memory'
  const [scores, setScores] = useState({});
  const [phase, setPhase] = useState("idle");

  // Reaction Time Test
  const [rtWaiting, setRtWaiting] = useState(false);
  const [rtTarget, setRtTarget] = useState(false);
  const [rtStart, setRtStart] = useState(null);
  const [rtResult, setRtResult] = useState(null);

  // Stroop Test
  const STROOP_WORDS = [
    { word: "RED", color: "blue", correct: "BLUE" },
    { word: "GREEN", color: "red", correct: "RED" },
    { word: "BLUE", color: "green", correct: "GREEN" },
    { word: "YELLOW", color: "purple", correct: "PURPLE" },
  ];
  const [stroopIdx, setStroopIdx] = useState(0);
  const [stroopCorrect, setStroopCorrect] = useState(0);
  const [stroopDone, setStroopDone] = useState(false);

  // Memory Test
  const MEM_WORDS = ["APEX", "CORE", "SYNC", "FLOW", "MIND"];
  const [memPhase, setMemPhase] = useState("show"); // show | recall
  const [memInput, setMemInput] = useState("");
  const [memResult, setMemResult] = useState(null);

  const totalScore = Math.round(
    (scores.reaction !== undefined ? scores.reaction : 0) * 0.35 +
    (scores.stroop !== undefined ? scores.stroop : 0) * 0.35 +
    (scores.memory !== undefined ? scores.memory : 0) * 0.30
  );

  useEffect(() => {
    const done = Object.keys(scores).length;
    if (done === 3) onScore(totalScore);
  }, [scores]);

  // Reaction time logic
  const startRT = () => {
    setPhase("waiting");
    setRtTarget(false);
    setRtResult(null);
    setRtWaiting(true);
    const delay = 1500 + Math.random() * 2500;
    setTimeout(() => {
      setRtTarget(true);
      setRtStart(Date.now());
      setPhase("target");
    }, delay);
  };

  const handleRTClick = () => {
    if (!rtTarget) { setPhase("tooearly"); setTimeout(() => setPhase("idle"), 1000); return; }
    const ms = Date.now() - rtStart;
    setRtResult(ms);
    setRtTarget(false);
    setPhase("done");
    const score = Math.max(0, Math.min(100, Math.round(100 - (ms - 150) / 5)));
    setScores(s => ({ ...s, reaction: score }));
  };

  const handleStroop = (answer) => {
    const word = STROOP_WORDS[stroopIdx];
    const isCorrect = answer.toUpperCase() === word.correct;
    const newCorrect = stroopCorrect + (isCorrect ? 1 : 0);
    if (stroopIdx + 1 >= STROOP_WORDS.length) {
      setStroopDone(true);
      const score = Math.round((newCorrect / STROOP_WORDS.length) * 100);
      setScores(s => ({ ...s, stroop: score }));
      setStroopCorrect(newCorrect);
    } else {
      setStroopIdx(i => i + 1);
      setStroopCorrect(newCorrect);
    }
  };

  const handleMemoryRecall = () => {
    const recalled = memInput.toUpperCase().split(/[\s,]+/).filter(Boolean);
    const correct = recalled.filter(w => MEM_WORDS.includes(w)).length;
    const score = Math.round((correct / MEM_WORDS.length) * 100);
    setMemResult({ correct, total: MEM_WORDS.length });
    setScores(s => ({ ...s, memory: score }));
  };

  const resetTest = (t) => {
    setTest(t);
    setPhase("idle");
    setRtTarget(false); setRtResult(null); setRtWaiting(false);
    setStroopIdx(0); setStroopCorrect(0); setStroopDone(false);
    setMemPhase("show"); setMemInput(""); setMemResult(null);
    if (t === "memory") {
      setTimeout(() => setMemPhase("recall"), 4000);
    }
  };

  const testBtns = [
    { key: "reaction", label: "⚡ Reaction Time", color: C.coral, done: scores.reaction !== undefined },
    { key: "stroop", label: "🎨 Stroop Test", color: C.indigo, done: scores.stroop !== undefined },
    { key: "memory", label: "🧠 Memory Recall", color: C.teal, done: scores.memory !== undefined },
  ];

  return (
    <Section id="cognitive" bg="white">
      <p className="section-label" style={{ marginBottom: 12 }}>06 — Cognitive Assessment</p>
      <h2 className="serif" style={{ fontSize: "clamp(24px,5vw,38px)", lineHeight: 1.2, marginBottom: 8 }}>
        Test your cognitive profile
      </h2>
      <p style={{ color: "#64748B", fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>
        Cardiometabolic disorders impair attention, memory, and processing speed. Complete all three tests to generate your cognitive score.
      </p>

      {/* Test selector */}
      <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
        {testBtns.map(b => (
          <button key={b.key} className="choice-btn" onClick={() => resetTest(b.key)}
            style={{
              borderColor: test === b.key ? b.color : b.done ? `${b.color}60` : undefined,
              color: test === b.key ? b.color : b.done ? `${b.color}80` : undefined,
              background: b.done ? `${b.color}08` : undefined,
              position: "relative"
            }}>
            {b.label}
            {b.done && <span style={{ marginLeft: 6, fontSize: 12, color: b.color }}>✓</span>}
          </button>
        ))}
      </div>

      {/* Test panels */}
      {test === "reaction" && (
        <div style={{ background: C.ivory, borderRadius: 20, padding: "32px 20px", textAlign: "center", border: `1px solid ${C.silver}` }}>
          <h4 style={{ fontWeight: 600, marginBottom: 8 }}>Reaction Time Test</h4>
          <p style={{ color: "#64748B", fontSize: 13, marginBottom: 24 }}>Tap the circle the moment it turns green.</p>
          <div
            onClick={handleRTClick}
            style={{
              width: 120, height: 120, borderRadius: "50%",
              margin: "0 auto 24px",
              background: rtTarget ? C.teal : phase === "waiting" ? C.coral : C.silver,
              cursor: "pointer",
              transition: "background 0.15s ease",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 600, color: "white"
            }}>
            {rtTarget ? "TAP!" : phase === "waiting" ? "..." : phase === "tooearly" ? "Too early" : "●"}
          </div>
          {rtResult && <p style={{ color: C.teal, fontWeight: 700, fontSize: 18 }}>⚡ {rtResult}ms — Score: {scores.reaction}/100</p>}
          {phase !== "waiting" && phase !== "target" && (
            <button className="btn-primary" onClick={startRT} style={{ fontSize: 14, padding: "10px 24px" }}>
              {phase === "idle" ? "Start Test" : "Try Again"}
            </button>
          )}
        </div>
      )}

      {test === "stroop" && (
        <div style={{ background: C.ivory, borderRadius: 20, padding: "32px 20px", textAlign: "center", border: `1px solid ${C.silver}` }}>
          <h4 style={{ fontWeight: 600, marginBottom: 4 }}>Stroop Color-Word Test</h4>
          <p style={{ color: "#64748B", fontSize: 13, marginBottom: 24 }}>Select the <em>color of the text</em>, not the word it spells.</p>
          {!stroopDone ? (
            <>
              <div style={{
                fontSize: 40, fontWeight: 800, marginBottom: 8,
                color: STROOP_WORDS[stroopIdx].color,
                fontFamily: "'DM Serif Display', serif"
              }}>{STROOP_WORDS[stroopIdx].word}</div>
              <p style={{ fontSize: 12, color: "#94A3B8", marginBottom: 20 }}>{stroopIdx + 1} / {STROOP_WORDS.length}</p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                {["Red", "Blue", "Green", "Purple"].map(c => (
                  <button key={c} className="choice-btn" onClick={() => handleStroop(c)}>{c}</button>
                ))}
              </div>
            </>
          ) : (
            <div>
              <div style={{ fontSize: 32, fontWeight: 700, color: C.indigo, marginBottom: 8 }}>
                {stroopCorrect}/{STROOP_WORDS.length}
              </div>
              <p style={{ color: "#64748B" }}>Stroop Score: <strong>{scores.stroop}/100</strong></p>
            </div>
          )}
        </div>
      )}

      {test === "memory" && (
        <div style={{ background: C.ivory, borderRadius: 20, padding: "32px 20px", textAlign: "center", border: `1px solid ${C.silver}` }}>
          <h4 style={{ fontWeight: 600, marginBottom: 4 }}>Working Memory Test</h4>
          {memPhase === "show" ? (
            <>
              <p style={{ color: "#64748B", fontSize: 13, marginBottom: 20 }}>Memorize these words. You have 4 seconds.</p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 16 }}>
                {MEM_WORDS.map(w => (
                  <div key={w} style={{
                    background: `${C.teal}20`, borderRadius: 10, padding: "8px 16px",
                    fontWeight: 700, color: C.teal, fontSize: 16
                  }}>{w}</div>
                ))}
              </div>
              <div style={{ color: "#94A3B8", fontSize: 13, animation: "blinkCursor 1s infinite" }}>Memorizing...</div>
            </>
          ) : memResult === null ? (
            <>
              <p style={{ color: "#64748B", fontSize: 13, marginBottom: 16 }}>Type the words you remember, separated by spaces.</p>
              <input
                type="text" value={memInput} onChange={e => setMemInput(e.target.value)}
                placeholder="e.g. APEX FLOW CORE..."
                style={{
                  width: "100%", padding: "12px 16px", borderRadius: 12,
                  border: `1.5px solid ${C.silver}`, fontSize: 15,
                  fontFamily: "'DM Sans', sans-serif", marginBottom: 16, background: "white"
                }}
              />
              <button className="btn-primary" onClick={handleMemoryRecall} style={{ fontSize: 14, padding: "10px 24px" }}>
                Submit
              </button>
            </>
          ) : (
            <div>
              <div style={{ fontSize: 32, fontWeight: 700, color: C.teal, marginBottom: 8 }}>
                {memResult.correct}/{memResult.total}
              </div>
              <p style={{ color: "#64748B" }}>Memory Score: <strong>{scores.memory}/100</strong></p>
            </div>
          )}
        </div>
      )}

      {/* Score summary */}
      {Object.keys(scores).length > 0 && (
        <div style={{ marginTop: 24, background: `${C.indigo}08`, borderRadius: 16, padding: "20px", border: `1px solid ${C.indigo}20` }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            {testBtns.filter(b => scores[b.key] !== undefined).map(b => (
              <div key={b.key} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: b.color }}>{scores[b.key]}</div>
                <div style={{ fontSize: 11, color: "#64748B" }}>{b.label.split(" ").slice(1).join(" ")}</div>
              </div>
            ))}
            {Object.keys(scores).length === 3 && (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: C.indigo }}>{totalScore}</div>
                <div style={{ fontSize: 11, color: "#64748B" }}>Cognitive Score</div>
              </div>
            )}
          </div>
        </div>
      )}
    </Section>
  );
}

// ─── 8. ANALYSIS SYSTEM ──────────────────────────────────────────────────────
function AnalysisSystem({ cogScore }) {
  const [lactate, setLactate] = useState("");
  const [result, setResult] = useState(null);

  const analyze = () => {
    const lac = parseFloat(lactate);
    if (isNaN(lac) || lac < 0) return;
    const cog = cogScore || 60;

    let risk = "Low";
    let color = C.teal;
    let interpretation = "";
    let riskNum = 0;

    if (lac > 4.0 && cog < 50) {
      risk = "High"; color = C.red; riskNum = 85;
      interpretation = "Severely elevated lactate combined with impaired cognition strongly suggests significant metabolic-cardiovascular dysfunction. Urgent clinical evaluation is recommended.";
    } else if (lac > 2.5 || cog < 55) {
      risk = "Moderate"; color = C.coral; riskNum = 55;
      interpretation = "Elevated lactate or reduced cognitive performance warrants further investigation. Consider clinical correlation with HbA1c, cardiac markers, and detailed metabolic panel.";
    } else if (lac > 1.8) {
      risk = "Borderline"; color = "#EAB308"; riskNum = 35;
      interpretation = "Mildly elevated lactate with preserved cognition may reflect post-exercise state, dietary factors, or early metabolic changes. Monitor trends over time.";
    } else {
      risk = "Normal"; color = C.teal; riskNum = 12;
      interpretation = "Lactate levels and cognitive performance are within normal ranges. Continued monitoring with healthy lifestyle practices is recommended.";
    }

    setResult({ risk, color, interpretation, riskNum, lac, cog });
  };

  return (
    <Section id="analysis" bg={C.ivory}>
      <p className="section-label" style={{ marginBottom: 12 }}>07 — Integrated Analysis</p>
      <h2 className="serif" style={{ fontSize: "clamp(24px,5vw,38px)", lineHeight: 1.2, marginBottom: 8 }}>
        Combine your biomarkers
      </h2>
      <p style={{ color: "#64748B", fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>
        Enter your sweat lactate level to combine with your cognitive assessment for an integrated risk interpretation.
      </p>

      <div style={{ background: "white", borderRadius: 20, padding: "24px 20px", border: `1px solid ${C.silver}`, marginBottom: 20 }}>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>
            Sweat Lactate Level (mmol/L)
          </label>
          <div style={{ display: "flex", gap: 12 }}>
            <input
              type="number" step="0.1" min="0" max="20"
              value={lactate} onChange={e => setLactate(e.target.value)}
              placeholder="e.g. 2.4"
              style={{
                flex: 1, padding: "12px 16px", borderRadius: 12,
                border: `1.5px solid ${C.silver}`, fontSize: 16,
                fontFamily: "'DM Sans', sans-serif", background: C.ivory
              }}
            />
            <button className="btn-primary" onClick={analyze} style={{ fontSize: 14, padding: "12px 24px", whiteSpace: "nowrap" }}>
              Analyze
            </button>
          </div>
          <p style={{ marginTop: 8, fontSize: 12, color: "#94A3B8" }}>Normal range: 0.5 – 1.8 mmol/L at rest</p>
        </div>

        <div style={{ borderTop: `1px solid ${C.silver}`, paddingTop: 16 }}>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1, background: C.ivory, borderRadius: 10, padding: "12px" }}>
              <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 4 }}>LACTATE</div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>{lactate || "—"} <span style={{ fontSize: 12, fontWeight: 400, color: "#64748B" }}>mmol/L</span></div>
            </div>
            <div style={{ flex: 1, background: C.ivory, borderRadius: 10, padding: "12px" }}>
              <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 4 }}>COGNITIVE SCORE</div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>{cogScore || "—"} <span style={{ fontSize: 12, fontWeight: 400, color: "#64748B" }}>/100</span></div>
            </div>
          </div>
        </div>
      </div>

      {result && (
        <div style={{
          background: `${result.color}10`, border: `1.5px solid ${result.color}30`,
          borderRadius: 20, padding: "24px 20px", animation: "fadeUp 0.4s ease"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: "#64748B" }}>INTEGRATED ASSESSMENT</div>
            <span className="tag" style={{ background: `${result.color}20`, color: result.color }}>
              {result.risk} Risk
            </span>
          </div>
          <p style={{ color: "#475569", fontSize: 14, lineHeight: 1.75 }}>{result.interpretation}</p>
          <div style={{ marginTop: 16, height: 6, borderRadius: 9999, background: C.silver, overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 9999,
              background: `linear-gradient(to right, ${C.teal}, ${result.color})`,
              width: `${result.riskNum}%`, transition: "width 0.8s cubic-bezier(.4,0,.2,1)"
            }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span style={{ fontSize: 11, color: "#94A3B8" }}>Normal</span>
            <span style={{ fontSize: 11, color: "#94A3B8" }}>High</span>
          </div>
        </div>
      )}
    </Section>
  );
}

// ─── 9. DASHBOARD / GAUGE ─────────────────────────────────────────────────────
function Dashboard({ cogScore }) {
  const [lactate, setLactate] = useState(2.2);
  const cog = cogScore || 65;
  const riskRaw = Math.min(100, Math.round((lactate / 8 * 60) + ((100 - cog) * 0.4)));
  const riskPct = Math.min(100, riskRaw);
  const riskColor = riskPct < 30 ? C.teal : riskPct < 60 ? C.coral : C.red;
  const riskLabel = riskPct < 30 ? "Low" : riskPct < 60 ? "Moderate" : "High";

  // SVG gauge
  const r = 70, cx = 90, cy = 90;
  const startAngle = -210, endAngle = 30;
  const totalArc = endAngle - startAngle;
  const filled = (riskPct / 100) * totalArc;
  const toRad = d => (d * Math.PI) / 180;
  const arcPath = (start, end) => {
    const s = { x: cx + r * Math.cos(toRad(start)), y: cy + r * Math.sin(toRad(start)) };
    const e = { x: cx + r * Math.cos(toRad(end)), y: cy + r * Math.sin(toRad(end)) };
    const large = end - start > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
  };

  return (
    <Section id="dashboard" bg="white">
      <p className="section-label" style={{ marginBottom: 12 }}>08 — Risk Dashboard</p>
      <h2 className="serif" style={{ fontSize: "clamp(24px,5vw,38px)", lineHeight: 1.2, marginBottom: 8 }}>
        Your metabolic risk gauge
      </h2>
      <p style={{ color: "#64748B", fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>
        A real-time visualization of your integrated cardiometabolic risk profile.
      </p>

      <div style={{ background: C.ivory, borderRadius: 20, padding: "32px 20px", border: `1px solid ${C.silver}`, textAlign: "center" }}>
        {/* SVG Gauge */}
        <svg width={180} height={120} viewBox="0 0 180 120" style={{ overflow: "visible", marginBottom: 8 }}>
          {/* Background arc */}
          <path d={arcPath(startAngle, endAngle)} fill="none" stroke={C.silver} strokeWidth={10} strokeLinecap="round" />
          {/* Colored fill */}
          <path
            d={arcPath(startAngle, startAngle + filled)}
            fill="none"
            stroke={riskColor}
            strokeWidth={10}
            strokeLinecap="round"
            style={{ transition: "all 0.8s cubic-bezier(.4,0,.2,1)", filter: `drop-shadow(0 0 6px ${riskColor}50)` }}
          />
          {/* Center text */}
          <text x={cx} y={cy - 4} textAnchor="middle" fill={riskColor} fontFamily="DM Serif Display" fontSize={28} fontWeight="bold">
            {riskPct}
          </text>
          <text x={cx} y={cy + 14} textAnchor="middle" fill="#94A3B8" fontFamily="DM Sans" fontSize={11}>RISK INDEX</text>
        </svg>

        <div style={{
          display: "inline-block", padding: "6px 20px", borderRadius: 100,
          background: `${riskColor}15`, color: riskColor, fontWeight: 700, fontSize: 15, marginBottom: 20
        }}>{riskLabel} Risk</div>

        {/* Adjust lactate slider */}
        <div style={{ textAlign: "left", marginTop: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Simulate Lactate</span>
            <span style={{ fontWeight: 700, color: riskColor }}>{lactate.toFixed(1)} mmol/L</span>
          </div>
          <input
            type="range" min="0.5" max="8" step="0.1" value={lactate}
            onChange={e => setLactate(Number(e.target.value))}
            className="slider-track"
            style={{ background: `linear-gradient(to right, ${riskColor} ${(lactate - 0.5) / 7.5 * 100}%, ${C.silver} ${(lactate - 0.5) / 7.5 * 100}%)` }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span style={{ fontSize: 11, color: "#94A3B8" }}>0.5 (Low)</span>
            <span style={{ fontSize: 11, color: "#94A3B8" }}>8.0 (High)</span>
          </div>
        </div>
      </div>

      {/* Metric cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
        {[
          { label: "Lactate", val: `${lactate.toFixed(1)} mmol/L`, color: riskColor },
          { label: "Cognitive Score", val: `${cog}/100`, color: C.indigo },
          { label: "Risk Category", val: riskLabel, color: riskColor },
          { label: "Confidence", val: cogScore ? "High" : "Moderate", color: C.teal },
        ].map((m, i) => (
          <div key={i} style={{ background: C.ivory, borderRadius: 14, padding: "16px", border: `1px solid ${C.silver}` }}>
            <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 4, fontWeight: 600, letterSpacing: "0.06em" }}>{m.label.toUpperCase()}</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: m.color }}>{m.val}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ─── 10. DEVICE SIMULATION ────────────────────────────────────────────────────
function DeviceSimulation() {
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0);

  const steps = [
    "Sweat collected on electrode surface",
    "Lactate oxidase enzyme reacts with lactate",
    "Electron transfer generates current",
    "Amperometric signal measured",
    "Concentration calculated & transmitted",
  ];

  useEffect(() => {
    if (!running) return;
    if (step >= steps.length) { setRunning(false); return; }
    const t = setTimeout(() => setStep(s => s + 1), 1200);
    return () => clearTimeout(t);
  }, [running, step]);

  const startSim = () => { setStep(0); setRunning(true); };

  return (
    <Section id="device" bg={C.ivory}>
      <p className="section-label" style={{ marginBottom: 12 }}>09 — Biosensor Architecture</p>
      <h2 className="serif" style={{ fontSize: "clamp(24px,5vw,38px)", lineHeight: 1.2, marginBottom: 8 }}>
        The SPE biosensor, visualized
      </h2>
      <p style={{ color: "#64748B", fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>
        A Screen-Printed Electrode (SPE) with lactate oxidase enzyme converts sweat lactate directly into a measurable electrical signal.
      </p>

      {/* Electrode diagram */}
      <div style={{ background: "white", borderRadius: 20, padding: "28px 20px", border: `1px solid ${C.silver}`, marginBottom: 20 }}>
        <svg viewBox="0 0 300 140" width="100%" style={{ marginBottom: 20 }}>
          {/* Substrate */}
          <rect x="20" y="90" width="260" height="30" rx="4" fill="#E2E8F0" />
          <text x="150" y="110" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="DM Sans">Flexible Polymer Substrate</text>

          {/* Counter electrode */}
          <rect x="30" y="60" width="60" height="34" rx="4" fill={`${C.silver}`} />
          <text x="60" y="52" textAnchor="middle" fill="#64748B" fontSize="9" fontFamily="DM Sans">Counter</text>
          <text x="60" y="78" textAnchor="middle" fill="#64748B" fontSize="8" fontFamily="DM Sans">CE</text>

          {/* Reference electrode */}
          <rect x="120" y="60" width="60" height="34" rx="4" fill="#C084FC30" stroke="#C084FC" strokeWidth={1} />
          <text x="150" y="52" textAnchor="middle" fill="#9333EA" fontSize="9" fontFamily="DM Sans">Reference</text>
          <text x="150" y="78" textAnchor="middle" fill="#9333EA" fontSize="8" fontFamily="DM Sans">Ag/AgCl</text>

          {/* Working electrode */}
          <rect x="210" y="60" width="60" height="34" rx="4" fill={`${C.teal}25`} stroke={C.teal} strokeWidth={1.5} />
          <text x="240" y="52" textAnchor="middle" fill={C.teal} fontSize="9" fontFamily="DM Sans">Working</text>
          <text x="240" y="76" textAnchor="middle" fill={C.teal} fontSize="8" fontFamily="DM Sans">LOx</text>
          <text x="240" y="87" textAnchor="middle" fill={C.teal} fontSize="8" fontFamily="DM Sans">enzyme</text>

          {/* Sweat droplets */}
          {(running || step > 0) && (
            <>
              <ellipse cx="240" cy="58" rx="8" ry="5" fill={`${C.indigo}40`} />
              <ellipse cx="228" cy="55" rx="5" ry="4" fill={`${C.indigo}30`} />
            </>
          )}

          {/* Signal arrow */}
          {step >= 3 && (
            <g>
              <line x1="240" y1="60" x2="240" y2="20" stroke={C.coral} strokeWidth={2} strokeDasharray="4 2" />
              <polygon points="236,24 244,24 240,14" fill={C.coral} />
              <text x="260" y="22" fill={C.coral} fontSize="9" fontFamily="DM Sans">Signal</text>
            </g>
          )}
        </svg>

        {/* Step indicators */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {steps.map((s, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 12,
              opacity: i < step ? 1 : 0.3, transition: "opacity 0.5s ease"
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                background: i < step ? C.teal : C.silver,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, color: "white",
                transition: "background 0.4s ease"
              }}>{i + 1}</div>
              <span style={{ fontSize: 13, color: i < step ? "#0F172A" : "#94A3B8", fontWeight: i < step ? 500 : 400 }}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      <button className="btn-primary" onClick={startSim} disabled={running}>
        {running ? "Simulating..." : "▶ Run Simulation"}
      </button>
    </Section>
  );
}

// ─── 11. SCIENTIFIC BASIS ─────────────────────────────────────────────────────
function ScientificBasis() {
  const facts = [
    {
      icon: "⚗",
      title: "Lactate Oxidase Catalysis",
      body: "LOx enzyme catalyzes: Lactate + O₂ → Pyruvate + H₂O₂. The hydrogen peroxide is electrochemically oxidized at the working electrode, producing a current proportional to lactate concentration.",
      ref: "Heikenfeld et al., Lab Chip 2018"
    },
    {
      icon: "💧",
      title: "Sweat-Blood Correlation",
      body: "Sweat lactate correlates with blood lactate across physiological ranges (0.5–10 mmol/L), though sweat concentration is typically 1.5–3× higher. Calibration algorithms correct for this offset.",
      ref: "Mena-Bravo et al., Anal. Chim. Acta 2014"
    },
    {
      icon: "🧬",
      title: "Cognitive-Metabolic Link",
      body: "Insulin resistance and impaired cerebral glucose metabolism co-occur in T2DM and CVD, reducing processing speed, working memory, and executive function — measurable via validated cognitive tasks.",
      ref: "Biessels & Despa, Nat Rev Neurol 2018"
    },
    {
      icon: "📡",
      title: "Wearable Integration",
      body: "Modern flexible electronics enable real-time sweat sampling with microfluidic channels, on-chip analog front-ends, and Bluetooth transmission — enabling continuous ambulatory monitoring.",
      ref: "Gao et al., Nature 2016"
    },
  ];

  return (
    <Section id="science" bg="white">
      <p className="section-label" style={{ marginBottom: 12 }}>10 — Scientific Foundation</p>
      <h2 className="serif" style={{ fontSize: "clamp(24px,5vw,38px)", lineHeight: 1.2, marginBottom: 8 }}>
        The research behind it
      </h2>
      <p style={{ color: "#64748B", fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
        Grounded in peer-reviewed literature across analytical chemistry, bioelectronics, and clinical metabolomics.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {facts.map((f, i) => (
          <div key={i} className="card-hover" style={{ background: C.ivory, borderRadius: 16, padding: "20px", border: `1px solid ${C.silver}` }}>
            <div style={{ display: "flex", gap: 14 }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12, background: "white",
                border: `1px solid ${C.silver}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, flexShrink: 0
              }}>{f.icon}</div>
              <div>
                <h4 style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>{f.title}</h4>
                <p style={{ color: "#475569", fontSize: 13, lineHeight: 1.75, marginBottom: 8 }}>{f.body}</p>
                <span style={{ fontSize: 11, color: C.teal, fontWeight: 600 }}>📄 {f.ref}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ─── 12. IMPACT ───────────────────────────────────────────────────────────────
function Impact() {
  const impacts = [
    { icon: "🌍", stat: "17M+", label: "deaths from CVD annually", detail: "Early detection could prevent a significant proportion through timely intervention." },
    { icon: "💰", stat: "~$760B", label: "annual diabetes cost (US)", detail: "Non-invasive monitoring reduces costly late-stage complication management." },
    { icon: "👆", stat: "Non-invasive", label: "no needles, no labs", detail: "Sweat-based testing eliminates barriers to regular monitoring in low-resource settings." },
    { icon: "⚡", stat: "< 5 min", label: "full assessment time", detail: "Rapid biosensor + cognitive test enables opportunistic screening in clinical workflows." },
  ];

  return (
    <Section id="impact" bg={C.ivory}>
      <p className="section-label" style={{ marginBottom: 12 }}>11 — Real-World Impact</p>
      <h2 className="serif" style={{ fontSize: "clamp(24px,5vw,38px)", lineHeight: 1.2, marginBottom: 8 }}>
        Why this matters
      </h2>
      <p style={{ color: "#64748B", fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
        Cardiometabolic disease is a global crisis. Accessible, continuous, non-invasive monitoring could reshape preventive medicine.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {impacts.map((im, i) => (
          <div key={i} className="card-hover" style={{
            background: "white", borderRadius: 18, padding: "20px 16px",
            border: `1px solid ${C.silver}`, textAlign: "center"
          }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>{im.icon}</div>
            <div className="serif" style={{ fontSize: 22, color: C.teal, marginBottom: 4 }}>{im.stat}</div>
            <div style={{ fontWeight: 600, fontSize: 12, color: C.slate, marginBottom: 8 }}>{im.label}</div>
            <p style={{ fontSize: 11, color: "#94A3B8", lineHeight: 1.6 }}>{im.detail}</p>
          </div>
        ))}
      </div>

      {/* Vision statement */}
      <div style={{
        marginTop: 24,
        background: `linear-gradient(135deg, ${C.slate}, #1E3A5F)`,
        borderRadius: 20, padding: "28px 24px", color: "white", textAlign: "center"
      }}>
        <p className="serif" style={{ fontSize: 20, lineHeight: 1.5, marginBottom: 12 }}>
          "The future of metabolic health is not in the clinic — it's on your skin."
        </p>
        <p style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.7 }}>
          Integrating sweat biosensing with cognitive biomarkers represents the next frontier in personalized, continuous, preventive cardiometabolic care.
        </p>
      </div>
    </Section>
  );
}

// ─── NAV BAR ──────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: "14px 20px",
      background: scrolled ? "rgba(248,250,252,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? `1px solid ${C.silver}` : "none",
      transition: "all 0.3s ease",
      display: "flex", justifyContent: "space-between", alignItems: "center"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: `linear-gradient(135deg, ${C.teal}, ${C.indigo})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14
        }}>💧</div>
        <span style={{ fontWeight: 700, fontSize: 14, color: scrolled ? C.slate : "white" }}>LactoSense</span>
      </div>
      <button
        onClick={() => document.getElementById("analysis")?.scrollIntoView({ behavior: "smooth" })}
        className="btn-primary"
        style={{ fontSize: 12, padding: "8px 16px" }}>
        Assess Risk
      </button>
    </nav>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{
      background: C.slate, color: "white",
      padding: "48px 20px", textAlign: "center"
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 12,
        background: `linear-gradient(135deg, ${C.teal}, ${C.indigo})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 20px", fontSize: 20
      }}>💧</div>
      <div className="serif" style={{ fontSize: 22, marginBottom: 8 }}>LactoSense</div>
      <p style={{ color: "#64748B", fontSize: 13, marginBottom: 24 }}>Sweat-Based Cardiometabolic Early Detection</p>

      <div style={{ borderTop: "1px solid #1E293B", paddingTop: 24, maxWidth: 400, margin: "0 auto" }}>
        <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Naufa Nufail & Keishya Aghni</p>
        <p style={{ color: "#64748B", fontSize: 13, lineHeight: 1.8 }}>
          Faculty of Medicine<br />
          Universitas Diponegoro<br />
          2026
        </p>
      </div>

      <p style={{ marginTop: 24, fontSize: 11, color: "#334155" }}>
        For educational and research purposes only. Not a medical device.
      </p>
    </footer>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [cogScore, setCogScore] = useState(null);

  return (
    <>
      <style>{styles}</style>
      <Navbar />
      <Hero />
      <WhatIs />
      <WhatGoesWrong />
      <WhyLactate />
      <HighLactate />
      <WhyMoreData />
      <CognitiveTests onScore={setCogScore} />
      <AnalysisSystem cogScore={cogScore} />
      <Dashboard cogScore={cogScore} />
      <DeviceSimulation />
      <ScientificBasis />
      <Impact />
      <Footer />
    </>
  );
}
