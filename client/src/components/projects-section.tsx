import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";

export function ProjectsSection() {
  const { data: projects, isLoading, isError, error } = useQuery<Project[]>({
    queryKey: ["/api/projects/featured"],
  });
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

        {isLoading ? (
          <div className="text-center text-muted-foreground py-12">
            Loading projects...
          </div>
        ) : isError ? (
          <Card className="max-w-2xl mx-auto border-destructive">
            <CardContent className="py-12">
              <p className="text-center text-destructive">
                Failed to load projects. {error instanceof Error ? error.message : "Please try again later."}
              </p>
            </CardContent>
          </Card>
        ) : !projects || projects.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            No featured projects available yet.
          </div>
        ) : (
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
                  {project.projectUrl && (
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 text-primary hover:text-primary/80 transition-colors"
                      aria-label={`View ${project.title} project`}
                      data-testid={`link-project-${index}`}
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground" data-testid={`text-project-desc-${index}`}>
                  {project.description || project.longDescription}
                </p>
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tag, tagIndex) => (
                      <Badge
                        key={tagIndex}
                        variant="secondary"
                        data-testid={`badge-project-${index}-tag-${tagIndex}`}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
