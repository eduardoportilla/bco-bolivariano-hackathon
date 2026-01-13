# Spec-Driven Development Framework

A lightweight methodology for AI-assisted development in the Banco Bolivariano hackathon project.

---

## Cycle

```
SPEC -> PLAN -> IMPLEMENT -> VALIDATE -> CLOSE
```

### 1. Spec
Define the feature in `specs/active/` with:
- Clear objective
- Acceptance criteria
- Technical constraints
- Related guidelines

### 2. Plan
Use `prompts/plan-feature.md` to:
- Analyze the spec
- Ask clarifying questions
- Propose implementation steps
- Identify affected files

### 3. Implement
Use `prompts/implement.md` to:
- Execute the plan step by step
- Follow guidelines in `guidelines/`
- Ensure all imports are included
- Format code consistently

### 4. Validate
Use `prompts/validate.md` to:
- Verify implementation matches spec
- Run linting and type checks
- Check for missing edge cases
- Confirm acceptance criteria met

### 5. Close
- Move spec from `specs/active/` to `specs/closed/`
- Log the change in `specs/changes.md`
- Archive any related assets

---

## Directory Structure

```
docs/agents/
├── FRAMEWORK.md          # This file
├── guidelines/           # Coding rules and patterns
│   ├── coding.md         # General code standards
│   ├── styling.md        # Styling guidelines
│   ├── components.md     # Component patterns
│   ├── architecture.md   # Project structure
│   ├── security.md       # Banking security rules
│   └── mobile.md         # React Native patterns
├── specs/
│   ├── active/           # Current work items
│   ├── closed/           # Completed specs
│   └── changes.md        # Implementation changelog
└── prompts/              # Reusable AI prompts
    ├── plan-feature.md
    ├── implement.md
    ├── validate.md
    └── manage-rules.md
```

---

## Quick Reference

| Action | Command |
|--------|---------|
| Start new feature | Create spec in `specs/active/` |
| Get guidelines | Read relevant file in `guidelines/` |
| Plan implementation | Use `prompts/plan-feature.md` |
| Execute changes | Use `prompts/implement.md` |
| Verify work | Use `prompts/validate.md` |
| Complete feature | Move to `specs/closed/`, update `changes.md` |
