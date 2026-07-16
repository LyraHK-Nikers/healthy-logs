"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * Protein intake calculator. Ranges reflect common evidence-based guidance
 * (RDA ~0.8 g/kg; more for active people and those training for muscle).
 * Educational only — the nutritionist should sanity-check the ranges.
 */
const ACTIVITY = [
  { v: "sedentary", label: "Not very active", low: 0.8, high: 1.0 },
  { v: "active", label: "Active / general fitness", low: 1.2, high: 1.6 },
  { v: "strength", label: "Strength training / athlete", low: 1.6, high: 2.2 },
] as const;

export function ProteinCalculator() {
  const [weight, setWeight] = useState("70");
  const [unit, setUnit] = useState<"kg" | "lb">("kg");
  const [activity, setActivity] = useState<string>("active");

  const w = parseFloat(weight);
  const kg = unit === "lb" ? w / 2.2046 : w;
  const band = ACTIVITY.find((a) => a.v === activity) ?? ACTIVITY[1];
  const valid = Number.isFinite(kg) && kg > 0;
  const low = valid ? Math.round(kg * band.low) : 0;
  const high = valid ? Math.round(kg * band.high) : 0;

  return (
    <div className="card p-5 sm:p-6">
      <h3 className="font-display text-lg text-ink">Protein calculator</h3>
      <p className="mt-1 text-sm text-ink-soft">
        A rough daily protein target based on your weight and activity.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="pc-weight" className="mb-1 block text-sm font-medium text-ink">
            Your weight
          </label>
          <div className="flex gap-2">
            <input
              id="pc-weight"
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
          <label htmlFor="pc-activity" className="mb-1 block text-sm font-medium text-ink">
            Activity level
          </label>
          <select
            id="pc-activity"
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
              {low}–{high} g
            </span>{" "}
            <span className="text-sm text-ink-soft">of protein per day</span>
          </p>
        ) : (
          <p className="text-sm text-ink-soft">Enter your weight to see a target.</p>
        )}
      </div>

      <p className="log-stamp mt-3">
        A guide, not medical advice. Needs vary — check with your clinician.
      </p>
      <Link
        href="/category/protein"
        className="mt-3 inline-block text-sm text-accent link-underline"
      >
        Read our protein guides →
      </Link>
    </div>
  );
}
