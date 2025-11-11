import { Button } from "@/components/ui/button";
import { ArrowDown, MessageSquare } from "lucide-react";
import heroImage from "@assets/generated_images/SWMM_infrastructure_hero_background_de0bd9d3.png";

interface HeroSectionProps {
  onChatClick: () => void;
}

export function HeroSection({ onChatClick }: HeroSectionProps) {
  const scrollToProjects = () => {
    const element = document.getElementById("projects");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative h-[90vh] flex items-center justify-center overflow-hidden"
    >
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1
          className="text-6xl md:text-7xl font-bold text-white mb-6 tracking-tight"
          data-testid="text-hero-name"
        >
          Robert Dickinson
        </h1>
        <p
          className="text-2xl md:text-3xl text-white/95 mb-4 font-medium"
          data-testid="text-hero-title"
        >
          SWMM Engineer & Water Management Expert
        </p>
        <p
          className="text-base md:text-lg text-white/85 mb-12 max-w-2xl mx-auto"
          data-testid="text-hero-subtitle"
        >
          Specializing in Storm Water Management Modeling, environmental engineering, 
          and sustainable water infrastructure solutions for complex urban systems
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            onClick={scrollToProjects}
            data-testid="button-view-projects"
          >
            View Projects
            <ArrowDown className="ml-2 h-5 w-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={onChatClick}
            className="bg-background/10 backdrop-blur-sm text-white border-white/30 hover:bg-background/20"
            data-testid="button-chat-hero"
          >
            <MessageSquare className="mr-2 h-5 w-5" />
            Chat with AI Assistant
          </Button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ArrowDown className="h-6 w-6 text-white/70" />
      </div>
    </section>
  );
}
