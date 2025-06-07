"use client";

import { useState, useEffect } from "react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";
import { Card, CardContent } from "@workspace/ui/components/card";
import { DatePicker } from "@workspace/ui/components/date-picker";
import { SlashCommandEditor } from "@workspace/ui/components/slash-command-editor";
import {
  Save,
  Edit,
  Archive,
  MoreHorizontal,
  Calendar,
  User,
  Tag,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowLeft,
} from "lucide-react";
import {
  TodoAPI,
  type TodoTask,
  type CreateTodoData,
  type UpdateTodoData,
} from "@workspace/ui/lib/todo-api";
import { toast } from "sonner";

interface TodoEnterpriseFormProps {
  companyId: number;
  todo?: TodoTask | null;
  onSave?: (todo: TodoTask) => void;
  onCancel?: () => void;
  onClose?: () => void;
}

export function TodoEnterpriseForm({
  companyId,
  todo,
  onSave,
  onCancel,
  onClose,
}: TodoEnterpriseFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as "low" | "medium" | "high",
    dueDate: undefined as Date | undefined,
    category: "General",
    assignedToId: "",
  });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(!todo);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    if (todo) {
      setFormData({
        title: todo.title,
        description: todo.description || "",
        priority: todo.priority,
        dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
        category: todo.category,
        assignedToId: todo.assignedTo?.id || "",
      });
    }
  }, [todo]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await TodoAPI.getCategories(companyId);
        setCategories(cats);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [companyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Le titre est requis");
      return;
    }

    setLoading(true);

    try {
      let savedTodo: TodoTask;

      if (todo) {
        // Update existing todo
        const updateData: UpdateTodoData = {
          title: formData.title,
          description: formData.description || undefined,
          priority: formData.priority,
          dueDate: formData.dueDate
            ? formData.dueDate.toISOString()
            : undefined,
          category: formData.category,
          assignedToId: formData.assignedToId || undefined,
        };
        savedTodo = await TodoAPI.updateTodo(todo.id, updateData);
        toast.success("Tâche mise à jour avec succès");
      } else {
        // Create new todo
        const createData: CreateTodoData = {
          title: formData.title,
          description: formData.description || undefined,
          priority: formData.priority,
          dueDate: formData.dueDate
            ? formData.dueDate.toISOString()
            : undefined,
          category: formData.category,
          assignedToId: formData.assignedToId || undefined,
          companyId,
        };
        savedTodo = await TodoAPI.createTodo(createData);
        toast.success("Tâche créée avec succès");
      }

      setIsEditing(false);
      onSave?.(savedTodo);
    } catch (error) {
      console.error("Error saving todo:", error);
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (todo) {
      setIsEditing(false);
      // Reset form data
      setFormData({
        title: todo.title,
        description: todo.description || "",
        priority: todo.priority,
        dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
        category: todo.category,
        assignedToId: todo.assignedTo?.id || "",
      });
    } else {
      onCancel?.();
      onClose?.();
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "Haute";
      case "medium":
        return "Moyenne";
      case "low":
        return "Basse";
      default:
        return "Normale";
    }
  };

  const getStatusColor = (completed: boolean) => {
    return completed
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-blue-100 text-blue-800 border-blue-200";
  };

  const getStatusLabel = (completed: boolean) => {
    return completed ? "Terminé" : "En cours";
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* Header - Enterprise Style */}
      <div className="bg-[#2d3748] border-b border-[#4a5568] sticky top-0 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Left side - Title and breadcrumb */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-[#4a5568]"
              >
                <ArrowLeft className="w-4 h-4" />
                To-do
              </Button>
              <Separator orientation="vertical" className="h-6 bg-[#4a5568]" />
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-medium text-white">
                  {todo
                    ? formData.title || "Tâche sans titre"
                    : "Nouvelle tâche"}
                </h1>
                {todo && (
                  <Badge
                    variant="outline"
                    className={`${getStatusColor(todo.completed)} border text-xs`}
                  >
                    {getStatusLabel(todo.completed)}
                  </Badge>
                )}
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center space-x-2">
              {todo && !isEditing && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 border-[#4a5568] text-gray-300 hover:text-white hover:bg-[#4a5568]"
                  >
                    <Edit className="w-4 h-4" />
                    Modifier
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 border-[#4a5568] text-gray-300 hover:text-white hover:bg-[#4a5568]"
                  >
                    <Archive className="w-4 h-4" />
                    Archiver
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#4a5568] text-gray-300 hover:text-white hover:bg-[#4a5568]"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </>
              )}

              {isEditing && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    disabled={loading}
                    className="border-[#4a5568] text-gray-300 hover:text-white hover:bg-[#4a5568]"
                  >
                    Annuler
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-[#3182ce] hover:bg-[#2c5aa0] text-white"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sauvegarde...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Sauvegarder
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form - Left Column */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg bg-[#2d3748] border-[#4a5568]">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div className="space-y-3">
                    <Label
                      htmlFor="title"
                      className="text-sm font-medium text-gray-300"
                    >
                      Titre *
                    </Label>
                    {isEditing ? (
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        placeholder="Entrez le titre de la tâche"
                        className="text-lg font-medium bg-[#1a1a1a] border-[#4a5568] text-white placeholder:text-gray-400 focus:border-[#3182ce]"
                        required
                      />
                    ) : (
                      <div className="text-lg font-medium text-white py-2">
                        {formData.title || "Titre non défini"}
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="space-y-3">
                    <Label
                      htmlFor="description"
                      className="text-sm font-medium text-gray-300"
                    >
                      Description
                    </Label>
                    {isEditing ? (
                      <SlashCommandEditor
                        value={formData.description}
                        onChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            description: value,
                          }))
                        }
                        placeholder="Décrivez la tâche en Markdown... Tapez / pour voir les commandes"
                        minHeight="400px"
                      />
                    ) : (
                      <div className="text-gray-300 py-2 min-h-[200px] whitespace-pre-wrap">
                        {formData.description || "Aucune description"}
                      </div>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Right Column */}
          <div className="space-y-4">
            {/* Priority */}
            <Card className="shadow-lg bg-[#2d3748] border-[#4a5568] border-l-4 border-l-orange-400">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-gray-400" />
                    <Label className="text-sm font-medium text-gray-300">
                      Priorité
                    </Label>
                  </div>
                  {isEditing ? (
                    <select
                      value={formData.priority}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          priority: e.target.value as any,
                        }))
                      }
                      className="w-full rounded-md border border-[#4a5568] bg-[#1a1a1a] text-white px-3 py-2 text-sm focus:border-[#3182ce] focus:ring-1 focus:ring-[#3182ce] focus:outline-none"
                    >
                      <option value="low">Basse</option>
                      <option value="medium">Moyenne</option>
                      <option value="high">Haute</option>
                    </select>
                  ) : (
                    <Badge
                      className={`${getPriorityColor(formData.priority)} border`}
                    >
                      {getPriorityLabel(formData.priority)}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Due Date */}
            <Card className="shadow-lg bg-[#2d3748] border-[#4a5568] border-l-4 border-l-blue-400">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <Label className="text-sm font-medium text-gray-300">
                      Date d'échéance
                    </Label>
                  </div>
                  {isEditing ? (
                    <DatePicker
                      date={formData.dueDate}
                      onDateChange={(date) =>
                        setFormData((prev) => ({
                          ...prev,
                          dueDate: date,
                        }))
                      }
                      placeholder="Sélectionner une date d'échéance"
                      className="text-sm bg-[#1a1a1a] border-[#4a5568] text-white"
                    />
                  ) : (
                    <div className="text-sm text-gray-300">
                      {formData.dueDate
                        ? formData.dueDate.toLocaleDateString("fr-FR", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "Aucune date définie"}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Category */}
            <Card className="shadow-lg bg-[#2d3748] border-[#4a5568] border-l-4 border-l-green-400">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-gray-400" />
                    <Label className="text-sm font-medium text-gray-300">
                      Catégorie
                    </Label>
                  </div>
                  {isEditing ? (
                    <Input
                      value={formData.category}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                      placeholder="Catégorie"
                      list="categories"
                      className="text-sm bg-[#1a1a1a] border-[#4a5568] text-white placeholder:text-gray-400 focus:border-[#3182ce]"
                    />
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-xs border-[#4a5568] text-gray-300"
                    >
                      {formData.category}
                    </Badge>
                  )}
                  <datalist id="categories">
                    {categories.map((cat) => (
                      <option key={cat} value={cat} />
                    ))}
                    <option value="General" />
                    <option value="Travail" />
                    <option value="Personnel" />
                    <option value="Urgent" />
                  </datalist>
                </div>
              </CardContent>
            </Card>

            {/* Assigned To */}
            <Card className="shadow-lg bg-[#2d3748] border-[#4a5568] border-l-4 border-l-purple-400">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <Label className="text-sm font-medium text-gray-300">
                      Assigné à
                    </Label>
                  </div>
                  {isEditing ? (
                    <Input
                      value={formData.assignedToId}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          assignedToId: e.target.value,
                        }))
                      }
                      placeholder="Utilisateur"
                      className="text-sm bg-[#1a1a1a] border-[#4a5568] text-white placeholder:text-gray-400 focus:border-[#3182ce]"
                    />
                  ) : (
                    <div className="text-sm text-gray-300">
                      {formData.assignedToId || "Non assigné"}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Timestamps */}
            {todo && (
              <Card className="shadow-lg bg-[#2d3748] border-[#4a5568] border-l-4 border-l-gray-400">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <Label className="text-sm font-medium text-gray-300">
                        Informations
                      </Label>
                    </div>
                    <div className="space-y-2 text-xs text-gray-400">
                      <div>
                        Créé le{" "}
                        {new Date(todo.createdAt).toLocaleDateString("fr-FR")}
                      </div>
                      <div>
                        Modifié le{" "}
                        {new Date(todo.updatedAt).toLocaleDateString("fr-FR")}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
