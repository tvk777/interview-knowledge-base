# Task

Create a comprehensive operational runbook named:

```
ADDING_NEW_TECHNOLOGY.md
```

This document will become the official documentation for adding a new technology to the Interview Knowledge Base project.

The document should be written in professional technical English.

The goal is to create documentation that allows someone (including future me) to successfully add a completely new technology to the project after months or years without remembering how the pipeline works.

The document should be self-contained and should not require reading any other documentation except the referenced Claude Code prompts.

---

# Context

The project already contains:

```
data/
    original/
    generated/
    categories/
    tags/
    enriched/

prompts/
    categories.md

prompts/new-technology/
    README.md
    01-build-category-dictionary.md
    02-review-categories.md
    03-build-tag-dictionary.md
    04-review-tags.md
    05-build-final-dataset.md
```

Read those files and use them as the source of truth.

Do not invent a different workflow.

The documentation must accurately describe the existing pipeline.

---

# Goal

Produce a complete operational manual.

It should explain not only WHAT to do, but WHY every step exists.

Assume the reader has forgotten everything about the project.

The reader should be able to follow the document from beginning to end without asking any additional questions.

---

# Target Length

Approximately

500–700 lines

Longer is acceptable if it improves clarity.

Do not intentionally shorten the document.

---

# Writing Style

Write like high-quality internal engineering documentation.

Be clear.

Be practical.

Be explicit.

Avoid unnecessary marketing language.

Use Markdown headings extensively.

Use bullet lists where appropriate.

Use checklists.

Use notes.

Use warnings.

Use examples.

Use code blocks.

---

# Required Sections

The document should contain at least the following sections.

# Title

Adding a New Technology

---

# Purpose

Explain:

- what this document is;
- when it should be used;
- who it is intended for.

---

# Overview

Describe the complete pipeline.

Include an ASCII pipeline diagram.

---

# Before You Start

Explain:

- prerequisites;
- required tools;
- required files;
- project state;
- Git recommendations;
- expected project structure.

---

# Project Structure

Explain every important directory.

Example:

```
data/original
data/generated
data/categories
data/tags
data/enriched
prompts
```

Explain the purpose of each directory.

---

# Step 1 – Create the Original Dataset

For this step include:

Purpose

Input

Output

Directory

Requirements

Validation

Common mistakes

Next step

Include JSON examples where appropriate.

---

# Step 2 – Build the Generated Dataset

Explain:

- build-data
- input
- output
- generated schema
- difficulty
- ids
- categoryId
- tags

Explain why categoryId and tags are empty.

---

# Step 3 – Generate the Category Dictionary

Explain:

Purpose

Input

Output

Claude Code prompt

Expected result

Validation

Common mistakes

Examples

Explain the relationship with

```
categories.md
```

---

# Step 4 – Review Categories

Explain:

why manual review is required

what should be reviewed

what should never be changed later

what "frozen" means

Include a detailed checklist.

---

# Step 5 – Generate the Tag Dictionary

Explain:

Purpose

Input

Output

Prompt

Expected tag count

Naming conventions

Relationship with categories

Examples

Validation

---

# Step 6 – Review Tags

Explain:

what makes a good navigation tag

what should be removed

duplicates

aliases

implementation details

generic tags

Include a detailed checklist.

---

# Step 7 – Generate the Final Dataset

Explain:

Purpose

Inputs

Outputs

Prompt

Decision process

Validation

Examples

Explain:

category assignment

tag assignment

consistency

---

# Step 8 – Validate the Dataset

Create a complete validation checklist.

Include every validation rule used by the project.

---

# Step 9 – Connect the Frontend

Explain how the generated dataset becomes available to the frontend.

Mention:

technology registry

routing

search index

category navigation

tag navigation

filters

---

# Recovery Guide

Explain how to continue if the work was interrupted.

Examples:

Already have generated dataset.

Already have categories.

Already have tags.

Already have enriched dataset.

---

# Troubleshooting

Include many practical scenarios.

Examples:

Missing categories

Duplicate tags

Invalid JSON

Incomplete dataset

Prompt generated bad output

Questions without categories

Tags that don't exist

Category IDs don't match

---

# Best Practices

Document recommended workflow.

Explain:

why categories should be frozen

why tags should be frozen

why manual review matters

when to regenerate

when not to regenerate

Git recommendations

---

# Validation Checklist

Provide a final pre-release checklist.

Use Markdown checkboxes.

---

# Quick Reference

Provide a condensed workflow.

Example:

```
Original
    ↓
Generated
    ↓
Categories
    ↓
Review
    ↓
Tags
    ↓
Review
    ↓
Enriched
    ↓
Validation
    ↓
Frontend
```

---

# Appendix

Include:

Directory structure

Example file names

Example commands

Example generated schema

Useful notes

---

# Important Requirements

Do NOT rewrite the existing workflow.

Do NOT simplify the pipeline.

Do NOT omit manual review stages.

Keep the documentation practical.

Prefer explaining WHY in addition to HOW.

Assume the document will become the permanent operational manual for this project.

When finished, save the result as:

```
prompts/new-technology/ADDING_NEW_TECHNOLOGY.md
```

The final document should feel like documentation found in a mature production project rather than a short README.