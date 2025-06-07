export interface Module {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  route: string;
  category: string;
  isInstalled: boolean;
  isCore?: boolean;
  version: string;
  dependencies?: string[];
}

export interface ModuleCategory {
  id: string;
  name: string;
  count: number;
  isExpanded?: boolean;
}

// Core modules that come pre-installed
export const CORE_MODULES: Module[] = [
  {
    id: "settings",
    name: "Paramètres",
    description: "Configuration système et paramètres utilisateur",
    icon: "⚙️",
    color: "bg-gray-500",
    route: "/dashboard/settings",
    category: "system",
    isInstalled: true,
    isCore: true,
    version: "1.0.0",
  },
  {
    id: "apps",
    name: "Apps",
    description: "Gestionnaire d'applications",
    icon: "📱",
    color: "bg-blue-500",
    route: "/dashboard/apps",
    category: "system",
    isInstalled: true,
    isCore: true,
    version: "1.0.0",
  },
];

// Available modules for installation
export const AVAILABLE_MODULES: Module[] = [
  {
    id: "todo",
    name: "To-do",
    description: "Gestionnaire de tâches et projets",
    icon: "✏️",
    color: "bg-green-500",
    route: "/dashboard/todo",
    category: "productivity",
    isInstalled: false,
    version: "1.0.0",
  },
  {
    id: "contacts",
    name: "Contacts",
    description: "Gestion des contacts et clients",
    icon: "👥",
    color: "bg-purple-500",
    route: "/dashboard/contacts",
    category: "sales",
    isInstalled: false,
    version: "1.0.0",
  },
  {
    id: "crm",
    name: "CRM",
    description: "Gestion de la relation client",
    icon: "💎",
    color: "bg-teal-500",
    route: "/dashboard/crm",
    category: "sales",
    isInstalled: false,
    version: "1.0.0",
    dependencies: ["contacts"],
  },
  {
    id: "sales",
    name: "Ventes",
    description: "Gestion des ventes et devis",
    icon: "📊",
    color: "bg-orange-500",
    route: "/dashboard/sales",
    category: "sales",
    isInstalled: false,
    version: "1.0.0",
    dependencies: ["contacts", "crm"],
  },
  {
    id: "inventory",
    name: "Inventaire",
    description: "Gestion des stocks et produits",
    icon: "📦",
    color: "bg-orange-500",
    route: "/dashboard/inventory",
    category: "inventory",
    isInstalled: false,
    version: "1.0.0",
  },
  {
    id: "accounting",
    name: "Comptabilité",
    description: "Gestion financière et comptable",
    icon: "💰",
    color: "bg-green-500",
    route: "/dashboard/accounting",
    category: "accounting",
    isInstalled: false,
    version: "1.0.0",
  },
  {
    id: "hr",
    name: "Employés",
    description: "Gestion des ressources humaines",
    icon: "👥",
    color: "bg-purple-500",
    route: "/dashboard/hr",
    category: "hr",
    isInstalled: false,
    version: "1.0.0",
  },
  {
    id: "project",
    name: "Projet",
    description: "Gestion de projets et tâches",
    icon: "🎯",
    color: "bg-blue-500",
    route: "/dashboard/project",
    category: "productivity",
    isInstalled: false,
    version: "1.0.0",
    dependencies: ["todo"],
  },
  {
    id: "calendar",
    name: "Calendrier",
    description: "Planification et rendez-vous",
    icon: "📅",
    color: "bg-yellow-500",
    route: "/dashboard/calendar",
    category: "productivity",
    isInstalled: false,
    version: "1.0.0",
  },
  {
    id: "documents",
    name: "Documents",
    description: "Gestion documentaire",
    icon: "📄",
    color: "bg-blue-600",
    route: "/dashboard/documents",
    category: "productivity",
    isInstalled: false,
    version: "1.0.0",
  },
];

export const MODULE_CATEGORIES: ModuleCategory[] = [
  { id: "all", name: "Tous", count: 0 },
  { id: "system", name: "Système", count: 0 },
  { id: "sales", name: "Ventes", count: 0 },
  { id: "inventory", name: "Inventaire", count: 0 },
  { id: "accounting", name: "Comptabilité", count: 0 },
  { id: "hr", name: "Ressources Humaines", count: 0 },
  { id: "productivity", name: "Productivité", count: 0 },
];

// Module management functions
export class ModuleManager {
  private static baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  static async getAllModules(): Promise<Module[]> {
    try {
      const response = await fetch(`${this.baseUrl}/modules`);
      if (!response.ok) {
        throw new Error("Failed to fetch modules");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching modules:", error);
      // Fallback to static data with proper installation status
      return [...CORE_MODULES, ...AVAILABLE_MODULES].map((module) => ({
        ...module,
        isInstalled: CORE_MODULES.some((core) => core.id === module.id),
      }));
    }
  }

  static async getInstalledModules(): Promise<Module[]> {
    try {
      const response = await fetch(`${this.baseUrl}/modules/installed`);
      if (!response.ok) {
        throw new Error("Failed to fetch installed modules");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching installed modules:", error);
      return CORE_MODULES;
    }
  }

  static async getAvailableModules(): Promise<Module[]> {
    try {
      const response = await fetch(`${this.baseUrl}/modules/available`);
      if (!response.ok) {
        throw new Error("Failed to fetch available modules");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching available modules:", error);
      return AVAILABLE_MODULES;
    }
  }

  static async installModule(moduleId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/modules/install`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ moduleId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to install module");
      }

      return true;
    } catch (error) {
      console.error("Error installing module:", error);
      throw error;
    }
  }

  static async uninstallModule(moduleId: string): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.baseUrl}/modules/uninstall/${moduleId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to uninstall module");
      }

      return true;
    } catch (error) {
      console.error("Error uninstalling module:", error);
      throw error;
    }
  }

  static async isInstalled(moduleId: string): Promise<boolean> {
    try {
      const installedModules = await this.getInstalledModules();
      return installedModules.some((m) => m.id === moduleId);
    } catch (error) {
      console.error("Error checking module installation:", error);
      return false;
    }
  }

  static async getModuleInfo(moduleId: string): Promise<Module | null> {
    try {
      const response = await fetch(`${this.baseUrl}/modules/${moduleId}`);
      if (!response.ok) {
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching module info:", error);
      return null;
    }
  }
}
