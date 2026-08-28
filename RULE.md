# AI Assistant Guidelines for @qqax/design-editor

This document outlines strict rules and best practices for any AI/LLM (e.g., Claude, Gemini, Codex, etc.) assisting with the development of the `@qqax/design-editor` package. These guidelines are formulated based on past mistakes and common LLM pitfalls specific to this frontend package.

**AI ASSISTANT INSTRUCTION:** You MUST read and follow these rules before making any changes, suggesting commands, or writing code in this package.

---

## 1. Package Management & Lockfiles
**Rule:** ALWAYS use `pnpm`. DO NOT use `npm`, `yarn`, or `bun`.
- **Why:** This package is part of a larger `pnpm` monorepo. Using `npm install` locally within this package will break the root `pnpm-lock.yaml` lockfile and cause CI/CD failures (e.g., `ERR_PNPM_OUTDATED_LOCKFILE`).
- **Actionable:** 
  - To install dependencies, use `pnpm add <pkg>`.
  - Do not create a separate `package-lock.json` or `yarn.lock` inside this directory.

## 2. NPM Publishing & Permissions
**Rule:** When releasing or publishing this package to the registry, proactively verify NPM authentication and organizational permissions.
- **Why:** "E403 Forbidden" errors occur when attempting to publish without proper scope access to `@qqax`.
- **Actionable:** 
  - Ensure the environment is authenticated (`npm whoami`) and confirm you have write access to the `@qqax` scope.
  - Coordinate version bumps correctly (e.g., via `changesets` if used by the host repo) before attempting an `npm publish` or `pnpm publish`.

## 3. Asset Management & CDN Offloading
**Rule:** Do NOT bundle large binary assets (images, fonts, heavy JSON templates) directly in the package source code.
- **Why:** This bloats the published NPM package size and slows down downstream installations.
- **Actionable:** 
  - Always design the editor to fetch heavy assets dynamically from a CDN.
  - Do not hardcode local asset paths in the frontend components; accept asset URLs as props or fetch them from external buckets.

## 4. Secrets and Environment Variables
**Rule:** NEVER commit `.env` or any environment-specific configuration files to version control.
- **Why:** Security risk. AI agents have previously attempted to track modified `.env` files.
- **Actionable:** 
  - Always verify that `.env` is listed in `.gitignore`. 
  - If a `.env` file accidentally appears as modified in `git status`, DO NOT commit it. Use `git rm --cached .env` to untrack it locally.

## 5. Frontend UI & React Best Practices
**Rule:** Utilize modern React patterns and the established styling system (Tailwind CSS, Ant Design).
- **Why:** LLMs often hallucinate vanilla CSS, inject inline styles, or use outdated React class component patterns.
- **Actionable:** 
  - Rely on Tailwind utility classes and provided UI components.
  - Do not use inline styles (`style={{...}}`) unless dynamically required for things like calculated drag-and-drop dimensions or canvas positioning.

## 6. General LLM Pitfalls to Avoid
- **Destructive File Edits:** Do not overwrite entire files to make small changes. Use targeted, precise edits to preserve existing comments, structure, and unrelated logic.
- **Global Installs:** Avoid suggesting `npm install -g`.
- **TypeScript Strictness:** Do not use `@ts-ignore`, `@ts-expect-error`, or `any` to lazily bypass type checking. Fix the underlying TypeScript definitions instead.
