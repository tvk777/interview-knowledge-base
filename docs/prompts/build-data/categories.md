# Categories

This document defines the canonical categories used to classify interview questions.

Rules:

- Each question MUST belong to exactly one category.
- Categories are technology-specific.
- Do NOT invent new categories.
- If no category fits, use `Other`.

---

# Classification Rules

1. Assign exactly one category.
2. Never invent a new category.
3. Choose the most specific category available.
4. If multiple categories seem applicable, prefer the one that represents the primary topic of the question.
5. Use `Other` only as a last resort.

---

# React

## Fundamentals
Core React concepts, virtual DOM, rendering model, React philosophy, advantages, limitations, and comparisons with other frameworks.

## JSX
JSX syntax, expressions, rendering rules, fragments, conditional rendering, lists, keys, and JSX-specific behavior.

## Components
Functional components, composition, props, component lifecycle concepts, rendering behavior, reusable component design, and communication between components.

## Hooks
Built-in hooks, custom hooks, hook rules, dependencies, lifecycle behavior, hook composition, and best practices.

## Forms
Controlled and uncontrolled components, form handling, validation, React Hook Form, Formik, and form-related patterns.

## Context API
Context creation, providers, consumers, useContext, global state sharing, and Context performance considerations.

## State Management
Local state, useState, useReducer, lifting state up, state organization, derived state, and general state management patterns excluding Redux.

## Performance
Memoization, React.memo, useMemo, useCallback, lazy loading, Suspense, rendering optimization, reconciliation, hydration, and profiling.

## Routing & SSR
React Router, navigation, route protection, code splitting, server-side rendering concepts, and routing-related topics.

## Architecture & Patterns
Application architecture, folder structure, reusable patterns, composition patterns, design principles, testing strategy, scalability, and maintainability.

## Redux
Redux, Redux Toolkit, reducers, actions, middleware, async logic, selectors, RTK Query, and Redux architecture.

## Other
Questions that do not clearly belong to any category above.

---

# JavaScript

## Fundamentals
Core JavaScript concepts, language features, execution model, variables, operators, and general language behavior.

## Data Types
Primitive types, reference types, type coercion, equality, conversions, null, undefined, symbols, and BigInt.

## Variables & Scope
var, let, const, lexical scope, block scope, hoisting, temporal dead zone, execution context, stack, heap, and memory.

## Strings
String manipulation, template literals, Unicode, methods, immutability, and string-related algorithms.

## Arrays
Array methods, iteration, transformations, sorting, searching, destructuring, spread operator, and performance considerations.

## Objects
Object creation, properties, descriptors, prototypes, this, object methods, destructuring, and object manipulation.

## Functions
Function declarations, expressions, arrow functions, parameters, higher-order functions, currying, and functional programming concepts.

## Closures & Execution Context
Closures, lexical environment, execution context, call stack, scope chain, memory behavior, and related concepts.

## Classes & OOP
Classes, constructors, inheritance, encapsulation, polymorphism, prototype chain, and object-oriented programming.

## Async JavaScript
Callbacks, Promises, async/await, Event Loop, microtasks, macrotasks, timers, asynchronous programming, and concurrency.

## DOM & Browser APIs
DOM manipulation, nodes, elements, BOM, browser APIs, storage, fetch, Web APIs, and document interaction.

## Events
Event propagation, bubbling, capturing, delegation, event listeners, custom events, and browser event handling.

## Regular Expressions
Pattern matching, RegExp syntax, flags, groups, lookaheads, lookbehinds, and string searching.

## Modules
ES Modules, CommonJS, imports, exports, module resolution, bundling, and code organization.

## Other
Questions that do not clearly belong to any category above.

---

# TypeScript

## Fundamentals
TypeScript basics, benefits, compiler, language overview, and comparison with JavaScript.

## Basic Types
Primitive types, arrays, tuples, enums, any, unknown, never, void, literal types, and basic typing.

## Advanced Types
Union types, intersection types, mapped types, conditional types, indexed access types, template literal types, and advanced type manipulation.

## Interfaces & Type Aliases
Interfaces, type aliases, declaration merging, extending types, structural typing, and choosing between interfaces and types.

## Functions
Typing functions, overloads, optional parameters, generics in functions, this typing, and function signatures.

## Generics
Generic functions, generic interfaces, generic constraints, utility patterns, and reusable typed abstractions.

## Utility Types
Partial, Required, Pick, Omit, Record, Exclude, Extract, ReturnType, Parameters, and other built-in utility types.

## Classes
TypeScript classes, access modifiers, abstract classes, implements, inheritance, decorators (if applicable), and OOP features.

## Modules
Modules, namespaces, declaration files, imports, exports, ambient declarations, and module resolution.

## Configuration
tsconfig.json, compiler options, strict mode, path aliases, project references, build configuration, and tooling.

## TypeScript with JavaScript
JavaScript interoperability, migration strategies, JSDoc typing, third-party libraries, and integration with existing JavaScript projects.

## Other
Questions that do not clearly belong to any category above.

---

# Next.js

## Fundamentals
Core Next.js concepts, framework overview, architecture, benefits, comparisons with React, and use cases.

## Routing
File-system routing, dynamic routes, nested routes, route groups, parallel routes, intercepting routes, and routing concepts.

## Navigation
Link component, useRouter, redirects, navigation APIs, client navigation, and route transitions.

## App Router vs Pages Router
Differences, migration strategies, feature comparison, compatibility, and architectural changes between routing systems.

## Server & Client Components
Server Components, Client Components, rendering boundaries, directives, composition, and communication between component types.

## Rendering & Data Fetching
SSR, SSG, ISR, CSR, static and dynamic rendering, fetch(), data loading strategies, and rendering lifecycle.

## Loading, Error Handling & Streaming
loading.tsx, error.tsx, not-found.tsx, Suspense, streaming, error boundaries, and fallback UI.

## API Routes, Route Handlers & Server Actions
API Routes, Route Handlers, Server Actions, backend functionality, mutations, forms, and server-side logic.

## Caching
Data Cache, Full Route Cache, Router Cache, cache invalidation, revalidation, cache tags, and caching strategies.

## Performance & SEO
Performance optimization, hydration, metadata, image optimization, fonts, scripts, SEO, Core Web Vitals, and optimization techniques.

## Styling & Configuration
CSS Modules, Tailwind CSS, Sass, global styles, configuration files, environment variables, TypeScript setup, and project configuration.

## State Management, Security & Cookies
State management approaches, authentication, authorization, cookies, headers, middleware security, sessions, and request handling.

## Architecture, Testing, i18n & Deployment
Project structure, architectural patterns, testing, internationalization, deployment, Vercel, Docker, and production best practices.

## Other
Questions that do not clearly belong to any category above.