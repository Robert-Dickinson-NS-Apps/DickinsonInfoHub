import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { ExpertiseSection } from "@/components/expertise-section";
import { SocialLinksSection } from "@/components/social-links-section";
import { ProjectsSection } from "@/components/projects-section";
import { ChatInterface } from "@/components/chat-interface";
import { Footer } from "@/components/footer";

export default function Home() {
  const [chatOpen, setChatOpen] = useState(false);

  const toggleChat = () => setChatOpen((prev) => !prev);

  return (
    <div className="min-h-screen bg-background">
      <Navigation onChatClick={toggleChat} />
      <main>
        <HeroSection onChatClick={toggleChat} />
        <AboutSection />
        <ExpertiseSection />
        <SocialLinksSection />
        <ProjectsSection />
        <Footer />
      </main>
      <ChatInterface isOpen={chatOpen} onClose={toggleChat} />
    </div>
  );
}
