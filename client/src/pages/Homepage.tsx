import HeroSection from "@/sections/HeroSection";
import CardGroup from "@/sections/CardGroup";
import { ArchitectureSection } from "@/sections/ArchitectureSection";
import { TechStack } from "@/sections/TechStack";
import { Navbar } from "./custom-components/Navbar";

const Homepage = () => {
  return (
    <div className="mb-60">
      <Navbar />
      <div id="landing-sections" className="px-60 my-32">
        <HeroSection />
        <CardGroup />
        <ArchitectureSection />
        <TechStack />
      </div>
    </div>
  );
};

export default Homepage;
