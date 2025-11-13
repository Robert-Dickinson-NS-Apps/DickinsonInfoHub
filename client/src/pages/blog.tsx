import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Calendar } from "lucide-react";
import type { Article } from "@shared/schema";

export default function Blog() {
  const { data: articles, isLoading, error } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-blog-title">
              Technical Articles
            </h1>
            <p className="text-lg text-muted-foreground" data-testid="text-blog-subtitle">
              Insights on Storm Water Management, SWMM modeling, and environmental engineering
            </p>
          </div>

          {isLoading && (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} data-testid={`skeleton-article-${i}`}>
                  <CardHeader>
                    <Skeleton className="h-8 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {error && (
            <Card data-testid="error-articles">
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">Failed to load articles. Please try again later.</p>
              </CardContent>
            </Card>
          )}

          {articles && articles.length === 0 && (
            <Card data-testid="empty-articles">
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No articles published yet. Check back soon!</p>
              </CardContent>
            </Card>
          )}

          {articles && articles.length > 0 && (
            <div className="space-y-6">
              {articles.map((article) => (
                <Link key={article.id} href={`/blog/${article.slug}`}>
                  <a data-testid={`link-article-${article.slug}`}>
                    <Card className="hover-elevate active-elevate-2">
                      <CardHeader>
                        <CardTitle className="text-2xl" data-testid={`text-article-title-${article.id}`}>
                          {article.title}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2" data-testid={`text-article-date-${article.id}`}>
                          <Calendar className="h-4 w-4" />
                          {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : 'Draft'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground line-clamp-3" data-testid={`text-article-excerpt-${article.id}`}>
                          {article.excerpt}
                        </p>
                      </CardContent>
                      <CardFooter>
                        <div className="flex items-center gap-2 text-primary">
                          <span>Read more</span>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </CardFooter>
                    </Card>
                  </a>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
