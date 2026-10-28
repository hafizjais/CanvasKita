import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { analyticsDomain } from "@/lib/analytics";
import { getContactEmail } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Privacy Notice",
  description: `How ${siteConfig.name} handles the information you share through this website.`,
  alternates: { canonical: "/privacy" },
};

/*
 * Plain-language notice describing what this site actually does. Review it
 * whenever you change the form, delivery method or analytics, and seek
 * professional advice if you need formal compliance assurance (e.g. PDPA 2010).
 */
export default function PrivacyPage() {
  const email = getContactEmail();

  return (
    <div className="container-page max-w-3xl py-14 sm:py-20">
      <h1 className="text-[2.4rem] leading-tight font-semibold sm:text-5xl">Privacy notice</h1>
      <p className="mt-4 text-muted">Last updated {siteConfig.privacyLastUpdated}</p>

      <div className="mt-10 space-y-8 text-lg leading-relaxed text-graphite [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-ink">
        <section>
          <h2>What this notice covers</h2>
          <p>
            This notice explains how {siteConfig.name} handles personal information you share through this website.
          </p>
        </section>

        <section>
          <h2>Information you send me</h2>
          <p>
            When you submit the project enquiry form, I receive the details you enter: your name, business name,
            email address or phone number, the type of website you need, your project description and, if you choose
            to provide them, your approximate budget and timeline. Please don&rsquo;t include sensitive personal or
            financial information.
          </p>
        </section>

        <section>
          <h2>How it is used</h2>
          <p>
            I use this information only to reply to your enquiry, discuss your project and prepare a quotation. I do
            not sell it or share it for marketing purposes. Enquiries are delivered to me by email or through a
            secure form-processing service, and kept only as long as needed for our discussion and any resulting
            project.
          </p>
        </section>

        <section>
          <h2>WhatsApp</h2>
          <p>
            If you contact me on WhatsApp, the conversation takes place on WhatsApp and is subject to its own terms
            and privacy policy. Nothing from this website is sent to WhatsApp unless you choose to start a
            conversation.
          </p>
        </section>

        <section>
          <h2>Analytics</h2>
          <p>
            {analyticsDomain
              ? "This site uses privacy-friendly analytics that don't use cookies or collect personal information. I see aggregated figures, such as page views and which buttons are used, to understand what is useful."
              : "This site does not currently use analytics or tracking cookies."}
          </p>
        </section>

        <section>
          <h2>Your choices</h2>
          <p>
            You can ask to see, correct or delete the information you have sent me
            {email ? (
              <>
                {" "}
                by emailing{" "}
                <a href={`mailto:${email}`} className="text-ink underline underline-offset-4">
                  {email}
                </a>
              </>
            ) : (
              " by contacting me through the enquiry form or WhatsApp"
            )}
            .
          </p>
        </section>
      </div>
    </div>
  );
}
