# QA and Devin Polish

## Goal

Make the completed shell feel deliberate without spending primary-model time on low-risk visual refinement.

## QA checklist

- [ ] Review desktop, tablet, and mobile layouts.
- [ ] Check no horizontal overflow exists.
- [ ] Review all empty, loading, error, hover, focus, active, and disabled states.
- [ ] Confirm keyboard and focus basics for forms, dialogs, menus, and tabs.
- [ ] Confirm status colors and copy are understandable and accessible.
- [ ] Record data contracts and backend dependencies per page.

## Devin ticket template

```md
Refine [specific page/component] only.

Preserve existing behavior, routes, tokens, and commerce-language copy.
Improve spacing, typography hierarchy, responsive layout, and interaction states.
Do not change component architecture or introduce dependencies.

Acceptance criteria:
- No horizontal overflow at mobile/tablet/desktop widths
- Hover, focus, active, disabled, loading, and empty states are deliberate
- Existing functionality remains intact
```

## Done when

The shell is responsive, consistent, accessible at a basic level, and ready for data-model implementation.
