# /test

Write tests for existing or new code.

## Steps

1. Identify what needs testing
2. Check docs/guidelines/testing.md for patterns
3. Write tests using AAA pattern
4. Run `pnpm test` to verify
5. Ensure coverage meets requirements (70%+ components)

## Pattern

```
Arrange - Set up test data
Act - Execute code under test
Assert - Verify outcome
```

## Rules

- Test behavior, not implementation
- Use accessible queries (getByRole, getByLabelText)
- Mock external dependencies
- Co-locate tests with components
