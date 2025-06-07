"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@workspace/ui/hooks/use-auth";
import { Button } from "@workspace/ui/components/button";
import { DashboardAppGrid } from "@workspace/ui/components/dashboard-app-grid";
import { ModeToggle } from "@workspace/ui/components/mode-toggle";
import type { Module } from "@workspace/ui/lib/modules";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleAppOpen = (module: Module) => {
    if (module.route) {
      router.push(module.route);
    }
  };

  const handleAppUninstall = (module: Module) => {
    console.log("Uninstalling module:", module.name);
    // Here you would typically make an API call to uninstall the module
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">
                Business Management System
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.push("/dashboard/apps")}
                className="text-sm"
              >
                Apps Store
              </Button>
              <span className="text-sm text-muted-foreground">
                Welcome, {user?.name || user?.email}
              </span>
              <ModeToggle />
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <DashboardAppGrid
            onAppOpen={handleAppOpen}
            onAppUninstall={handleAppUninstall}
          />
        </div>
      </main>
    </div>
  );
}
