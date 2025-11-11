import { SiX, SiLinkedin, SiGithub } from "react-icons/si";
import { Globe, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-card border-t py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div>
            <h3
              className="text-2xl font-bold mb-4"
              data-testid="text-footer-heading"
            >
              Let's Work Together
            </h3>
            <p
              className="text-muted-foreground mb-6"
              data-testid="text-footer-bio"
            >
              Interested in collaborating on water management projects or 
              discussing innovative SWMM solutions? I'd love to hear from you.
            </p>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-5 w-5" />
              <a
                href="mailto:robert@semm5.org"
                className="hover:text-primary transition-colors"
                data-testid="link-email"
              >
                robert@semm5.org
              </a>
            </div>
          </div>

          <div>
            <h3
              className="text-2xl font-bold mb-4"
              data-testid="text-footer-connect"
            >
              Connect
            </h3>
            <div className="space-y-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-footer-twitter"
              >
                <SiX className="h-5 w-5" />
                <span>Twitter</span>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-footer-linkedin"
              >
                <SiLinkedin className="h-5 w-5" />
                <span>LinkedIn</span>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-footer-github"
              >
                <SiGithub className="h-5 w-5" />
                <span>GitHub</span>
              </a>
              <a
                href="https://semm5.org"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-footer-website"
              >
                <Globe className="h-5 w-5" />
                <span>semm5.org</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground" data-testid="text-copyright">
              © {currentYear} Robert Dickinson. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground" data-testid="text-powered-by">
              AI-Powered by DeepSeek
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
