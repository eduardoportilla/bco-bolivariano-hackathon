# /fix-issue

Fix an issue and draft a PR description.

## Steps

1. Understand the issue described by the developer
2. Analyze the problem and find relevant code
3. Implement the fix following project rules
4. Write tests if applicable
5. Run `pnpm typecheck` and `pnpm test`
6. Draft PR description in Spanish with:
   - Titulo claro del cambio
   - Descripcion del problema
   - Solucion aplicada
   - Archivos modificados

## PR Template

```markdown
## Descripcion

[Descripcion del problema y contexto]

## Solucion

[Explicacion de los cambios realizados]

## Cambios

- [Lista de archivos/componentes modificados]

## Testing

- [ ] Pruebas unitarias
- [ ] Pruebas manuales
```
