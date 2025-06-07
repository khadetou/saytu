"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Badge } from "@workspace/ui/components/badge";
import { ModeToggle } from "@workspace/ui/components/mode-toggle";
import { 
  Settings, 
  User, 
  Shield, 
  Database, 
  Mail, 
  Bell, 
  Palette, 
  Globe,
  Save,
  ArrowLeft
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface SettingsSection {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

export default function SettingsPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("general");
  const [settings, setSettings] = useState({
    companyName: "Mon Entreprise",
    companyEmail: "contact@monentreprise.com",
    companyPhone: "+33 1 23 45 67 89",
    companyAddress: "123 Rue de la Paix, 75001 Paris",
    language: "fr",
    timezone: "Europe/Paris",
    currency: "EUR",
    dateFormat: "DD/MM/YYYY",
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false
  });

  const handleSave = () => {
    // Simulate saving settings
    toast.success("Paramètres sauvegardés avec succès!");
  };

  const sections: SettingsSection[] = [
    {
      id: "general",
      name: "Général",
      description: "Paramètres généraux de l'entreprise",
      icon: <Settings className="w-5 h-5" />,
      component: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="companyName">Nom de l'entreprise</Label>
              <Input
                id="companyName"
                value={settings.companyName}
                onChange={(e) => setSettings(prev => ({ ...prev, companyName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyEmail">Email de l'entreprise</Label>
              <Input
                id="companyEmail"
                type="email"
                value={settings.companyEmail}
                onChange={(e) => setSettings(prev => ({ ...prev, companyEmail: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyPhone">Téléphone</Label>
              <Input
                id="companyPhone"
                value={settings.companyPhone}
                onChange={(e) => setSettings(prev => ({ ...prev, companyPhone: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Langue</Label>
              <select
                id="language"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={settings.language}
                onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyAddress">Adresse de l'entreprise</Label>
            <Input
              id="companyAddress"
              value={settings.companyAddress}
              onChange={(e) => setSettings(prev => ({ ...prev, companyAddress: e.target.value }))}
            />
          </div>
        </div>
      )
    },
    {
      id: "appearance",
      name: "Apparence",
      description: "Thème et personnalisation",
      icon: <Palette className="w-5 h-5" />,
      component: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Mode sombre/clair</h3>
              <p className="text-sm text-muted-foreground">
                Choisissez votre thème préféré
              </p>
            </div>
            <ModeToggle />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="dateFormat">Format de date</Label>
              <select
                id="dateFormat"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={settings.dateFormat}
                onChange={(e) => setSettings(prev => ({ ...prev, dateFormat: e.target.value }))}
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Devise</Label>
              <select
                id="currency"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={settings.currency}
                onChange={(e) => setSettings(prev => ({ ...prev, currency: e.target.value }))}
              >
                <option value="EUR">Euro (€)</option>
                <option value="USD">Dollar US ($)</option>
                <option value="GBP">Livre Sterling (£)</option>
              </select>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "notifications",
      name: "Notifications",
      description: "Gérer les notifications",
      icon: <Bell className="w-5 h-5" />,
      component: (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">Notifications par email</h3>
                <p className="text-sm text-muted-foreground">
                  Recevoir des notifications importantes par email
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                className="h-4 w-4"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">Notifications push</h3>
                <p className="text-sm text-muted-foreground">
                  Recevoir des notifications dans le navigateur
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.pushNotifications}
                onChange={(e) => setSettings(prev => ({ ...prev, pushNotifications: e.target.checked }))}
                className="h-4 w-4"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">Emails marketing</h3>
                <p className="text-sm text-muted-foreground">
                  Recevoir des informations sur les nouveautés
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.marketingEmails}
                onChange={(e) => setSettings(prev => ({ ...prev, marketingEmails: e.target.checked }))}
                className="h-4 w-4"
              />
            </div>
          </div>
        </div>
      )
    },
    {
      id: "system",
      name: "Système",
      description: "Informations système",
      icon: <Database className="w-5 h-5" />,
      component: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Version du système</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">v1.0.0</div>
                <Badge variant="secondary" className="mt-2">Stable</Badge>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Base de données</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">PostgreSQL</div>
                <p className="text-sm text-muted-foreground mt-2">Connecté</p>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-2">
            <Label>Fuseau horaire</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={settings.timezone}
              onChange={(e) => setSettings(prev => ({ ...prev, timezone: e.target.value }))}
            >
              <option value="Europe/Paris">Europe/Paris (UTC+1)</option>
              <option value="America/New_York">America/New_York (UTC-5)</option>
              <option value="Asia/Tokyo">Asia/Tokyo (UTC+9)</option>
            </select>
          </div>
        </div>
      )
    }
  ];

  const activeComponent = sections.find(s => s.id === activeSection)?.component;

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
                  <Settings className="w-8 h-8" />
                  Paramètres
                </h1>
                <p className="text-muted-foreground">
                  Configuration du système et préférences
                </p>
              </div>
            </div>
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Sauvegarder
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors flex items-center gap-3 ${
                  activeSection === section.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                {section.icon}
                <div>
                  <div className="font-medium">{section.name}</div>
                  <div className="text-xs opacity-70">{section.description}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1">
            <Card>
              <CardHeader>
                <CardTitle>
                  {sections.find(s => s.id === activeSection)?.name}
                </CardTitle>
                <CardDescription>
                  {sections.find(s => s.id === activeSection)?.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeComponent}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
