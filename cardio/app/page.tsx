"use client";

import { useEffect, useState } from "react";
import { profile, reviews, disclaimer, offerings } from "./components/content";
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

  const [checkIns, setCheckIns] = useState<CheckInEntry[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetch("/api/checkin")
      .then((res) => (res.ok ? res.json() : { entries: [] }))
      .then((data) => setCheckIns(data.entries || []))
      .catch(() => setCheckIns([]));
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget; 
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

      formEl.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  // Not yet rendered anywhere below - computed for an upcoming
  // countdown/check-in log display.
  const latestCheckIn = checkIns[0];
  const daysLeft = daysUntil(profile.travelDate || "2026-09-10");

  return (
    <div className="sculpt">
      {/* ---------- NAVIGATION ---------- */}
      <nav className="nav">
        <div className="wrap nav-row">
          <Link href="/ayo" className="nav-mark">
            Sculpt <span>Protocol</span>
          </Link>
          <a className="nav-cta" href="#signup">
            Start Your Journey
          </a>
        </div>
      </nav>

      {/* ---------- HERO SECTION ---------- */}
      <header className="hero-photo">
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
              Gatwick feeling strong, confident, and ready - not rushed, with
              doubt, or overworked to get there.
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

      {/* ---------- MADE FOR YOU (dark break) ---------- */}
      <section className="sculpt-showcase-section" id="made-for-you">
        <div className="wrap">
          <div className="showcase-grid">
            <div className="showcase-content">
              <h2 className="showcase-title">
                Meticulous adjustments for a complex countdown.
              </h2>
              <p className="showcase-sub">
                Every metabolic profile, workout set, macro breakdown, and
                progression plan is tracked live to force body recomposition
                safely without over-exhausting your energy limits before
                deployment.
              </p>
            </div>

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
                  Covers biometrics analytics, tailored resistance metrics,
                  bespoke meal planning consultancy, equipment acquisition
                  advisory, and daily performance checks.
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
            <span className="hero-mark">© {new Date().getFullYear()}</span>
          </div>
          <p className="disclaimer hidden">{disclaimer}</p>
        </div>
      </footer>
    </div>
  );
}