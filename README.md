# 🇸🇳 Saytu ERP - 100% Senegalese ERP

> **A modern, optimized, and developer-friendly ERP system, built in Senegal with cutting-edge technologies.**

[![Next.js](https://img.shields.io/badge/Next.js-15.2.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![NestJS](https://img.shields.io/badge/NestJS-11-red?style=for-the-badge&logo=nestjs)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.9.0-blue?style=for-the-badge&logo=prisma)](https://prisma.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue?style=for-the-badge&logo=typescript)](https://typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0.8-cyan?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-latest-black?style=for-the-badge&logo=shadcnui)](https://ui.shadcn.com/)
[![pnpm](https://img.shields.io/badge/pnpm-10.4.1-orange?style=for-the-badge&logo=pnpm)](https://pnpm.io/)

## 🌟 Vision

**Saytu ERP** represents much more than a simple software solution - it's a **Senegalese technological awakening movement**.

### 🚀 **Awakening Senegalese Youth**

This project was born from the conviction that **Senegalese youth have the talent and creativity** to create world-class technological solutions. We're not building for the West, but **for our market, by our market**.

### 🌍 **Global Vision, Local Roots**

While rooted in Senegalese realities, **Saytu ERP is designed to meet the needs of all companies worldwide**. We prove that African innovation can compete with the best international solutions.

### 💡 **Our Mission**

- **Awaken** the technological consciousness of Senegalese youth
- **Demonstrate** that we can create international-level solutions
- **Build** for our local businesses while aiming for global excellence
- **Inspire** a new generation of African developers
- **Prove** that Africa is a major player in technological innovation

_"It's time for Senegalese youth to stop consuming others' technology and start creating their own."_

## ✨ Key Features

### 🚀 Cutting-Edge Technologies

- **Frontend**: Next.js 15.2.3 with App Router and Server Components
- **Backend**: NestJS 11 with modular architecture and Swagger
- **Database**: Prisma 6.9.0 ORM with PostgreSQL
- **UI Components**: shadcn/ui with Radix UI primitives for accessibility
- **Styling**: Tailwind CSS 4.0.8 for modern, responsive design
- **Authentication**: Better-auth 1.2.8 with multi-provider support
- **State Management**: TanStack Query 5.80.6 for data management
- **Runtime**: React 19.0.0 with latest features
- **Tooling**: TypeScript 5.7.3 strict mode + pnpm 10.4.1

### 🎯 Business Features

- **📋 Task Management**: Todo module with Kanban, Tree, and Form views
- **📊 Dashboard**: Intuitive enterprise-grade interface
- **🔧 Module System**: Extensible and modular architecture
- **🌙 Dark/Light Mode**: Adaptive interface
- **📝 Markdown Editor**: With integrated slash (/) commands
- **📅 Date Picker**: Localized components with French support

### 🏗️ Modern Architecture

```
saytu/
├── apps/
│   ├── web/          # Next.js Frontend
│   ├── admin/        # Admin Interface
│   └── server/       # NestJS API
├── packages/
│   └── ui/           # Shared shadcn/ui Components
└── docs/             # Documentation
```

**Monorepo Benefits:**

- **Shared UI Components**: shadcn/ui components used across all apps
- **Type Safety**: Shared TypeScript types and schemas
- **Consistent Styling**: Unified Tailwind CSS configuration
- **Efficient Development**: Hot-reload across all packages

## 🛠️ Installation

### Prerequisites

- Node.js 18+
- pnpm (recommended)
- PostgreSQL 14+

### Quick Setup

```bash
# Clone the project
git clone https://github.com/your-org/saytu-erp.git
cd saytu-erp

# Install dependencies
pnpm install

# Database configuration
cp .env.example .env
# Edit .env with your database settings

# Initialize database
pnpm db:migrate
pnpm db:seed

# Start development mode
pnpm dev
```

### Application Access

- **Frontend**: http://localhost:3001
- **Admin**: http://localhost:3002
- **API**: http://localhost:8000
- **Documentation**: http://localhost:3003

## 🎨 User Interface

### Design System

Our interface is inspired by the best UX/UI practices with:

- **Professional dark theme** for an enterprise experience
- **shadcn/ui components** built on Radix UI for consistency and accessibility
- **Tailwind CSS 4.0.8** for utility-first styling and rapid development
- **Smooth animations** with CSS transitions and transforms
- **Responsive design** adapted for mobile and desktop
- **Component library** with reusable, customizable UI elements

### Advanced Markdown Editor

```markdown
# Type / to see available commands

- /h1, /h2, /h3 for headings
- /bold, /italic for formatting
- /list, /table for structures
- Real-time side-by-side preview
```

## 🔧 Development

### Available Scripts

```bash
# Development
pnpm dev              # Start all services
pnpm dev:web          # Frontend only
pnpm dev:server       # API only

# Build
pnpm build            # Production build
pnpm build:web        # Build frontend
pnpm build:server     # Build API

# Database
pnpm db:migrate       # Prisma migrations
pnpm db:seed          # Test data
pnpm db:studio        # Prisma Studio interface

# Tests
pnpm test             # Unit tests
pnpm test:e2e         # End-to-end tests
pnpm lint             # ESLint linting
```

### Module Structure

```typescript
// Todo module example
export const TodoModule = {
  name: "todo",
  version: "1.0.0",
  views: ["tree", "kanban", "form"],
  permissions: ["read", "write", "delete"],
  routes: ["/dashboard/todo"],
  components: {
    TreeView: TodoTreeView,
    KanbanView: TodoKanbanView,
    FormView: TodoEnterpriseForm,
  },
};
```

## 📦 Available Modules

### ✅ Implemented Modules

- **🏠 Base**: Authentication, dashboard, settings
- **📋 Todo**: Task management with multiple views
- **🔧 Settings**: System and user configuration
- **📱 Apps**: Module and application manager

### 🚧 Modules in Development

- **👥 CRM**: Customer relationship management
- **💰 Accounting**: Financial management
- **📦 Inventory**: Stock management
- **👨‍💼 HR**: Human resources
- **📊 Reporting**: Advanced dashboards

## 🌍 Global Adaptability with Senegalese Roots

### 🇸🇳 **Senegalese Specificities (Local Market)**

- **Language**: French interface (extensible multilingual)
- **Currency**: Native CFA Franc (XOF) support
- **Mobile Money**: Orange Money, Wave, Free Money integration
- **Local Banks**: Ecobank, CBAO, BHS, UBA APIs, etc.
- **Taxation**: Senegalese VAT, local taxes, SYSCOHADA
- **Regulations**: OHADA compliance and Senegalese legislation

### 🌍 **Global Adaptability (Global Vision)**

- **Multi-currency**: Support for all international currencies
- **Multi-language**: i18n architecture for worldwide expansion
- **Regulations**: Framework adaptable to international legislations
- **Payments**: Stripe, PayPal, and local systems integration
- **Accounting**: IFRS, GAAP, and local standards
- **Reports**: Templates adaptable to each country's requirements

### 💡 **Philosophy: "Think Global, Act Local"**

_Designed in Senegal for the entire world - proving that excellence has no borders._

## 🤝 Contribution - Join the Movement!

**Call to Senegalese and African youth**: This project is YOUR opportunity to prove that we can create world-class technological solutions!

### 🔥 **Why Contribute?**

- **Develop your skills** on the latest technologies
- **Build your portfolio** with an international-scale project
- **Be part of history** in the Senegalese technological awakening
- **Prove to the world** that Africa is a major player in innovation
- **Create opportunities** for the next generation

### How to Contribute

1. **Fork** the project
2. **Create** a feature branch (`git checkout -b feature/new-feature`)
3. **Commit** your changes (`git commit -m 'Add new feature'`)
4. **Push** to the branch (`git push origin feature/new-feature`)
5. **Open** a Pull Request

### Code Standards

- **TypeScript** strict mode
- **ESLint** + **Prettier** for formatting
- **Unit tests** required
- **Documentation** for new features

## 🚀 Deployment

### Environments

- **Development**: Localhost with hot-reload
- **Staging**: Testing environment
- **Production**: Optimized deployment

### Deployment Technologies

- **Frontend**: Vercel or Netlify
- **Backend**: Railway, Render, or VPS
- **Database**: Hosted PostgreSQL
- **CDN**: Cloudflare for assets

## 📊 Performance

### Optimizations

- **Server Components**: Optimized server-side rendering
- **Code Splitting**: Progressive module loading
- **Caching**: Advanced caching strategies
- **Bundle Size**: JavaScript bundle optimization

### Metrics

- **Lighthouse Score**: 95+ on all criteria
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Core Web Vitals**: Excellent on all indicators

## 📄 License

This project is licensed under **MIT** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Senegalese Open Source Community**
- **Project Contributors**
- **Technologies used**: Next.js, NestJS, Prisma, shadcn/ui
- **Inspiration**: Modern ERP solutions and enterprise software best practices

## 📞 Contact

- **Email**: contact@saytu-erp.sn
- **Website**: https://saytu-erp.sn
- **Twitter**: [@SaytuERP](https://twitter.com/SaytuERP)
- **LinkedIn**: [Saytu ERP](https://linkedin.com/company/saytu-erp)

---

<div align="center">
  <p><strong>🇸🇳 Made with ❤️ in Senegal for the World 🌍</strong></p>
  <p><em>"Senegalese youth no longer consume, they CREATE!"</em></p>
  <p><strong>🚀 Wake Up, Innovate, Dominate! 🚀</strong></p>

---

  <p><em>Saytu ERP - When Senegalese excellence meets global ambition</em></p>
</div>
