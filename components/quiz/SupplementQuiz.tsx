"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/**
 * "Find your supplement" quiz — 3 questions → a research-backed starting point,
 * links into the matching guides/category, and captures the email via the same
 * /api/subscribe newsletter endpoint. No account needed (all client-side state).
 *
 * Recommendation copy is deliberately compliant ("may support", "is associated
 * with") — have the site's nutritionist review before launch.
 */
type Goal =
  | "sleep"
  | "energy"
  | "gut"
  | "stress"
  | "immunity"
  | "recovery";

type Option = { v: string; label: string; icon?: keyof typeof ICONS };
type Question = { key: "goal" | "diet" | "style"; q: string; opts: Option[] };

const QUESTIONS: Question[] = [
  {
    key: "goal",
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
  {
    key: "diet",
    q: "How would you describe your eating?",
    opts: [
      { v: "balanced", label: "Pretty balanced" },
      { v: "plant", label: "Mostly plant-based" },
      { v: "lowveg", label: "Low on fruit and veg" },
      { v: "unsure", label: "Honestly, not sure" },
    ],
  },
  {
    key: "style",
    q: "How do you like to take things?",
    opts: [
      { v: "simple", label: "Keep it simple, one thing" },
      { v: "routine", label: "A small daily routine" },
      { v: "evidence", label: "Whatever the evidence says" },
    ],
  },
];

const REC: Record<Goal, { name: string; why: string }> = {
  sleep: {
    name: "Magnesium glycinate",
    why: "A gentle, well-absorbed form that may support relaxation and winding down before bed.",
  },
  energy: {
    name: "A B12 and iron check",
    why: "Low B12 or iron are common, fixable causes of low energy — worth ruling out before stimulants.",
  },
  gut: {
    name: "Fibre and a daily probiotic",
    why: "Most of us fall short on fibre; pairing it with a probiotic may support digestive comfort.",
  },
  stress: {
    name: "Magnesium with L-theanine",
    why: "A calm-focus pairing that is associated with feeling steadier and less wired.",
  },
  immunity: {
    name: "Vitamin D and zinc",
    why: "Two of the most evidence-backed nutrients for normal immune function, especially in winter.",
  },
  recovery: {
    name: "Creatine and electrolytes",
    why: "Creatine monohydrate is the most studied performance supplement; electrolytes help you rehydrate.",
  },
};

const CATEGORY_FOR: Record<Goal, string> = {
  sleep: "minerals",
  energy: "vitamins",
  gut: "gut-health",
  stress: "minerals",
  immunity: "vitamins",
  recovery: "sports-nutrition",
};

const DIET_TIP: Record<string, string> = {
  plant: "Since you eat mostly plant-based, also keep an eye on B12, iron and omega-3.",
  lowveg: "With less veg in the mix, a greens or fibre boost is an easy win.",
};

const ICONS = {
  moon: "M20 14a8 8 0 1 1-9-9 7 7 0 0 0 9 9Z",
  bolt: "M13 3 5 13h5l-1 8 8-11h-5l1-7Z",
  leaf: "M5 20c8 0 14-6 14-14C11 6 5 12 5 20Z",
  waves: "M3 8h10a2 2 0 1 0-2-2M3 12h13a2 2 0 1 1-2 2M3 16h7a2 2 0 1 1-2 2",
  shield: "M12 3 5 6v5c0 4 3 7 7 8 4-1 7-4 7-8V6l-7-3Z",
  bar: "M4 9v6M7 8v8M17 8v8M20 9v6M7 12h10",
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

export function SupplementQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "loading" | "done">(
    "idle",
  );
  const [emailMsg, setEmailMsg] = useState("No spam. Unsubscribe anytime.");
  const [live, setLive] = useState("");

  const questionRef = useRef<HTMLHeadingElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const interacted = useRef(false);

  const total = QUESTIONS.length;
  const done = step >= total;
  const progress = Math.round((Math.min(step, total) / total) * 100);

  // Move focus + announce on each transition, but never on first mount.
  useEffect(() => {
    if (!interacted.current) return;
    if (done) {
      setLive(
        `Your result: ${REC[answers.goal as Goal]?.name ?? "your recommendation"}.`,
      );
      resultRef.current?.focus();
    } else {
      questionRef.current?.focus();
    }
  }, [step, done, answers]);

  function choose(key: string, value: string) {
    interacted.current = true;
    setAnswers((a) => ({ ...a, [key]: value }));
    setStep((s) => s + 1);
  }

  function restart() {
    interacted.current = true;
    setAnswers({});
    setStep(0);
    setEmail("");
    setEmailStatus("idle");
    setEmailMsg("No spam. Unsubscribe anytime.");
  }

  async function subscribe(e: React.FormEvent) {
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
  }

  return (
    <div className="card mx-auto max-w-xl p-6 sm:p-8">
      <div aria-live="polite" className="sr-only">
        {live}
      </div>
      <div className="flex items-center justify-between">
        <span className="eyebrow">Find your supplement</span>
        <span className="log-stamp">
          {done ? "Result" : `Q${step + 1} / ${total}`}
        </span>
      </div>
      <div className="mt-3 h-1 rounded-full bg-line">
        <div
          className="h-1 rounded-full bg-accent transition-all duration-300"
          style={{ width: `${done ? 100 : progress}%` }}
        />
      </div>

      {!done ? (
        <div className="mt-6">
          <h2
            ref={questionRef}
            tabIndex={-1}
            className="font-display text-xl text-ink outline-none"
          >
            {QUESTIONS[step].q}
          </h2>
          <div className="mt-4 space-y-2.5">
            {QUESTIONS[step].opts.map((o) => (
              <button
                key={o.v}
                type="button"
                onClick={() => choose(QUESTIONS[step].key, o.v)}
                className="flex w-full items-center gap-3 rounded-card border border-line bg-surface px-4 py-3.5 text-left text-md text-ink transition-colors hover:border-accent"
              >
                {o.icon && <Icon name={o.icon} />}
                <span>{o.label}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div ref={resultRef} tabIndex={-1} className="outline-none">
          <ResultView
            goal={answers.goal as Goal}
            dietTip={DIET_TIP[answers.diet]}
            email={email}
            setEmail={setEmail}
            emailStatus={emailStatus}
            emailMsg={emailMsg}
            subscribe={subscribe}
            restart={restart}
          />
        </div>
      )}
    </div>
  );
}

function ResultView({
  goal,
  dietTip,
  email,
  setEmail,
  emailStatus,
  emailMsg,
  subscribe,
  restart,
}: {
  goal: Goal;
  dietTip?: string;
  email: string;
  setEmail: (v: string) => void;
  emailStatus: "idle" | "loading" | "done";
  emailMsg: string;
  subscribe: (e: React.FormEvent) => void;
  restart: () => void;
}) {
  const rec = REC[goal] ?? REC.sleep;
  const category = CATEGORY_FOR[goal] ?? "general-nutrition";

  return (
    <div className="mt-6">
      <p className="text-sm text-ink-soft">Based on your answers, start with</p>
      <p className="mt-1 font-display text-2xl text-ink">{rec.name}</p>
      <p className="mt-3 text-md text-ink-soft">{rec.why}</p>

      {dietTip && (
        <div className="mt-4 rounded-card bg-accent-soft px-4 py-3 text-sm text-ink">
          {dietTip}
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        <Link href={`/category/${category}`} className="btn-primary">
          Read the guides
        </Link>
        <Link href={`/articles?category=${category}`} className="btn-secondary">
          See our top picks
        </Link>
      </div>

      <div className="mt-6 border-t border-line pt-5">
        {emailStatus === "done" ? (
          <p className="text-sm text-accent">
            Thanks — check your inbox to confirm and grab your free guide.
          </p>
        ) : (
          <>
            <p className="mb-2 text-sm text-ink">
              Want this emailed to you, plus a free starter guide?
            </p>
            <form onSubmit={subscribe} className="flex flex-wrap gap-2">
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
                {emailStatus === "loading" ? "Sending…" : "Send it"}
              </button>
            </form>
            <p className="log-stamp mt-2">{emailMsg}</p>
          </>
        )}
      </div>

      <button
        type="button"
        onClick={restart}
        className="mt-5 text-sm text-ink-soft underline hover:text-accent"
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
