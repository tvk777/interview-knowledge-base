# Project Backlog

This document contains ideas, improvements, and architectural changes that are intentionally postponed until after the MVP.

These items are not part of the current implementation roadmap.

---

## Canonical Data Model Review

Before introducing a database backend, review the generated data model and determine whether the schema should be normalized.

Topics to evaluate:

- Add `id` to `Tag`
- Add `id` to `Technology`
- Introduce `technologies.json`
- Consider `technologyId` relationships
- Align the generation pipeline with the future database schema
- Keep the frontend models synchronized with the generated data contract

---

## Future Ideas

- Admin panel
- Database backend
- REST API
- User authentication
- Favorites
- Progress tracking
- Interview simulation