import Link from "next/link";
import { cacheLife } from "next/cache";
import { navLinks } from "@/components/site-header";
import { Wordmark } from "@/components/wordmark";
import { siteConfig } from "@/config/site";
import { projects } from "@/data/projects";
import { getContactEmail, getSocialLinks, getWhatsAppUrl } from "@/lib/contact";

async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

export function SiteFooter() {
  const whatsappUrl = getWhatsAppUrl();
  const email = getContactEmail();
  const socials = getSocialLinks();

  return (
    <footer className="on-dark bg-ink text-on-dark">
      <div className="container-page grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Wordmark tone="light" />
          <p className="mt-5 max-w-xs leading-relaxed text-on-dark-muted">{siteConfig.positioning}</p>
        </div>

        <nav aria-label="Footer" className="lg:col-span-2">
          <h2 className="text-sm font-semibold tracking-[0.1em] text-on-dark-muted uppercase">Explore</h2>
          <ul className="mt-4 space-y-2.5">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="link-underline hover:text-on-dark">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <h2 className="text-sm font-semibold tracking-[0.1em] text-on-dark-muted uppercase">Portfolio</h2>
          <ul className="mt-4 space-y-2.5">
            {projects.map((project) => (
              <li key={project.slug}>
                <Link href={`/work/${project.slug}`} className="link-underline">
                  {project.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h2 className="text-sm font-semibold tracking-[0.1em] text-on-dark-muted uppercase">Contact</h2>
          <ul className="mt-4 space-y-2.5">
            {whatsappUrl && (
              <li>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="link-underline">
                  WhatsApp<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            )}
            {email && (
              <li>
                <a href={`mailto:${email}`} className="link-underline">
                  {email}
                </a>
              </li>
            )}
            <li>
              <Link href="/#enquiry" className="link-underline">
                Project enquiry form
              </Link>
            </li>
            {socials.map((social) => (
              <li key={social.href}>
                <a href={social.href} target="_blank" rel="noopener noreferrer" className="link-underline">
                  {social.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-line-dark">
        <div className="container-page flex flex-col gap-3 py-6 text-sm text-on-dark-muted sm:flex-row sm:justify-between">
          <p>
            © <CopyrightYear /> {siteConfig.name}. All rights reserved.
          </p>
          <Link href="/privacy" className="link-underline hover:text-on-dark">
            Privacy notice
          </Link>
        </div>
      </div>
    </footer>
  );
}
