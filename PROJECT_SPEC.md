# KeepAliveMovie — Product Specification

## 1. Product summary

**Name:** KeepAliveMovie  
**Tagline:** Keep the stories you love alive.

A personal entertainment journal and community where people can organize the movies, anime, and series they love, track their viewing journey, rate and review titles, save memories, and discuss stories with other fans.

## 2. Target experience

The product should feel cinematic, personal, friendly, quick, and easy to use. The user should be able to quickly find a title, save it to a list, record viewing progress, and share a thought without navigating through a complicated interface.

## 3. MVP features

### Authentication and account
- Sign up and sign in with email/password through Supabase Auth.
- Sign out.
- Basic account/profile settings.
- Clear validation and error messages.
- Password reset flow if supported by the selected Supabase setup.

### Profile and onboarding
- Avatar/photo, display name, unique username, and short bio.
- Favorite genres or categories.
- Profile completion percentage based on required profile fields.
- First-login onboarding tour explaining the main areas.
- Tour can be skipped; do not force it on every login. Provide a way to replay it.
- Do not expose private account details on public profiles.

### Home and discovery
- Responsive cinematic home page with a hero section.
- Rows/sections for popular or relevant movies, anime, and series.
- Media detail view with poster/backdrop, title, overview, release date, genres, and media type where available.
- TMDB metadata/images only when configured and used according to TMDB terms and attribution requirements.
- Loading skeletons, empty states, and recoverable errors.
- Lazy-load images and load long collections incrementally.

### Personal entertainment journal
- Watchlist / want to watch.
- Currently watching.
- Watched / completed.
- Dropped or paused status where appropriate.
- Viewing progress for episodic content when reliable episode metadata is available.
- Personal rating, favorite marker, and optional short personal note/memory.
- Viewing history and filters by media type/status.
- Prevent duplicate entries for the same user and media item.

### Community
- Create a text post, optionally linked to a media item.
- Posts can be marked as containing spoilers.
- Feed with pagination or incremental loading.
- Like and comment on posts.
- Spoiler content should be hidden behind a deliberate reveal action.
- Basic reporting/moderation hooks may be planned, but do not claim a full moderation system exists until implemented.

### Navigation and design
- Responsive navigation drawer/hamburger menu.
- Profile summary near the top of the drawer and settings near the bottom where practical.
- Prominent create-post `+` action, positioned accessibly on mobile and desktop.
- Footer/About page explaining the product.
- Dark cinematic visual style with restrained purple accent.

## 4. Explicit non-goals for first release

Do not implement these until the MVP is stable:
- AI recommendations or chatbot.
- Real-time messaging.
- Complex follower/friend graph.
- Subscription/payment system.
- Native mobile application.
- Full-scale moderation dashboard.
- Custom media database copied from another service.
- Separate Express server without a demonstrated need.

## 5. UX and performance requirements

- Work on mobile, tablet, and desktop.
- Be usable on slow or unstable connections.
- Show skeletons while waiting for data and clear empty/error states.
- Offer retry when a request can safely be retried.
- Use pagination/incremental loading; do not load an unlimited feed at once.
- Lazy-load below-the-fold imagery.
- Avoid excessive animation and large dependencies.
- Use accessible contrast, keyboard navigation, form labels, and focus indicators.

## 6. Success criteria for MVP

A user can:
1. Register and sign in.
2. Complete or skip onboarding.
3. Set up and edit a profile.
4. Browse/search available entertainment metadata.
5. Open a media detail view.
6. Add a title to a personal status/list and update it.
7. Rate a title and see it in their personal journal.
8. Create a community post, mark spoilers, like, and comment.
9. Use the site on a mobile viewport without major layout breakage.
10. Sign out, and their private data remains protected by database policies.
