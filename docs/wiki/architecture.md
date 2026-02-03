# Architecture

[Spanish version](Architecture.es.md)

This project is a **pnpm + Turborepo monorepo** implementing a modern, scalable architecture for a multi-platform banking application.

## Solution Architecture

### **Hexagonal Architecture (Ports & Adapters)**

This is the primary pattern governing how code is organized and dependencies flow:

```
┌────────────────────────────────────────────────────────────┐
│                         APPS                               │
│   ┌─────────────┐  ┌──────────────┐  ┌─────────────┐       │
│   │  web-shell  │  │ web-accounts │  │   mobile    │       │
│   │  (Adapter)  │  │   (Adapter)  │  │  (Adapter)  │       │
│   └──────┬──────┘  └──────┬───────┘  └──────┬──────┘       │
│          │                │                 │              │
│          ▼                ▼                 ▼              │
│   ┌─────────────────────────────────────────────────┐      │
│   │              @repo/core (DOMAIN)                │      │
│   │  ┌─────────┐  ┌──────────┐  ┌───────────┐       │      │
│   │  │  auth   │  │ accounts │  │ transfers │       │      │
│   │  │ (Port)  │  │  (Port)  │  │  (Port)   │       │      │
│   │  └─────────┘  └──────────┘  └───────────┘       │      │
│   └─────────────────────────────────────────────────┘      │
└────────────────────────────────────────────────────────────┘
```

**Evidence:**

```1:2:apps/web-shell/src/services/index.ts
import { httpClient } from '../adapters/http.web';
import { createAuthService } from '@repo/core/domains/auth';
```

- **Ports**: `HttpClient` interface + service interfaces (`AuthService`) in core
- **Adapters**: Platform-specific implementations (`http.web.ts`)

---

## Domain Organization

### **Domain-Driven Design**

Not full DDD (no bounded contexts, aggregates, or domain events), but uses **tactical patterns** for organizing business logic:

```
domains/[domain]/
├── types.ts      → Entities & Value Objects
├── schema.ts     → Validation (Domain Rules)
├── service.ts    → Domain Service (Factory Pattern)
├── queries.ts    → Query Key Factory
└── index.ts      → Public API
```

**Evidence:**

```8:14:packages/core/src/domains/auth/service.ts
export interface AuthService {
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<AuthResponse>;
  refresh: () => Promise<RefreshResponse>;
  getMe: () => Promise<User>;
}
```

---

## App Architecture (React Level)

### **Feature-Sliced Design (FSD)**

Each app uses vertical slicing by feature, not horizontal layers:

```
features/[feature]/
├── components/     → UI Layer
├── hooks/          → Application Layer (React Query)
├── screens/        → Pages (Mobile)
├── [Name]Page.tsx  → Pages (Web)
└── index.ts        → Public API
```

**Evidence:**

```8:14:apps/web-shell/src/features/auth/hooks/useAuth.ts
export function useAuth() {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: authService.getMe,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry on 401
  });
}
```

---

## Deployment Architecture

### **Micro-Frontend Architecture (MFE)**

Using **Module Federation** for independent deployability:

| App | Role | Port |
|-----|------|------|
| `web-shell` | Host (owns auth, routing) | 3000 |
| `web-accounts` | Remote (accounts feature) | 3001 |

---

## Summary Definition

> **Monorepo** with **Hexagonal Architecture** and **DDD** for domain organization, **Feature-Sliced Design** for app structure, deployed as **Micro-Frontends** via Module Federation.

Or in simpler terms:

> **Monorepo + Ports & Adapters + Feature-Sliced Design + Micro-Frontends**

### Key Design Principles

| Principle | Implementation |
|-----------|----------------|
| **Dependency Inversion** | Core defines interfaces, apps provide implementations |
| **Separation of Concerns** | Domain logic isolated from infrastructure |
| **Single Responsibility** | One feature/domain per folder |
| **Open/Closed** | Add new adapters without modifying core |

This is a modern, scalable architecture well-suited for multi-platform (web + mobile) banking applications with team autonomy.