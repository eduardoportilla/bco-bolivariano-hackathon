# Cursor AI Guide

**IDE:** Cursor  
**Model:** Claude 4.5 Opus  
**MCPs:** Context7

---

## Workflow

### 1. Plan

Use **Shift+Tab** (Plan Mode) before implementing non-trivial features.

- Agent researches codebase
- Creates implementation plan
- Wait for approval before coding

### 2. Implement

Use `/feature` command or implement from approved plan.

- Follow feature-based structure
- Include tests for new code
- Use react-hook-form + zod for forms

### 3. Review

Run `/review` before committing.

- Runs typecheck, lint, tests
- Checks for forbidden patterns
- Validates security practices

### 4. Commit

Use conventional commits in Spanish:

```
feat(web-accounts): agregar vista de movimientos
fix(mobile): corregir validacion de transferencia
refactor(ui-web): optimizar componente Card
```

Scopes match folder names: `core`, `ui`, `web-shell`, `web-accounts`, `mobile`

### 5. PR

Run `/pr` to draft PR description in Spanish.

---

## Commands

Type `/` in chat:

| Command | Purpose |
|---------|---------|
| `/feature` | Implement feature with tests |
| `/component` | Create component with tests |
| `/test` | Write tests for code |
| `/review` | Validate before commit |
| `/fix-issue` | Fix issue and draft PR |
| `/pr` | Draft PR description |

---

## Rules

Auto-applied from `.cursor/rules/`:

| Rule | When |
|------|------|
| `core.mdc` | Always |
| `security.mdc` | Always |
| `web.mdc` | Editing web files |
| `mobile.mdc` | Editing mobile files |
| `services.mdc` | Creating services/API calls |
| `hooks.mdc` | Creating React Query hooks |
| `testing.mdc` | Writing tests |
| `architecture.mdc` | Creating features |

---

## Key Patterns

### Forms
react-hook-form + zod + zodResolver

### State
Zustand (client) + React Query (server)

### Styling
- Web: TailwindCSS 4.1 + shadcn/ui
- Mobile: StyleSheet.create()

### Testing
Always include tests. Coverage: 70%+

### Commits
Conventional commits in Spanish with app/package scope.

---

## Guidelines

Detailed reference in `docs/guidelines/`:

| File | Content |
|------|---------|
| `coding.md` | TypeScript, imports |
| `components.md` | Component patterns |
| `styling.md` | TailwindCSS, shadcn |
| `architecture.md` | Feature organization |
| `services.md` | API, config, forms, state |
| `security.md` | OWASP, tokens |
| `mobile.md` | React Native |
| `testing.md` | Vitest, Jest |

---

## Resources

Add context materials to `docs/resources/`:

- `apis/` - API documentation
- `designs/` - UI mockups
- `diagrams/` - Architecture flows
- `references/` - External guides

---

## Quick Reference

| Action | Shortcut |
|--------|----------|
| Plan Mode | `Shift+Tab` |
| Interrupt | `Escape` |
| Review | `Review > Find Issues` |
| Commands | `/` |

---

## Tips

1. **Plan first** - Use Plan Mode for complex features
2. **Be specific** - Include file paths in prompts
3. **Fresh start** - New conversation for new tasks
4. **Always test** - Include tests in `/feature`
5. **Review before commit** - Run `/review`

---

## Troubleshooting

See `docs/TROUBLESHOOTING.md` for common issues.

---

## External Resources

- [Cursor Best Practices](https://cursor.com/blog/agent-best-practices)
- [Rules Documentation](https://cursor.com/docs/context/rules)
- [Commands Documentation](https://cursor.com/docs/context/commands)
