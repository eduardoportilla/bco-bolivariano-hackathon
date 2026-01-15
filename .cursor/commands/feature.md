# /feature

Implement a new feature or change with tests (unless otherwise specified).

## Steps

1. Ask clarifying questions about requirements
2. Create implementation plan with affected files
3. Wait for approval before coding
4. Implement following project rules
5. Write tests for new functionality
6. Run `pnpm typecheck` and `pnpm test`
7. Summarize changes made

## Structure

Follow feature-based organization:
- Web: apps/web-*/src/features/[name]/
- Mobile: apps/mobile/src/features/[name]/

## Always Include

- TypeScript types for new data
- Tests for new components/hooks
- Zod schemas for form validation
