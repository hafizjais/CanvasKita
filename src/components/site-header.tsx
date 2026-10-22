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
    <header className="sticky top-0 z-40 print:hidden border-b border-ink/10 bg-paper/92 backdrop-blur-md supports-[not(backdrop-filter:blur(0))]:bg-paper">
      <div className="container-page flex h-16 items-center justify-between gap-6">
        <Link href="/" className="shrink-0" aria-label="Hafiz MJ Digital, home">
          <Wordmark />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-8 text-[0.94rem] font-medium text-graphite">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="link-underline py-1 hover:text-ink">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/get-quote"
            className={buttonClasses("primary", "md", "h-10 max-sm:hidden")}
            {...track("cta_click", { location: "header", label: "Get an Estimate" })}
          >
            Get an Estimate
          </Link>
          <MobileNav links={navLinks} />
        </div>
      </div>
    </header>
  );
}
