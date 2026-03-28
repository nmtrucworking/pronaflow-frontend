# PronaFlow Frontend

Frontend application for PronaFlow project and workflow management platform, built with React, TypeScript, and Vite.

## Overview

This repository contains the UI layer of PronaFlow, focused on:

- Project and task management workflows
- Modular feature-based architecture
- Backend and mock API runtime modes for development and UX testing
- Comprehensive internal documentation under docs

## Tech Stack

- React 18
- TypeScript 5
- Vite 5
- Tailwind CSS 3
- Redux Toolkit and Zustand
- TanStack React Query
- React Router
- React Hook Form and Zod
- Radix UI
- Framer Motion

## Quick Start

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
git clone <repository-url>
cd frontend
npm install
```

### Run

```bash
# Real backend mode
npm run dev:backend

# Mock API mode (UI/UX testing)
npm run dev:mock
```

## Scripts

| Command | Description |
| --- | --- |
| npm run dev | Alias for backend mode (vite --mode backend) |
| npm run dev:backend | Start dev server with real backend |
| npm run dev:mock | Start dev server with mock API |
| npm run build | Type-check and build for production |
| npm run preview | Preview production build |
| npm run lint | Run ESLint |

## Project Structure

```text
frontend/
	docs/             Project documentation and reports
	public/           Static assets (branding, icons, previews)
	src/
		components/     Shared UI components
		features/       Domain/feature modules
		layouts/        App layout definitions
		routes/         Route configuration
		services/       API integration layer
		store/          Global state (Redux)
		hooks/          Reusable custom hooks
		utils/          Utility functions
		types/          Shared TypeScript types
		styles/         Global styling
		themes/         Theme setup
```

## Documentation

- Main index: docs/INDEX.md
- API docs: docs/api/API_DOCUMENTATION_INDEX.md
- Implementation guide: docs/implementation/IMPLEMENTATION_GUIDE.md
- Deployment notes: docs/deployment/DEPLOYMENT_SUMMARY.md

## Deploy Test on GitHub Pages

### Local pre-check

```bash
npm run build:pages
```

### Enable GitHub Pages in repository settings

1. Open repository Settings.
2. Go to Pages.
3. Under Build and deployment, select Source = GitHub Actions.

### Trigger deploy

- Push to branch main, or
- Run workflow Deploy Frontend to GitHub Pages manually from Actions tab.

After workflow finishes, GitHub Pages URL is shown in the deploy job output.

## Contributing

1. Create a branch from main.
2. Keep PRs focused and descriptive.
3. Ensure lint/build pass locally.
4. Open a Pull Request using the provided template.

## License

Private repository. All rights reserved by the PronaFlow project owners.
