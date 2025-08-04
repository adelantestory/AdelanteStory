import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import MissionStatement from "@/components/mission-statement";
import ProgramsSection from "@/components/programs-section";
import PartnershipsSection from "@/components/partnerships-section";
import StorySection from "@/components/story-section";
import ImpactStats from "@/components/impact-stats";
import Testimonials from "@/components/testimonials";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <MissionStatement />
      <ProgramsSection />
      <PartnershipsSection />
      <StorySection />
      <ImpactStats />
      <Testimonials />
      <ContactSection />
      <Footer />
    </div>
  );
}
