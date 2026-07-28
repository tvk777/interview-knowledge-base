# Tag Dictionary Report

Generated as part of building canonical tag dictionaries for the interview knowledge base, per `docs/prompts/build-tag-dictionaries-prompt.md`. This report is intended for **manual review** before the dictionaries in `data/tags/` become part of the project — no questions were tagged and no existing files were modified as part of this task.

## Summary

- **Technologies processed:** 4 (`react`, `javascript`, `typescript`, `nextjs`), sourced from `data/generated/*.json`
- **Total extracted concept forms reviewed:** 442 (raw names/spellings/aliases identified across all four datasets, before consolidation)
- **Total canonical tags:** 323
- **Duplicate concepts merged:** 119 (raw forms folded into an existing canonical tag rather than kept as a separate tag)
- **Aliases merged:** 119 (one alias per merged duplicate — see the Normalization Review tables below)

## Dictionary Statistics

| Technology | Total Tags | Total Aliases |
|---|---|---|
| react | 84 | 29 |
| javascript | 120 | 44 |
| typescript | 69 | 24 |
| nextjs | 50 | 22 |

## Cross-Technology Consistency

17 concepts recur across more than one technology's dataset. Each uses **exactly one** canonical name everywhere it appears (verified programmatically — no technology-prefixed duplicates like "React Promise" were created):

| Concept | Appears in |
|---|---|
| Code Splitting | react, nextjs |
| CSS Modules | react, nextjs |
| ESLint | react, javascript, nextjs |
| Hydration | react, nextjs |
| MobX | react, typescript |
| Prettier | react, javascript |
| Server Components | react, nextjs |
| Server-Side Rendering | react, nextjs |
| Strict Mode | react, javascript, typescript |
| Suspense | react, nextjs |
| TypeScript | react, javascript, nextjs |
| Babel | javascript, typescript |
| Cookies | javascript, nextjs |
| Decorators | javascript, typescript |
| Module | javascript, typescript |
| Tree Shaking | javascript, typescript |
| typeof | javascript, typescript |

## Concepts Deliberately Kept Separate

Per the "never merge different concepts" rule, several superficially-similar terms were kept as distinct tags rather than merged, because they represent genuinely different things:

- **`ReactDOM.render` / `ReactDOM.hydrate` / `ReactDOM.unmountComponentAtNode` / `ReactDOM.findDOMNode`** and **`ReactDOMServer.renderToString` / `ReactDOMServer.renderToStaticMarkup`** — each is a distinct API method with different behavior, not spelling variants of one concept.
- **`Tail Call Optimization`** vs **`Tail Recursion`** — a compiler optimization vs. a recursion pattern; related but not identical.
- **`Prototype`** vs **`Prototypal Inheritance`** — the mechanism/object vs. the inheritance paradigm built on it.
- **`Object.freeze`** vs **`Object.seal`** — different levels of immutability restriction.
- **`Server Actions`** (Next.js data-mutation feature) kept separate from **`Action`** (Redux) — same English word, unrelated concepts.
- **`var`**, **`let`**, **`const`** — kept as three separate tags (distinct scoping/reassignment semantics), matching the pattern already used in `docs/reports/markdown_rendering_spec.md`'s own worked examples.
- **`Event Bubbling`** vs **`Event Capturing`** vs **`Event Propagation`** vs **`Event Delegation`** — four distinct, individually-named DOM event concepts, not aliases of one another.
- **`getServerSideProps`** / **`getStaticProps`** (nextjs) kept as their own tags rather than merged into `Server-Side Rendering` / `Static Site Generation` — they are specific legacy Pages Router APIs, a narrower concept than the rendering strategy itself.

## Concepts Excluded

The extraction pass surfaced many bold/heading strings that were deliberately **not** turned into tags, per the exclusion rules:

- **Generic structural labels**: "Description", "Purpose", "Example", "Summary", "Conclusion", "Key points", "Benefits", "Notes", "Usage" — these are recurring answer-formatting labels (section headers within the Markdown), not technical concepts.
- **Complete sentences**: e.g. "State is managed by the DOM.", "Children notify the parent about changes using callbacks." — explanatory prose, not concept names.
- **Example/variable names and filenames**: `Person`, `greet`, `user`, `data-user-id`, `app.ts`, `math.ts` — instance data from code samples.
- **People and organization names**: "Brendan Eich", "Netscape", "LiveScript", "ECMA International", "TC39" — historical/organizational trivia rather than concepts a question would be tagged with.
- **Bare technology names as self-tags**: "React", "JavaScript" is included cross-technology only where it's genuinely a topic *within* another technology's questions (e.g. TypeScript comparisons appearing in `react.json`); a technology's own dictionary doesn't tag itself.

## Normalization Review

Every canonical tag that absorbed at least one alias, for manual review:

### react (23 merged tags)

