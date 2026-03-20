# Repository Guidelines

## Project Structure & Module Organization
- `Doc/` contains the project documentation set (designs, API specs, and sequences).
- There is no application source code in this repository at the moment; this repo is currently documentation-only.
- If code is introduced later, add a top-level folder such as `app/`, `src/`, or `packages/` and document its purpose here.

## Build, Test, and Development Commands
- No build, test, or runtime commands are defined in this repository yet.
- If you add code, include the primary commands in this section and keep them copy-pasteable (for example: `composer install`, `php artisan test`, `npm run dev`).

## Coding Style & Naming Conventions
- No codebase exists in this repository yet, so there are no established style or lint rules.
- If you introduce code, prefer standard Laravel conventions and define formatting/linting in this document.
- Call out indentation and naming (for example: 4-space indent in PHP, `camelCase` for variables, `StudlyCase` for classes).

## Testing Guidelines
- There are no tests or test frameworks configured in this repository.
- If tests are added, document how to run them and any naming conventions (for example: `tests/Feature/*Test.php`).
- Note any coverage expectations if they exist (for example: “new features require tests”).

## Commit & Pull Request Guidelines
- Git history is not available in this repository, so no commit message conventions can be inferred.
- If you initialize Git, document commit expectations and PR requirements (issue links, scope summary, and screenshots for UI changes).
- Keep PRs small and focused, and call out any docs impacted by the change.

## Documentation Notes
- The primary references live in `Doc/`.
- `api_spec_loggit.pdf` contains API definitions.
- `basic_design_loggit.pdf`, `detail_design_loggit.pdf`, and `laravel_design_loggit.pdf` provide architecture and design context.
- `sequence_loggit.pdf` provides flow and sequence references.
