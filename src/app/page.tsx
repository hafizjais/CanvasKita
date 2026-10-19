import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Faq } from "@/components/sections/faq";
import { Hero } from "@/components/sections/hero";
import { Industries } from "@/components/sections/industries";
import { Process } from "@/components/sections/process";
import { SelectedWork } from "@/components/sections/selected-work";
import { Services } from "@/components/sections/services";
import { Testimonials } from "@/components/sections/testimonials";
import { WhyWorkWithMe } from "@/components/sections/why-work-with-me";
import { StructuredData } from "@/components/structured-data";

export default function HomePage() {
  return (
    <>
      <StructuredData />
      <Hero />
      <Industries />
      <SelectedWork />
      <Services />
      <WhyWorkWithMe />
      <Process />
      <About />
      <Testimonials />
      <Faq />
      <Contact />
    </>
  );
}
