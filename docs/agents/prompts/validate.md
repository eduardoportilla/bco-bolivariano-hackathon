# Validate Prompt

Use this prompt to verify an implementation matches its spec.

---

## Instructions

When validating:

1. **Compare to spec** - check each acceptance criterion
2. **Run checks** - lint, typecheck, tests
3. **Review patterns** - verify guidelines followed
4. **Test edge cases** - confirm error handling
5. **Document gaps** - note any deviations

---

## Validation Checklist

```
## Validation: [Feature Name]

### Spec: `docs/agents/specs/active/[spec].md`

### Acceptance Criteria
- [ ] Criterion 1: [status]
- [ ] Criterion 2: [status]
- [ ] Criterion 3: [status]

### Code Quality
- [ ] `pnpm lint` passes
- [ ] `pnpm typecheck` passes
- [ ] `pnpm test` passes (if applicable)

### Guidelines Compliance
- [ ] No missing imports
- [ ] Named exports used
- [ ] TypeScript strict (no any)
- [ ] No hardcoded secrets
- [ ] No console.log
- [ ] Spanish user-facing text

### Issues Found
1. [Issue description and location]
2. [Issue description and location]

### Verdict
[ ] PASS - Ready to close
[ ] FAIL - Needs fixes (list above)
```

---

## Prompt to Use

```
Validate the implementation of [feature name] against its spec.

1. Read the spec at docs/agents/specs/active/[spec].md
2. Check each acceptance criterion is met
3. Run pnpm lint and pnpm typecheck
4. Review code for guideline compliance:
   - All imports present
   - Named exports used
   - No TypeScript any
   - No hardcoded secrets
   - No console.log
5. Report validation status with any issues found
```

---

## On Pass

If validation passes:
1. Move spec from `specs/active/` to `specs/closed/`
2. Add entry to `specs/changes.md`
