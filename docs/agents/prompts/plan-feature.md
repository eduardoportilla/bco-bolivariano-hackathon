# Plan Feature Prompt

Use this prompt to iterate and refine a feature specification before implementation.

---

## Instructions

When planning a feature, follow these steps:

1. **Read the spec** in `docs/agents/specs/active/`
2. **Identify gaps** - what information is missing?
3. **Ask clarifying questions** - do not assume
4. **Propose implementation steps** - break into small tasks
5. **Identify affected files** - list files to create/modify
6. **Check guidelines** - reference relevant rules

---

## Template

```
## Feature: [Name]

### Spec Location
`docs/agents/specs/active/[spec-name].md`

### Clarifying Questions
1. [Question about unclear requirement]
2. [Question about edge case]

### Implementation Steps
1. [ ] Step one
2. [ ] Step two
3. [ ] Step three

### Affected Files
- `apps/web-shell/src/...` - [reason]
- `packages/ui-web/src/...` - [reason]

### Relevant Guidelines
- `guidelines/coding.md` - import order
- `guidelines/components.md` - component structure
```

---

## Prompt to Use

```
Read the feature spec at [path]. Following the plan-feature template:
1. Identify any unclear requirements and ask questions
2. Propose a step-by-step implementation plan
3. List all files that need to be created or modified
4. Reference relevant guidelines from docs/agents/guidelines/
```
