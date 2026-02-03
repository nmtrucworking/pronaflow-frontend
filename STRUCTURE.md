# PronaFlow Frontend - Project Structure

Cấu trúc thư mục chuẩn cho dự án PronaFlow Frontend

## 📂 Root Directory

```
frontend/
├── 📁 docs/                    # Tài liệu dự án
├── 📁 public/                  # Static assets
├── 📁 src/                     # Source code
├── 📁 node_modules/            # Dependencies (auto-generated)
├── 📄 .gitignore               # Git ignore configuration
├── 📄 eslint.config.js         # ESLint configuration
├── 📄 index.html               # Entry HTML file
├── 📄 package.json             # Project dependencies & scripts
├── 📄 package-lock.json        # Lock file
├── 📄 postcss.config.js        # PostCSS configuration
├── 📄 README.md                # Project documentation
├── 📄 tailwind.config.js       # TailwindCSS configuration
├── 📄 tsconfig.json            # TypeScript base configuration
├── 📄 tsconfig.app.json        # TypeScript app configuration
├── 📄 tsconfig.node.json       # TypeScript node configuration
└── 📄 vite.config.ts           # Vite build configuration
```

## 📚 Documentation Structure (`/docs`)

```
docs/
├── 📄 INDEX.md                          # Documentation index
├── 📁 deployment/                       # Deployment documentation
│   ├── COLOR_SYSTEM_DEPLOYMENT.md
│   ├── COMPLETION_REPORT.md
│   ├── DEPLOYMENT_SUMMARY.md
│   ├── FE_MODULES_DEPLOYMENT_COMPLETE_VI.md
│   ├── FINAL_DEPLOYMENT_STATUS.md
│   ├── MODULES_DEPLOYMENT_STATUS.md
│   └── SIDEBAR_REFACTOR_SUMMARY.md
├── 📁 modules/                          # Module documentation
│   ├── MODULE_1_README.md
│   ├── MODULE_2_README.md
│   ├── MODULE_2_REFERENCE.md
│   ├── MODULE_2_SUMMARY.md
│   ├── MODULE_3_QUICKSTART.md
│   ├── MODULE_3_README.md
│   ├── MODULE_3_REFERENCE.md
│   ├── MODULE_3_SUMMARY.md
│   ├── MODULE_9_COMPLETION.md
│   ├── MODULE_9_QUICKREF.md
│   ├── MODULE_9_README.md
│   ├── MODULE_12_COMPLETION.md
│   ├── MODULE_12_QUICKREF.md
│   └── MODULE_12_README.md
├── 📁 implementation/                   # Implementation guides
│   ├── IMPLEMENTATION_COMPLETE.md
│   ├── IMPLEMENTATION_VISUAL_SUMMARY.md
│   └── UI_COMPONENTS_IMPLEMENTATION.md
├── 📁 reports/                          # Project reports
│   ├── ALLPROJECTS_BEFORE_AFTER.md
│   ├── ALLPROJECTS_OPTIMIZATION_SUMMARY.md
│   ├── PROJECTDETAILCOMPACT_DOCS.md
│   └── PROJECTDETAILCOMPACT_QUICKREF.md
├── 📁 frontend/                         # Frontend technical docs
│   ├── 00-Overview.md
│   ├── GanttChart-Enhanced.md
│   ├── Typography.md
│   ├── 01-Tech Stack & Standards/
│   ├── 02-Application Architecture/
│   ├── 03-Component Specifications/
│   ├── 04-API & Security/
│   ├── 05-Business Logic/
│   └── 06-Testing & Deployment/
├── 📁 backend/                          # Backend technical docs
├── 📁 architecture/                     # System architecture
└── 📁 planning/                         # Project planning
```

## 🎨 Public Assets (`/public`)

```
public/
├── 📁 assets/              # General assets
│   └── 📁 docs/           # Document assets
├── 📁 branding/           # Brand assets (logos, colors)
├── 📁 defaults/           # Default images/files
├── 📁 icons/              # Icon files
├── 📁 previews/           # Preview images
└── 📁 wallpapers/         # Background images
```

## 💻 Source Code (`/src`)

