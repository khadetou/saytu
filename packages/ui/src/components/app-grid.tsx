"use client";

import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Badge } from "./badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import { AVAILABLE_APPS, APP_CATEGORIES, type App } from "../lib/apps";
import { Search, Download, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface AppGridProps {
  onAppInstall?: (app: App) => void;
  onAppUninstall?: (app: App) => void;
  onAppOpen?: (app: App) => void;
}

export function AppGrid({
  onAppInstall,
  onAppUninstall,
  onAppOpen,
}: AppGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [apps, setApps] = useState(AVAILABLE_APPS);
  const [installingApps, setInstallingApps] = useState<Set<string>>(new Set());

  const filteredApps = apps.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const installedAppsCount = apps.filter((app: App) => app.isInstalled).length;
  const totalAppsCount = apps.length;

  const handleInstall = async (app: App) => {
    // Check dependencies
    if (app.dependencies) {
      const missingDeps = app.dependencies.filter(
        (depId: string) => !apps.find((a: App) => a.id === depId)?.isInstalled
      );

      if (missingDeps.length > 0) {
        toast.error(
          `Please install dependencies first: ${missingDeps.join(", ")}`
        );
        return;
      }
    }

    // Start installation
    setInstallingApps((prev) => new Set(prev).add(app.id));

    // Simulate installation delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setApps((prev: App[]) =>
      prev.map((a: App) => (a.id === app.id ? { ...a, isInstalled: true } : a))
    );

    setInstallingApps((prev) => {
      const newSet = new Set(prev);
      newSet.delete(app.id);
      return newSet;
    });

    toast.success(`${app.name} installed successfully!`);
    onAppInstall?.(app);
  };

  const handleUninstall = (app: App) => {
    if (app.isCore) {
      toast.error("Core apps cannot be uninstalled");
      return;
    }

    setApps((prev: App[]) =>
      prev.map((a: App) => (a.id === app.id ? { ...a, isInstalled: false } : a))
    );

    toast.success(`${app.name} uninstalled successfully!`);
    onAppUninstall?.(app);
  };

  const handleOpen = (app: App) => {
    if (!app.isInstalled) {
      handleInstall(app);
      return;
    }
    onAppOpen?.(app);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Apps</h1>
            <p className="text-xl text-muted-foreground">
              Discover and install apps to extend your business capabilities
            </p>
          </div>

          {/* Statistics */}
          <div className="flex gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>{installedAppsCount} installed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-muted-foreground/50 rounded-full"></div>
              <span>{totalAppsCount - installedAppsCount} available</span>
            </div>
            <div className="flex items-center gap-2">
              <span>•</span>
              <span>{filteredApps.length} showing</span>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search apps..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchQuery(e.target.value)
              }
              className="pl-10 h-11"
            />
          </div>

          {/* Category Filter - Responsive Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:flex xl:flex-wrap gap-2">
            {APP_CATEGORIES.map((category: string) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="justify-center text-xs sm:text-sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Apps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredApps.map((app: App) => (
          <Card
            key={app.id}
            className={`group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${
              app.isInstalled
                ? "ring-2 ring-primary/20 bg-primary/5"
                : "hover:border-primary/50"
            }`}
            onClick={() => handleOpen(app)}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div
                  className={`w-14 h-14 rounded-xl ${app.color} flex items-center justify-center text-white text-2xl shadow-lg group-hover:shadow-xl transition-shadow`}
                >
                  {app.icon}
                </div>
                <div className="flex flex-col gap-1">
                  {app.isInstalled && (
                    <Badge variant="secondary" className="text-xs font-medium">
                      <Check className="w-3 h-3 mr-1" />
                      Installed
                    </Badge>
                  )}
                  {app.dependencies && (
                    <Badge variant="outline" className="text-xs">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Deps
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                  {app.name}
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {app.description}
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="pt-0 space-y-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <Badge variant="outline" className="text-xs">
                  {app.category}
                </Badge>
                <span className="font-mono">v{app.version}</span>
              </div>

              <div className="flex gap-2">
                {app.isInstalled ? (
                  <>
                    <Button size="sm" className="flex-1 font-medium">
                      Open
                    </Button>
                    {!app.isCore && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          handleUninstall(app);
                        }}
                      >
                        Uninstall
                      </Button>
                    )}
                  </>
                ) : (
                  <Button
                    size="sm"
                    className="flex-1 font-medium"
                    disabled={installingApps.has(app.id)}
                  >
                    {installingApps.has(app.id) ? (
                      <>
                        <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Installing...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Install
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredApps.length === 0 && (
        <div className="text-center py-16">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No apps found</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            No apps match your search criteria. Try adjusting your search terms
            or category filter.
          </p>
        </div>
      )}
    </div>
  );
}
