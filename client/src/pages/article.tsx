import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Calendar } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Article } from "@shared/schema";

type SlugState =
  | { status: "loading" }
  | { status: "ready"; slug: string }
  | { status: "notFound" };

function useArticleSlugState(): SlugState {
  const [match, params] = useRoute("/blog/:slug");
  const [state, setState] = useState<SlugState>({ status: "loading" });

  useEffect(() => {
    // Route doesn't match at all
    if (!match) {
      setState((prev) => prev.status === "notFound" ? prev : { status: "notFound" });
      return;
    }

    // Route matches, check slug
    const normalizedSlug = params?.slug?.trim();
    if (normalizedSlug && normalizedSlug.length > 0) {
      setState((prev) => 
        prev.status === "ready" && prev.slug === normalizedSlug 
          ? prev 
          : { status: "ready", slug: normalizedSlug }
      );
    } else {
      // Route matches but slug is still loading (empty during transition)
      setState((prev) => prev.status === "loading" ? prev : { status: "loading" });
    }
  }, [match, params?.slug]);

  return state;
}

function ArticleContent({ slug }: { slug: string }) {
  const { data: article, isLoading, error } = useQuery<Article>({
    queryKey: ["/api/articles", slug],
    queryFn: async () => {
      const res = await fetch(`/api/articles/${slug}`);
      if (!res.ok) {
        throw new Error(`${res.status}: ${await res.text()}`);
      }
      return await res.json();
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Link href="/blog">
            <a>
              <Button variant="ghost" className="mb-8" data-testid="button-back-to-blog">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Articles
              </Button>
            </a>
          </Link>

          {isLoading && (
            <div data-testid="skeleton-article">
              <Skeleton className="h-12 w-3/4 mb-4" />
              <Skeleton className="h-6 w-1/4 mb-8" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          )}

          {error && (
            <Card data-testid="error-article">
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">Failed to load article. It may have been removed or the link is incorrect.</p>
              </CardContent>
            </Card>
          )}

          {article && (
            <article data-testid={`article-${article.slug}`}>
              <header className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-article-title">
                  {article.title}
                </h1>
                <div className="flex items-center gap-2 text-muted-foreground" data-testid="text-article-date">
                  <Calendar className="h-4 w-4" />
                  {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'Draft'}
                </div>
              </header>

              <div 
                className="prose prose-lg dark:prose-invert max-w-none"
                data-testid="article-content"
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {article.content}
                </ReactMarkdown>
              </div>
            </article>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ArticlePage() {
  const slugState = useArticleSlugState();

  if (slugState.status === "loading") {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <Skeleton className="h-12 w-3/4 mb-4" data-testid="skeleton-loading" />
            <Skeleton className="h-6 w-1/4 mb-8" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (slugState.status === "notFound") {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <Card data-testid="error-not-found">
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">Article not found.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Only render ArticleContent when status is "ready" with valid slug
  return <ArticleContent slug={slugState.slug} />;
}
