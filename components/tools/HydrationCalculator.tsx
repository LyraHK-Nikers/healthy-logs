"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * Hydration estimator. Uses a common ~30–40 ml/kg/day heuristic, nudged by
 * activity. It's a rough starting point, not a prescription — thirst and urine
 * colour are better day-to-day signals (stated in the UI).
 */
const ACTIVITY = [
  { v: "light", label: "Mostly resting", ml: 30 },
  { v: "moderate", label: "Some daily activity", ml: 35 },
  { v: "intense", label: "Hard exercise / hot climate", ml: 40 },
] as const;

export function HydrationCalculator() {
  const [weight, setWeight] = useState("70");
  const [unit, setUnit] = useState<"kg" | "lb">("kg");
  const [activity, setActivity] = useState<string>("moderate");

  const w = parseFloat(weight);
  const kg = unit === "lb" ? w / 2.2046 : w;
  const band = ACTIVITY.find((a) => a.v === activity) ?? ACTIVITY[1];
  const valid = Number.isFinite(kg) && kg > 0;
  const litres = valid ? (kg * band.ml) / 1000 : 0;
  const cups = Math.round(litres / 0.24);

  return (
    <div className="card p-5 sm:p-6">
      <h3 className="font-display text-lg text-ink">Hydration calculator</h3>
      <p className="mt-1 text-sm text-ink-soft">
        A rough daily fluid target — food and other drinks count too.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="hc-weight" className="mb-1 block text-sm font-medium text-ink">
            Your weight
          </label>
          <div className="flex gap-2">
            <input
              id="hc-weight"
              type="number"
              min="1"
              inputMode="decimal"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full rounded-card border border-line bg-surface px-3 py-2.5 text-sm text-ink"
            />
            <select
              aria-label="Weight unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value as "kg" | "lb")}
              className="rounded-card border border-line bg-surface px-3 py-2.5 text-sm text-ink"
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="hc-activity" className="mb-1 block text-sm font-medium text-ink">
            Typical day
          </label>
          <select
            id="hc-activity"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            className="w-full rounded-card border border-line bg-surface px-3 py-2.5 text-sm text-ink"
          >
            {ACTIVITY.map((a) => (
              <option key={a.v} value={a.v}>
                {a.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5 rounded-card bg-accent-soft px-4 py-4" aria-live="polite">
        {valid ? (
          <p className="text-ink">
            <span className="font-display text-2xl text-ink">
              {litres.toFixed(1)} L
            </span>{" "}
            <span className="text-sm text-ink-soft">
              per day (about {cups} cups)
            </span>
          </p>
        ) : (
          <p className="text-sm text-ink-soft">Enter your weight to see a target.</p>
        )}
      </div>

      <p className="log-stamp mt-3">
        A guide only. Thirst and pale-yellow urine are better daily signals.
      </p>
      <Link
        href="/category/general-nutrition"
        className="mt-3 inline-block text-sm text-accent link-underline"
      >
        More everyday nutrition →
      </Link>
    </div>
  );
}
