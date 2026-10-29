# Antigravity Prompt 1 — Start the Project

Read `ANTIGRAVITY_RULES.md`, `PROJECT_SPEC.md`, `TECHNICAL_PLAN.md`, `DATABASE_PLAN.md`, `ROADMAP.md`, and `DECISIONS.md` first.

We are starting Milestone 1 only: Foundation and visual shell.

1. Inspect the current workspace before changing anything. If a React + TypeScript + Vite project already exists, preserve it and adapt it. If not, create it.
2. Configure Tailwind CSS v4 correctly with Vite using `@tailwindcss/vite`.
3. Set up React Router and a clean, responsive app shell for KeepAliveMovie.
4. Implement the first visual shell only: cinematic dark theme, responsive header/navigation drawer, profile/settings navigation placeholders, home page hero, horizontally scrollable media rows using clearly labeled mock data, reusable media card, footer/About link, and a prominent accessible create-post `+` action. Do not connect Supabase or TMDB yet.
5. Create reusable loading skeleton, empty state, error state, and not-found page components if they fit this milestone.
6. Use the design tokens from the project spec. Keep the UI responsive, accessible, and performant. Avoid adding extra packages unless necessary.
7. Do not implement fake working authentication, fake social actions, or features from later milestones. Any not-yet-connected controls must be clearly disabled or presented as nonfunctional placeholders.
8. Run the available typecheck/build/lint commands. Fix errors caused by your changes.
9. Update `ROADMAP.md` with completed items and report what you changed, files created, commands/tests run, limitations, and the next recommended step.

Work in small steps. Do not implement Milestone 2 or later. Ask before destructive changes.
