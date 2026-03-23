---
name: ux-ui-outcomes
description: Turn product requirements, feature briefs, and vague UI requests into practical UX/UI outcomes with clear flows, interaction rules, visual direction, accessibility checks, and engineering-ready handoff. Use when Codex needs to design or specify screens, improve an existing experience, define component behavior, create desktop/mobile UI specs, or produce implementation-ready UX documentation instead of loose design ideas.
---

# UX/UI Outcomes

## Overview

Deliver UX/UI work that is ready to implement, not just pleasant to discuss. Optimize for user goals, measurable task success, and consistent interaction behavior across screens and states.

If the repo already contains product docs, a design system, UI copy rules, or agent instructions, treat them as hard constraints before proposing visuals or interactions. Reuse existing tokens and behaviors when they exist; only propose net-new patterns when the current system is silent.

## Workflow

### 1. Clarify Product Intent And Constraints

Capture or infer:
- target users and primary jobs-to-be-done
- success metrics and task completion signals
- platform and device constraints
- business constraints, legal/compliance limits, and delivery scope
- existing design-system or brand constraints

If details are missing, state explicit assumptions and continue. Do not block on perfect discovery for normal product work.

### 2. Define Structure Before Visuals

Map:
- primary and secondary user flows
- information architecture and navigation model
- key entry points, exits, and recovery paths
- edge states: empty, loading, error, permission, offline, zero-results, success

Prefer task flow clarity over novel layouts. If the structure is weak, do not move on to visual polish.

### 3. Design The Interaction Model

Specify interaction rules for the important components and actions:
- default, hover, focus, active, disabled, validation, success, and async-progress states
- forms, filters, search, pagination, tables, inline editing, and destructive actions
- transitions, confirmations, autosave, optimistic updates, and failure recovery
- keyboard behavior, focus movement, and screen-reader labels where relevant

When a product already has component rules, inherit them instead of creating parallel behavior.

### 4. Apply UI Research Before Visual Direction

Read [`references/ui-knowledge-sources.md`](./references/ui-knowledge-sources.md).

Use it to select:
- 2-3 professional UX/UI articles or design-system docs relevant to the task
- 3-5 benchmark examples from the Awwwards section

Extract the principles that matter for this task. Do not copy layouts or art direction verbatim. Translate benchmarks into reusable decisions about hierarchy, navigation, density, motion, trust, and conversion.

If the user explicitly asks for current or latest examples, supplement the bundled references with live browsing.

### 5. Produce Visual Direction

Define:
- typography hierarchy
- spacing rhythm and layout grid
- color roles, not just color picks
- icon usage and illustration rules if needed
- responsive breakpoints and layout adaptation rules

Keep visual hierarchy in service of task speed and comprehension. Prefer clear emphasis, scannability, and action priority over decorative variation.

### 6. Enforce Accessibility Baseline

Meet at least this baseline unless stricter project rules exist:
- keyboard access for all interactive controls
- visible focus states
- WCAG AA contrast for text and controls
- semantic labels, helper text, and validation messaging
- non-color indicators for status where practical

### 7. Create Engineering Handoff

Provide screen-by-screen specs with:
- component usage and variants
- spacing, sizing, and token references
- state and behavior notes
- acceptance criteria and concrete test scenarios

When the user wants a deeper artifact, use [`references/ui-spec-template.md`](./references/ui-spec-template.md) as the response structure.

## Output Contract

Return work in this order unless the user asks for another format:
1. Problem framing
2. Assumptions
3. User flows and IA
4. Inspiration and rationale
5. Screen specs
6. Component and state specs
7. Accessibility checks
8. Handoff checklist

## Quality Bar

- Prefer implementation-ready decisions over generic design language.
- Tie recommendations to task success, not taste alone.
- Call out tradeoffs when density, speed, trust, or flexibility compete.
- Distinguish facts from assumptions.
- Cover both desktop and mobile when the product is responsive or cross-device.
- Include empty/loading/error states whenever they affect delivery quality.

## References

- Research and benchmark source list: [`references/ui-knowledge-sources.md`](./references/ui-knowledge-sources.md)
- Detailed handoff scaffold: [`references/ui-spec-template.md`](./references/ui-spec-template.md)
