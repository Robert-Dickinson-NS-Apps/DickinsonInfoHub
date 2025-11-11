import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SiX, SiLinkedin, SiGithub } from "react-icons/si";
import { Globe } from "lucide-react";

const socialLinks = [
  {
    name: "Twitter",
    icon: SiX,
    handle: "@robertdickinson",
    description: "Follow for SWMM insights",
    url: "https://twitter.com",
    color: "text-foreground",
  },
  {
    name: "LinkedIn",
    icon: SiLinkedin,
    handle: "Robert Dickinson",
    description: "Professional network",
    url: "https://linkedin.com",
    color: "text-[#0A66C2]",
  },
  {
    name: "GitHub",
    icon: SiGithub,
    handle: "robert-dickinson",
    description: "Open source projects",
    url: "https://github.com",
    color: "text-foreground",
  },
  {
    name: "SEMM5.org",
    icon: Globe,
    handle: "semm5.org",
    description: "Visit my website",
    url: "https://semm5.org",
    color: "text-primary",
  },
];

export function SocialLinksSection() {
  return (
    <section id="social" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold mb-6"
            data-testid="text-social-heading"
          >
            Connect With Me
          </h2>
          <p
            className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto"
            data-testid="text-social-subtitle"
          >
            Let's collaborate on water management solutions and share knowledge
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
              data-testid={`link-social-${link.name.toLowerCase()}`}
            >
              <Card className="hover-elevate active-elevate-2 transition-all duration-200 h-full">
                <CardHeader>
                  <div className={`${link.color} mb-4`}>
                    <link.icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-lg" data-testid={`text-social-name-${index}`}>
                    {link.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <p className="font-mono text-sm" data-testid={`text-social-handle-${index}`}>
                    {link.handle}
                  </p>
                  <p className="text-sm text-muted-foreground" data-testid={`text-social-desc-${index}`}>
                    {link.description}
                  </p>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
