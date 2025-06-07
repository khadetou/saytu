"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Input } from "@workspace/ui/components/input";
import { 
  Calendar, 
  User, 
  Plus, 
  Search,
  Edit,
  Trash2,
  MoreHorizontal,
  Clock,
  AlertCircle
} from "lucide-react";
import { TodoAPI, type TodoTask, type TodoQueryParams } from "@workspace/ui/lib/todo-api";
import { toast } from "sonner";

interface TodoKanbanViewProps {
  companyId: number;
  onEditTodo?: (todo: TodoTask) => void;
  onCreateTodo?: () => void;
}

interface KanbanColumn {
  id: string;
  title: string;
  status: "pending" | "completed";
  color: string;
  todos: TodoTask[];
}

export function TodoKanbanView({ companyId, onEditTodo, onCreateTodo }: TodoKanbanViewProps) {
  const [columns, setColumns] = useState<KanbanColumn[]>([
    { id: "todo", title: "À faire", status: "pending", color: "bg-blue-500", todos: [] },
    { id: "in-progress", title: "En cours", status: "pending", color: "bg-yellow-500", todos: [] },
    { id: "done", title: "Terminé", status: "completed", color: "bg-green-500", todos: [] }
  ]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const params: TodoQueryParams = {
        companyId,
        search: searchQuery || undefined,
        limit: 100,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      };

      const response = await TodoAPI.getAllTodos(params);
      
      // Distribute todos across columns
      const todoTodos = response.data.filter(todo => !todo.completed && todo.priority === 'low');
      const inProgressTodos = response.data.filter(todo => !todo.completed && ['medium', 'high'].includes(todo.priority));
      const doneTodos = response.data.filter(todo => todo.completed);

      setColumns([
        { id: "todo", title: "À faire", status: "pending", color: "bg-blue-500", todos: todoTodos },
        { id: "in-progress", title: "En cours", status: "pending", color: "bg-yellow-500", todos: inProgressTodos },
        { id: "done", title: "Terminé", status: "completed", color: "bg-green-500", todos: doneTodos }
      ]);
    } catch (error) {
      console.error('Error fetching todos:', error);
      toast.error('Erreur lors du chargement des tâches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [companyId, searchQuery]);

  const handleToggleTodo = async (id: number) => {
    try {
      await TodoAPI.toggleTodo(id);
      await fetchTodos();
      toast.success('Tâche mise à jour');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleDeleteTodo = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      return;
    }

    try {
      await TodoAPI.deleteTodo(id);
      await fetchTodos();
      toast.success('Tâche supprimée');
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleMoveTodo = async (todo: TodoTask, newStatus: "pending" | "completed") => {
    try {
      await TodoAPI.updateTodo(todo.id, { completed: newStatus === "completed" });
      await fetchTodos();
      toast.success('Tâche déplacée');
    } catch (error) {
      toast.error('Erreur lors du déplacement');
    }
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

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement du tableau Kanban...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              📋 Vue Kanban
            </CardTitle>
            <Button onClick={onCreateTodo} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nouvelle tâche
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher des tâches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 max-w-md"
            />
          </div>
        </CardContent>
      </Card>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => (
          <div key={column.id} className="space-y-4">
            {/* Column Header */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
                    {column.title}
                  </div>
                  <Badge variant="secondary">{column.todos.length}</Badge>
                </CardTitle>
              </CardHeader>
            </Card>

            {/* Column Content */}
            <div className="space-y-3 min-h-[400px]">
              {column.todos.map((todo) => (
                <Card key={todo.id} className="group hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Title and Actions */}
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium text-sm leading-tight">
                          {todo.title}
                        </h3>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditTodo?.(todo)}
                            className="h-6 w-6 p-0"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTodo(todo.id)}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Description */}
                      {todo.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {todo.description}
                        </p>
                      )}

                      {/* Badges */}
                      <div className="flex items-center gap-1 flex-wrap">
                        <Badge 
                          className={`text-xs text-white ${getPriorityColor(todo.priority)}`}
                        >
                          {getPriorityLabel(todo.priority)}
                        </Badge>
                        
                        {todo.dueDate && (
                          <Badge 
                            variant={isOverdue(todo.dueDate) ? "destructive" : "outline"} 
                            className="text-xs flex items-center gap-1"
                          >
                            {isOverdue(todo.dueDate) ? (
                              <AlertCircle className="w-3 h-3" />
                            ) : (
                              <Calendar className="w-3 h-3" />
                            )}
                            {new Date(todo.dueDate).toLocaleDateString('fr-FR')}
                          </Badge>
                        )}

                        {todo.assignedTo && (
                          <Badge variant="outline" className="text-xs flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {todo.assignedTo.name.split(' ')[0]}
                          </Badge>
                        )}
                      </div>

                      {/* Move Actions */}
                      <div className="flex items-center gap-2 pt-2 border-t">
                        {column.status === "pending" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMoveTodo(todo, "completed")}
                            className="text-xs h-6"
                          >
                            ✓ Terminer
                          </Button>
                        )}
                        {column.status === "completed" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMoveTodo(todo, "pending")}
                            className="text-xs h-6"
                          >
                            ↺ Rouvrir
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Add Task Button */}
              <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-4">
                  <Button
                    variant="ghost"
                    onClick={onCreateTodo}
                    className="w-full h-auto p-4 text-muted-foreground hover:text-primary"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter une tâche
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
