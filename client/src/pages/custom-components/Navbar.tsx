import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import logoPath from "../../assets/inVault-logo.png";

export const Navbar = () => {
  return (
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
  );
};
