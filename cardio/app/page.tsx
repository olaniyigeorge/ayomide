"use client";

import { useEffect, useRef, useState } from "react";
import {
  profile,
  phases,
  monitoring,
  nutrition,
  idealCandidate,
  reviews,
  investment,
  contact,
  disclaimer,
  offerings,
} from "./components/content";
import "./globals.css";
import RollingNumber from "./components/rollingNumbers";
import Link from "next/link";

/** Adds .is-visible to any element with data-reveal once it scrolls into view. */
function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll("[data-reveal]"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function formatNaira(n: number) {
  return `₦${n.toLocaleString("en-NG")}`;
}

function daysUntil(dateStr: string) {
  const target = new Date(dateStr + "T00:00:00");
  const now = new Date();
  const diffMs = target.setHours(0, 0, 0, 0) - now.setHours(0, 0, 0, 0);
  return Math.ceil(diffMs / 86_400_000);
}

type CheckInEntry = {
  _id?: string;
  weight: number;
  waist: number;
  glute: number;
  note?: string;
  createdAt?: string;
};

export default function SculptProtocolPage() {
  useReveal();

  const [activePhase, setActivePhase] = useState(-1);
  const phaseRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [checkIns, setCheckIns] = useState<CheckInEntry[]>([]);
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch past check-ins on mount
  useEffect(() => {
    fetch("/api/checkin")
      .then((res) => (res.ok ? res.json() : { entries: [] }))
      .then((data) => setCheckIns(data.entries || []))
      .catch(() => setCheckIns([]));
  }, []);

  // Phase visibility tracker
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = Number((entry.target as HTMLElement).dataset.phaseIndex);
          if (entry.isIntersecting) {
            setActivePhase((prev) => Math.max(prev, idx));
          }
        });
      },
      { threshold: 0.4, rootMargin: "0px 0px -15% 0px" }
    );
    phaseRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  // Consolidated & clean baseline submission handling
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    const form = new FormData(e.currentTarget);
    const weightVal = Number(form.get("weight"));
    const waistVal = Number(form.get("waist"));
    const gluteVal = Number(form.get("glute"));
    const noteVal = form.get("note")?.toString() || "";

    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weight: weightVal,
          waist: waistVal,
          glute: gluteVal,
          note: noteVal,
        }),
      });

      if (!res.ok) throw new Error("Something went wrong. Please try again.");

      const data = await res.json();
      
      setSuccess("Got it - your baseline is set. We'll be in touch shortly.");
      
      // Update check-in UI immediately
      setCheckIns((prev) => [
        {
          _id: data.id || Math.random().toString(),
          weight: weightVal,
          waist: waistVal,
          glute: gluteVal,
          note: noteVal,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      
      e.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  const gaugeFillPct = activePhase < 0 ? 0 : ((activePhase + 1) / phases.length) * 100;
  const latestCheckIn = checkIns[0];
  const daysLeft = daysUntil(profile.travelDate || "2026-09-10"); // Fallback safety match for 9-week countdown

  return (
    <div className="sculpt">
      {/* ---------- NAVIGATION ---------- */}
      <nav className="nav">
        <div className="wrap nav-row">
          <Link href="/ayo" className="nav-mark decoration-none">
            Sculpt <span>Protocol</span>
          </Link>
          <a className="nav-cta" href="#signup">
            Start Your Journey
          </a>
        </div>
      </nav>

      {/* ---------- HERO SECTION ---------- */}
      <header className="hero-photo">
        {/* Absolute Background & Layout Anchors */}
        <div className="hero-photo-bg">
          {/* If you have a separate ambient background photo, keep it here. Otherwise, leave it empty */}
        </div>

        {/* The yoga pose asset explicitly breaking out across the right side */}
        <div className="hero-absolute-portrait">
          <img src="/images/presh_yoga.png" alt="Ayomide elite training posture alignment" />
        </div>

        <div className="wrap">
          <div className="hero-photo-content">
            <span className="hero-badge">🔥 Made Specially For You, Ayomide</span>

            <h1 className="hero-photo-title">
              SCULPT THE <em>BEST</em>
              <br />
              VERSION OF
              <br />
              YOURSELF
            </h1>

            <p className="hero-photo-sub">
              A structured, personalised 9-week transformation built around
              your body, schedule, and one clear deadline: touching down in
              Gatwick feeling strong, confident, and ready - not rushed, with doubt or
              overworked to get there.
            </p>

            <div className="hero-photo-actions">
              <a className="btn-primary" href="#signup">
                Start Training <span aria-hidden>→</span>
              </a>
              <a className="btn-ghost" href="#offerings">
                View the Protocol
              </a>
            </div>

            <div className="hero-photo-stats">
              <div>
                <div className="hero-stat-value">
                  <RollingNumber value={36} delay={1.4} />"
                </div>
                <div className="hero-stat-label">Waist Goal</div>
              </div>
              <div>
                <div className="hero-stat-value">
                  <RollingNumber value={44} delay={1.4} />"
                </div>
                <div className="hero-stat-label">Glute Goal</div>
              </div>
              <div>
                <div className="hero-stat-value">
                  <RollingNumber value={84} delay={1.4} />kg
                </div>
                <div className="hero-stat-label">Weight Goal</div>
              </div>
            </div>
          </div>
        </div>
      </header>

 

      {/* ---------- CORE STRATEGY / OFFERINGS ---------- */}
      <section className="section" id="offerings">
        <div className="wrap">
          <div className="eyebrow">TARGETED SPECIFICATIONS</div>
          <h2 className="section-title">Program Architecture Built For Your Goals</h2>

          <div className="goal-cards" style={{ marginTop: 48 }} data-reveal>
            {offerings.options.map((option) => (
              <div className="goal-card" key={option.title}>
                <div className="goal-card-icon">{option.icon}</div>
                <div className="goal-card-goal">{option.goal}</div>
                <h3 className="goal-card-title">{option.title}</h3>
                <p className="goal-card-remark">{option.remark}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

{/* ---------- TARGETED VISUAL ZONE ---------- */}
      <section className="sculpt-showcase-section" id="made-for-you">
        <div className="wrap">
          {/* Default to stacked (grid-cols-1), and split 50/50 on medium screens up (md:grid-cols-2) */}
          <div className="flex flex-col border-2 border-red-400 md:flex-row items-center justify-between gap-8">
            {/* Left Column: Content */}
            <div className="showcase-content">
              <h2 className="showcase-title">
                Meticulous adjustments for a complex countdown.
              </h2>
              <p className="showcase-sub">
                Every metabolic profile, workout set, macro breakdown, and progression plan is tracked live to force body recomposition safely without over-exhausting your energy limits before deployment.
              </p>
            </div>
            
            {/* Right Column: Contained Image */}
            <div className="showcase-image-wrapper">
              <img 
                src="/images/weird_presh.jpg" 
                alt="Ayomide high-performance training focus" 
                className="showcase-img"
              />
            </div>

          </div>
        </div>
      </section>

                 {/* ---------- REVIEWS (sliding) ---------- */}
      <section className="reviews">
        <div className="wrap">
          <div className="eyebrow">Proof It Works</div>
          <h2 className="section-title">Others On This Protocol</h2>
        </div>

        <div className="marquee" style={{ marginTop: 48 }}>
          <div className="marquee-track">
            {[...reviews, ...reviews].map((r, i) => (
              <div className="review-card" key={`${r.name}-${i}`}>
                <p className="review-quote">&ldquo;{r.quote}&rdquo;</p>
                <div className="review-meta">
                  <b>{r.name}</b>
                  <span>{r.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- PRIVATE ONBOARDING & PRICING ---------- */}
      <section className="signup-section" id="signup">
        <div className="wrap">
          <div className="signup-grid">
            <div>

              <div className="signup-price-block">
                <div className="signup-price-label">All-Inclusive Sculpt Investment</div>
                <div className="signup-price-value">{formatNaira(120000)}</div>
                <p className="signup-price-note">
                  Covers biometrics analytics, tailored resistance metrics, bespoke meal planning consultancy, equipment acquisition advisory, and daily performance checks.
                </p>
              </div>

              <ul className="signup-list">
                <li><span className="signup-check">✓</span> High-Tier Fitness Biometric Blueprint</li>
                <li><span className="signup-check">✓</span> Personalized Dynamic Training Split</li>
                <li><span className="signup-check">✓</span> Targeted Structural Glute & Waist Isolation</li>
                <li><span className="signup-check">✓</span> De-inflammation Sourcing & Nutrition Concierge</li>
                <li><span className="signup-check">✓</span> Comprehensive Progress Adjustments & Session Logistics</li>
              </ul>
            </div>

            {/* Submissions Processing Card */}
            <div className="signup-card">
              <form onSubmit={handleSubmit}>
                <p className="signup-baseline-note">
                  Supply current metric baselines to generate your initial dashboard values.
                </p>

                <div className="signup-form-row-split">
                  <div className="signup-form-row">
                    <label htmlFor="weight">Weight (kg)</label>
                    <input id="weight" name="weight" type="number" step="0.1" inputMode="decimal" className="signup-input" placeholder="84" required />
                  </div>
                  <div className="signup-form-row">
                    <label htmlFor="waist">Waist (in)</label>
                    <input id="waist" name="waist" type="number" step="0.1" inputMode="decimal" className="signup-input" placeholder="36" required />
                  </div>
                </div>

                <div className="signup-form-row">
                  <label htmlFor="glute">Glute (in)</label>
                  <input id="glute" name="glute" type="number" step="0.1" inputMode="decimal" className="signup-input" placeholder="44" required />
                </div>

                <div className="signup-form-row">
                  <label htmlFor="note">Vital health notes or dietary constraints?</label>
                  <textarea id="note" name="note" className="signup-textarea" placeholder="Injuries, specific timeline targets, or anomalies..." />
                </div>

                <button type="submit" className="signup-submit" disabled={submitting}>
                  {submitting ? "Processing Baselines..." : "Establish Protocol Entry"}
                  <span aria-hidden>→</span>
                </button>

                <p className="signup-fineprint">Secure verification submission.</p>

                {error && <p className="signup-note-error">{error}</p>}
                {success && <p className="signup-note-success">{success}</p>}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer className="footer">
        <div className="wrap">
          <div className="footer-row">
            <span className="footer-mark">Sculpt Protocol</span>
            <span className="hero-mark" style={{ margin: 0 }}>
              © {new Date().getFullYear()}
            </span>
          </div>
          <p className="disclaimer">{disclaimer}</p>
        </div>
      </footer>
    </div>
  );
}