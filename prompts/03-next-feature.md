# Antigravity Prompt — Implement the Next Milestone

Read `ANTIGRAVITY_RULES.md`, `PROJECT_SPEC.md`, `TECHNICAL_PLAN.md`, `DATABASE_PLAN.md`, `DECISIONS.md`, and `ROADMAP.md`.

Implement **only the next unchecked milestone** in `ROADMAP.md`.

Before editing:
1. Inspect the existing code and current roadmap state.
2. Briefly state the goal and files you expect to change.
3. Identify prerequisites, secrets/configuration, and security considerations.

During implementation:
- Reuse existing patterns and components.
- Do not break working features or silently replace working code.
- Use TypeScript types and explicit loading, empty, and error states.
- For database work, use reviewed migrations and implement/test RLS before relying on client-side access.
- Never expose service-role keys or private secrets in frontend code.
- Do not add future features beyond this milestone.

After implementation:
1. Run the available typecheck, lint, tests, and production build.
2. Fix errors caused by the implementation.
3. Update `ROADMAP.md` and `DECISIONS.md` where appropriate.
4. Report what is complete, how to test it, any manual dashboard/configuration steps, remaining issues, and the next milestone.

Do not claim tests passed unless they were actually run. If credentials or external setup are missing, implement the safe parts and clearly explain what I must configure.
