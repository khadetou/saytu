"use client";

import { useState, useEffect } from "react";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Card, CardContent } from "@workspace/ui/components/card";
import { ModuleManager, type Module } from "@workspace/ui/lib/modules";
import { cn } from "@workspace/ui/lib/utils";
import { MoreHorizontal, Download, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface AppsGridProps {
  selectedCategory: string;
  searchQuery: string;
}

export function AppsGrid({ selectedCategory, searchQuery }: AppsGridProps) {
  const [installingApps, setInstallingApps] = useState<Set<string>>(new Set());
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const allModules = await ModuleManager.getAllModules();
        setModules(allModules);
      } catch (error) {
        console.error("Error fetching modules:", error);
        toast.error("Erreur lors du chargement des modules");
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  const filteredModules = modules.filter((module) => {
    const matchesCategory =
      selectedCategory === "all" || module.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleModuleAction = async (module: Module) => {
    if (module.isInstalled) {
      return;
    }

    setInstallingApps((prev) => new Set(prev).add(module.id));

    try {
      await ModuleManager.installModule(module.id);
      const updatedModules = await ModuleManager.getAllModules();
      setModules(updatedModules);
      toast.success(`${module.name} installé avec succès!`);
    } catch (error) {
      toast.error(
        `Erreur lors de l'installation: ${error instanceof Error ? error.message : "Erreur inconnue"}`
      );
    } finally {
      setInstallingApps((prev) => {
        const newSet = new Set(prev);
        newSet.delete(module.id);
        return newSet;
      });
    }
  };

  const getActionButton = (module: Module) => {
    const isInstalling = installingApps.has(module.id);

    if (module.isInstalled) {
      return (
        <Button variant="outline" size="sm" disabled className="text-xs">
          <CheckCircle className="w-3 h-3 mr-1" />
          Installé
        </Button>
      );
    }

    return (
      <Button
        variant="default"
        size="sm"
        onClick={() => handleModuleAction(module)}
        disabled={isInstalling}
        className="text-xs"
      >
        {isInstalling ? (
          "Installation..."
        ) : (
          <>
            <Download className="w-3 h-3 mr-1" />
            Installer
          </>
        )}
      </Button>
    );
  };

  if (loading) {
    return (
      <div className="flex-1 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement des modules...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-semibold">Apps</h1>
          <div className="text-sm text-muted-foreground">
            1-{filteredModules.length} / {modules.length}
          </div>
        </div>
        <p className="text-muted-foreground">
          Découvrez les applications et installez celles dont vous avez besoin.
        </p>
      </div>

      {/* Apps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredModules.map((module) => (
          <Card
            key={module.id}
            className="group hover:shadow-md transition-shadow"
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <div
                  className={cn(
                    "p-2 rounded-lg text-white text-2xl",
                    module.color
                  )}
                >
                  {module.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">
                    {module.name}
                  </h3>
                  <p className="text-xs text-muted-foreground truncate">
                    {module.description}
                  </p>
                  {module.isCore && (
                    <Badge variant="secondary" className="text-xs mt-1">
                      Core
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between">
                {getActionButton(module)}
                <span className="text-xs text-muted-foreground">
                  v{module.version}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredModules.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Aucune application trouvée.</p>
        </div>
      )}
    </div>
  );
}
