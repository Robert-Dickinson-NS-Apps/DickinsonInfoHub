import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

const projects = [
  {
    title: "Urban Flood Mitigation System",
    description:
      "Developed comprehensive SWMM model for a metropolitan area to reduce flood risk by 40% through optimized detention basin placement and green infrastructure integration.",
    tags: ["SWMM", "Hydraulic Modeling", "GIS"],
    link: "https://semm5.org",
  },
  {
    title: "Water Quality Analysis Platform",
    description:
      "Created real-time water quality monitoring and prediction system using SWMM coupled with AI-driven analytics for early contamination detection.",
    tags: ["Data Science", "Environmental", "Python"],
    link: "https://semm5.org",
  },
  {
    title: "Sustainable Drainage Design",
    description:
      "Designed and implemented SUDS (Sustainable Urban Drainage Systems) for new development, achieving 60% reduction in peak runoff rates.",
    tags: ["SUDS", "Infrastructure", "Sustainability"],
    link: "https://semm5.org",
  },
  {
    title: "Climate Resilience Assessment",
    description:
      "Conducted climate change impact analysis on existing stormwater infrastructure using future rainfall scenarios and adaptive management strategies.",
    tags: ["Climate Adaptation", "Risk Assessment", "Planning"],
    link: "https://semm5.org",
  },
];

export function ProjectsSection() {
  return (
    <section id="projects" className="py-24 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold mb-6"
            data-testid="text-projects-heading"
          >
            Featured Projects
          </h2>
          <p
            className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto"
            data-testid="text-projects-subtitle"
          >
            Delivering innovative water management solutions across diverse urban environments
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <Card
              key={index}
              className="hover-elevate active-elevate-2 transition-all duration-200"
              data-testid={`card-project-${index}`}
            >
              <CardHeader>
                <CardTitle className="text-xl flex items-start justify-between gap-4">
                  <span data-testid={`text-project-title-${index}`}>{project.title}</span>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 text-primary hover:text-primary/80 transition-colors"
                    aria-label={`View ${project.title} project`}
                    data-testid={`link-project-${index}`}
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground" data-testid={`text-project-desc-${index}`}>
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, tagIndex) => (
                    <Badge
                      key={tagIndex}
                      variant="secondary"
                      data-testid={`badge-project-${index}-tag-${tagIndex}`}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
