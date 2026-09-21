"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  DETAILS,
  FLOW,
  REC_NAME,
  CATEGORY_FOR,
  type Goal,
  type GoalDetail,
} from "./quizContent";

/**
 * "Find your supplement" — a delightful, Noom-style multi-step quiz.
 *
 * One question per screen, tap-to-advance, warm reactions, reassuring "coach"
 * interstitials, and a "building your plan" moment for anticipation. The result
 * shows a free teaser; the in-depth breakdown is unlocked with
 * an email signup (all client-side; subscribe hits /api/subscribe).
 *
 * All recommendation copy is deliberately compliant and was compliance-audited
 * (see quizContent.ts). Information only — not medical advice.
 */

/* ------------------------------------------------------------------ icons */

const ICONS = {
  moon: "M20 14a8 8 0 1 1-9-9 7 7 0 0 0 9 9Z",
  bolt: "M13 3 5 13h5l-1 8 8-11h-5l1-7Z",
  leaf: "M5 20c8 0 14-6 14-14C11 6 5 12 5 20Z",
  waves: "M3 8h10a2 2 0 1 0-2-2M3 12h13a2 2 0 1 1-2 2M3 16h7a2 2 0 1 1-2 2",
  shield: "M12 3 5 6v5c0 4 3 7 7 8 4-1 7-4 7-8V6l-7-3Z",
  bar: "M4 9v6M7 8v8M17 8v8M20 9v6M7 12h10",
  battery: "M2 9h13v6H2z M18 11v2 M4 11h2v2H4z",
  zigzag: "M3 15l4-5 3 4 4-6 4 5",
  spark: "M12 3v4 M12 17v4 M3 12h4 M17 12h4 M5.6 5.6l2.8 2.8 M15.6 15.6l2.8 2.8 M18.4 5.6l-2.8 2.8 M8.4 15.6l-2.8 2.8",
  smile: "M12 3.5a8.5 8.5 0 1 1 0 17 8.5 8.5 0 0 1 0-17 M8.5 14a4 4 0 0 0 7 0 M9 10h.01 M15 10h.01",
  ring: "M12 4.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15z",
  calendar: "M4.5 6h15v14h-15z M4.5 10h15 M9 4v3 M15 4v3",
  flask: "M9.5 3.5h5 M11 3.5v6l-4.2 7.4a2 2 0 0 0 1.8 3h6.8a2 2 0 0 0 1.8-3L13 9.5v-6 M8 14h8",
} as const;

function Icon({ name }: { name: keyof typeof ICONS }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5 shrink-0 text-accent"
      aria-hidden="true"
    >
      <path d={ICONS[name]} />
    </svg>
  );
}

