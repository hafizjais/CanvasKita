/**
 * The seven stages of a project, from first message to final handover,
 * grouped into four phases for the homepage journey. Wording here is the
 * single source for that section.
 */

export type ProjectStage = {
  id: string;
  title: string;
  description: string;
  /** Short fact shown as a label, e.g. the typical timeline or payment split. */
  label?: string;
  /** Extra wording below the description. */
  note?: string;
  list?: { heading: string; items: string[] };
  clientAction?: string;
  outcome: string;
  /** A restrained visual emphasis for the hypercare stage. */
  highlight?: boolean;
};

export const processIntro = {
  title: "Your Idea. Our Process. Your Website.",
  body: "From the first conversation to a website you're ready to share with the world.",
};

export type PhaseVisual = "plan" | "build" | "launch" | "support";

export type ProjectPhase = {
  id: string;
  title: string;
  summary: string;
  visual: PhaseVisual;
  /** Ids from projectStages, in order. */
  stageIds: string[];
  /** Key terms shown at the top of the expanded phase. */
  keyPoints: string[];
};

export const projectPhases: ProjectPhase[] = [
  {
    id: "plan",
    title: "Plan & Confirm",
    visual: "plan",
    summary:
      "Let's understand your business, define the scope and agree on the right solution before development begins.",
    stageIds: ["discuss", "deposit"],
    keyPoints: ["Written quotation", "50% deposit to begin"],
  },
  {
    id: "build",
    title: "Design & Build",
    visual: "build",
    summary: "I turn your requirements into a responsive website designed around your business and customers.",
    stageIds: ["build"],
    keyPoints: ["Typically 1–2 weeks for standard websites"],
  },
  {
    id: "launch",
    title: "Review & Launch",
    visual: "launch",
    summary:
      "Review the website, provide feedback, and get ready to launch once the agreed revisions are complete.",
    stageIds: ["review", "launch"],
    keyPoints: ["2 revision rounds included", "Remaining 50% before public launch", "Website walkthrough"],
  },
  {
    id: "support",
    title: "Support & Handover",
    visual: "support",
    summary: "Get support after launch, understand your website and receive the agreed handover materials.",
    stageIds: ["hypercare", "handover"],
    keyPoints: ["14 days of post-launch support", "Final handover"],
  },
];

export const processCta = {
  title: "Ready to Start Your Project?",
  primary: "Discuss Your Project",
  secondary: "Get an Estimate",
  whatsappMessage:
    "Hi Hafiz, I'd like to discuss a website project. Could you tell me how to get started?",
};

export const projectStages: ProjectStage[] = [
  {
    id: "discuss",
    title: "Discuss Your Project",
    description:
      "Tell me about your business, your goals and the website you need. We'll discuss the required pages, features, budget and timeline so I can recommend a suitable solution.",
    clientAction: "Submit an enquiry through WhatsApp or the website contact form.",
    outcome: "A recommended approach and written quotation.",
  },
  {
    id: "deposit",
    title: "Confirm & Pay Deposit",
    label: "50% deposit to begin",
    description:
      "Once you're happy with the quotation and project scope, confirm your booking by paying a 50% deposit. Your project begins when the deposit and required materials have been received.",
    clientAction: "Approve the quotation, pay the deposit and provide the necessary branding, images and content.",
    outcome: "Confirmed project scope, payment record and planned development schedule.",
  },
  {
    id: "build",
    title: "Design & Development",
    label: "Typically 1–2 weeks for standard websites",
    description:
      "I design and build your website according to the agreed requirements, including the page layouts, content, responsive design and selected features.",
    note: "The timeline begins once the deposit, required content and project details are received. Complex websites, e-commerce stores, booking systems and delayed feedback may require additional time.",
    outcome: "A working website preview for the client to review.",
  },
  {
    id: "review",
    title: "Review & Revisions",
    label: "2 revision rounds included",
    description:
      "You'll receive a preview link to review the website before launch. I'll make the agreed revisions, check the responsive layout and test the features included in your package.",
    note: "Two revision rounds are included in the standard project scope, unless your quotation states otherwise. New pages, new features or changes outside the agreed scope may require an additional quotation.",
    outcome: "Client-approved website ready for launch.",
  },
  {
    id: "launch",
    title: "Launch & Website Training",
    label: "Remaining 50% before public launch",
    description:
      "Once the website is approved and the remaining project balance is paid, I'll publish the website and carry out the final checks. I'll also guide you through the relevant features so you understand how to use your website.",
    note: "Recommended payment terms: 50% deposit to begin and the remaining 50% before public launch.",
    list: {
      heading: "Training may cover",
      items: [
        "Accessing the website and relevant administration tools.",
        "Updating text, images or products where supported.",
        "Managing enquiries or bookings where applicable.",
        "Understanding the domain, hosting and renewal arrangements.",
      ],
    },
    outcome: "A live website, relevant access and a guided walkthrough.",
  },
  {
    id: "hypercare",
    title: "14-Day Hypercare Support",
    label: "14 days of post-launch support included.",
    highlight: true,
    description:
      "For 14 days after launch, you can report bugs or problems related to the agreed website functionality. I'll help investigate and resolve eligible issues covered by the original project scope.",
    list: {
      heading: "What this covers",
      items: [
        "Covers bugs in the agreed deliverables.",
        "Does not automatically include new features, extra pages or ongoing content updates.",
        "Issues caused by third-party services, external outages or changes made outside the agreed scope may require separate investigation.",
        "Additional maintenance can be arranged separately.",
      ],
    },
    outcome: "A supported transition as the client begins using the website.",
  },
  {
    id: "handover",
    title: "Final Handover",
    description:
      "At the end of the hypercare period, we'll confirm the handover is complete. You'll receive the agreed documentation, relevant account access, project files and instructions applicable to your website.",
    list: {
      heading: "Handover includes",
      items: [
        "Final project checklist.",
        "Website access and relevant credentials, shared securely.",
        "Source code or repository access when included in the agreement.",
        "Basic operating instructions or training material where agreed.",
        "Information on future renewals and optional maintenance.",
      ],
    },
    note: "You'll have the access needed to operate your live website from launch. The final handover formalises the remaining agreed deliverables and closes the project.",
    outcome: "A completed project with clearly documented ownership, access and next steps.",
  },
];
