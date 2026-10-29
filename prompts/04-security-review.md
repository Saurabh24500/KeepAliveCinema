# Antigravity Prompt — Security Review

Review the current KeepAliveMovie code and Supabase configuration without adding new product features.

Focus on:
- Any secret, service-role key, password, or private token exposed in frontend code, logs, repository files, or environment examples.
- `.gitignore`, `.env.local`, and `.env.example`.
- Supabase Row Level Security enabled on every user/community table.
- Policies preventing one user from reading or modifying another user's private journal entries.
- Ownership rules for profiles, posts, comments, and likes.
- Input validation and reasonable content length limits.
- Authentication/session handling and protected routes.
- Unsafe assumptions that frontend-only checks provide authorization.
- Duplicate likes/journal items and missing database constraints.
- Error messages that reveal unnecessary private details.

Do not claim database policies are safe unless you can inspect and test them. Run available checks, list each finding by severity, fix clear issues within the existing architecture, and describe any manual Supabase dashboard tests still required. Do not print secret values in your report.
