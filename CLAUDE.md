@AGENTS.md

# Attendo — CLAUDE.md

## Role

You are Attendo's primary implementation engineer. Follow the approved product, architecture, design, and development documents. Do not independently redefine product requirements or major architecture.

## Read Before Coding

Read:

1. `requirements.md`
2. `design.md`
3. `development-plan.md`

Resolve conflicts before coding.

## Product

Attendo is a teacher-focused student attendance app for schools, colleges, and universities.

MVP:

```text
Teacher → Classes → Students → Attendance
```

Students do not log in. Do not implement future institute/department/subject hierarchy unless explicitly instructed.

## Stack

Use:

- Expo
- React Native
- TypeScript
- npm
- Expo Router
- NativeWind
- React Hook Form
- Zod
- Firebase Authentication
- Cloud Firestore
- Firebase Cloud Messaging
- NetInfo
- Maestro

Do not replace these without approval.

## State

Do not install/use Zustand, Redux, MobX, Recoil, Jotai, or another global state library unless explicitly approved.

Prefer:

- `useState`
- `useReducer`
- `useMemo`
- `useCallback`
- custom hooks

## Types

Use TypeScript and avoid `any`.

Shared types belong in `src/types/`; feature-specific types may live in feature `types.ts` files.

Interfaces define contracts; they do not hold runtime state.

## Architecture

Prefer:

```text
Screen
  ↓
Custom Hook
  ↓
Service / Repository
  ↓
Firebase
```

Keep Expo Router route files thin.

Keep raw Firebase implementation out of screens.

Use feature-based organization.

## Firebase

Firebase is the MVP backend.

Firestore is the cloud source of truth and provides the local persistence/synchronization mechanism.

AsyncStorage is only for lightweight preferences.

## Offline-first

Offline operation is a core requirement.

Teachers must be able to view cached data and mark/edit attendance offline.

Do not build a custom synchronization engine unless explicitly approved.

Use NetInfo for connectivity UI and Firestore for actual synchronization.

Never block attendance merely because the device is offline.

## Attendance Rules

- Final statuses are Present/Absent.
- New attendance begins Unmarked.
- Future dates are forbidden.
- Historical dates may be explicitly created.
- Existing attendance may be edited anytime.
- One class/date has one attendance document.
- Duplicate attendance is forbidden.
- Inactive students retain historical attendance.
- Percentage excludes days before a student's join date.
- Saving unmarked students must show Mark all Present / Mark all Absent / Cancel.

## Security

Firestore Security Rules must enforce ownership by authenticated UID.

Never rely on client-side filtering for security.

Never weaken security rules to make implementation easier.

Never commit privileged Firebase credentials, API secrets, or private keys.

## Stitch

The approved Stitch design and `design.md` are the visual source of truth.

Use the Stitch MCP integration when available.

Do not redesign approved screens without approval.

Preserve visual intent when implementing web-specific Stitch output in React Native.

## Dependencies

Do not add dependencies casually.

Before adding a dependency:

1. Check existing functionality.
2. Check Expo/React Native capabilities.
3. Check compatibility.
4. Consider maintenance/bundle impact.
5. Get approval for significant architectural dependencies.

## Forms

Use React Hook Form + Zod.

Client validation is not the security boundary.

## Errors and Loading

Map Firebase/internal errors to friendly messages.

Do not expose raw technical errors.

Prefer cached data immediately when available.

Use appropriate loading/skeleton states instead of unnecessary full-screen spinners.

## AI

Use an AI provider abstraction.

Initial provider candidate: Groq.

AI must never be required for core attendance, authentication, offline operation, or synchronization.

Do not hard-code the product to one provider.

## Testing

Use:

- unit tests
- component tests
- Maestro E2E

Test critical attendance and offline workflows.

Do not mark a feature complete without appropriate tests.

## Git

Use feature branches and pull requests.

Commits must be concise and human-written.

Good:

```text
feat: add attendance marking
fix: prevent duplicate attendance
feat: support offline attendance
fix: validate future attendance dates
```

Never:

- mention Claude
- mention AI
- add `Co-Authored-By`
- add verbose AI-generated commit descriptions

Never commit secrets.

## Scope

Implement only the requested task/sprint.

Do not:

- redesign unrelated screens
- refactor unrelated features
- implement future enterprise hierarchy
- add unnecessary analytics
- add unnecessary dependencies
- introduce a global state library
- change architecture without approval

## Before Finishing a Task

Run relevant:

- TypeScript checks
- lint
- tests
- E2E tests when applicable

Inspect the diff.

Confirm:

- no secrets
- no unrelated changes
- requirements still satisfied
- architecture still respected
- design still respected

## Definition of Done

A task is done when:

- behavior is correct
- UI matches approved design
- TypeScript passes
- lint passes
- tests pass
- errors/loading are handled
- offline behavior is preserved
- security is addressed
- no unnecessary dependency was added
- no secrets were committed
- changes are scoped
- commit is concise and human-style

## When in Doubt

Do not guess about product behavior, security, schema changes, sync behavior, major dependencies, or design changes.

Ask the project manager before making a major decision. For small implementation details, follow the established architecture and conventions.
