"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import { Badge } from "@workspace/ui/components/badge";
import { 
  Save, 
  X, 
  Calendar, 
  User, 
  Tag,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { TodoAPI, type TodoTask, type CreateTodoData, type UpdateTodoData } from "@workspace/ui/lib/todo-api";
import { toast } from "sonner";

interface TodoFormProps {
  companyId: number;
  todo?: TodoTask | null;
  onSave?: (todo: TodoTask) => void;
  onCancel?: () => void;
  onClose?: () => void;
}

export function TodoForm({ companyId, todo, onSave, onCancel, onClose }: TodoFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as "low" | "medium" | "high",
    dueDate: "",
    category: "General",
    assignedToId: ""
  });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    if (todo) {
      setFormData({
        title: todo.title,
        description: todo.description || "",
        priority: todo.priority,
        dueDate: todo.dueDate ? todo.dueDate.split('T')[0] : "",
        category: todo.category,
        assignedToId: todo.assignedTo?.id || ""
      });
    }
  }, [todo]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await TodoAPI.getCategories(companyId);
        setCategories(cats);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [companyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Le titre est requis');
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
          dueDate: formData.dueDate || undefined,
          category: formData.category,
          assignedToId: formData.assignedToId || undefined
        };
        savedTodo = await TodoAPI.updateTodo(todo.id, updateData);
        toast.success('Tâche mise à jour avec succès');
      } else {
        // Create new todo
        const createData: CreateTodoData = {
          title: formData.title,
          description: formData.description || undefined,
          priority: formData.priority,
          dueDate: formData.dueDate || undefined,
          category: formData.category,
          assignedToId: formData.assignedToId || undefined,
          companyId
        };
        savedTodo = await TodoAPI.createTodo(createData);
        toast.success('Tâche créée avec succès');
      }

      onSave?.(savedTodo);
      onClose?.();
    } catch (error) {
      console.error('Error saving todo:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    onClose?.();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high": return "Haute";
      case "medium": return "Moyenne";
      case "low": return "Basse";
      default: return "Normale";
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {todo ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Modifier la tâche
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5" />
                Nouvelle tâche
              </>
            )}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={handleCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Entrez le titre de la tâche"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Décrivez la tâche (optionnel)"
              rows={3}
            />
          </div>

          {/* Priority and Category Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priorité</Label>
              <div className="space-y-2">
                <select
                  id="priority"
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="low">Basse</option>
                  <option value="medium">Moyenne</option>
                  <option value="high">Haute</option>
                </select>
                <Badge 
                  className={`text-xs text-white ${getPriorityColor(formData.priority)}`}
                >
                  {getPriorityLabel(formData.priority)}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <div className="space-y-2">
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="Catégorie"
                  list="categories"
                />
                <datalist id="categories">
                  {categories.map(cat => (
                    <option key={cat} value={cat} />
                  ))}
                  <option value="General" />
                  <option value="Travail" />
                  <option value="Personnel" />
                  <option value="Urgent" />
                </datalist>
                <Badge variant="outline" className="text-xs flex items-center gap-1 w-fit">
                  <Tag className="w-3 h-3" />
                  {formData.category}
                </Badge>
              </div>
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="dueDate">Date d'échéance</Label>
            <div className="space-y-2">
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              />
              {formData.dueDate && (
                <Badge variant="outline" className="text-xs flex items-center gap-1 w-fit">
                  <Calendar className="w-3 h-3" />
                  {new Date(formData.dueDate).toLocaleDateString('fr-FR')}
                </Badge>
              )}
            </div>
          </div>

          {/* Assigned To */}
          <div className="space-y-2">
            <Label htmlFor="assignedTo">Assigné à</Label>
            <Input
              id="assignedTo"
              value={formData.assignedToId}
              onChange={(e) => setFormData(prev => ({ ...prev, assignedToId: e.target.value }))}
              placeholder="ID de l'utilisateur (optionnel)"
            />
            {formData.assignedToId && (
              <Badge variant="outline" className="text-xs flex items-center gap-1 w-fit">
                <User className="w-3 h-3" />
                {formData.assignedToId}
              </Badge>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {todo ? 'Mettre à jour' : 'Créer'}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
