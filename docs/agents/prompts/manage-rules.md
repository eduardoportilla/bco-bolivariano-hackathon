# Manage Rules Prompt

Use this prompt to retrieve relevant guidelines or suggest updates.

---

## Guidelines Location

```
docs/agents/guidelines/
├── coding.md       # TypeScript, imports, naming
├── styling.md      # TailwindCSS, shadcn, mobile styles
├── components.md   # Component patterns, atomic design
├── architecture.md # Monorepo, MFE, state management
├── security.md     # Banking security requirements
└── mobile.md       # React Native patterns
```

---

## Retrieve Guidelines

When starting a task, identify which guidelines apply:

| Task Type | Relevant Guidelines |
|-----------|---------------------|
| New component | `coding.md`, `components.md`, `styling.md` |
| API integration | `coding.md`, `architecture.md`, `security.md` |
| Mobile screen | `coding.md`, `mobile.md`, `security.md` |
| Auth feature | `security.md`, `architecture.md` |
| Styling update | `styling.md` |

---

## Prompt to Use

```
I need to [describe task].

1. Which guidelines from docs/agents/guidelines/ are relevant?
2. Summarize the key rules I must follow
3. Are there any patterns I should use from the guidelines?
```

---

## Suggest Rule Updates

If you encounter a pattern not covered by guidelines:

```
## Suggested Guideline Update

### File: `docs/agents/guidelines/[file].md`

### Section: [New or existing section]

### Proposed Addition:
[Describe the pattern or rule to add]

### Rationale:
[Why this should be a guideline]
```

---

## Quick Reference

### Always Check
- Import order: `coding.md`
- Component structure: `components.md`
- Security rules: `security.md`

### Platform-Specific
- Web styling: `styling.md`
- Mobile styling: `mobile.md`
- MFE patterns: `architecture.md`
