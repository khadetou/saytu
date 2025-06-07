import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
  installDate?: Date;
}

@Injectable()
export class ModulesService {
  constructor(private prisma: PrismaService) {}

  // Core modules that come pre-installed
  private readonly CORE_MODULES: Module[] = [
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
      version: "1.0.0"
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
      version: "1.0.0"
    }
  ];

  // Available modules for installation
  private readonly AVAILABLE_MODULES: Module[] = [
    {
      id: "todo",
      name: "To-do",
      description: "Gestionnaire de tâches et projets",
      icon: "✏️",
      color: "bg-green-500",
      route: "/dashboard/todo",
      category: "productivity",
      isInstalled: false,
      version: "1.0.0"
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
      version: "1.0.0"
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
      dependencies: ["contacts"]
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
      dependencies: ["contacts", "crm"]
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
      version: "1.0.0"
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
      version: "1.0.0"
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
      version: "1.0.0"
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
      dependencies: ["todo"]
    }
  ];

  async getAllModules(): Promise<Module[]> {
    const installedModules = await this.getInstalledModuleIds();
    
    return [...this.CORE_MODULES, ...this.AVAILABLE_MODULES].map(module => ({
      ...module,
      isInstalled: this.CORE_MODULES.some(core => core.id === module.id) || installedModules.includes(module.id)
    }));
  }

  async getInstalledModules(): Promise<Module[]> {
    const allModules = await this.getAllModules();
    return allModules.filter(module => module.isInstalled);
  }

  async getAvailableModules(): Promise<Module[]> {
    const allModules = await this.getAllModules();
    return allModules.filter(module => !module.isInstalled);
  }

  async installModule(moduleId: string): Promise<Module> {
    const module = [...this.CORE_MODULES, ...this.AVAILABLE_MODULES].find(m => m.id === moduleId);
    
    if (!module) {
      throw new NotFoundException(`Module ${moduleId} not found`);
    }

    if (module.isCore) {
      throw new BadRequestException(`Core module ${moduleId} cannot be installed`);
    }

    // Check if already installed
    const installedModules = await this.getInstalledModuleIds();
    if (installedModules.includes(moduleId)) {
      throw new BadRequestException(`Module ${moduleId} is already installed`);
    }

    // Check dependencies
    if (module.dependencies) {
      const missingDeps = module.dependencies.filter(dep => 
        !this.CORE_MODULES.some(core => core.id === dep) && 
        !installedModules.includes(dep)
      );
      
      if (missingDeps.length > 0) {
        throw new BadRequestException(`Missing dependencies: ${missingDeps.join(", ")}`);
      }
    }

    // Install module in database
    await this.prisma.installedModule.create({
      data: {
        moduleId,
        name: module.name,
        version: module.version,
        installDate: new Date()
      }
    });

    return { ...module, isInstalled: true, installDate: new Date() };
  }

  async uninstallModule(moduleId: string): Promise<boolean> {
    const module = [...this.CORE_MODULES, ...this.AVAILABLE_MODULES].find(m => m.id === moduleId);
    
    if (!module) {
      throw new NotFoundException(`Module ${moduleId} not found`);
    }

    if (module.isCore) {
      throw new BadRequestException(`Core module ${moduleId} cannot be uninstalled`);
    }

    // Check if other modules depend on this one
    const installedModules = await this.getInstalledModuleIds();
    const dependentModules = this.AVAILABLE_MODULES.filter(m =>
      installedModules.includes(m.id) && m.dependencies?.includes(moduleId)
    );

    if (dependentModules.length > 0) {
      throw new BadRequestException(
        `Cannot uninstall: ${dependentModules.map(m => m.name).join(", ")} depend on this module`
      );
    }

    // Uninstall module from database
    await this.prisma.installedModule.deleteMany({
      where: { moduleId }
    });

    return true;
  }

  async getModuleInfo(moduleId: string): Promise<Module> {
    const allModules = await this.getAllModules();
    const module = allModules.find(m => m.id === moduleId);
    
    if (!module) {
      throw new NotFoundException(`Module ${moduleId} not found`);
    }

    return module;
  }

  async getModuleDependencies(moduleId: string): Promise<string[]> {
    const module = [...this.CORE_MODULES, ...this.AVAILABLE_MODULES].find(m => m.id === moduleId);
    
    if (!module) {
      throw new NotFoundException(`Module ${moduleId} not found`);
    }

    return module.dependencies || [];
  }

  private async getInstalledModuleIds(): Promise<string[]> {
    const installedModules = await this.prisma.installedModule.findMany({
      select: { moduleId: true }
    });
    
    return installedModules.map(m => m.moduleId);
  }
}
