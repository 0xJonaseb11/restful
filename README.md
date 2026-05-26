# TaskFlow &mdash; Full-Stack RESTful Template

A highly-optimized, premium full-stack RESTful application template. Built using **TypeScript**, utilizing an **Express** backend with **Prisma ORM** + **SQLite**, and a **Vite + React** frontend styled with **Tailwind CSS v3**.

---

## Features

- **End-to-End TypeScript**: Complete type safety from the database schema to the client UI.
- **RESTful Architecture**: Clean REST endpoints with Express router, controller isolation, and unified error handling.
- **Robust Schema Validation**: JSON payload, parameters, and query validation using Zod schemas.
- **Database Engine & GUI**: Prisma ORM with lightweight SQLite, plus built-in Prisma Studio GUI.
- **API Documentation**: Complete Swagger UI OpenAPI documentation integrated directly into the API runtime.
- **Premium User Interface**: Stunning, responsive glassmorphic design featuring curated dark-mode hues, real-time dashboard analytics, custom Google Fonts, and micro-animations.
- **Unified Monorepo Workflow**: Simple orchestration using npm workspaces and concurrent dev servers.

---

## Directory Structure

```
├── backend/            # Express REST API
│   ├── prisma/         # Database schema & migrations
│   └── src/            # Controllers, middleware, routes, docs, services
├── frontend/           # Vite + React Client
│   ├── src/            # Components, styling, state management
│   └── index.html      # Entry document
├── package.json        # Workspace orchestrator
└── README.md           # Documentation
```

---

## Getting Started

### Prerequisites

Ensure you have **Node.js** (v18+) and **npm** installed on your system.

### 1. Installation

Install all dependencies for both frontend and backend workspaces concurrently from the root directory:

```bash
npm install
```

### 2. Database Migration

Initialize your local SQLite database and generate the Prisma Client:

```bash
npm run db:migrate
```

### 3. Launch Development Environment

Run both the Express API and the Vite React application concurrently with a single command:

```bash
npm run dev
```

- **Frontend client**: http://localhost:3000
- **Backend API & Swagger Docs**: http://localhost:5001/api/docs
- **Backend Spec JSON**: http://localhost:5001/api/docs.json

### 4. Database Inspector (GUI)

To visually inspect and manage your SQLite data in the browser, run:

```bash
npm run studio
```

- **Prisma Studio**: http://localhost:5555

