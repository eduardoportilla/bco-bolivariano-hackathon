# How to Create Guidelines

Meta-guideline for creating consistent AI-readable documentation.

---

## Document Structure

```markdown
# [Topic] Guidelines

Brief one-line description of the guideline scope.

---

## Section Title

Content with code examples and tables.

---

## Another Section

More content...
```

---

## Required Elements

| Element | Purpose | Format |
|---------|---------|--------|
| Title | Main topic | `# [Topic] Guidelines` |
| Intro | Scope statement | Single sentence after title |
| Sections | Logical groupings | `## Section Title` |
| Separators | Visual breaks | `---` between sections |
| Code blocks | Examples | Triple backticks with language |
| Tables | Quick reference | Markdown tables |

---

## Writing Style

- **Concise**: Use short, direct sentences
- **Actionable**: Tell what to do, not what not to do
- **Consistent**: Follow existing guideline patterns
- **No emojis**: Plain text only
- **English**: All documentation in English
- **Code-first**: Show, then explain if needed

---

## Code Examples

### Do This

```typescript
// Good: Show the correct pattern with a brief comment
interface UserProps {
  name: string;
  email: string;
}

export function User({ name, email }: UserProps) {
  return <div>{name}</div>;
}
```

### Avoid This

```typescript
// Bad: Don't show incorrect patterns unless comparing
const user: any = data; // BAD - explain why
```

---

## File Naming

| Type | Convention | Example |
|------|------------|---------|
| Standard guideline | `lowercase.md` | `coding.md` |
| Meta/utility | `_lowercase.md` | `_how_to.md` |
| Platform-specific | `platform.md` | `mobile.md` |

Place all guidelines in `docs/agents/guidelines/`.

---

## Updating AGENTS.md

After creating a guideline, add it to the table in `AGENTS.md`:

```markdown
| Topic | File |
|-------|------|
| New Topic | [guidelines/new-topic.md](docs/agents/guidelines/new-topic.md) |
```

---

## Template

```markdown
# [Topic] Guidelines

[One-line scope description.]

---

## Overview

[Brief context if needed, otherwise skip.]

---

## Rules

[Core rules as bullet points or numbered list.]

---

## Examples

[Code examples with proper syntax highlighting.]

---

## Common Patterns

[Reusable patterns specific to this topic.]

---

## Forbidden Patterns

[Patterns to avoid, shown for clarity.]
```

---

## Checklist

Before finalizing a guideline:

- [ ] Title follows `# [Topic] Guidelines` format
- [ ] Sections separated by `---`
- [ ] Code examples have language tags
- [ ] No emojis or informal language
- [ ] Added to `AGENTS.md` table
- [ ] File named in lowercase with `.md` extension
