# Repository Guidelines

## Project Structure & Module Organization
The backend entrypoint lives in `src/index.mts`, wiring middleware, Socket.io, and static delivery from `public`. Business logic is separated into `src/routes`, `src/controllers`, and `src/models`, while shared helpers sit in `src/utils`. Database connectivity (`src/config/db`) depends on environment variables, and seed utilities reside under `src/seed`. Client assets (HTML, Tailwind, TypeScript) are served from `public`, with reusable browser scripts in `public/js/components` compiled via `public/js/tsconfig.json`.

## Build, Test, and Development Commands
Run `npm install` once to pull dependencies. `npm start` transpiles both server and client TypeScript (`tsc -p tsconfig.json` plus `public/js/tsconfig.json`) before starting the Express server on `PORT` (defaults to 4000). Use `npm run seed` for minimal fixture data or `npm run seed:full` for the full sample classroom set; both assume a reachable MongoDB URI. Regenerate Tailwind bundles with `npm run build:css` whenever you edit `public/css/global.css` or Tailwind tokens.

## Coding Style & Naming Conventions
Follow the existing 2-space indentation in TypeScript, JSON, and config files. Keep files typed (`.ts`/`.mts`) and prefer ES module syntax with explicit extensions (`import ... from "./utils/hash.js"`). Models remain `PascalCase`, route and controller files stay `camelCase`, and environment variables use `SCREAMING_SNAKE_CASE`. Run `tsc -p tsconfig.json --noEmit` before pushing to ensure strict type safety stays intact.

## Testing Guidelines
An automated test runner is not yet wired into `package.json`; when adding coverage, place specs under `src/tests` (e.g., `src/tests/auth.test.ts`) and execute them via `npx ts-node --esm`. Favor Supertest for HTTP endpoints and stub external services such as Nodemailer. Target high-risk flows—authentication, role guards, and seeding logic—with meaningful assertions and document manual QA steps in your PR until a dedicated script is introduced.

## Commit & Pull Request Guidelines
Recent history follows Conventional Commits (`feat:`, `fix:`, `chore:`); match that style and keep bodies concise and imperative. Each PR should describe the problem, the solution, and how reviewers can reproduce results (`npm start`, endpoints hit, seeded roles, etc.). Link issues, flag schema or ENV changes, and include screenshots when UI in `public` changes. Avoid bundling unrelated refactors with feature work to keep reviews focused.

## Security & Configuration Tips
Never commit secrets; copy `.env.example` into `.env` and populate `PORT`, `MONGO_USER`, `MONGO_PASSWORD`, `JWT_SECRET`, `MAIL_USER`, `MAIL_PASS`, `FRONTEND_URL`, and `MAIL_FROM_NAME`. `src/config/config.ts` builds the Atlas URI, while `src/config/db/db.ts` also honors `MONGODB_URI` for local overrides, so keep them in sync when adding variables. When testing email or Socket.io features, prefer sandbox credentials and document any new permissions your code requires.
