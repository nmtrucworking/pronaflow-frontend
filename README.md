# PronaFlow Frontend

Hệ thống quản lý dự án và quy trình làm việc được xây dựng với React, TypeScript và Vite.

## Tech Stack

- **Framework:** React 18.3.1
- **Language:** TypeScript 5.5.3
- **Build Tool:** Vite 5.4.1
- **Styling:** TailwindCSS 3.4.10
- **State Management:** Redux Toolkit, Zustand
- **Routing:** React Router DOM 7.13.0
- **Form Handling:** React Hook Form + Zod
- **UI Components:** Radix UI
- **Data Fetching:** TanStack React Query
- **i18n:** i18next
- **Animation:** Framer Motion

## Getting Started

### Prerequisites

- Node.js (phiên bản 18 trở lên)
- npm hoặc yarn

### Installation

```bash
# Clone repository
git clone <repository-url>

# Di chuyển vào thư mục frontend
cd frontend

# Cài đặt dependencies
npm install

# Chạy development server (backend thật)
npm run dev:backend

# Chạy development server (mock API để test UI/UX)
npm run dev:mock

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```text
frontend/
├── docs/                    # Tài liệu dự án
│   ├── deployment/         # Tài liệu triển khai
│   ├── implementation/     # Tài liệu implementation
│   ├── modules/           # Tài liệu modules
│   ├── reports/           # Báo cáo dự án
│   ├── frontend/          # Tài liệu kỹ thuật frontend
│   └── backend/           # Tài liệu kỹ thuật backend
├── public/                 # Static assets
│   ├── assets/
│   ├── branding/
│   ├── defaults/
│   ├── icons/
│   └── previews/
├── src/                    # Source code
│   ├── components/        # React components
│   ├── features/          # Feature modules
│   ├── layouts/           # Layout components
│   ├── routes/            # Routing configuration
│   ├── store/             # Redux store
│   ├── services/          # API services
│   ├── hooks/             # Custom hooks
│   ├── utils/             # Utility functions
│   ├── types/             # TypeScript types
│   ├── config/            # App configuration
│   ├── styles/            # Global styles
│   └── themes/            # Theme configuration
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

## Available Scripts

- `npm run dev` - Alias của backend mode (`vite --mode backend`)
- `npm run dev:backend` - Chạy với API backend thật
- `npm run dev:mock` - Chạy giả lập API để kiểm tra UI/UX
- `npm run build` - Build production
- `npm run preview` - Preview production build
- `npm run lint` - Chạy ESLint

## Documentation

Tài liệu chi tiết về dự án được tổ chức trong thư mục `docs/`:

- **Deployment:** Tài liệu về quá trình triển khai
- **Implementation:** Hướng dẫn implementation các modules
- **Modules:** Chi tiết về từng module trong hệ thống
- **Reports:** Báo cáo tiến độ và tổng kết
- **Frontend/Backend:** Tài liệu kỹ thuật chi tiết

## Contributing

1. Tạo branch mới từ `main`
2. Commit changes với clear message
3. Push lên repository
4. Tạo Pull Request

## License

Private - PronaFlow Project


If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:
