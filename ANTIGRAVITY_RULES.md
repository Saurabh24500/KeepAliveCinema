# Antigravity Project Rules

You are the implementation partner for **KeepAliveMovie**. Build a clean, maintainable MVP in small, testable milestones.

## Working style

- Inspect the existing project before editing. Preserve working code and do not overwrite user work without explaining why.
- Work on **one milestone at a time**. Do not build the entire roadmap in one pass.
- Before making substantial changes, briefly state the files you plan to create/edit and the reason.
- After each milestone, summarize changes, commands run, test results, known limitations, and the exact next step.
- If a decision is unclear, choose the simplest safe MVP default and document it in `DECISIONS.md`. Ask only when the choice materially affects data, security, cost, or product direction.
- Prefer readable code over clever abstractions. Avoid unnecessary packages, duplicated components, huge files, fake functionality, and premature optimization.
- Do not claim a feature works unless it is implemented and tested. Do not leave silent placeholder buttons.
- Explain unfamiliar concepts briefly because the project owner is learning while building.

## Product constraints

- Product name: KeepAliveMovie.
- Tagline: “Keep the stories you love alive.”
- Positioning: a personal entertainment journal and community.
- Main content types: movies, anime, anime series, TV series, and web series.
- Prioritize personal lists, viewing history, progress, ratings, favorites, memories, and community posts.
- Initial visual direction: cinematic dark UI; background `#0B0B10`, panels around `#171720`, purple accent `#A855F7`; accessible contrast and restrained effects.
- Responsive from mobile to desktop; fast on slow connections.
- Do not add features outside the current milestone unless needed for correctness or security.

## Technical constraints

- React + TypeScript + Vite.
- Tailwind CSS v4 using `@tailwindcss/vite`.
- React Router for routing.
- Supabase Auth, PostgreSQL, and Storage for backend services.
- TMDB for entertainment metadata and poster images, subject to its terms and attribution requirements.
- Deploy to Vercel when the app is ready.
- Do not introduce a separate Express backend unless a concrete requirement justifies it.
- Use environment variables for credentials and external API keys.
- Frontend may use only Supabase publishable/anon credentials. **Never expose the Supabase service-role key or other server secrets in frontend code.**
- Keep `.env.local` out of Git; provide `.env.example` with placeholder values only.
- Implement Supabase Row Level Security (RLS) for user data before connecting production features.
- Do not store passwords yourself; use Supabase Auth.
- Validate inputs and handle loading, empty, error, and retry states.

## Code quality

- Keep UI components, feature logic, data access, and types separated when that separation is useful.
- Use strict TypeScript; avoid `any` unless justified and documented.
- Use semantic HTML, keyboard-accessible controls, visible focus states, and labels for form fields.
- Use reusable media cards, loading skeletons, empty states, and error states where appropriate.
- Use lazy loading for non-critical images and pagination/incremental loading for long lists.
- Avoid loading all media or all posts at once.
- Do not add fake user counts, fake reviews, or fake production data that could be mistaken for real data.
- Add comments for non-obvious logic, not every line.

## Before finishing each milestone

1. Run the relevant lint/typecheck/build/test commands that exist in the project.
2. Fix errors caused by the changes.
3. Check mobile and desktop layouts where possible.
4. Check empty, loading, and error states for new data-driven screens.
5. Update `ROADMAP.md` and `DECISIONS.md` if needed.
6. Report what is genuinely complete versus what still needs configuration, credentials, or manual verification.
