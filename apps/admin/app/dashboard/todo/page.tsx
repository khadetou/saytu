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
import { TodoTreeView } from "@workspace/ui/components/todo/todo-tree-view";
import { TodoKanbanView } from "@workspace/ui/components/todo/todo-kanban-view";
import { TodoEnterpriseForm } from "@workspace/ui/components/todo/todo-enterprise-form";
import {
  TodoAPI,
  type TodoTask,
  type TodoStats,
} from "@workspace/ui/lib/todo-api";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  List,
  LayoutGrid,
  Plus,
  Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ViewType = "tree" | "kanban" | "form";

export default function TodoPage() {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<ViewType>("tree");
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<TodoTask | null>(null);
  const [stats, setStats] = useState<TodoStats>({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
  });
  const [loading, setLoading] = useState(true);

  // Mock company ID - in real app, get from auth context
  const companyId = 1;

  const fetchStats = async () => {
    try {
      const todoStats = await TodoAPI.getTodoStats(companyId);
      setStats(todoStats);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [companyId]);

  const handleCreateTodo = () => {
    setEditingTodo(null);
    setShowForm(true);
  };

  const handleEditTodo = (todo: TodoTask) => {
    setEditingTodo(todo);
    setShowForm(true);
  };

  const handleSaveTodo = (todo: TodoTask) => {
    setShowForm(false);
    setEditingTodo(null);
    fetchStats(); // Refresh stats
    toast.success(editingTodo ? "Tâche mise à jour" : "Tâche créée");
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTodo(null);
  };

  const getViewIcon = (view: ViewType) => {
    switch (view) {
      case "tree":
        return <List className="w-4 h-4" />;
      case "kanban":
        return <LayoutGrid className="w-4 h-4" />;
      case "form":
        return <Plus className="w-4 h-4" />;
    }
  };

  const getViewLabel = (view: ViewType) => {
    switch (view) {
      case "tree":
        return "Liste";
      case "kanban":
        return "Kanban";
      case "form":
        return "Formulaire";
    }
  };

  if (showForm) {
    return (
      <TodoEnterpriseForm
        companyId={companyId}
        todo={editingTodo}
        onSave={handleSaveTodo}
        onCancel={handleCancelForm}
        onClose={handleCancelForm}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                  ✏️ To-do
                </h1>
                <p className="text-muted-foreground">
                  Gestionnaire de tâches et projets
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* View Switcher */}
              <div className="flex items-center border rounded-lg p-1">
                {(["tree", "kanban"] as ViewType[]).map((view) => (
                  <Button
                    key={view}
                    variant={currentView === view ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentView(view)}
                    className="flex items-center gap-2"
                  >
                    {getViewIcon(view)}
                    {getViewLabel(view)}
                  </Button>
                ))}
              </div>
              <Button
                onClick={handleCreateTodo}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nouvelle tâche
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Stats */}
          {!loading && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Circle className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold">{stats.total}</p>
                      <p className="text-sm text-muted-foreground">Total</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">{stats.completed}</p>
                      <p className="text-sm text-muted-foreground">Terminées</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="text-2xl font-bold">{stats.pending}</p>
                      <p className="text-sm text-muted-foreground">En cours</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="text-2xl font-bold">{stats.overdue}</p>
                      <p className="text-sm text-muted-foreground">En retard</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Content */}
          {currentView === "tree" && (
            <TodoTreeView
              companyId={companyId}
              onEditTodo={handleEditTodo}
              onCreateTodo={handleCreateTodo}
            />
          )}

          {currentView === "kanban" && (
            <TodoKanbanView
              companyId={companyId}
              onEditTodo={handleEditTodo}
              onCreateTodo={handleCreateTodo}
            />
          )}
        </div>
      </div>
    </div>
  );
}
