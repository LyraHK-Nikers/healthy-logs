"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/**
 * "Myth or Fact" nutrition game — guess whether each statement is a myth or a
 * fact, learn why. Educational + shareable; myth-busting builds trust.
 * Statements use compliant phrasing — have the nutritionist review them.
 */
type Card = { text: string; answer: "myth" | "fact"; why: string };

const CARDS: Card[] = [
  {
    text: "Eating after 8 pm automatically makes you gain weight.",
    answer: "myth",
    why: "Weight comes down to total energy over time, not the clock. Late snacking can lead to eating more, but the hour itself isn't the cause.",
  },
  {
    text: "Frozen vegetables are usually less nutritious than fresh.",
    answer: "myth",
    why: "Frozen veg is picked and frozen at peak ripeness, so it's often just as nutritious — sometimes more — than 'fresh' that's travelled for days.",
  },
  {
    text: "Everyone needs exactly eight glasses of water a day.",
    answer: "myth",
    why: "Needs vary with size, activity and climate, and food and other drinks count. Thirst and urine colour are better guides.",
  },
  {
    text: "Creatine is only useful for male bodybuilders.",
    answer: "myth",
    why: "Creatine monohydrate is one of the most studied supplements and is associated with strength and performance gains in many people, including women.",
  },
  {
    text: "Eating eggs spikes everyone's blood cholesterol.",
    answer: "myth",
    why: "For most people, dietary cholesterol has a modest effect; saturated and trans fats influence blood cholesterol more.",
  },
  {
    text: "Your liver and kidneys already handle 'detoxing' your body.",
    answer: "fact",
    why: "They do — which is why 'detox' teas and cleanses aren't needed to remove toxins.",
  },
  {
    text: "People who do resistance training generally need more protein.",
    answer: "fact",
    why: "Higher intakes (roughly 1.6 g/kg and up) are associated with better muscle support when you're training.",
  },
  {
    text: "Magnesium may help some people feel more relaxed.",
    answer: "fact",
    why: "It may support relaxation, especially if your intake is low — though the effect is usually modest, and it isn't a sleep medicine.",
  },
  {
    text: "Carbohydrates are inherently fattening.",
    answer: "myth",
    why: "No single nutrient is inherently fattening; total calories and overall diet quality are what matter.",
  },
  {
    text: "Most vitamin D is made when sunlight hits your skin.",
    answer: "fact",
    why: "Sunlight on skin is the main source for most people, which is why deficiency is common in darker months.",
  },
];

const DISCLAIMER = "Information only, not medical advice.";

export function MythGame() {
  const [index, setIndex] = useState(0);
  const [guess, setGuess] = useState<"myth" | "fact" | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [shareMsg, setShareMsg] = useState("");
  const [live, setLive] = useState("");

  const questionRef = useRef<HTMLParagraphElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef<HTMLDivElement>(null);
  const interacted = useRef(false);

  const total = CARDS.length;
  const card = CARDS[index];

  // Move focus to the new content on each transition, but never on first mount.
  useEffect(() => {
    if (!interacted.current) return;
    if (finished) scoreRef.current?.focus();
    else if (guess) feedbackRef.current?.focus();
    else questionRef.current?.focus();
  }, [index, guess, finished]);

  function answer(choice: "myth" | "fact") {
    if (guess) return;
    interacted.current = true;
    const ok = choice === card.answer;
    setGuess(choice);
    if (ok) setScore((s) => s + 1);
    setLive(`${ok ? "Correct" : "Not quite"}. It's a ${card.answer}. ${card.why}`);
  }

  function next() {
    interacted.current = true;
    if (index + 1 >= total) {
      setFinished(true);
      setLive(`You scored ${score} out of ${total}.`);
    } else {
      setIndex((i) => i + 1);
      setGuess(null);
      setLive("");
    }
  }

  function restart() {
    interacted.current = true;
    setIndex(0);
    setGuess(null);
    setScore(0);
    setFinished(false);
    setShareMsg("");
    setLive("");
  }

  async function share() {
    const text = `I scored ${score}/${total} on the Healthy Logs nutrition myth quiz. Can you beat me?`;
    const url = "https://healthylogs.com/myths";
    try {
      if (navigator.share) {
        await navigator.share({ title: "Healthy Logs myth quiz", text, url });
      } else {
        await navigator.clipboard.writeText(`${text} ${url}`);
        setShareMsg("Copied — paste it anywhere.");
      }
    } catch {
      setShareMsg("Couldn't share — copy the link from your browser bar.");
    }
  }

  const correct = guess === card.answer;
  const band =
    score >= 9
      ? "Nutrition myth-buster."
      : score >= 6
        ? "Solid — you know your stuff."
        : "Plenty of myths out there — our guides can help.";

  return (
    <>
      <div aria-live="polite" className="sr-only">
        {live}
      </div>

      {finished ? (
        <div
          ref={scoreRef}
          tabIndex={-1}
          className="card mx-auto max-w-xl p-6 text-center outline-none sm:p-8"
        >
          <p className="eyebrow">Your score</p>
          <p className="mt-2 font-display text-3xl text-ink">
            {score} / {total}
          </p>
          <p className="mt-2 text-md text-ink-soft">{band}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={restart} className="btn-primary">
              Play again
            </button>
            <button type="button" onClick={share} className="btn-secondary">
              Share your score
            </button>
            <Link href="/articles" className="btn-secondary">
              Read the guides
            </Link>
          </div>
          {shareMsg && <p className="log-stamp mt-3">{shareMsg}</p>}
          <p className="log-stamp mt-6">{DISCLAIMER}</p>
        </div>
      ) : (
        <div className="card mx-auto max-w-xl p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <span className="eyebrow">Myth or fact</span>
            <span className="log-stamp">
              {index + 1} / {total} · score {score}
            </span>
          </div>
          <div className="mt-3 h-1 rounded-full bg-line">
            <div
              className="h-1 rounded-full bg-accent transition-all duration-300"
              style={{ width: `${Math.round((index / total) * 100)}%` }}
            />
          </div>

          <p
            ref={questionRef}
            tabIndex={-1}
            className="mt-6 font-display text-xl leading-snug text-ink outline-none"
          >
            &ldquo;{card.text}&rdquo;
          </p>

          {!guess ? (
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => answer("myth")}
                className="rounded-card border border-line bg-surface py-3.5 text-md font-medium text-ink transition-colors hover:border-accent"
              >
                Myth
              </button>
              <button
                type="button"
                onClick={() => answer("fact")}
                className="rounded-card border border-line bg-surface py-3.5 text-md font-medium text-ink transition-colors hover:border-accent"
              >
                Fact
              </button>
            </div>
          ) : (
            <div ref={feedbackRef} tabIndex={-1} className="mt-6 outline-none">
              <p
                className={
                  correct
                    ? "font-display text-lg text-accent"
                    : "font-display text-lg text-ink"
                }
              >
                {correct ? "Correct" : "Not quite"} — it&rsquo;s a {card.answer}.
              </p>
              <p className="mt-2 text-md text-ink-soft">{card.why}</p>
              <button type="button" onClick={next} className="btn-primary mt-5">
                {index + 1 >= total ? "See your score" : "Next"}
              </button>
            </div>
          )}

          <p className="log-stamp mt-6">{DISCLAIMER}</p>
        </div>
      )}
    </>
  );
}