function Check({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className={className ?? "mt-0.5 h-4 w-4 shrink-0 text-accent"}
      aria-hidden="true"
    >
      <path
        d="M3.5 8.5l3 3 6-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Lock() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5 shrink-0 text-accent"
      aria-hidden="true"
    >
      <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

/* -------------------------------------------------------------- questions */

type QKey = "goal" | "feeling" | "diet" | "activity" | "style";
type Opt = { v: string; label: string; icon?: keyof typeof ICONS };

const QUESTION: Record<QKey, { q: string; opts: Opt[] }> = {
  goal: {
    q: "What would you like to work on first?",
    opts: [
      { v: "sleep", label: "Better sleep", icon: "moon" },
      { v: "energy", label: "More energy", icon: "bolt" },
      { v: "gut", label: "Gut comfort", icon: "leaf" },
      { v: "stress", label: "Less stress", icon: "waves" },
      { v: "immunity", label: "Stronger immunity", icon: "shield" },
      { v: "recovery", label: "Workout recovery", icon: "bar" },
    ],
  },
  feeling: {
    q: FLOW.feeling.question,
    opts: [
      { v: "empty", label: FLOW.feeling.labels.empty, icon: "battery" },
      { v: "updown", label: FLOW.feeling.labels.updown, icon: "zigzag" },
      { v: "stressed", label: FLOW.feeling.labels.stressed, icon: "spark" },
      { v: "good", label: FLOW.feeling.labels.good, icon: "smile" },
    ],
  },
  diet: {
    q: "How would you describe your eating?",
    opts: [
      { v: "balanced", label: "Pretty balanced", icon: "leaf" },
      { v: "plant", label: "Mostly plant-based", icon: "leaf" },
      { v: "lowveg", label: "Low on fruit and veg", icon: "waves" },
      { v: "unsure", label: "Honestly, not sure", icon: "smile" },
    ],
  },
  activity: {
    q: FLOW.activity.question,
    opts: [
      { v: "rest", label: FLOW.activity.labels.rest, icon: "moon" },
      { v: "light", label: FLOW.activity.labels.light, icon: "waves" },
      { v: "active", label: FLOW.activity.labels.active, icon: "bar" },
    ],
  },
  style: {
    q: "How do you like to take things?",
    opts: [
      { v: "simple", label: "Keep it simple, one thing", icon: "ring" },
      { v: "routine", label: "A small daily routine", icon: "calendar" },
      { v: "evidence", label: "Whatever the evidence says", icon: "flask" },
    ],
  },
};

type Step =
  | { kind: "q"; key: QKey }
  | { kind: "reaction" }
  | { kind: "coach"; which: 1 | 2 }
  | { kind: "building" }
  | { kind: "result" };

const SEQUENCE: Step[] = [
  { kind: "q", key: "goal" },
  { kind: "reaction" },
  { kind: "q", key: "feeling" },
  { kind: "coach", which: 1 },
  { kind: "q", key: "diet" },
  { kind: "q", key: "activity" },
  { kind: "q", key: "style" },
  { kind: "coach", which: 2 },
  { kind: "building" },
  { kind: "result" },
];

const BUILDING_INDEX = SEQUENCE.findIndex((s) => s.kind === "building");
const TOTAL_Q = SEQUENCE.filter((s) => s.kind === "q").length;

// Word used in the personalised "Building your ___ plan" heading.
const GOAL_WORD: Record<Goal, string> = {
  sleep: "sleep",
  energy: "energy",
  gut: "gut",
  stress: "calm",
  immunity: "immunity",
  recovery: "recovery",
};

/* ------------------------------------------------------------------ main */

export function SupplementQuiz({
  liveCategories,
}: {
  /** Categories that currently have at least one published article. */
  liveCategories?: string[];
} = {}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "loading" | "done">("idle");
  const [emailMsg, setEmailMsg] = useState("No spam. Unsubscribe anytime.");
  const [live, setLive] = useState("");

  const interacted = useRef(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const breakdownRef = useRef<HTMLDivElement>(null);

  const step = SEQUENCE[index];
  const goal = (answers.goal as Goal) ?? "sleep";

  const advance = useCallback(() => {
    interacted.current = true;
    setIndex((i) => Math.min(i + 1, SEQUENCE.length - 1));
  }, []);

  const back = useCallback(() => {
    interacted.current = true;
    setIndex((i) => {
      let j = i - 1;
      while (j > 0 && SEQUENCE[j].kind !== "q") j--;
      return Math.max(0, j);
    });
  }, []);

  const choose = useCallback((key: string, value: string) => {
    interacted.current = true;
    setAnswers((a) => ({ ...a, [key]: value }));
    setIndex((i) => Math.min(i + 1, SEQUENCE.length - 1));
  }, []);

  const restart = useCallback(() => {
    interacted.current = true;
    setAnswers({});
    setEmail("");
    setEmailStatus("idle");
    setEmailMsg("No spam. Unsubscribe anytime.");
    setIndex(0);
  }, []);

  const subscribe = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setEmailStatus("loading");
      try {
        const res = await fetch("/api/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setEmailStatus("idle");
          setEmailMsg(data.error || "Something went wrong. Try again.");
          return;
        }
        setEmailStatus("done");
      } catch {
        setEmailStatus("idle");
        setEmailMsg("Network error. Try again.");
      }
    },
    [email],
  );

  // Focus + announce on each step change (never on first mount).
  useEffect(() => {
    if (!interacted.current) return;
    // Keep the quiz card anchored in view as the screen swaps, then move focus
    // without letting the browser double-scroll.
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    cardRef.current?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
    screenRef.current?.focus({ preventScroll: true });
    const s = SEQUENCE[index];
    if (s.kind === "result") setLive(`Your starting point: ${REC_NAME[goal]}.`);
    else if (s.kind === "q") setLive(QUESTION[s.key].q);
    else if (s.kind === "building") setLive(`${FLOW.building.heading}. One moment.`);
    else if (s.kind === "reaction") setLive(FLOW.goalReactions[goal]);
    else if (s.kind === "coach")
      setLive((s.which === 1 ? FLOW.interstitial1 : FLOW.interstitial2).heading);
  }, [index, goal]);

  // Announce + move focus into the breakdown the moment it unlocks.
  useEffect(() => {
    if (emailStatus === "done") {
      setLive("Success — your full breakdown is unlocked below.");
      breakdownRef.current?.focus();
    }
  }, [emailStatus]);

  const progress = Math.round(
    ((Math.min(index, BUILDING_INDEX) + 1) / (BUILDING_INDEX + 1)) * 100,
  );

  const headerRight =
    step.kind === "q"
      ? `Q${SEQUENCE.slice(0, index + 1).filter((s) => s.kind === "q").length} / ${TOTAL_Q}`
      : step.kind === "building"
        ? "Building"
        : step.kind === "result"
          ? "Result"
          : "•••";

  return (
    <div ref={cardRef} className="card mx-auto max-w-xl scroll-mt-24 p-6 sm:p-8">
      <div aria-live="polite" className="sr-only">
        {live}
      </div>

      {step.kind !== "result" && (
        <>
          <div className="flex items-center justify-between">
            <span className="eyebrow">Find your supplement</span>
            <span className="log-stamp">{headerRight}</span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full bg-accent transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </>
      )}

      <div
        key={index}
        ref={screenRef}
        tabIndex={-1}
        className="animate-fade-up mt-6 outline-none"
      >
        {step.kind === "q" && (
          <QuestionCard
            qkey={step.key}
            current={answers[step.key]}
            onChoose={choose}
            onBack={back}
            showBack={index > 0}
          />
        )}
        {step.kind === "reaction" && (
          <ReactionScreen text={FLOW.goalReactions[goal]} onContinue={advance} />
        )}
        {step.kind === "coach" && (
          <CoachScreen
            data={step.which === 1 ? FLOW.interstitial1 : FLOW.interstitial2}
            onContinue={advance}
          />
        )}
        {step.kind === "building" && (
          <BuildingScreen goal={goal} onDone={advance} />
        )}
        {step.kind === "result" && (
          <ResultView
            goal={goal}
            answers={answers}
            email={email}
            setEmail={setEmail}
            emailStatus={emailStatus}
            emailMsg={emailMsg}
            subscribe={subscribe}
            restart={restart}
            breakdownRef={breakdownRef}
            liveCategories={liveCategories}
          />
        )}
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- screens */

function QuestionCard({
  qkey,
  current,
  onChoose,
  onBack,
  showBack,
}: {
  qkey: QKey;
  current?: string;
  onChoose: (key: string, value: string) => void;
  onBack: () => void;
  showBack: boolean;
}) {
  const { q, opts } = QUESTION[qkey];
  // `picked` = the option tapped this visit (drives the confirm animation);
  // `current` = a previously chosen answer, shown highlighted when you go Back.
  const [picked, setPicked] = useState<string | null>(null);
  const timer = useRef<number | null>(null);
  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    [],
  );

  const active = picked ?? current ?? null;
  const handle = (v: string) => {
    if (picked) return; // ignore double-taps mid-transition
    setPicked(v);
    timer.current = window.setTimeout(() => onChoose(qkey, v), 300);
  };

  return (
    <div>
      <h2 className="font-display text-xl leading-snug text-ink sm:text-2xl">{q}</h2>
      <div className="mt-5 space-y-2.5">
        {opts.map((o) => {
          const isActive = o.v === active;
          return (
            <button
              key={o.v}
              type="button"
              onClick={() => handle(o.v)}
              aria-pressed={isActive}
              className={`group flex w-full items-center gap-3 rounded-card border px-4 py-3.5 text-left text-md text-ink transition-all ${
                isActive
                  ? "border-accent bg-accent-soft"
                  : "border-line bg-surface hover:-translate-y-0.5 hover:border-accent hover:shadow-[0_8px_24px_-16px_rgba(28,37,32,0.4)]"
              }`}
            >
              {o.icon && <Icon name={o.icon} />}
              <span className="flex-1">{o.label}</span>
              {isActive ? (
                <Check className="h-5 w-5 text-accent" />
              ) : (
                <span
                  className="text-line transition-all group-hover:translate-x-1 group-hover:text-accent"
                  aria-hidden="true"
                >
                  →
                </span>
              )}
            </button>
          );
        })}
      </div>
      {showBack && (
        <button
          type="button"
          onClick={onBack}
          className="mt-5 text-sm text-ink-soft underline hover:text-accent"
        >
          ← Back
        </button>
      )}
    </div>
  );
}

/** Auto-advance after `ms`, unless the user prefers reduced motion. */
function useAutoAdvance(ms: number, onDone: () => void) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const t = window.setTimeout(onDone, ms);
    return () => window.clearTimeout(t);
    // run once per mount; onDone is stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

function ReactionScreen({ text, onContinue }: { text: string; onContinue: () => void }) {
  useAutoAdvance(1900, onContinue);
  return (
    <div className="py-4 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft">
        <Check className="h-6 w-6 text-accent" />
      </div>
      <p className="mx-auto mt-5 max-w-sm font-display text-xl leading-snug text-ink">
        {text}
      </p>
      <button type="button" onClick={onContinue} className="btn-primary mt-6">
        Continue
      </button>
    </div>
  );
}

function CoachScreen({
  data,
  onContinue,
}: {
  data: { eyebrow: string; heading: string; body: string; cta: string };
  onContinue: () => void;
}) {
  return (
    <div className="relative overflow-hidden rounded-card bg-accent-soft p-6 text-center sm:p-8">
      <div className="notebook-lines absolute inset-0 opacity-30" aria-hidden="true" />
      <div className="relative">
        <p className="eyebrow">{data.eyebrow}</p>
        <h2 className="mt-2 font-display text-xl leading-snug text-ink sm:text-2xl">
          {data.heading}
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-md text-ink-soft">{data.body}</p>
        <button type="button" onClick={onContinue} className="btn-primary mt-6">
          {data.cta} →
        </button>
      </div>
    </div>
  );
}

function BuildingScreen({ goal, onDone }: { goal: Goal; onDone: () => void }) {
  const [pct, setPct] = useState(0);
  const [msg, setMsg] = useState(0);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const totalMs = reduce ? 900 : 2600;
    const start = Date.now();
    const n = FLOW.building.messages.length;
    // Drive from elapsed wall-clock time so the screen still finishes on
    // schedule even if a backgrounded tab throttles the interval.
    const id = window.setInterval(() => {
      const t = Math.min(1, (Date.now() - start) / totalMs);
      setPct(Math.round(t * 100));
      setMsg(Math.min(n - 1, Math.floor(t * n)));
      if (t >= 1) window.clearInterval(id);
    }, 60);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (pct >= 100) {
      const t = window.setTimeout(onDone, 400);
      return () => window.clearTimeout(t);
    }
  }, [pct, onDone]);

  const R = 52;
  const C = 2 * Math.PI * R;

  return (
    <div className="py-4 text-center">
      <p className="eyebrow">Almost ready</p>
      <h2 className="mt-2 font-display text-2xl text-ink">
        Building your {GOAL_WORD[goal]} plan
      </h2>

      <div className="relative mx-auto mt-6 h-32 w-32">
        <svg viewBox="0 0 120 120" className="h-32 w-32 -rotate-90">
          <circle cx="60" cy="60" r={R} fill="none" stroke="var(--line)" strokeWidth="8" />
          <circle
            cx="60"
            cy="60"
            r={R}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - Math.min(pct, 100) / 100)}
            style={{ transition: "stroke-dashoffset 0.1s linear" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-display text-2xl text-ink">
          {Math.round(Math.min(pct, 100))}%
        </div>
      </div>

      <p aria-live="polite" className="mx-auto mt-5 min-h-[1.5rem] max-w-xs text-md text-ink-soft">
        {FLOW.building.messages[msg]}
      </p>
    </div>
  );
}

