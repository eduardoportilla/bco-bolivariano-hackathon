# Implement Prompt

Use this prompt to execute an implementation plan.

---

## Instructions

When implementing:

1. **Read the plan** - understand all steps before starting
2. **Follow guidelines** - check `docs/agents/guidelines/` for patterns
3. **Complete imports** - never leave missing imports
4. **Format consistently** - follow project conventions
5. **Test as you go** - verify each step works
6. **Update spec** - mark completed items

> **Remember** that the filesystem is your knowledge base for documentation and tracking progress.

---

## Pre-Implementation Checklist

Before writing code, verify:

- [ ] Spec is in `specs/active/`
- [ ] Plan is approved
- [ ] Relevant guidelines reviewed
- [ ] Dependencies installed
- [ ] Types defined

---

## Prompt to Use

```
Implement the plan for [feature name].

Before starting:
1. Read the spec at docs/agents/specs/active/[spec].md
2. Review these guidelines:
   - docs/agents/guidelines/coding.md
   - docs/agents/guidelines/[relevant].md

Rules to follow:
- Include all imports
- Use named exports
- Follow TypeScript strict mode
- Use @repo/ prefix for internal packages
- No console.log in production code
- Spanish for user-facing text

Execute each step, verifying the build passes after changes.
```

---

## Post-Implementation

After completing:

1. Run `pnpm lint` and `pnpm typecheck`
2. Verify the feature works as specified
3. Update the spec with completion status
