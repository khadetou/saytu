"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Input } from "@workspace/ui/components/input";
import {
  Calendar,
  User,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  Edit,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import {
  TodoAPI,
  type TodoTask,
  type TodoQueryParams,
} from "@workspace/ui/lib/todo-api";
import { toast } from "sonner";

interface TodoTreeViewProps {
  companyId: number;
  onEditTodo?: (todo: TodoTask) => void;
  onCreateTodo?: () => void;
}

export function TodoTreeView({
  companyId,
  onEditTodo,
  onCreateTodo,
}: TodoTreeViewProps) {
  const [todos, setTodos] = useState<TodoTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "completed"
  >("all");
  const [filterPriority, setFilterPriority] = useState<
    "all" | "low" | "medium" | "high"
  >("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const params: TodoQueryParams = {
        companyId,
        search: searchQuery || undefined,
        status: filterStatus,
        priority: filterPriority,
        page,
        limit: 50,
        sortBy: "createdAt",
        sortOrder: "desc",
      };

      const response = await TodoAPI.getAllTodos(params);
      setTodos(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching todos:", error);
      toast.error("Erreur lors du chargement des tâches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [companyId, searchQuery, filterStatus, filterPriority, page]);

  const handleToggleTodo = async (id: number) => {
    try {
      await TodoAPI.toggleTodo(id);
      await fetchTodos();
      toast.success("Tâche mise à jour");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const handleDeleteTodo = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
      return;
    }

    try {
      await TodoAPI.deleteTodo(id);
      await fetchTodos();
      toast.success("Tâche supprimée");
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des tâches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Circle className="w-5 h-5" />
              Vue Liste ({todos.length} tâches)
            </CardTitle>
            <Button onClick={onCreateTodo} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nouvelle tâche
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Rechercher des tâches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En cours</option>
              <option value="completed">Terminées</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as any)}
              className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="all">Toutes priorités</option>
              <option value="high">Haute</option>
              <option value="medium">Moyenne</option>
              <option value="low">Basse</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Todo List */}
      <div className="space-y-2">
        {todos.map((todo) => (
          <Card
            key={todo.id}
            className={`group transition-all hover:shadow-md ${todo.completed ? "opacity-60" : ""}`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => handleToggleTodo(todo.id)}
                  className="mt-1"
                />
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <h3
                      className={`font-medium ${todo.completed ? "line-through" : ""}`}
                    >
                      {todo.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditTodo?.(todo)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTodo(todo.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {todo.description && (
                    <p className="text-sm text-muted-foreground">
                      {todo.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-xs">
                      {todo.category}
                    </Badge>
                    <Badge
                      className={`text-xs text-white ${getPriorityColor(todo.priority)}`}
                    >
                      {getPriorityLabel(todo.priority)}
                    </Badge>
                    {todo.dueDate && (
                      <Badge
                        variant="outline"
                        className="text-xs flex items-center gap-1"
                      >
                        <Calendar className="w-3 h-3" />
                        {new Date(todo.dueDate).toLocaleDateString("fr-FR")}
                      </Badge>
                    )}
                    {todo.assignedTo && (
                      <Badge
                        variant="outline"
                        className="text-xs flex items-center gap-1"
                      >
                        <User className="w-3 h-3" />
                        {todo.assignedTo.name}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Précédent
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} sur {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Suivant
          </Button>
        </div>
      )}

      {todos.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Circle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucune tâche trouvée</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || filterStatus !== "all" || filterPriority !== "all"
                ? "Essayez d'ajuster vos filtres de recherche"
                : "Commencez par créer votre première tâche"}
            </p>
            <Button onClick={onCreateTodo}>
              <Plus className="w-4 h-4 mr-2" />
              Créer une tâche
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
