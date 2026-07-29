# Refinement of Step 1 — Mobile Navigation

Before making any changes, read:

- docs/frontend-design.md
- docs/frontend-architecture.md
- docs/user-flow.md

The mobile navigation requirements have been updated.

----------------------------------------------------
Task
----------------------------------------------------

Refactor the existing application shell to improve the mobile navigation.

Do NOT implement any new functionality.

This task is only a refinement of the existing layout.

----------------------------------------------------
Requirements
----------------------------------------------------

On desktop:

- Keep the current layout unchanged.
- TechnologyTabs remain visible in the Header.
- Sidebar remains visible.

On mobile:

The Header should contain only:

- Menu button
- Application title

The Sheet should contain:

1. Technology selector
2. Divider
3. Tag filters

TechnologyTabs should no longer be hidden on mobile.

Instead, they should be rendered inside the mobile Sheet above the tag list.

There should be only one navigation entry point on mobile.

Do not duplicate the TechnologyTabs component.

Reuse the existing component in different locations depending on the viewport.

----------------------------------------------------
Before Writing Code
----------------------------------------------------

First explain:

- what needs to change
- which files will be modified
- whether the current architecture still satisfies frontend-architecture.md

Wait for approval before generating code.

----------------------------------------------------
After Implementation
----------------------------------------------------

Provide:

- summary
- modified files
- architectural decisions

Do not continue with the next implementation step.