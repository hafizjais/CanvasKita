# Hafiz MJ Digital

Portfolio and enquiry website for Hafiz MJ Digital, a freelance web design and development studio in Malaysia.

Built with Next.js 16 (App Router, Cache Components), React 19, TypeScript, Tailwind CSS 4 and Lucide icons. Every page is prerendered as static HTML. The enquiry form works with or without JavaScript.

## Quick start

Requires Node.js 20.9 or newer.

```bash
npm install          # install dependencies
npm run dev          # development server on http://localhost:3000
npm run lint         # ESLint
npm test             # pricing calculation unit tests (Node's built-in runner)
npx tsc --noEmit     # type check
npm run build        # production build
npm start            # serve the production build
```

## Before you launch: things to fill in

Everything a visitor uses to contact you lives in **`src/config/site.ts`**. Empty values are treated as "not configured". Their buttons and links are hidden, and visitors are sent to the enquiry form instead, so nothing ever leads to a broken link.

| Setting | Where | Notes |
| --- | --- | --- |
| WhatsApp number | `siteConfig.contact.whatsappNumber` | International format, digits only, e.g. `60123456789`. Turns on every WhatsApp button, including the floating one. |
| WhatsApp greeting | `siteConfig.contact.whatsappMessage` | The pre-filled message. Keep it short. |
| Contact email | `siteConfig.contact.email` | Shown in the contact section, footer and privacy notice. |
| Social profiles | `siteConfig.social` | Full `https://` URLs. Empty entries are hidden. |
| Production URL | `NEXT_PUBLIC_SITE_URL` env var | Optional on Vercel, which provides the production domain automatically. Set it when you add a custom domain (see [SEO](#seo-and-indexing)). |
| Form delivery | env vars | See [Enquiry form delivery](#enquiry-form-delivery). **Until this is set, the form tells visitors their message was not sent.** |
| Project relationship | `relationship` in `src/data/projects.ts` | `"client"`, `"own"` or `"unconfirmed"`. Financial Hafiz is `"own"`; the others are `"unconfirmed"` and show no label. |

Content that is likely to change (services, benefits, process steps, FAQs, credentials, testimonials) is in **`src/data/content.ts`**. Enquiry form options (website types, budget ranges, timelines) are in `enquiryOptions` in `src/config/site.ts`.

## Packages and the price estimator

The homepage Services section compares five website packages, each with a "Customise This Plan" link that opens the estimator with that type selected. The estimator at **`/get-quote`** lets visitors configure a package and see an itemised estimate in MYR, print it or save it as a PDF, send it on WhatsApp, or submit it as an enquiry. No contact details are needed to see a price.

**To change prices, edit `src/config/pricing.ts`.** It is the only place figures live:

| What | Setting |
| --- | --- |
| Package starting prices, included pages/products, page limits, indicative timelines | `pricing.packages` |
| Add-on prices (`fixed`, `percent` of base, or `monthly`), which packages offer them, page limits | `pricing.addOns` |
| Custom domain highlight (included with every package) | `pricing.customDomain` |
| Extra page price | `pricing.extraPagePrice` |
| Extra product listings (block size, price, maximum) | `pricing.extraProducts` |
| Expedited delivery percentage and availability | `pricing.expedited` |
| Features already included in a package (never charged twice) | `includedAddOns` on each package |
| Estimate validity, reference prefix, revisions, post-launch support | `pricing.estimate` |
| Exclusions and assumptions printed on the estimate | `pricing.exclusions`, `pricing.assumptions` |

Package descriptions, inclusions and display order are in `src/data/packages.ts`. After changing prices, run `npm test`. The tests read their expected figures from `pricing.ts`, so a price change won't break them; they check the rules (included pages, no double charging, separate recurring costs).

How estimates are calculated (`src/lib/quote/calculate.ts`):
- Amounts are integer sen, so totals are exact.
- Monthly maintenance is listed separately and never added to the project total. A first-year figure appears only when every one-time item has a fixed price.
- Add-ons included in a package, or not offered for it, are removed before pricing.
- Starting-price add-ons, and copywriting or SEO beyond five pages, make the total read "From …". Complex booking and advanced commerce needs are listed as "Quoted separately", with no price.
- Anything the estimator can't price (such as complex booking rules) is listed as "Quoted separately" and never given a price. Fully custom work isn't a package: clients contact you directly for a quotation.
- When an estimate enquiry is submitted, the server recalculates the estimate from the selected options, so prices sent from the browser are never trusted.

Printing uses the browser's own dialog ("Save as PDF"). The printable layout is `src/components/quote/estimate-document.tsx`.

## Project structure

```
src/
  app/
    page.tsx                 Homepage (assembles the sections)
    layout.tsx               Fonts, metadata, header, footer, analytics
    work/[slug]/page.tsx     Case-study pages, one per project
    privacy/page.tsx         Privacy notice
    actions/enquiry.ts       Server action: validation, spam checks, delivery
    sitemap.ts, robots.ts    SEO files
    opengraph-image.tsx      Generated social-sharing image
    icon.svg, apple-icon.png Favicons
  components/
    sections/                Hero, SelectedWork, Services, WhyWorkWithMe, Process,
                             About, Testimonials, Faq, Contact, Industries
    enquiry-form.tsx         The form (client component)
    contact-cta.tsx          WhatsApp button with automatic fallback to the form
    site-header.tsx, mobile-nav.tsx, site-footer.tsx, floating-contact.tsx
    ui/                      Button styles, browser and phone frames
  config/site.ts             Business details and contact settings
  data/projects.ts           Portfolio projects
  data/content.ts            Services, FAQs, process, credentials, testimonials
  lib/                       WhatsApp/email helpers, analytics, enquiry validation & delivery
public/
  work/<project>/            Screenshots for each project
  about/hafiz.jpg            Profile photo
```

## Adding or editing portfolio projects

The "Selected work" section shows one card per project, and each card links to the live website.

Projects have a `type` of `"client"` or `"own"`, shown as a label on each card. MAGNA IBN is the featured project (`FEATURED` in `src/components/sections/selected-work.tsx`).

1. Add screenshots to `public/work/<slug>/`: `desktop.webp` (1440×900 capture of the homepage) and `mobile.webp` (780×1688, i.e. 390×844 at 2× pixel density).
2. Add an entry to `projects` in `src/data/projects.ts`. Describe only what is visible on the live site; don't add results, figures or quotes you can't support.
3. The card and the footer link appear automatically.

Screenshots were captured from the live sites on 19 October 2026. Re-capture them when a site changes significantly.

## Replacing images, certificates and testimonials

- **Profile photo**: replace `public/about/hafiz.jpg`. A 4:5 portrait about 800px wide works best. It is imported in `src/components/sections/about.tsx`, so restart the dev server after replacing it.
- **Certificates**: add entries to `credentials` in `src/data/content.ts`. A "Credentials" list appears in the About section only when this list has entries. Never include certificate numbers or other private identifiers.
- **Testimonials**: add genuine, approved quotes to `testimonials` in `src/data/content.ts`. The section is hidden while the list is empty.

## Enquiry form delivery

The form validates in the browser and again on the server. It then sends the enquiry using the first method that is configured:

**Option 1: email with [Resend](https://resend.com)** (recommended)

```bash
RESEND_API_KEY=re_...
ENQUIRY_TO_EMAIL=you@yourdomain.com          # comma-separate several addresses
ENQUIRY_FROM_EMAIL="Hafiz MJ Digital <enquiries@yourdomain.com>"
```

Verify your sending domain in Resend first. Without a verified domain, Resend only delivers test messages to your own account address. When the visitor gives an email address, it is set as the reply-to, so you can reply directly.

**Option 2: webhook.** Posts the enquiry as JSON to any URL, such as a Make, Zapier or n8n scenario, or a Google Apps Script that writes to a sheet:

```bash
ENQUIRY_WEBHOOK_URL=https://hook.example.com/...
```

The JSON payload contains `subject`, `submittedAt`, `name`, `business`, `contact`, `websiteType`, `message`, `budget` and `timeline`.

**Neither set:** nothing is sent. The visitor sees a clear message that the enquiry wasn't sent, and their typed details are kept. In development, the enquiry is also printed to the terminal.

Secrets are only read on the server (`src/lib/enquiry-delivery.ts` is marked `server-only`). Never prefix them with `NEXT_PUBLIC_`.

**Spam protection:** a hidden honeypot field, a minimum fill time of 3 seconds, and a per-IP limit of 5 submissions per 10 minutes. Suspected bots are shown a normal success message but nothing is delivered. The rate limit is held in memory per server instance, so on serverless hosting it slows abuse rather than enforcing a hard cap. If spam becomes a problem, add Cloudflare Turnstile.

Copy `.env.example` to `.env.local` to configure locally.

## Analytics

Analytics are off until you set `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`. The site is set up for [Plausible](https://plausible.io), which is cookie-free and needs no consent banner. To use a self-hosted or proxied script, also set `NEXT_PUBLIC_PLAUSIBLE_SRC`.

Tracked events (add each as a custom-event goal in Plausible to see it):

| Event | Properties | Fired when |
| --- | --- | --- |
| `whatsapp_click` | `location` | Any WhatsApp button is clicked |
| `project_click` | `project`, `target` (`live_site`) | A portfolio link is clicked |
| `cta_click` | `location`, `label` | Other calls to action (e.g. "Request a Quotation") |
| `enquiry_start` | none | First interaction with the enquiry form |
| `enquiry_submitted` | none | Successful form submission |
| `quote_package_selected`, `quote_estimate_viewed`, `quote_printed` | `package` | Estimator usage |
| `quote_enquiry_start`, `quote_enquiry_submitted` | none | Estimator enquiry form |

Links are tracked through `data-track` attributes (see `track()` in `src/lib/analytics.ts`), so you can tag new links without turning them into client components. Check events in Plausible's real-time view after deploying; nothing is recorded before then.

**Measuring conversion rate.** Define conversion rate as *qualified enquiries ÷ eligible visitors* over a fixed period. Qualified enquiries are form submissions plus WhatsApp conversations that turn out to be genuine prospects. Eligible visitors are unique visitors, excluding your own visits and bots. `whatsapp_click` counts intent, not conversations, so log genuine WhatsApp enquiries yourself. To assess an improvement (for example against a previous site), compare equal periods with similar traffic sources, using the same definitions on both sides.

## SEO and indexing

- The production URL comes from `NEXT_PUBLIC_SITE_URL` (e.g. `https://hafizmjdigital.com`) when set. Otherwise, on Vercel, it comes from the project's production domain, which Vercel provides automatically (`VERCEL_PROJECT_PRODUCTION_URL`).
- Vercel preview deployments, and builds outside Vercel without `NEXT_PUBLIC_SITE_URL`, send `noindex` and `robots.txt` disallows crawling, so test deployments stay out of search results.
- With it: canonical URLs, Open Graph/Twitter metadata, `sitemap.xml`, and `ProfessionalService` and `FAQPage` structured data are generated. Structured data contains no ratings or reviews, and the email and phone are included only when configured.

## Deploying

**Vercel** (simplest):

1. Push this repository to GitHub and import it at vercel.com/new. The framework is detected automatically.
2. Under *Settings → Environment Variables*, add `NEXT_PUBLIC_SITE_URL` (Production only), the form delivery variables, and optionally `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`.
3. Add your domain under *Settings → Domains*, then redeploy so `NEXT_PUBLIC_SITE_URL` is applied.
4. After launch, submit a test enquiry, tap a WhatsApp button on your phone, and submit `https://yourdomain/sitemap.xml` in Google Search Console.

**Any Node.js host:** run `npm run build`, then `npm start` (set `PORT` if needed), with the same environment variables. The site uses server actions, so a static export (`output: "export"`) won't work.

## Notes

- `AGENTS.md` is generated by Next.js for AI coding agents and is re-created by `next dev`. Leave it in place.
- The colours and type scale are defined as design tokens in `src/app/globals.css` (`@theme`). Headings use Schibsted Grotesk and body text uses Instrument Sans, both loaded through `next/font`.
