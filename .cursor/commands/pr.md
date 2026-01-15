# /pr

Draft a pull request description in Spanish.

## Steps

1. Review current changes with `git diff`
2. Run `pnpm typecheck` and `pnpm lint`
3. Run `pnpm test` to verify
4. Draft PR description in Spanish:
   - Titulo siguiendo conventional commits
   - Descripcion del cambio
   - Lista de modificaciones
   - Checklist de validacion

## Output

```markdown
## Descripcion

[Que hace este PR y por que]

## Cambios

- [Cambio 1]
- [Cambio 2]

## Checklist

- [ ] Typecheck pasa
- [ ] Lint pasa
- [ ] Tests pasan
- [ ] Codigo revisado
```
