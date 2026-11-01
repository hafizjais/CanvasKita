import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";
import { MobileNav } from "@/components/mobile-nav";
import { Wordmark } from "@/components/wordmark";
import { track } from "@/lib/analytics";

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#services", label: "Services" },
  { href: "/#work", label: "Projects" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="on-dark sticky top-0 z-40 border-b border-on-dark/10 bg-ink/92 text-on-dark backdrop-blur-md print:hidden supports-[not(backdrop-filter:blur(0))]:bg-ink">
      <div className="container-page flex h-16 items-center justify-between gap-6">
        <Link href="/" className="shrink-0" aria-label="Hafiz MJ Digital, home">
          <Wordmark />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-8 text-[0.94rem] font-medium text-on-dark-muted">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="link-underline py-1 hover:text-on-dark">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/get-quote"
            className={buttonClasses("glow", "md", "h-10 max-sm:hidden")}
            {...track("cta_click", { location: "header", label: "Get a Quote" })}
          >
            Get a Quote
          </Link>
          <MobileNav links={navLinks} />
        </div>
      </div>
    </header>
  );
}
