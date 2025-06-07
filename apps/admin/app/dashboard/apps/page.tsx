"use client";

import { useState } from "react";
import { AppsSidebar } from "@workspace/ui/components/apps-sidebar";
import { AppsGrid } from "@workspace/ui/components/apps-grid";

export default function AppsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <div className="flex h-screen bg-background">
      <AppsSidebar
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <AppsGrid
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
      />
    </div>
  );
}
