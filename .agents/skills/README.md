# MedicalC-360 project agent skills

Project-scoped Agent Skills installed under `.agents/skills/`. These are available to coding agents that support the shared `.agents/skills/*/SKILL.md` convention once this branch is pulled locally.

## Installed skills

### Expo (official, MIT)
- `expo-overview` — entry point and shared setup rules for Expo work.
- `expo-web-to-native` — incremental migration of this existing Vite/React site into a native Android/iOS application.
- `expo-dom` — reuse selected existing web components inside the native app during migration.
- `expo-router` — native navigation and route conventions.
- `expo-native-ui` — native-feeling screens, controls, accessibility and platform conventions.
- `expo-ui` — native components via `@expo/ui`.
- `expo-design-system` — design tokens, reusable components and design audits.
- `expo-data-fetching` — API calls, caching, data states and offline support.

### Vercel (MIT)
- `vercel-react-best-practices` — React performance and maintainability guidance.
- `web-design-guidelines` — accessibility, responsive design and interaction review.

## Sources
- Expo: https://github.com/expo/skills
- Vercel: https://github.com/vercel-labs/agent-skills

Skill files were copied from upstream repositories. Supporting migration, routing and design-system references are included where the skill links to them.

## Project-specific cautions
- The current web application is React 18 + Vite. Do not apply React 19-only advice without an intentional framework upgrade.
- Do not scaffold Expo or migrate screens until the existing calculator engine, validation rules and test coverage have been audited.
- Before using Expo APIs, inspect the app's actual Expo SDK version and consult version-matched documentation. The Expo skills may describe newer SDK capabilities.
- Keep the existing production website working throughout the migration. Prefer incremental delivery over a rewrite.
- Preserve the project's established typography preference: Comic Sans MS (Comic Sans/cursive fallbacks) and 16px body text unless the owner changes it.
- Clinical formulas, units, reference ranges and interpretation must be independently verified; never treat a successful build as clinical validation.

## Updating
Review upstream changes before replacing these files. The skills are guidance, not executable dependencies. Do not install every skill in either upstream repository indiscriminately; select skills based on the actual task.
