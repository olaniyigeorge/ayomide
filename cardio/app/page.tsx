"use client";

import { useEffect, useRef, useState } from "react";
import {
  phases,
  monitoring,
  nutrition,
  idealCandidate,
  reviews,
  investment,
  contact,
  disclaimer,
  goalOptions,
} from "./components/content";
import "./globals.css";

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

export default function SculptProtocolPage() {
  useReveal();

  const [activePhase, setActivePhase] = useState(-1);
  const phaseRefs = useRef<Array<HTMLDivElement | null>>([]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");

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

  function toggleGoal(goal: string) {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim() || !phone.trim() || selectedGoals.length === 0) {
      setStatus("error");
      setErrorMsg("Please add your name, phone number, and pick at least one goal.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, goals: selectedGoals }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Something went wrong.");
      }

      setStatus("success");
      setName("");
      setPhone("");
      setSelectedGoals([]);
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  }

  const gaugeFillPct =
    activePhase < 0 ? 0 : ((activePhase + 1) / phases.length) * 100;

  return (
    <div className="sculpt">
      <nav className="nav">
        <div className="wrap nav-row">
          <span className="nav-mark">
            Sculpt <span>Protocol</span>™
          </span>
          <a className="nav-cta" href="#reach-us">
            Begin Assessment
          </a>
        </div>
      </nav>

      {/* ---------- HERO ---------- */}
      <header className="hero">
        <div className="wrap">
          <p className="hero-mark">File No. 07-WK · Body Recomposition</p>
          <h1 className="hero-title">
            The Sculpt
            <br />
            Prot<em>o</em>col™
          </h1>
          <p className="hero-sub">
            A seven-week recomposition methodology built on structured
            movement, progressive conditioning, and continuous monitoring -
            not fad diets or routines you can't sustain past week two.
          </p>
          <div className="hero-actions">
            <a className="btn-primary" href="#reach-us">
              Begin Assessment
            </a>
            <a className="btn-ghost" href="#phases">
              View the Protocol
            </a>
          </div>

          <div className="readout" data-reveal>
            <div className="readout-cell">
              <div className="readout-label">Duration</div>
              <div className="readout-value">7 Weeks</div>
            </div>
            <div className="readout-cell">
              <div className="readout-label">Investment</div>
              <div className="readout-value">₦120k – ₦150k</div>
            </div>
            <div className="readout-cell">
              <div className="readout-label">Phases</div>
              <div className="readout-value">I - V</div>
            </div>
          </div>
        </div>
      </header>

      {/* ---------- OVERVIEW ---------- */}
      <section className="section">
        <div className="wrap">
          <div className="eyebrow">Overview</div>
          <h2 className="overview-title" data-reveal>
            Every participant begins with a reading, not a guess. From there
            the protocol adapts to <em>your</em> fitness level, your goals,
            and your rate of progression.
          </h2>

          <div className="overview-grid">
            <div className="outcome-cell" data-reveal>
              <b>Composition</b>
              Reduced body fat, a stronger midsection, fuller glutes.
            </div>
            <div className="outcome-cell" data-reveal>
              <b>Capacity</b>
              Increased stamina, cardiovascular fitness, muscular endurance.
            </div>
            <div className="outcome-cell" data-reveal>
              <b>Carryover</b>
              Better posture, functional strength, sustainable habits.
            </div>
          </div>
        </div>
      </section>

      {/* ---------- PHASES (signature element) ---------- */}
      <section className="section" id="phases">
        <div className="wrap">
          <div className="eyebrow">The Protocol</div>
          <h2 className="section-title">Five Phases,
            <br />
            One Cycle
          </h2>

          <div className="phases-body" style={{ marginTop: 56 }}>
            <div className="gauge" style={{ height: "calc(100% - 30px)" }}>
              <div
                className="gauge-fill"
                style={{ height: `${gaugeFillPct}%` }}
              />
            </div>
            <div className="phase-list">
              {phases.map((phase, i) => (
                <div
                  key={phase.code}
                  className={`phase-row ${
                    i <= activePhase ? "is-active" : ""
                  }`}
                  data-phase-index={i}
                  ref={(el) => {
                    phaseRefs.current[i] = el;
                  }}
                  data-reveal
                >
                  <div className="phase-dot-col">
                    <div className="phase-dot" />
                  </div>
                  <div>
                    <div className="phase-head">
                      <span className="phase-numeral">{phase.numeral}</span>
                      <span className="phase-code">{phase.code}</span>
                    </div>
                    <h3 className="phase-title">{phase.title}</h3>
                    <p className="phase-summary">{phase.summary}</p>
                    <div className="phase-tags">
                      {phase.items.map((item) => (
                        <span className="phase-tag" key={item}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- MONITORING / NUTRITION ---------- */}
      <section className="section">
        <div className="wrap">
          <div className="eyebrow">Support Systems</div>
          <h2 className="section-title">Tracked &amp; Fuelled</h2>

          <div className="panels" style={{ marginTop: 48 }} data-reveal>
            <div className="panel">
              <div className="panel-title">Performance Monitoring</div>
              <ul className="panel-list">
                {monitoring.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </div>
            <div className="panel">
              <div className="panel-title">Nutritional Support</div>
              <ul className="panel-list">
                {nutrition.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- VISUAL LOG (before / after) ---------- */}
      <section className="section">
        <div className="wrap">
          <div className="eyebrow">Visual Log</div>
          <h2 className="section-title">Now &amp; Then</h2>
          <p className="hero-sub" style={{ marginTop: 14, marginBottom: 40 }}>
            Progress photographs are part of every participant's file. Swap
            these placeholders for real client images when ready.
          </p>

          <div className="photo-gallery" data-reveal>
            <div className="photo-frame">
              <span className="photo-frame-tag">Before</span>
              <img src="/images/before.jpg" alt="Before" />
            </div>
            <div className="photo-frame">
              <span className="photo-frame-tag">After</span>
              <img src="/images/after.jpg" alt="After" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- REVIEWS (sliding) ---------- */}
      <section className="reviews">
        <div className="wrap">
          <div className="eyebrow">Participant Logs</div>
          <h2 className="section-title">In Their Words</h2>
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

      {/* ---------- IDEAL CANDIDATE ---------- */}
      <section className="section">
        <div className="wrap">
          <div className="eyebrow">Is This For You</div>
          <h2 className="section-title">Ideal Candidate</h2>
          <div
            className="candidate-list"
            style={{ marginTop: 32 }}
            data-reveal
          >
            {idealCandidate.map((c) => (
              <span className="candidate-chip" key={c}>
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- PRICING ---------- */}
      <section className="section">
        <div className="wrap">
          <div className="eyebrow">Investment</div>
          <h2 className="section-title">Comprehensive 7-Week Program</h2>

          <div className="price-card" style={{ marginTop: 40 }} data-reveal>
            <div>
              <div className="price-figure">
                {formatNaira(investment.low)} – {formatNaira(investment.high)}
              </div>
              <div className="price-note">
                One-time investment for the full seven-week cycle.
              </div>
              <ul className="price-includes">
                {investment.includes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <a className="btn-primary" href="#reach-us">
              Begin Assessment
            </a>
          </div>
        </div>
      </section>

      {/* ---------- REACH US ---------- */}
      <section className="section" id="reach-us">
        <div className="wrap">
          <div className="eyebrow">Reach Us</div>
          <h2 className="section-title">Start Your File</h2>

          <div className="contact-grid" style={{ marginTop: 48 }}>
            <form onSubmit={handleSubmit} data-reveal noValidate>
              <div className="form-row">
                <label htmlFor="name">Full name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="form-row">
                <label htmlFor="phone">Phone number</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="080..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="form-row">
                <label>Goals (select all that apply)</label>
                <div className="checkbox-grid">
                  {goalOptions.map((goal) => (
                    <label className="checkbox-chip" key={goal}>
                      <input
                        type="checkbox"
                        checked={selectedGoals.includes(goal)}
                        onChange={() => toggleGoal(goal)}
                      />
                      <span>{goal}</span>
                    </label>
                  ))}
                </div>
              </div>
              <button
                className="submit-btn"
                type="submit"
                disabled={status === "loading"}
              >
                {status === "loading" ? "Sending..." : "Request Assessment"}
              </button>
              {status === "success" && (
                <p className="submit-note">
                  Received! We'll reach out to schedule your baseline
                  assessment.
                </p>
              )}
              {status === "error" && (
                <p className="submit-note submit-note-error">{errorMsg}</p>
              )}
            </form>

            <div className="contact-direct">
              <div className="contact-direct-title">Direct Contact</div>
              <a
                className="contact-link"
                href={contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp <span>Chat now</span>
              </a>
              <a className="contact-link" href={`tel:${contact.phone}`}>
                Call <span>{contact.phone}</span>
              </a>
              <a className="contact-link" href={`mailto:${contact.email}`}>
                Email <span>{contact.email}</span>
              </a>
              <a
                className="contact-link"
                href={contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram <span>@sculptprotocol</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer className="footer">
        <div className="wrap">
          <div className="footer-row">
            <span className="footer-mark">Sculpt Protocol™</span>
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