# Arquitectura

[Versión en inglés](architecture.md)

Este proyecto es un **monorepo con pnpm + Turborepo** que implementa una arquitectura moderna y escalable para una aplicación bancaria multiplataforma.

## Arquitectura de la Solución

### **Arquitectura Hexagonal (Puertos y Adaptadores)**

Este es el patrón principal que gobierna cómo se organiza el código y cómo fluyen las dependencias:

```
┌────────────────────────────────────────────────────────────┐
│                         APPS                               │
│   ┌─────────────┐  ┌──────────────┐  ┌─────────────┐       │
│   │  web-shell  │  │ web-accounts │  │   mobile    │       │
│   │ (Adaptador) │  │  (Adaptador) │  │ (Adaptador) │       │
│   └──────┬──────┘  └──────┬───────┘  └──────┬──────┘       │
│          │                │                 │              │
│          ▼                ▼                 ▼              │
│   ┌─────────────────────────────────────────────────┐      │
│   │              @repo/core (DOMINIO)               │      │
│   │  ┌─────────┐  ┌──────────┐  ┌───────────┐       │      │
│   │  │  auth   │  │ accounts │  │ transfers │       │      │
│   │  │(Puerto) │  │ (Puerto) │  │  (Puerto) │       │      │
│   │  └─────────┘  └──────────┘  └───────────┘       │      │
│   └─────────────────────────────────────────────────┘      │
└────────────────────────────────────────────────────────────┘
```

**Evidencia:**

```1:2:apps/web-shell/src/services/index.ts
import { httpClient } from '../adapters/http.web';
import { createAuthService } from '@repo/core/domains/auth';
```

- **Puertos**: Interfaz `HttpClient` + interfaces de servicio (`AuthService`) en core
- **Adaptadores**: Implementaciones especificas por plataforma (`http.web.ts`)

---

## Organización del Dominio

### **Diseño Dirigido por el Dominio (DDD)**

No es DDD completo (sin contextos delimitados, agregados o eventos de dominio), pero utiliza **patrones tácticos** para organizar la lógica de negocio:

```
domains/[dominio]/
├── types.ts      → Entidades y Objetos de Valor
├── schema.ts     → Validacion (Reglas de Dominio)
├── service.ts    → Servicio de Dominio (Patron Factory)
├── queries.ts    → Fabrica de Claves de Query
└── index.ts      → API Publica
```

**Evidencia:**

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

## Arquitectura de Apps (Nivel React)

### **Diseño por Capas de Funcionalidad (FSD)**

Cada app utiliza segmentación vertical por funcionalidad, no capas horizontales:

```
features/[funcionalidad]/
├── components/     → Capa de UI
├── hooks/          → Capa de Aplicacion (React Query)
├── screens/        → Paginas (Mobile)
├── [Name]Page.tsx  → Paginas (Web)
└── index.ts        → API Publica
```

**Evidencia:**

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

## Arquitectura de Despliegue

### **Arquitectura de Micro-Frontends (MFE)**

Utilizando **Module Federation** para despliegue independiente:

| App | Rol | Puerto |
|-----|-----|--------|
| `web-shell` | Host (posee auth, enrutamiento) | 3000 |
| `web-accounts` | Remoto (funcionalidad de cuentas) | 3001 |

---

## Definición Resumida

> **Monorepo** con **Arquitectura Hexagonal** y **DDD** para organización del dominio, **Diseño por Capas de Funcionalidad** para estructura de apps, desplegado como **Micro-Frontends** vía Module Federation.

O en términos más simples:

> **Monorepo + Puertos y Adaptadores + Feature-Sliced Design + Micro-Frontends**

### Principios de Diseño Clave

| Principio | Implementación |
|-----------|----------------|
| **Inversión de Dependencias** | Core define interfaces, las apps proveen implementaciones |
| **Separación de Responsabilidades** | Lógica de dominio aislada de infraestructura |
| **Responsabilidad Única** | Una funcionalidad/dominio por carpeta |
| **Abierto/Cerrado** | Agregar nuevos adaptadores sin modificar core |

Esta es una arquitectura moderna y escalable, ideal para aplicaciones bancarias multiplataforma (web + mobile) con autonomía de equipos.
