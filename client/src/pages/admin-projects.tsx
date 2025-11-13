import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Project, InsertProject } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminProjects() {
  const { toast } = useToast();
  const [editing, setEditing] = useState<number | "new" | null>(null);
  const [formData, setFormData] = useState<Partial<InsertProject>>({});
  const [uploading, setUploading] = useState(false);

  const { data: projects, isLoading, isError, error } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertProject) => apiRequest("/api/projects", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects/featured"] });
      setEditing(null);
      setFormData({});
      toast({ title: "Project created successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to create project", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertProject> }) =>
      apiRequest(`/api/projects/${id}`, "PATCH", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects/featured"] });
      setEditing(null);
      setFormData({});
      toast({ title: "Project updated successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to update project", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/projects/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects/featured"] });
      toast({ title: "Project deleted successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to delete project", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.technologies) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    if (editing === "new") {
      createMutation.mutate(formData as InsertProject);
    } else if (typeof editing === "number") {
      updateMutation.mutate({ id: editing, data: formData });
    }
  };

  const startEdit = (project: Project) => {
    setEditing(project.id);
    setFormData({
      title: project.title,
      description: project.description,
      longDescription: project.longDescription,
      technologies: project.technologies,
      imageUrl: project.imageUrl,
      projectUrl: project.projectUrl,
      featured: project.featured,
      displayOrder: project.displayOrder,
    });
  };

  const handleTechInput = (value: string) => {
    const techs = value.split(",").map((t) => t.trim()).filter(Boolean);
    setFormData({ ...formData, technologies: techs });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validation
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast({ title: "File too large. Max size is 5MB", variant: "destructive" });
      return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast({ title: "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setFormData(prev => ({ ...prev, imageUrl: data.url }));
      toast({ title: "Image uploaded successfully!" });
    } catch (error) {
      console.error("Upload error:", error);
      const message = error instanceof Error ? error.message : "Failed to upload image";
      toast({ title: message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Manage Projects</h1>
          <Button
            onClick={() => {
              setEditing("new");
              setFormData({
                title: "",
                description: "",
                technologies: [],
                featured: false,
                displayOrder: 0,
              });
            }}
            data-testid="button-add-project"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </div>

        {editing && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {editing === "new" ? "Create New Project" : "Edit Project"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title || ""}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    data-testid="input-project-title"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    data-testid="input-project-description"
                  />
                </div>

                <div>
                  <Label htmlFor="longDescription">Long Description</Label>
                  <Textarea
                    id="longDescription"
                    value={formData.longDescription || ""}
                    onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                    data-testid="input-project-long-description"
                  />
                </div>

                <div>
                  <Label htmlFor="technologies">Technologies (comma-separated) *</Label>
                  <Input
                    id="technologies"
                    value={formData.technologies?.join(", ") || ""}
                    onChange={(e) => handleTechInput(e.target.value)}
                    placeholder="SWMM, Python, GIS"
                    required
                    data-testid="input-project-technologies"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageFile">Upload Image</Label>
                  <Input
                    type="file"
                    id="imageFile"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    data-testid="input-project-image-file"
                  />
                  <p className="text-xs text-muted-foreground">
                    Max size: 5MB. Formats: JPEG, PNG, GIF, WebP
                  </p>
                  {uploading && (
                    <p className="text-xs text-primary">Uploading...</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="imageUrl">Or Image URL</Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl || ""}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    data-testid="input-project-image-url"
                  />
                  <p className="text-xs text-muted-foreground">
                    Alternatively, provide an external image URL
                  </p>
                </div>

                {formData.imageUrl && (
                  <div>
                    <Label>Image Preview</Label>
                    <div className="mt-2 rounded-md border p-2">
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="max-h-48 object-contain"
                        data-testid="img-project-preview"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="projectUrl">Project URL</Label>
                  <Input
                    id="projectUrl"
                    value={formData.projectUrl || ""}
                    onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
                    data-testid="input-project-url"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured || false}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      data-testid="checkbox-project-featured"
                    />
                    <Label htmlFor="featured">Featured</Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Label htmlFor="displayOrder">Display Order</Label>
                    <Input
                      type="number"
                      id="displayOrder"
                      value={formData.displayOrder || 0}
                      onChange={(e) =>
                        setFormData({ ...formData, displayOrder: parseInt(e.target.value) })
                      }
                      className="w-24"
                      data-testid="input-project-display-order"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" data-testid="button-save-project">
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditing(null);
                      setFormData({});
                    }}
                    data-testid="button-cancel-edit"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="text-center text-muted-foreground py-12">Loading projects...</div>
        ) : isError ? (
          <Card className="border-destructive">
            <CardContent className="py-12">
              <p className="text-center text-destructive">
                Failed to load projects. {error instanceof Error ? error.message : "Please try again."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {projects?.map((project) => (
              <Card key={project.id} data-testid={`card-project-${project.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl flex items-center gap-2">
                        {project.title}
                        {project.featured && (
                          <Badge variant="default" className="text-xs">
                            Featured
                          </Badge>
                        )}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Display Order: {project.displayOrder}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => startEdit(project)}
                        data-testid={`button-edit-project-${project.id}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this project?")) {
                            deleteMutation.mutate(project.id);
                          }
                        }}
                        data-testid={`button-delete-project-${project.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-3">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies?.map((tech, index) => (
                      <Badge key={index} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  {project.projectUrl && (
                    <p className="text-sm text-muted-foreground mt-3">
                      URL: <a href={project.projectUrl} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">{project.projectUrl}</a>
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
