# Contributing to Rhiz

Welcome! To keep our codebase clean, maintainable, and scalable, we use a feature-branch workflow. Please read and follow these guidelines when contributing.

## Branching Model

- **main**: Integration branch for all features. Only merge tested, stable features here.
- **feature/relationship-tracking**: All relationship tracking features (health scoring, behavioral tracking, contextual suggestions, etc.)
- **feature/auth-profiles**: User authentication and profile management (OAuth, onboarding, upgrade prompts, etc.)
- **feature/contact-management**: Contact management features (bulk ops, templates, advanced search, etc.)
- **feature/analytics-intelligence**: Analytics and intelligence features (network analytics, AI suggestions, etc.)
- **feature/pwa-infra**: PWA, performance, and infrastructure improvements (code splitting, offline support, security, etc.)

## Workflow

1. **Start new work from the relevant feature branch**
   ```sh
   git checkout feature/relationship-tracking
   git pull
   git checkout -b feature/relationship-tracking-my-new-feature
   ```

2. **Open pull requests against the feature branch**
   - Get code reviewed and tested before merging.

3. **Merge feature branches into main when stable**
   - Only after all tests pass and code is reviewed.

4. **Keep main always deployable and stable**

## Testing

- Run `npm run build` and `npm test` on every branch before merging.
- Resolve all conflicts and ensure no regressions.

## Code Quality

- Follow the existing code style and conventions.
- Run `npm run lint` and fix any linter errors or warnings.
- Write clear, descriptive commit messages.

## Questions?

Open an issue or start a discussion if you have questions about the workflow or need help with a contribution. 