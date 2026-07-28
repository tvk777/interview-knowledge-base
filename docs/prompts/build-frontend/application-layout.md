# Step 1 — Application Layout

Before implementing anything, carefully read the following project specifications:

- docs/frontend-design.md
- docs/frontend-architecture.md
- docs/user-flow.md

These documents are the source of truth for this project.

Do not make assumptions that contradict the specifications.

If something is unclear, ask before implementing.

----------------------------------------------------
Task
----------------------------------------------------

Implement only Step 1: Application Layout.

The goal of this step is to build the application shell.

Do NOT implement:

- business logic
- data loading
- search
- filtering
- technology switching
- language switching
- markdown rendering
- API integration

This step is only about the layout and project structure.

----------------------------------------------------
Before Writing Code
----------------------------------------------------

First, analyze the specifications and create an implementation plan.

Your response should include:

## 1. Understanding

Briefly summarize your understanding of this task.

## 2. Implementation Plan

Describe exactly what you are going to implement.

Break the work into small tasks.

## 3. Files

List every file you plan to create or modify.

## 4. Architecture

Explain how the implementation follows frontend-architecture.md.

## 5. Questions

If any architectural decision is unclear, ask before writing code.

IMPORTANT:

Do NOT generate any code yet.

Wait for my approval after presenting the implementation plan.

----------------------------------------------------
Implementation Requirements
----------------------------------------------------

After I approve the plan, implement the layout according to the specifications.

Requirements:

- Use Next.js App Router.
- Use TypeScript.
- Use Tailwind CSS.
- Use shadcn/ui components whenever appropriate.
- Follow the folder structure defined in frontend-architecture.md.
- Keep components small and focused.
- Keep UI and business logic separated.
- Do not import JSON files anywhere.
- Do not add placeholder business logic.

Create the following layout:

Application Layout

├── Header
├── Sidebar
└── Main Content

The Header should be sticky.

The Sidebar should support desktop and mobile layouts.

On mobile, use a Sheet (Drawer).

Main Content should occupy the remaining available space.

----------------------------------------------------
Code Quality
----------------------------------------------------

Write production-quality code.

Keep components reusable.

Avoid unnecessary abstractions.

Avoid premature optimization.

Do not create functionality that belongs to later implementation steps.

----------------------------------------------------
After Implementation
----------------------------------------------------

When implementation is complete, provide:

1. A summary of what was implemented.
2. The final project structure.
3. A list of all created files.
4. Architectural decisions.
5. Any recommendations before moving to Step 2.

Do not start Step 2 automatically.

Wait for my approval.