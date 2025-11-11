import { Card } from "@/components/ui/card";
import credentialImage from "@assets/IMG_3074_1762826968810.jpeg";

export function AboutSection() {
  return (
    <section id="about" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold mb-6"
            data-testid="text-about-heading"
          >
            About Me
          </h2>
          <p
            className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8"
            data-testid="text-about-bio"
          >
            With extensive experience in Storm Water Management Modeling (SWMM) and 
            environmental engineering, I specialize in developing innovative solutions 
            for urban water infrastructure challenges. My work focuses on creating 
            sustainable, data-driven approaches to water management that balance 
            environmental protection with community needs.
          </p>
          <p
            className="text-base md:text-lg text-muted-foreground leading-relaxed"
            data-testid="text-about-bio-2"
          >
            Through advanced modeling techniques and collaborative engineering practices, 
            I help municipalities and organizations design resilient water systems that 
            can adapt to changing climate conditions and urban development patterns.
          </p>
        </div>

        <Card className="max-w-2xl mx-auto p-8 hover-elevate transition-transform">
          <img
            src={credentialImage}
            alt="AI Integrations - Professional credentials"
            className="w-full h-auto rounded-md"
            data-testid="img-credentials"
          />
        </Card>
      </div>
    </section>
  );
}
