# PronaFlow Frontend - Project Structure

Cấu trA�c thư mục chuẩn cho dự A�n PronaFlow Frontend

## d��� Root Directory

```
frontend/
├── d��� docs/                    # TA�i liệu dự A�n
├── d��� public/                  # Static assets
├── d��� src/                     # Source code
├── d��� node_modules/            # Dependencies (auto-generated)
├── d��� .gitignore               # Git ignore configuration
├── d��� eslint.config.js         # ESLint configuration
├── d��� index.html               # Entry HTML file
├── d��� package.json             # Project dependencies & scripts
├── d��� package-lock.json        # Lock file
├── d��� postcss.config.js        # PostCSS configuration
├── d��� README.md                # Project documentation
├── d��� tailwind.config.js       # TailwindCSS configuration
├── d��� tsconfig.json            # TypeScript base configuration
├── d��� tsconfig.app.json        # TypeScript app configuration
├── d��� tsconfig.node.json       # TypeScript node configuration
└── d��� vite.config.ts           # Vite build configuration
```

## d��? Documentation Structure (`/docs`)

```
docs/
├── d��� INDEX.md                          # Documentation index
├── d��� deployment/                       # Deployment documentation
│   ├── COLOR_SYSTEM_DEPLOYMENT.md
│   ├── COMPLETION_REPORT.md
│   ├── DEPLOYMENT_SUMMARY.md
│   ├── FE_MODULES_DEPLOYMENT_COMPLETE_VI.md
│   ├── FINAL_DEPLOYMENT_STATUS.md
│   ├── MODULES_DEPLOYMENT_STATUS.md
│   └── SIDEBAR_REFACTOR_SUMMARY.md
├── d��� modules/                          # Module documentation
│   ├── MODULE_1_README.md
│   ├── MODULE_2_DEPLOYMENT_READINESS.md
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
├── d��� implementation/                   # Implementation guides
│   ├── IMPLEMENTATION_COMPLETE.md
│   ├── IMPLEMENTATION_VISUAL_SUMMARY.md
│   └── UI_COMPONENTS_IMPLEMENTATION.md
├── d��� reports/                          # Project reports
│   ├── ALLPROJECTS_BEFORE_AFTER.md
│   ├── ALLPROJECTS_OPTIMIZATION_SUMMARY.md
│   ├── PROJECTDETAILCOMPACT_DOCS.md
│   └── PROJECTDETAILCOMPACT_QUICKREF.md
├── d��� frontend/                         # Frontend technical docs
│   ├── 00-Overview.md
│   ├── GanttChart-Enhanced.md
│   ├── Typography.md
│   ├── 01-Tech Stack & Standards/
│   ├── 02-Application Architecture/
│   ├── 03-Component Specifications/
│   ├── 04-API & Security/
│   ├── 05-Business Logic/
│   └── 06-Testing & Deployment/
├── d��� backend/                          # Backend technical docs
├── d��� architecture/                     # System architecture
└── d��� planning/                         # Project planning
```

## d�?� Public Assets (`/public`)

```
public/
├── d��� assets/              # General assets
│   └── d��� docs/           # Document assets
├── d��� branding/           # Brand assets (logos, colors)
├── d��� defaults/           # Default images/files
├── d��� icons/              # Icon files
├── d��� previews/           # Preview images
└── d��� wallpapers/         # Background images
```

## d��� Source Code (`/src`)

```
src/
├── d��� main.tsx                # Application entry point
├── d��� App.tsx                 # Root component
├── d��� App.css                 # App styles
├── d��� index.css               # Global styles
├── d��� assets/                 # Code-level assets
├── d��� components/             # Reusable React components
│   ├── ui/                   # Base UI components (shadcn/ui)
│   ├── common/               # Common shared components
│   └── layout/               # Layout components
├── d��� features/               # Feature modules
│   ├── auth/                 # Authentication
│   ├── projects/             # Project management
│   ├── tasks/                # Task management
│   ├── calendar/             # Calendar
│   ├── gantt/                # Gantt chart
│   └── ...                   # Other features
├── d��� layouts/                # Page layouts
│   ├── MainLayout.tsx
│   ├── AuthLayout.tsx
│   └── ...
├── d��� routes/                 # Routing configuration
│   ├── index.tsx
│   └── ProtectedRoute.tsx
├── d��� store/                  # State management
│   ├── slices/               # Redux slices
│   └── index.ts
├── d��� services/               # API services
│   ├── api.ts                # API client
│   └── ...                   # Feature services
├── d��� hooks/                  # Custom React hooks
│   ├── useAuth.ts
│   ├── useTheme.ts
│   └── ...
├── d��� utils/                  # Utility functions
│   ├── helpers.ts
│   ├── validators.ts
│   └── ...
├── d��� types/                  # TypeScript types
│   ├── models.ts
│   ├── api.ts
│   └── ...
├── d��� config/                 # Application config
│   ├── constants.ts
│   ├── env.ts
│   └── ...
├── d��� styles/                 # Global styles
│   ├── globals.css
│   └── themes/
├── d��� themes/                 # Theme configuration
│   ├── default.ts
│   └── ...
└── d��� mocks/                  # Mock data (development)
```

## d���️ Component Organization

### Feature-based Structure
Mỗi feature module cA� cấu trA�c:
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

## d��� Naming Conventions

### Files
- **Components**: PascalCase (e.g., `Button.tsx`, `UserProfile.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`, `apiClient.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ROUTES.ts`)
- **Types**: PascalCase (e.g., `User.types.ts`, `Api.types.ts`)

### Directories
- **Feature modules**: lowercase-hyphen (e.g., `user-profile/`, `task-management/`)
- **Component folders**: PascalCase (e.g., `Button/`, `UserCard/`)

## d��� Configuration Files

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

## d�?� Build Outputs

```
# Generated during build (gitignored)
dist/              # Production build
dist-ssr/          # Server-side rendering build
node_modules/      # Dependencies
*.local            # Local environment files
```

## d��� Best Practices

1. **Keep components small and focused** - Single responsibility principle
2. **Use feature folders** - Group related code together
3. **Shared code in appropriate directories** - Don't duplicate
4. **Index files for clean imports** - Export from index.ts
5. **Type everything** - Leverage TypeScript fully
6. **Document complex logic** - Comments for future maintainers
7. **Test critical paths** - Write tests for important features
8. **Follow naming conventions** - Consistency is key

## d��� Related Documentation

- [README.md](../../README.md) - Project overview and setup
- [docs/INDEX.md](../INDEX.md) - Full documentation index
- [docs/frontend/](../frontend/) - Detailed frontend documentation

---

**Last Updated:** 2026-02-03
