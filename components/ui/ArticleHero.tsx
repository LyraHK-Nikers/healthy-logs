import { ArticleArt } from "@/components/ui/CategoryVisual";

/**
 * Renders a real hero image when the article has one, otherwise the designed
 * category placeholder. Plain <img> (not next/image) keeps it dependency-free
 * and robust on any host's runtime.
 */
export function ArticleHero({
  src,
  alt,
  category,
  className,
  iconClassName,
}: {
  src?: string;
  alt?: string;
  category: string;
  className?: string;
  iconClassName?: string;
}) {
  if (src) {
    return (
      <div className={`relative overflow-hidden bg-accent-soft ${className ?? ""}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt || ""}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
    );
  }
  return (
    <ArticleArt slug={category} className={className} iconClassName={iconClassName} />
  );
}
