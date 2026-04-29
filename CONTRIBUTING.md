# Contributing to SuperPOS

We love your input! 🚀  
Want to help making SuperPOS even better? Here’s how you can contribute.

## 📘 Table of Contents
- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)
- [Pull Requests](#pull-requests)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Guidelines](#coding-guidelines)
- [Testing](#testing)
- [Commit Messages](#commit-messages)

## Code of Conduct
This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs
1. Check if the bug was already reported in [Issues](../../issues).
2. Open a new issue with a clear title and description.
3. Include as much relevant information as possible: steps to reproduce, expected vs actual behaviour, screenshots, environment details (OS, Node version, Docker version).

### Suggesting Enhancements
1. Open an issue and describe your idea in detail.
2. Explain why this enhancement would be useful to most SuperPOS users.
3. If you can, mock up a wireframe or describe the user interaction.

### Pull Requests
1. **Fork** the repo and create your branch from `main`.
2. **Clone** your fork locally.
3. Follow the [Development Setup](#development-setup) to get the project running.
4. Make your changes, ensuring adherence to [Coding Guidelines](#coding-guidelines).
5. **Test** your changes thoroughly.
6. **Commit** using conventional commit messages (see below).
7. **Push** to your fork and open a Pull Request against the `main` branch.
8. In the PR description, explain **what** changed and **why**.

## Development Setup
This project consists of three packages in a monorepo:
- `backend` – NestJS API + SQLite
- `pos-client` – React cashier application (Vite)
- `admin-panel` – React admin dashboard (Vite)

### Prerequisites
- Node.js 20+
- npm 10+
- Docker (optional)

### Local run (without Docker)
```bash
# Terminal 1 – backend
cd backend && npm install && npm run start:dev

# Terminal 2 – pos client
cd pos-client && npm install && npm run dev

# Terminal 3 – admin panel
cd admin-panel && npm install && npm run dev
```
## 🐳 With Docker
```bash
docker-compose up -d
```
📁 Project Structure
```
superpos/
├── backend/                  # NestJS API
│   └── src/
│       ├── modules/          # Feature modules (products, orders, reports, promotions)
│       ├── events/           # WebSocket gateway
│       └── app.module.ts     # Root module
├── pos-client/               # Cashier frontend
│   └── src/
│       ├── pages/            # Cashier page component
│       ├── store/            # Zustand cart store
│       ├── hooks/            # Scanner hook
│       └── lib/              # Offline database, sync queue
├── admin-panel/              # Admin frontend
│   └── src/
│       ├── AdminApp.tsx      # Main layout with menu
│       ├── ProductsPage.tsx  # Product CRUD
│       └── Dashboard.tsx     # Analytics dashboard
├── shared/                   # Shared TypeScript types
├── docker-compose.yml
├── .github/workflows/        # CI/CD pipelines
└── README.md
```
## 🧾 Coding Guidelines
- **TypeScript** – all code is strictly typed, prefer explicit types over `any`.
- **Formatting** – 2 spaces indentation, single quotes, no trailing spaces.
- **Backend (NestJS)** – follow the module-service-controller pattern.
- **Frontend (React)** – use functional components with hooks.
- **Style** – Ant Design components, avoid inline styles when possible.
- **Linting** – ESLint and Prettier configurations will be added soon; for now, keep the code clean.

## 🧪 Testing
- **Backend**: eventually we aim to use **Jest** for unit/e2e tests.
- **Frontend**: **Vitest** + React Testing Library.

Until testing infrastructure is set up, please manually test your changes:
Add a product in admin panel → scan it in cashier → finish sale → verify analytics dashboard updates.

## 📝 Commit Messages
We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:
feat: add daily sales bar chart to dashboard
fix: resolve offline order not syncing after reconnect
docs: update Contributing guidelines
refactor: move scanner logic into custom hook

Thank you for helping make SuperPOS awesome! 🛒✨
