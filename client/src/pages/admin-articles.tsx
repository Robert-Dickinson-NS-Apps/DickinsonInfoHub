import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Pencil, Trash2, Calendar, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { insertArticleSchema, type Article, type InsertArticle } from "@shared/schema";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Extend schema for form validation
const articleFormSchema = insertArticleSchema.extend({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
});

type ArticleFormData = z.infer<typeof articleFormSchema>;

export default function AdminArticles() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const { data: articles, isLoading, error } = useQuery<Article[]>({
    queryKey: ["/api/admin/articles"],
  });

  const form = useForm<ArticleFormData>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      published: false,
      publishedAt: null,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertArticle) => {
      return await apiRequest("POST", "/api/admin/articles", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/articles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      toast({ title: "Article created successfully" });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({ 
        title: "Failed to create article", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertArticle> }) => {
      return await apiRequest("PATCH", `/api/admin/articles/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/articles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      toast({ title: "Article updated successfully" });
      setIsDialogOpen(false);
      setEditingArticle(null);
      form.reset();
    },
    onError: (error: Error) => {
      toast({ 
        title: "Failed to update article", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/admin/articles/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/articles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      toast({ title: "Article deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Failed to delete article", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const handleSubmit = async (data: ArticleFormData) => {
    try {
      if (editingArticle) {
        await updateMutation.mutateAsync({ id: editingArticle.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
    } catch (error) {
      // Error is already handled in mutation callbacks
      console.error("Submit error:", error);
    }
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    form.reset({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      published: article.published ?? false,
      publishedAt: article.publishedAt,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this article?")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingArticle(null);
    setShowPreview(false);
    form.reset();
  };

  // Auto-generate slug from title
  const watchTitle = form.watch("title");
  const handleTitleChange = (value: string) => {
    form.setValue("title", value);
    if (!editingArticle) {
      form.setValue("slug", generateSlug(value));
    }
  };

  const watchContent = form.watch("content");

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold" data-testid="text-admin-articles-title">
              Manage Articles
            </h1>
            <p className="text-muted-foreground">
              Create and manage your technical blog articles
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
              <Button data-testid="button-create-article">
                <Plus className="h-4 w-4 mr-2" />
                New Article
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingArticle ? "Edit Article" : "Create New Article"}
                </DialogTitle>
                <DialogDescription>
                  {editingArticle ? "Update your article details" : "Create a new article for your blog"}
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            value={field.value ?? ""}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            placeholder="Enter article title"
                            data-testid="input-article-title"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug (URL)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            value={field.value ?? ""}
                            placeholder="article-url-slug"
                            data-testid="input-article-slug"
                          />
                        </FormControl>
                        <FormDescription>
                          Auto-generated from title. You can customize it if needed.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="excerpt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Excerpt</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            value={field.value ?? ""}
                            placeholder="Brief summary of the article"
                            rows={3}
                            data-testid="input-article-excerpt"
                          />
                        </FormControl>
                        <FormDescription>
                          This will be displayed in the article listing
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center justify-between">
                          <span>Content (Markdown)</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowPreview(!showPreview)}
                            data-testid="button-toggle-preview"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            {showPreview ? "Hide Preview" : "Show Preview"}
                          </Button>
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            value={field.value ?? ""}
                            placeholder="Write your article content in Markdown format..."
                            rows={15}
                            className="font-mono text-sm"
                            data-testid="input-article-content"
                          />
                        </FormControl>
                        {showPreview && watchContent && (
                          <div className="mt-4 p-4 rounded-md border">
                            <div className="text-sm font-semibold mb-2">Preview:</div>
                            <div className="prose dark:prose-invert max-w-none" data-testid="article-preview">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {watchContent}
                              </ReactMarkdown>
                            </div>
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="published"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Published</FormLabel>
                          <FormDescription>
                            Make this article visible to the public
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value ?? false}
                            onCheckedChange={field.onChange}
                            data-testid="switch-article-published"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleDialogClose}
                      data-testid="button-cancel-article"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createMutation.isPending || updateMutation.isPending}
                      data-testid="button-save-article"
                    >
                      {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Article"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {error && (
          <Card data-testid="error-admin-articles">
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">Failed to load articles. Please try again later.</p>
            </CardContent>
          </Card>
        )}

        {articles && articles.length === 0 && (
          <Card data-testid="empty-admin-articles">
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground mb-4">No articles yet. Create your first article!</p>
            </CardContent>
          </Card>
        )}

        {articles && articles.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Card key={article.id} data-testid={`card-article-${article.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-xl line-clamp-2" data-testid={`text-article-title-${article.id}`}>
                      {article.title}
                    </CardTitle>
                    {article.published ? (
                      <Badge variant="default" data-testid={`badge-published-${article.id}`}>
                        Published
                      </Badge>
                    ) : (
                      <Badge variant="secondary" data-testid={`badge-draft-${article.id}`}>
                        Draft
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="flex items-center gap-2" data-testid={`text-article-date-${article.id}`}>
                    <Calendar className="h-4 w-4" />
                    {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Not published'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3" data-testid={`text-article-excerpt-${article.id}`}>
                    {article.excerpt}
                  </p>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(article)}
                    data-testid={`button-edit-article-${article.id}`}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(article.id)}
                    disabled={deleteMutation.isPending}
                    data-testid={`button-delete-article-${article.id}`}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
