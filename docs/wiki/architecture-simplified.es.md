# Arquitectura

Este proyecto es un **monorepo con pnpm + Turborepo** que implementa una arquitectura moderna y escalable para una aplicación bancaria multiplataforma.

## Arquitectura de la Solución

### Arquitectura Hexagonal (Puertos y Adaptadores)

El dominio se concentra en `@repo/core` y las apps actúan como adaptadores por plataforma. La lógica de negocio no depende de detalles de infraestructura.

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

## Organización del Dominio

### Domain-Driven Design (DDD)

Se emplean patrones simplificados para estructurar el dominio (tipos, validaciones y servicios), sin llegar a un DDD completo con bounded contexts.

```
domains/[dominio]/
├── types.ts
├── schema.ts
├── service.ts
├── queries.ts
└── index.ts
```

## Arquitectura de Aplicaciones

### Feature-Sliced Design (FSD)

Cada app organiza su código por funcionalidad en lugar de capas horizontales.

```
features/[funcionalidad]/
├── components/
├── hooks/
├── screens/
├── [Name]Page.tsx
└── index.ts
```

## Arquitectura de Despliegue

### Micro-Frontends (MFE)

Se utiliza Module Federation para el despliegue independiente de micro-frontends.

## Resumen de la Arquitectura

> **Monorepo** con **Arquitectura Hexagonal** y **DDD** para organización del dominio, **Feature-Sliced Design** para estructura de apps, desplegado como **Micro-Frontends** vía Module Federation.

### Principios de Diseño Clave

| Principio | Implementación |
|-----------|----------------|
| **Inversión de Dependencias** | Core define interfaces, las apps proveen implementaciones |
| **Separación de Responsabilidades** | Lógica de dominio aislada de infraestructura |
| **Responsabilidad Única** | Una funcionalidad/dominio por carpeta |
| **Abierto/Cerrado** | Agregar nuevos adaptadores sin modificar core |

Esta es una arquitectura moderna y escalable, ideal para aplicaciones bancarias multiplataforma (web + móvil).