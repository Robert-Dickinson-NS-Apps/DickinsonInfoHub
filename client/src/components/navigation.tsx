import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

interface NavigationProps {
  onChatClick: () => void;
}

export function Navigation({ onChatClick }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollToSection("hero")}
              className="text-lg font-semibold hover-elevate active-elevate-2 px-3 py-2 rounded-md transition-colors"
              data-testid="link-home"
            >
              Robert Dickinson
            </button>
          </div>

          <div className="hidden md:flex items-center gap-1">
            <Button
              variant="ghost"
              onClick={() => scrollToSection("about")}
              data-testid="link-about"
            >
              About
            </Button>
            <Button
              variant="ghost"
              onClick={() => scrollToSection("expertise")}
              data-testid="link-expertise"
            >
              Expertise
            </Button>
            <Button
              variant="ghost"
              onClick={() => scrollToSection("projects")}
              data-testid="link-projects"
            >
              Projects
            </Button>
            <Button
              variant="ghost"
              onClick={() => scrollToSection("contact")}
              data-testid="link-contact"
            >
              Contact
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              onClick={onChatClick}
              className="hidden md:inline-flex"
              data-testid="button-open-chat"
            >
              Chat with AI
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-card">
          <div className="px-4 py-4 space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => scrollToSection("about")}
              data-testid="link-about-mobile"
            >
              About
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => scrollToSection("expertise")}
              data-testid="link-expertise-mobile"
            >
              Expertise
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => scrollToSection("projects")}
              data-testid="link-projects-mobile"
            >
              Projects
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => scrollToSection("contact")}
              data-testid="link-contact-mobile"
            >
              Contact
            </Button>
            <Button
              onClick={onChatClick}
              className="w-full"
              data-testid="button-open-chat-mobile"
            >
              Chat with AI
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
