import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, BarChart3, Cog } from "lucide-react";

const expertiseAreas = [
  {
    icon: Droplets,
    title: "Storm Water Modeling",
    description:
      "Expert in SWMM (Storm Water Management Model) for analyzing and designing urban drainage systems, flood control, and water quality management.",
  },
  {
    icon: BarChart3,
    title: "Data Analysis & Simulation",
    description:
      "Advanced computational modeling and data analysis for predicting water flow patterns, runoff volumes, and system performance under various scenarios.",
  },
  {
    icon: Cog,
    title: "Infrastructure Engineering",
    description:
      "Design and optimization of water treatment facilities, pumping stations, detention basins, and sustainable urban drainage systems (SUDS).",
  },
];

export function ExpertiseSection() {
  return (
    <section id="expertise" className="py-24 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold mb-6"
            data-testid="text-expertise-heading"
          >
            Areas of Expertise
          </h2>
          <p
            className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto"
            data-testid="text-expertise-subtitle"
          >
            Combining technical knowledge with innovative solutions to tackle 
            complex water management challenges
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {expertiseAreas.map((area, index) => (
            <Card
              key={index}
              className="hover-elevate active-elevate-2 transition-all duration-200"
              data-testid={`card-expertise-${index}`}
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                  <area.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl" data-testid={`text-expertise-title-${index}`}>
                  {area.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground" data-testid={`text-expertise-desc-${index}`}>
                  {area.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