| Canonical Tag | Aliases |
|---|---|
| Action | Actions |
| Class Component | Class Components |
| Context API | React Context, React Context API |
| Controlled Component | Controlled Components |
| Custom Hook | Custom Hooks |
| Error Boundary | Error Boundaries |
| Fragment | Fragments, React.Fragment |
| Functional Component | Functional Components |
| Higher-Order Component | Higher-Order Components, HOC |
| Lifecycle Method | Lifecycle Methods |
| Portal | Portals, ReactDOM.createPortal |
| React Fiber | Fiber |
| React Helmet | React Helmet Async |
| React.memo | memo |
| Reducer | Reducers |
| Render Props | Render Prop |
| Selector | Selectors |
| Server Components | React Server Components |
| Server-Side Rendering | SSR |
| Strict Mode | React.StrictMode, StrictMode |
| Suspense | React.Suspense |
| Synthetic Event | Synthetic Events, SyntheticEvent |
| Uncontrolled Component | Uncontrolled Components |

### javascript (35 merged tags)

| Canonical Tag | Aliases |
|---|---|
| Arrow Function | Arrow Functions |
| Callback | Callback Function, Callbacks |
| Class | Classes, Classes (ES6+) |
| Closure | Closures |
| Declarative Programming | Declarative |
| DOM (Document Object Model) | Document Object Model, DOM |
| ES Modules | ESM |
| Event Bubbling | Bubbling |
| Event Capturing | Capturing |
| fetch | Fetch API |
| Garbage Collection | Garbage Collector, GC |
| Generator | Generators |
| Higher-Order Function | Higher Order Functions, Higher-Order Functions |
| IIFE | Immediately Invoked Function Expression |
| Imperative Programming | Imperative |
| Intersection Observer API | Intersection Observer |
| JSON (JavaScript Object Notation) | JSON |
| Logical AND Operator | Logical AND |
| Logical NOT Operator | Logical NOT |
| Logical OR Operator | Logical OR |
| Object-Oriented Programming | OOP |
| Object.seal | Object.isSealed |
| Prototypal Inheritance | Prototype Chain, Prototype-based Inheritance |
| Prototype | __proto__, [[Prototype]] |
| Pure Function | Pure Functions |
| Reactive | Reactive Programming |
| Regular Expression | Regex, RegExp |
| Short-Circuit Evaluation | Short-circuiting |
| Strict Mode | "use strict" |
| Task Queue | Macrotask Queue |
| Template Literals | Template Literal |
| Temporal Dead Zone | TDZ |
| Timer | Timers |
| Truthy and Falsy Values | Falsy Values, Truthy Values |
| Web API | Web APIs |

### typescript (22 merged tags)

| Canonical Tag | Aliases |
|---|---|
| Abstract Class | Abstract Classes |
| Access Modifier | Access Modifiers |
| Conditional Type | Conditional Types |
| Declaration File | .d.ts |
| Design Pattern | Design Patterns |
| Domain-Driven Design | DDD |
| Factory | Abstract Factory, Factory Method |
| Function Overloading | Overload, Overloads |
| Generic Constraint | Generic Constraints |
| Index Signature | Indexed Access Types |
| Intersection Type | Intersection Types |
| Mapped Type | Mapped Types |
| Namespace | Namespaces |
| Observer | Observer Pattern |
| Repository | Repositories |
| Source Map | Source Maps |
| Strict Mode | strict |
| tsconfig | tsconfig.json |
| Tuple | Tuples |
| Type Assertion | Type Casting |
| Union Type | Union Types |
| Utility Type | Utility Types |

### nextjs (21 merged tags)

| Canonical Tag | Aliases |
|---|---|
| Catch-All Route | Catch-all Routes |
| Client Components | Client Component |
| Client-Side Rendering | CSR |
| Dynamic Route | Dynamic Routes |
| Environment Variable | Environment Variables |
| Error UI | error.tsx |
| Font Optimization | next/font |
| Image Optimization | next/image |
| Incremental Static Regeneration | ISR |
| Intercepting Route | Intercepting Routes |
| Layout | layout.tsx |
| Loading UI | loading.tsx |
| Not Found UI | not-found.tsx |
| Parallel Route | Parallel Routes |
| Route Group | Route Groups |
| Route Handlers | Route Handler |
| Server Actions | Server Action |
| Server Components | React Server Components, Server Component |
| Server-Side Rendering | SSR |
| Static Site Generation | SSG |
| Suspense | React.Suspense |

## Methodology Note

Given the volume of source content (437 questions, ~514KB of Markdown across the four `data/generated/*.json` files), concept candidates were surfaced programmatically (inline code spans, bold spans, and heading text extracted from every `question` and `answer` field), then curated manually against the inclusion/exclusion rules — generic labels, complete sentences, and example/variable data were filtered out; genuine technical concepts (APIs, hooks, patterns, language features) were normalized and cross-checked for consistent naming. All structural rules (unique names, alphabetical sorting, alias ownership, no self-referential aliases, cross-technology name consistency) were verified programmatically against the generated JSON files, not just asserted.

Because this is a first-pass extraction over a large corpus, some low-frequency or borderline concepts may have been missed or judged differently than a second reviewer would — that review is the explicit purpose of this report before `data/tags/` is wired into tagging, glossary, search, or related-questions features.
