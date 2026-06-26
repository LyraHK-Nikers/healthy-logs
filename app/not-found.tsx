import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-article px-5 py-24 text-center">
      <p className="eyebrow">Error 404</p>
      <h1 className="mt-3 font-display text-2xl text-ink sm:text-3xl">
        This log entry doesn&rsquo;t exist
      </h1>
      <p className="mt-4 text-ink-soft">
        The page you&rsquo;re looking for may have been moved or never existed.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link
          href="/"
          className="rounded-card bg-accent px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Back home
        </Link>
        <Link
          href="/articles"
          className="rounded-card border border-line px-5 py-2.5 text-sm text-ink-soft hover:border-accent hover:text-accent"
        >
          Browse articles
        </Link>
      </div>
    </div>
  );
}
