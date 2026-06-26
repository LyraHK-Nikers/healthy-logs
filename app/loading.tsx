/**
 * Route-level loading fallback. Shown during navigation transitions.
 * Quiet and on-brand — a pulsing log stamp rather than a spinner.
 */
export default function Loading() {
  return (
    <div className="mx-auto flex max-w-container items-center justify-center px-5 py-32">
      <p className="log-stamp animate-pulse">Loading log…</p>
    </div>
  );
}
