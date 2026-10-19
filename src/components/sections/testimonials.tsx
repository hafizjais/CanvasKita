import { testimonials } from "@/data/content";

/** Renders nothing until genuine, approved testimonials are added in data/content.ts. */
export function Testimonials() {
  if (testimonials.length === 0) return null;

  return (
    <section aria-labelledby="testimonials-title" className="py-20 sm:py-28">
      <div className="container-page">
        <p className="eyebrow">Client feedback</p>
        <h2 id="testimonials-title" className="mt-5 text-[2.3rem] leading-[1.05] font-semibold sm:text-5xl">
          In their words.
        </h2>
        <ul className="mt-12 grid gap-10 md:grid-cols-2">
          {testimonials.map((item) => (
            <li key={item.name} className="border-t border-ink/15 pt-6">
              <figure>
                <blockquote className="font-display text-xl leading-snug">&ldquo;{item.quote}&rdquo;</blockquote>
                <figcaption className="mt-5 text-sm text-muted">
                  <span className="font-semibold text-ink">{item.name}</span>
                  {item.role ? `, ${item.role}` : ""}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