/* ---------------------------------------------------------------- result */

function ResultView({
  goal,
  answers,
  email,
  setEmail,
  emailStatus,
  emailMsg,
  subscribe,
  restart,
  breakdownRef,
  liveCategories,
}: {
  goal: Goal;
  answers: Record<string, string>;
  email: string;
  setEmail: (v: string) => void;
  emailStatus: "idle" | "loading" | "done";
  emailMsg: string;
  subscribe: (e: React.FormEvent) => void;
  restart: () => void;
  breakdownRef: React.RefObject<HTMLDivElement>;
  liveCategories?: string[];
}) {
  const detail = DETAILS[goal];
  const recName = REC_NAME[goal];
  const category = CATEGORY_FOR[goal];
  // Only send people to a topic that actually has guides; otherwise an empty
  // "No articles yet" page would undercut the result.
  const hasGuides = !liveCategories || liveCategories.includes(category);
  const unlocked = emailStatus === "done";

  const tips = [
    answers.diet ? FLOW.dietTips[answers.diet as keyof typeof FLOW.dietTips] : null,
    answers.feeling
      ? FLOW.feeling.tips[answers.feeling as keyof typeof FLOW.feeling.tips]
      : null,
    answers.activity
      ? FLOW.activity.tips[answers.activity as keyof typeof FLOW.activity.tips]
      : null,
  ].filter(Boolean) as string[];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <span className="eyebrow">Your starting point</span>
        <span className="log-stamp">Result</span>
      </div>

      <p className="text-sm text-accent">{FLOW.goalReactions[goal]}</p>
      <h2 className="mt-2 font-display text-2xl leading-tight text-ink sm:text-3xl">
        {recName}
      </h2>
      <p className="mt-3 text-md text-ink-soft">{detail.teaser}</p>

      {tips.length > 0 && (
        <ul className="mt-4 space-y-2">
          {tips.map((t, i) => (
            <li
              key={i}
              className="flex gap-2.5 rounded-card bg-accent-soft px-4 py-2.5 text-sm text-ink"
            >
              <Check />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        {hasGuides ? (
          <>
            <Link href={`/category/${category}`} className="btn-primary">
              Read the guides
            </Link>
            <Link href={`/articles?category=${category}`} className="btn-secondary">
              See our top picks
            </Link>
          </>
        ) : (
          <Link href="/articles" className="btn-secondary">
            Browse all guides
          </Link>
        )}
      </div>

      <div className="mt-7">
        {unlocked ? (
          <FullBreakdown detail={detail} focusRef={breakdownRef} />
        ) : (
          <LockedPanel
            detail={detail}
            recName={recName}
            email={email}
            setEmail={setEmail}
            emailStatus={emailStatus}
            emailMsg={emailMsg}
            subscribe={subscribe}
          />
        )}
      </div>

      <button
        type="button"
        onClick={restart}
        className="mt-6 text-sm text-ink-soft underline hover:text-accent"
      >
        Start over
      </button>

      <p className="log-stamp mt-4">
        Information only, not medical advice. Talk to your clinician before
        starting a supplement.
      </p>
    </div>
  );
}

function LockedPanel({
  detail,
  recName,
  email,
  setEmail,
  emailStatus,
  emailMsg,
  subscribe,
}: {
  detail: GoalDetail;
  recName: string;
  email: string;
  setEmail: (v: string) => void;
  emailStatus: "idle" | "loading" | "done";
  emailMsg: string;
  subscribe: (e: React.FormEvent) => void;
}) {
  const inside = [
    ...detail.full.sections.map((s) => s.heading),
    "Quick facts & timing",
    "Food-first sources",
    "What to watch for",
  ];

  return (
    <div className="overflow-hidden rounded-card border border-line">
      {/* blurred hint that there's more behind the gate */}
      <div className="relative max-h-24 overflow-hidden" aria-hidden="true">
        <p className="select-none p-5 text-sm text-ink-soft blur-[5px]">
          {detail.full.sections[0].body}
        </p>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface" />
      </div>

      <div className="border-t border-line p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <Lock />
          <p className="font-display text-lg text-ink">Unlock your full breakdown</p>
        </div>
        <p className="mt-1 text-sm text-ink-soft">
          Pop in your email to read the complete, in-depth guide to{" "}
          <strong className="text-ink">{recName}</strong> — free, and yours to keep.
        </p>

        <ul className="mt-4 grid gap-1.5 text-sm text-ink-soft sm:grid-cols-2">
          {inside.map((label) => (
            <li key={label} className="flex gap-2">
              <Check />
              <span>{label}</span>
            </li>
          ))}
        </ul>

        <form onSubmit={subscribe} className="mt-5 flex flex-wrap gap-2">
          <label htmlFor="quiz-email" className="sr-only">
            Email address
          </label>
          <input
            id="quiz-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="min-w-[180px] flex-1 rounded-card border border-line bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft/60"
          />
          <button
            type="submit"
            disabled={emailStatus === "loading"}
            className="btn-primary disabled:opacity-60"
          >
            {emailStatus === "loading" ? "Unlocking…" : "Unlock free"}
          </button>
        </form>
        <p className="log-stamp mt-2">{emailMsg}</p>
      </div>
    </div>
  );
}

function FullBreakdown({
  detail,
  focusRef,
}: {
  detail: GoalDetail;
  focusRef: React.RefObject<HTMLDivElement>;
}) {
  return (
    <div ref={focusRef} tabIndex={-1} className="animate-fade-up outline-none">
      <div className="mb-5 flex items-center gap-2 rounded-card bg-accent-soft px-4 py-2.5 text-sm text-accent">
        <Check className="h-4 w-4 text-accent" />
        <span>Unlocked — check your inbox to confirm your free starter guide.</span>
      </div>

      <div className="space-y-5">
        {detail.full.sections.map((s) => (
          <div key={s.heading}>
            <h3 className="font-display text-lg text-ink">{s.heading}</h3>
            <p className="mt-1 text-ink-soft">{s.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-card border border-line p-4 sm:p-5">
        <p className="eyebrow mb-3">Quick facts</p>
        <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
          {detail.full.quickFacts.map((f) => (
            <div key={f.label}>
              <dt className="log-stamp">{f.label}</dt>
              <dd className="mt-0.5 text-sm text-ink">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-5">
        <p className="eyebrow mb-2">Try food first</p>
        <ul className="flex flex-wrap gap-2">
          {detail.full.foodFirst.map((f) => (
            <li
              key={f}
              className="rounded-full bg-accent-soft px-3 py-1 text-sm text-ink"
            >
              {f}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5">
        <p className="eyebrow mb-2">What to watch for</p>
        <ul className="space-y-1.5">
          {detail.full.watchOuts.map((w) => (
            <li key={w} className="flex gap-2 text-sm text-ink-soft">
              <span className="mt-px font-mono text-highlightText" aria-hidden="true">
                !
              </span>
              <span>{w}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 rounded-card border border-line bg-bg px-4 py-3 text-sm text-ink-soft">
        {detail.full.clinicianNote}
      </div>
    </div>
  );
}
