"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { ModuleManager, type Module } from "@workspace/ui/lib/modules";
import { cn } from "@workspace/ui/lib/utils";
import { MoreHorizontal, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface DashboardAppGridProps {
  onAppOpen?: (module: Module) => void;
  onAppUninstall?: (module: Module) => void;
}

export function DashboardAppGrid({
  onAppOpen,
  onAppUninstall,
}: DashboardAppGridProps) {
  const router = useRouter();
  const [installedModules, setInstalledModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstalledModules = async () => {
      try {
        const modules = await ModuleManager.getInstalledModules();
        setInstalledModules(modules);
      } catch (error) {
        console.error("Error fetching installed modules:", error);
        toast.error("Erreur lors du chargement des modules installés");
      } finally {
        setLoading(false);
      }
    };

    fetchInstalledModules();
  }, []);

  const handleAppClick = (module: Module) => {
    if (onAppOpen) {
      onAppOpen(module);
    } else {
      router.push(module.route);
    }
  };

  const handleUninstall = (module: Module, event: React.MouseEvent) => {
    event.stopPropagation();
    if (onAppUninstall) {
      onAppUninstall(module);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">
              Chargement des applications...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Applications installées
          </h2>
          <p className="text-muted-foreground">
            Cliquez sur une application pour l'ouvrir
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/apps")}
          className="flex items-center gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          Parcourir les apps
        </Button>
      </div>

      {/* Apps Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {installedModules.map((module) => (
          <Card
            key={module.id}
            className="group cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1 bg-card/50 backdrop-blur-sm border-border/50"
            onClick={() => handleAppClick(module)}
          >
            <CardContent className="p-4 flex flex-col items-center text-center space-y-3">
              {/* App Icon */}
              <div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg",
                  module.color
                )}
              >
                {module.icon}
              </div>

              {/* App Name */}
              <div className="space-y-1">
                <h3 className="font-medium text-sm leading-tight line-clamp-2">
                  {module.name}
                </h3>
                {module.isCore && (
                  <Badge variant="secondary" className="text-xs">
                    Core
                  </Badge>
                )}
              </div>

              {/* Actions */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                {!module.isCore && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleUninstall(module, e)}
                    className="h-6 w-6 p-0"
                  >
                    <MoreHorizontal className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add New App Card */}
        <Card
          className="group cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1 bg-card/30 backdrop-blur-sm border-dashed border-2 border-border/50"
          onClick={() => router.push("/dashboard/apps")}
        >
          <CardContent className="p-4 flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-muted text-muted-foreground text-2xl">
              +
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-sm text-muted-foreground">
                Ajouter une app
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">
            {installedModules.length}
          </div>
          <div className="text-sm text-muted-foreground">Apps installées</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {installedModules.filter((m) => m.isCore).length}
          </div>
          <div className="text-sm text-muted-foreground">Apps système</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {ModuleManager.getAvailableModules().length}
          </div>
          <div className="text-sm text-muted-foreground">Apps disponibles</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {installedModules.filter((m) => !m.isCore).length}
          </div>
          <div className="text-sm text-muted-foreground">Apps tierces</div>
        </div>
      </div>
    </div>
  );
}