```
src/
├── 📄 main.tsx                # Application entry point
├── 📄 App.tsx                 # Root component
├── 📄 App.css                 # App styles
├── 📄 index.css               # Global styles
├── 📁 assets/                 # Code-level assets
├── 📁 components/             # Reusable React components
│   ├── ui/                   # Base UI components (shadcn/ui)
│   ├── common/               # Common shared components
│   └── layout/               # Layout components
├── 📁 features/               # Feature modules
│   ├── auth/                 # Authentication
│   ├── projects/             # Project management
│   ├── tasks/                # Task management
│   ├── calendar/             # Calendar
│   ├── gantt/                # Gantt chart
│   └── ...                   # Other features
├── 📁 layouts/                # Page layouts
│   ├── MainLayout.tsx
│   ├── AuthLayout.tsx
│   └── ...
├── 📁 routes/                 # Routing configuration
│   ├── index.tsx
│   └── ProtectedRoute.tsx
├── 📁 store/                  # State management
│   ├── slices/               # Redux slices
│   └── index.ts
├── 📁 services/               # API services
│   ├── api.ts                # API client
│   └── ...                   # Feature services
├── 📁 hooks/                  # Custom React hooks
│   ├── useAuth.ts
│   ├── useTheme.ts
│   └── ...
├── 📁 utils/                  # Utility functions
│   ├── helpers.ts
│   ├── validators.ts
│   └── ...
├── 📁 types/                  # TypeScript types
│   ├── models.ts
│   ├── api.ts
│   └── ...
├── 📁 config/                 # Application config
│   ├── constants.ts
│   ├── env.ts
│   └── ...
├── 📁 styles/                 # Global styles
│   ├── globals.css
│   └── themes/
├── 📁 themes/                 # Theme configuration
│   ├── default.ts
│   └── ...
└── 📁 mocks/                  # Mock data (development)
```

## 🏗️ Component Organization

### Feature-based Structure
Mỗi feature module có cấu trúc:
```
features/[feature-name]/
├── components/         # Feature-specific components
├── hooks/             # Feature-specific hooks
├── services/          # Feature API services
├── types/             # Feature types
├── utils/             # Feature utilities
└── index.ts           # Public exports
```

### Component Structure
```
components/[component-name]/
├── [ComponentName].tsx
├── [ComponentName].test.tsx
├── [ComponentName].stories.tsx (if using Storybook)
├── index.ts
└── styles.module.css (if needed)
```

## 📋 Naming Conventions

### Files
- **Components**: PascalCase (e.g., `Button.tsx`, `UserProfile.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`, `apiClient.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ROUTES.ts`)
- **Types**: PascalCase (e.g., `User.types.ts`, `Api.types.ts`)

### Directories
- **Feature modules**: lowercase-hyphen (e.g., `user-profile/`, `task-management/`)
- **Component folders**: PascalCase (e.g., `Button/`, `UserCard/`)

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `vite.config.ts` | Vite bundler configuration |
| `tsconfig.json` | TypeScript base config |
| `tsconfig.app.json` | App-specific TypeScript config |
| `tsconfig.node.json` | Node-specific TypeScript config |
| `tailwind.config.js` | TailwindCSS configuration |
| `postcss.config.js` | PostCSS configuration |
| `eslint.config.js` | ESLint linting rules |
| `package.json` | Dependencies and scripts |

## 🚀 Build Outputs

```
# Generated during build (gitignored)
dist/              # Production build
dist-ssr/          # Server-side rendering build
node_modules/      # Dependencies
*.local            # Local environment files
```

## 📝 Best Practices

1. **Keep components small and focused** - Single responsibility principle
2. **Use feature folders** - Group related code together
3. **Shared code in appropriate directories** - Don't duplicate
4. **Index files for clean imports** - Export from index.ts
5. **Type everything** - Leverage TypeScript fully
6. **Document complex logic** - Comments for future maintainers
7. **Test critical paths** - Write tests for important features
8. **Follow naming conventions** - Consistency is key

## 🔗 Related Documentation

- [README.md](../README.md) - Project overview and setup
- [docs/INDEX.md](docs/INDEX.md) - Full documentation index
- [docs/frontend/](docs/frontend/) - Detailed frontend documentation

---

**Last Updated:** 2026-02-03
