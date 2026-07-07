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
} from "../components/content";
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

function formatTravelDate(dateStr: string) {
  const target = new Date(dateStr + "T00:00:00");
  return target.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
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
  const [weight, setWeight] = useState("");
  const [waist, setWaist] = useState("");
  const [glute, setGlute] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetch("/api/checkin")
      .then((res) => (res.ok ? res.json() : { entries: [] }))
      .then((data) => setCheckIns(data.entries || []))
      .catch(() => setCheckIns([]));
  }, []);

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

  async function handleCheckIn(e: React.FormEvent) {
    e.preventDefault();

    if (!weight.trim() || !waist.trim() || !glute.trim()) {
      setStatus("error");
      setErrorMsg("Please add weight, waist, and glute measurements.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weight: Number(weight),
          waist: Number(waist),
          glute: Number(glute),
          note,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Something went wrong.");
      }

      const data = await res.json();
      setCheckIns((prev) => [
        {
          _id: data.id,
          weight: Number(weight),
          waist: Number(waist),
          glute: Number(glute),
          note,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      setStatus("success");
      setWeight("");
      setWaist("");
      setGlute("");
      setNote("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  }

  const gaugeFillPct =
    activePhase < 0 ? 0 : ((activePhase + 1) / phases.length) * 100;

  const latestCheckIn = checkIns[0];
  const daysLeft = daysUntil(profile.travelDate);

  function statProgressPct(
    current: number,
    goal: number,
    direction: "up" | "down",
    latestValue: number | undefined
  ) {
    const value = latestValue ?? current;
    if (current === goal) return 100;
    const pct =
      direction === "down"
        ? ((current - value) / (current - goal)) * 100
        : ((value - current) / (goal - current)) * 100;
    return Math.max(0, Math.min(100, pct));
  }

  return (
    <div className="sculpt">
      <nav className="nav">
        <div className="wrap nav-row">
          <Link href="/ayo" className="nav-mark">
            Sculpt <span>Protocol</span>
          </Link>
          <a className="nav-cta" href="#checkin">
            Start Your Journey
          </a>
        </div>
      </nav>

      {/* ---------- HERO ---------- */}
      <header className="hero">
        <div className="wrap">
          <p className="hero-mark">File No. AYO-07 · Ayomide's Body Recomposition</p>
          <h1 className="hero-title">
            Ayomide's
            <br />
            Sculpt <em>Journey</em>
          </h1>

          <p className="hero-sub">
            A structured, in-person 7-week transformation built around her body,
            her schedule, and one clear deadline: touching down abroad feeling
            strong, confident, and ready - not rushed or overworked to get there.
          </p>
          <div className="hero-actions">
            <a className="btn-primary" href="#checkin">
              Log This Week
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
              <div className="readout-label">She Flies On</div>
              <div className="readout-value">{formatTravelDate(profile.travelDate)}</div>
            </div>
          </div>
        </div>
      </header>

      {/* ---------- PROFILE ---------- */}
      <section className="section" id="profile">
        <div className="wrap">
          <div className="eyebrow">Her File</div>
          <h2 className="section-title">Profile &amp; Goal</h2>

          <div className="profile-grid" style={{ marginTop: 48 }} data-reveal>
            <div className="profile-photo">
              <img src={profile.photos.profile} alt={profile.name} />
              <span className="profile-photo-tag">{profile.name}</span>
            </div>

            <div className="profile-info">
              <div className="countdown-badge">
                ✈ {daysLeft > 0 ? `${daysLeft} days` : "Travel day"} until she
                flies · {formatTravelDate(profile.travelDate)}
              </div>
              <h3 className="profile-name">{profile.fullName}</h3>
              <p className="profile-tagline">
                Seven weeks of in-person coaching, tracked week by week, so
                she steps on that flight feeling like her strongest self.
              </p>

              <div className="stat-cards">
                {profile.stats.map((stat) => {
                  const key = stat.label.toLowerCase() as
                    | "weight"
                    | "waist"
                    | "glute";
                  const latestValue = latestCheckIn?.[key];
                  const pct = statProgressPct(
                    stat.current,
                    stat.goal,
                    stat.direction,
                    latestValue
                  );
                  return (
                    <div className="stat-card" key={stat.label}>
                      <div className="stat-card-label">{stat.label}</div>
                      <div className="stat-card-row">
                        <span className="stat-current">
                          {latestValue ?? stat.current}
                          {stat.unit}
                        </span>
                        <span className="stat-arrow">
                          {stat.direction === "down" ? "↓" : "↑"}
                        </span>
                        <span className="stat-goal">
                          {stat.goal}
                          {stat.unit} goal
                        </span>
                      </div>
                      <div className="stat-bar">
                        <div
                          className="stat-bar-fill"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- OVERVIEW ---------- */}
      <section className="section">
        <div className="wrap">
          <div className="eyebrow">Overview</div>
          <h2 className="overview-title" data-reveal>
            This program is designed for someone starting from an inconsistent routine.
            We begin with simple movement, then gradually build strength, tone, and
            stamina - without overwhelming the body or mindset.
          </h2>

          <div className="overview-grid">
            <div className="outcome-cell" data-reveal>
<b>Composition</b>
Gradual fat reduction, improved waist definition, and glute activation through consistency.
            </div>
            <div className="outcome-cell" data-reveal>
<b>Composition</b>
Gradual fat reduction, improved waist definition, and glute activation through consistency.
            </div>
            <div className="outcome-cell" data-reveal>
<b>Carryover</b>
A sustainable active lifestyle that fits travel, work, and real life.
            </div>
          </div>
        </div>
      </section>

      <section className="section">
      <div className="wrap">
        <div className="eyebrow">Movement Style</div>
        <h2 className="section-title">Built Around Real Life</h2>

        <div className="overview-grid">
          <div className="outcome-cell" data-reveal>
            <b>Home Sessions</b>
            Short structured workouts that don't require equipment or gym pressure.
          </div>

          <div className="outcome-cell" data-reveal>
            <b>Outdoor Activity</b>
            Walking, light jogging, and movement-based cardio sessions.
          </div>

          <div className="outcome-cell" data-reveal>
            <b>Consistency Focus</b>
            Designed to work even on low-energy or busy days.
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
          <h2 className="section-title">Week 1 &amp; Sept 5</h2>
          <p className="hero-sub" style={{ marginTop: 14, marginBottom: 40 }}>
            Progress photographs are part of the file. Drop{" "}
            <code>before.jpg</code> and <code>after.jpg</code> into{" "}
            <code>/public/images/</code> and they'll show up here.
          </p>

          <div className="photo-gallery" data-reveal>
            <div className="photo-frame">
              <span className="photo-frame-tag">Now</span>
              <img src={profile.photos.before} alt={`${profile.name} - starting point`} />
            </div>
            <div className="photo-frame">
              <span className="photo-frame-tag">Sept 5 Goal</span>
              <img src={profile.photos.after} alt={`${profile.name} - goal look`} />
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

      {/* ---------- IDEAL CANDIDATE ---------- */}
      <section className="section">
        <div className="wrap">
          <div className="eyebrow">Why This Protocol</div>
          <h2 className="section-title">Built For Her Goal</h2>
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
          <div className="eyebrow">The Investment</div>
          <h2 className="section-title">All In, For Seven Weeks</h2>

          <div className="price-card" style={{ marginTop: 40 }} data-reveal>
            <div>
              <div className="price-figure">
                {formatNaira(investment.low)} – {formatNaira(investment.high)}
              </div>
              <div className="price-note">
                One-time investment for the full seven-week cycle, in person.
              </div>
              <p className="price-personal-note">{investment.note}</p>
              <ul className="price-includes">
                {investment.includes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <a className="btn-primary" href="#checkin">
              Log This Week
            </a>
          </div>
        </div>
      </section>

      {/* ---------- WEEKLY CHECK-IN ---------- */}
      <section className="section" id="checkin">
        <div className="wrap">
          <div className="eyebrow">Her Progress Journal</div>
          <h2 className="section-title">Weekly Check-In</h2>
          <p className="hero-sub" style={{ marginTop: 14, marginBottom: 0 }}>
            Log her measurements after every session. The profile card up top
            updates from whatever you enter here.
          </p>

          <div className="contact-grid" style={{ marginTop: 48 }}>
            <form
              className="checkin-form"
              onSubmit={handleCheckIn}
              data-reveal
              noValidate
            >
              <div className="form-row">
                <label htmlFor="weight">Weight (kg)</label>
                <input
                  id="weight"
                  name="weight"
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  placeholder="90"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
              <div className="form-row">
                <label htmlFor="waist">Waist (in)</label>
                <input
                  id="waist"
                  name="waist"
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  placeholder="42"
                  value={waist}
                  onChange={(e) => setWaist(e.target.value)}
                />
              </div>
              <div className="form-row">
                <label htmlFor="glute">Glute (in)</label>
                <input
                  id="glute"
                  name="glute"
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  placeholder="44"
                  value={glute}
                  onChange={(e) => setGlute(e.target.value)}
                />
              </div>
              <div className="form-row">
                <label htmlFor="note">Note (optional)</label>
                <input
                  id="note"
                  name="note"
                  type="text"
                  placeholder="Felt strong today, upped the squat load"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
              <button
                className="submit-btn"
                type="submit"
                disabled={status === "loading"}
              >
                {status === "loading" ? "Saving..." : "Save This Week"}
              </button>
              {status === "success" && (
                <p className="submit-note">Logged! Her profile card is updated.</p>
              )}
              {status === "error" && (
                <p className="submit-note submit-note-error">{errorMsg}</p>
              )}
            </form>

            <div className="checkin-log">
              <div className="contact-direct-title">Her History</div>
              {checkIns.length === 0 ? (
                <p className="checkin-empty">
                  No check-ins logged yet - the first entry starts her
                  progress trail.
                </p>
              ) : (
                <div className="checkin-list">
                  {checkIns.map((entry, i) => (
                    <div className="checkin-entry" key={entry._id || i}>
                      <div className="checkin-entry-date">
                        {entry.createdAt
                          ? new Date(entry.createdAt).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric" }
                            )
                          : "-"}
                      </div>
                      <div className="checkin-entry-stats">
                        <span>{entry.weight}kg</span>
                        <span>{entry.waist}in waist</span>
                        <span>{entry.glute}in glute</span>
                      </div>
                      {entry.note && (
                        <div className="checkin-entry-note">{entry.note}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="contact-direct" style={{ marginTop: 32 }}>
            <div className="contact-direct-title">
              Message Coach {contact.coachName}
            </div>
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