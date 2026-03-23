# UI Spec Template

Use this template when the user asks for a detailed handoff artifact, a spec for engineering, or a reusable screen-by-screen document.

## 1. Problem Framing

- Product or feature:
- Primary user:
- Primary job-to-be-done:
- Business goal:
- Success metrics:
- Constraints:

## 2. Assumptions

- List explicit assumptions.
- Mark each assumption as `low-risk`, `medium-risk`, or `high-risk`.

## 3. User Flows And IA

### Primary Flow

1. Entry point:
2. Key decisions:
3. Critical actions:
4. Exit or completion state:

### Secondary Flows

- Flow:
- Why it matters:
- Divergence from primary flow:

### Information Architecture

- Navigation model:
- Screen list:
- Object hierarchy:
- Global actions:

## 4. Inspiration And Rationale

### Professional Sources

- Source:
- Relevant principle:
- How it affects the design:

### Benchmark References

- Reference:
- Pattern worth borrowing:
- Pattern to avoid copying literally:

## 5. Screen Specs

Repeat for each screen.

### Screen: [Name]

- Goal:
- User context:
- Desktop layout:
- Mobile layout:
- Primary CTA:
- Secondary actions:
- Content hierarchy:
- Empty/loading/error states:
- Notes for analytics or instrumentation:

## 6. Component And State Specs

Repeat for each important component.

### Component: [Name]

- Purpose:
- Variants:
- Default behavior:
- Hover/focus/active:
- Disabled:
- Validation:
- Async progress:
- Error recovery:
- Keyboard behavior:
- Token or size notes:

## 7. Accessibility Checks

- Focus order:
- Focus visibility:
- Semantic labels:
- Error messaging:
- Contrast concerns:
- Touch target concerns:
- Motion reduction needs:

## 8. Handoff Checklist

- Clear component inventory
- Clear state inventory
- Responsive behavior documented
- Edge states documented
- Acceptance criteria documented
- QA scenarios documented

## 9. Acceptance Criteria

- `Given / When / Then` scenario:
- `Given / When / Then` scenario:

## 10. QA Test Scenarios

- Happy path:
- Validation failure:
- Async timeout or API failure:
- Empty state:
- Permission or access failure:
- Mobile-specific scenario:
