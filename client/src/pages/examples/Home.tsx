import Home from '../Home';
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ThemeProvider";

export default function HomeExample() {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <Home />
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  );
}