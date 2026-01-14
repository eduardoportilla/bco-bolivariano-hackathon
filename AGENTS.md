# AGENTS.md

AI coding agent guidelines for the Banco Bolivariano Hackathon project.

---

## Quick Start

Read the [Framework Guide](docs/agents/FRAMEWORK.md) for the spec-driven development methodology.

---

## Guidelines

| Topic | File |
|-------|------|
| Coding Standards | [guidelines/coding.md](docs/agents/guidelines/coding.md) |
| Styling (Web) | [guidelines/styling.md](docs/agents/guidelines/styling.md) |
| Components | [guidelines/components.md](docs/agents/guidelines/components.md) |
| Architecture | [guidelines/architecture.md](docs/agents/guidelines/architecture.md) |
| Security | [guidelines/security.md](docs/agents/guidelines/security.md) |
| Mobile | [guidelines/mobile.md](docs/agents/guidelines/mobile.md) |
| Testing | [guidelines/testing.md](docs/agents/guidelines/testing.md) |
| Creating Guidelines | [guidelines/_how_to.md](docs/agents/guidelines/_how_to.md) |

---

## Prompts

| Action | Prompt |
|--------|--------|
| Plan a feature | [prompts/plan-feature.md](docs/agents/prompts/plan-feature.md) |
| Implement code | [prompts/implement.md](docs/agents/prompts/implement.md) |
| Validate work | [prompts/validate.md](docs/agents/prompts/validate.md) |
| Get rules | [prompts/manage-rules.md](docs/agents/prompts/manage-rules.md) |

---

## Specs

- Active: [specs/active/](docs/agents/specs/active/)
- Closed: [specs/closed/](docs/agents/specs/closed/)
- Changelog: [specs/changes.md](docs/agents/specs/changes.md)

---

## Critical Rules

1. **No emojis** in code or comments
2. **Include all imports** - never leave missing imports
3. **Named exports** - no default exports
4. **Explicit types** - no implicit any
5. **@repo/ prefix** - use for internal packages
6. **Spanish UI text** - English for code
7. **No secrets** - use environment variables
8. **No console.log** - use proper logging

---

## Tech Stack

| Platform | Stack |
|----------|-------|
| Web | React 19, TypeScript, Vite, TailwindCSS 4.1, shadcn/ui for components  |
| Mobile | React Native CLI, TypeScript, Native StyleSheet |
| Monorepo | pnpm, Turborepo |
| State | Zustand, React Query |

---

## Project Structure

```
bbh/
├── apps/
│   ├── web-shell/      # Host MFE
│   ├── web-auth/       # Auth MFE
│   └── mobile/         # React Native
├── packages/
│   ├── ui-web/         # Web components
│   └── ui-mobile/      # Mobile components
└── docs/
    └── agents/         # This framework
```
