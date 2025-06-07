"use client";

import { useState } from "react";
import { Button } from "./button";
import { Badge } from "./badge";
import { Input } from "./input";
import { Search, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "../lib/utils";

interface AppCategory {
  id: string;
  name: string;
  count: number;
  isExpanded?: boolean;
}

interface AppsSidebarProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const APP_CATEGORIES: AppCategory[] = [
  { id: "all", name: "Tous", count: 76 },
  { id: "applications", name: "APPLICATIONS", count: 0, isExpanded: true },
  { id: "uncategorized", name: "Applications non classées", count: 14 },
  { id: "activity", name: "Secteurs d'activité", count: 8 },
  { id: "categories", name: "CATÉGORIES", count: 0, isExpanded: true },
  { id: "all-cat", name: "Tous", count: 14 },
  { id: "sales", name: "Ventes", count: 11 },
  { id: "inventory", name: "Inventaires", count: 6 },
  { id: "accounting", name: "Comptabilité", count: 7 },
  { id: "manufacturing", name: "Inventaire", count: 13 },
  { id: "fabrication", name: "Fabrication", count: 4 },
  { id: "website", name: "Site Web", count: 8 },
  { id: "marketing", name: "Marketing", count: 7 },
  { id: "hr", name: "Ressources humaines", count: 7 },
  { id: "productivity", name: "Productivité", count: 7 },
  { id: "customization", name: "Personnalisations", count: 1 },
  { id: "technical", name: "Technique", count: 7 },
  { id: "localization", name: "Localisation", count: 1 },
];

export function AppsSidebar({ 
  selectedCategory, 
  onCategorySelect, 
  searchQuery, 
  onSearchChange 
}: AppsSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["applications", "categories"])
  );

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const renderCategory = (category: AppCategory, isSubCategory = false) => {
    const isSelected = selectedCategory === category.id;
    const isSection = category.count === 0;
    const isExpanded = expandedSections.has(category.id);

    if (isSection) {
      return (
        <div key={category.id} className="mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleSection(category.id)}
            className="w-full justify-start px-2 py-1 h-auto text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            {isExpanded ? (
              <ChevronDown className="w-3 h-3 mr-1" />
            ) : (
              <ChevronRight className="w-3 h-3 mr-1" />
            )}
            {category.name}
          </Button>
        </div>
      );
    }

    return (
      <Button
        key={category.id}
        variant={isSelected ? "secondary" : "ghost"}
        size="sm"
        onClick={() => onCategorySelect(category.id)}
        className={cn(
          "w-full justify-between px-3 py-2 h-auto text-sm font-normal mb-1",
          isSubCategory && "ml-4",
          isSelected && "bg-primary/10 text-primary font-medium"
        )}
      >
        <span className="truncate">{category.name}</span>
        <Badge variant="outline" className="text-xs">
          {category.count}
        </Badge>
      </Button>
    );
  };

  return (
    <div className="w-64 bg-background border-r h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">A</span>
          </div>
          <span className="font-semibold">Apps</span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-9 text-sm"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex-1 overflow-y-auto p-2">
        {APP_CATEGORIES.map((category, index) => {
          const isSection = category.count === 0;
          const isExpanded = expandedSections.has(category.id);
          
          if (isSection) {
            const nextSectionIndex = APP_CATEGORIES.findIndex(
              (cat, i) => i > index && cat.count === 0
            );
            const subCategories = APP_CATEGORIES.slice(
              index + 1,
              nextSectionIndex === -1 ? undefined : nextSectionIndex
            );

            return (
              <div key={category.id}>
                {renderCategory(category)}
                {isExpanded && (
                  <div className="ml-2 mb-4">
                    {subCategories.map((subCat) => renderCategory(subCat, true))}
                  </div>
                )}
              </div>
            );
          }

          // Skip subcategories as they're handled above
          const prevCategory = APP_CATEGORIES[index - 1];
          if (prevCategory && prevCategory.count === 0) {
            return null;
          }

          return renderCategory(category);
        })}
      </div>
    </div>
  );
}
