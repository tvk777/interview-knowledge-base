We're ready to implement the next roadmap step: **Language Switching**.

Please follow the same workflow as before:

1. Read the relevant project documentation.
2. Review the current architecture and implementation.
3. Explain your proposed solution in detail.
4. Wait for my approval before making any code changes.
5. After implementation, provide a summary of all changes, architectural decisions, and verification steps.
6. Stop and wait for my review.

## Goal

Allow users to switch the application language between English and Ukrainian while keeping the architecture clean, scalable, and consistent with the existing design.

## Requirements

Please determine the best implementation that follows the existing architecture and design principles.

Consider at least the following:

- How the selected language should be represented.
- Whether the language should be reflected in the URL.
- How language switching should interact with the existing technology routing.
- How localized data should be loaded.
- How the current technology should be preserved when switching languages.
- How search and tag filtering should behave after changing the language.
- Which state should be preserved and which should be reset.
- Whether Server Components or Client Components need to change.
- Whether any providers should change.
- Whether any existing components should be generalized or refactored.
- How this design will support future deep-linking to individual questions.

Please keep the implementation consistent with the existing architecture:

- UI components should remain presentational.
- Services should own data loading.
- Data should continue to flow from Server Components into Client Components.
- Avoid introducing unnecessary client state.
- Prefer solutions that fit naturally into the Next.js App Router.

Before writing any code, explain your proposed architecture, discuss any trade-offs, and wait for my approval.

Thanks for the detailed proposal. Overall, I agree with the proposed architecture.

I like keeping language as a separate Context rather than putting it into the URL. It fits both the current roadmap and the existing data model, and I agree that it should have a different lifecycle from the search state.

I also agree with:

introducing a dedicated LanguageProvider;
keeping all Server Components unchanged;
making search language-aware;
preserving the current technology when switching languages;
implementing the documented fallback behavior through a small helper.

Before you start implementing, I'd like one clarification.

You propose using "en" as the default language. Should the selected language persist across page reloads (for example using localStorage), or is it intentionally reset to English on every refresh? Please explain your recommendation, then proceed with the implementation.