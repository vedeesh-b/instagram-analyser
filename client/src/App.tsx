import "./App.css";
import { Button } from "./components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "./components/ui/navigation-menu";
import "./components/styles.css";
import logoPath from "../src/assets/inVault-logo.png";
import HeroSection from "./sections/HeroSection";
import CardGroup from "./sections/CardGroup";
import { ArchitectureSection } from "./sections/ArchitectureSection";
import { TechStack } from "./sections/TechStack";

function App() {
  return (
    <div className="mb-60">
      <NavigationMenu className="w-full max-w-none py-4 px-60">
        <NavigationMenuList className="justify-between">
          <NavigationMenuItem>
            <NavigationMenuLink
              href="/"
              className="flex flex-row gap-3 justify-center items-center"
            >
              <img src={logoPath} alt="Logo" className="h-6" />
              <span className="text-xl text-white font-semibold font-['Familjen_Grotesk']">
                inVault
              </span>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Button className="bg-[#342792] rounded-sm">Upload folder</Button>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div id="landing-sections" className="px-60 my-32">
        <HeroSection />
        <CardGroup />
        <ArchitectureSection />
        <TechStack />
      </div>
    </div>
  );
}

export default App;
