We're ready to implement the next roadmap step: **Technology Switching**.

Please follow the same workflow as before:

1. Read the relevant project documentation.
2. Review the existing architecture and the current implementation.
3. Explain your proposed implementation in detail.
4. Wait for my approval before making any code changes.
5. After implementation, provide a summary of all changes, architectural decisions, and verification steps.
6. Stop and wait for my review.

## Goal

Allow users to switch between available technologies (JavaScript, React, Next.js, TypeScript) while keeping the architecture clean and consistent with the rest of the application.

## Requirements

Please determine the best implementation that follows the existing architecture and design principles.

Consider at least the following:

- Where the technology selector should live.
- How the selected technology should be represented.
- Whether the selected technology should be reflected in the URL.
- How data loading should work after switching technologies.
- Which components should remain server components and which should remain client components.
- How to minimize unnecessary client state.
- Whether existing providers should change.
- How search and tag filtering should behave after switching technologies.
- Whether any state should be reset when the technology changes.
- Whether any existing components should be generalized or refactored.

Please keep the implementation consistent with the project's existing architecture:

- UI components should remain presentational.
- Services should own data loading.
- Data should continue to flow from Server Components into Client Components.
- Avoid introducing unnecessary complexity.

Before writing any code, explain your proposed architecture and implementation plan, including any trade-offs, then wait for my approval.


Thanks for the detailed proposal. Overall, I agree with the proposed architecture.

I like the decision to represent the selected technology in the URL using a dynamic route. It keeps client state minimal, fits naturally with the App Router, and aligns well with the future deep-linking flow.

I also agree with:

using generateStaticParams() for the four technologies;
redirecting / to /react;
resetting the search and tag filter by remounting SearchProvider with key={technology};
keeping data loading in Server Components.

There is only one thing I'd like to keep unchanged.

In Step 7 we intentionally refactored AppLayout into a generic layout component using slots (sidebar and children). I'd like to preserve that separation of responsibilities rather than moving the Sidebar creation into AppLayout.

So please keep the current AppLayout API and continue passing the rendered Sidebar as the sidebar prop from the page component.

Everything else looks good. Please proceed with the implementation.