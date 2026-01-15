# /review

Review current changes before commit.

## Steps

1. Run `pnpm typecheck` - fix type errors
2. Run `pnpm lint` - fix lint issues
3. Run `pnpm test` - ensure tests pass
4. Check for forbidden patterns:
   - No hardcoded secrets
   - No console.log
   - No default exports
   - No implicit any
   - No missing imports
5. Verify we are following the project rules and security best practices.
5. Verify Spanish UI text, English code
6. Summarize what needs attention
