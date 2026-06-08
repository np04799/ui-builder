# 🧩 Builder Mode Constraints

BuilderPro must support:

- Bootstrap
- MUI
- Tailwind
- Custom

Users must select mode before project creation.

---

# Bootstrap Rules

Must:
- Follow official Bootstrap standards
- Use Bootstrap grid architecture
- Maintain Bootstrap responsiveness
- Use Bootstrap utility patterns

Do NOT:
- Mix Tailwind classes
- Mix MUI structure
- Generate custom conflicting grid logic

---

# MUI Rules

Must:
- Follow official Material UI standards
- Use MUI layout primitives
- Follow MUI responsive architecture

Do NOT:
- Mix Bootstrap classes
- Mix Tailwind utilities

---

# Tailwind Rules

Must:
- Follow official Tailwind standards
- Use utility-first approach
- Use responsive utility classes

Do NOT:
- Inject Bootstrap grid classes
- Inject MUI structure

---

# Custom Mode Rules

If Custom mode selected:

STRICT REQUIREMENTS:
- Use fully custom CSS
- Use custom responsive system
- Use internal layout engine
- Use BuilderPro native components

DO NOT:
- Use Bootstrap
- Use Tailwind
- Use MUI
- Use third-party UI utilities

Custom mode must remain framework-independent.

---

# Export Output Target Constraints

## Supported Output Targets
- HTML/CSS (all builder modes — free)
- React (Bootstrap / MUI / Tailwind modes only — Premium)
- Vue (Bootstrap / MUI / Tailwind modes only — Premium)
- Angular (Bootstrap / MUI / Tailwind modes only — Premium)

## Premium Gating Rules
- Component generation (React / Vue / Angular) is a paid feature
- Free users see the option but hit a paywall on confirm
- HTML/CSS export is always free
- Custom mode never shows component generation option (not gated — simply not applicable)

## Library Mapping Constraints
- Bootstrap mode → React: `react-bootstrap` only (not `reactstrap`)
- Bootstrap mode → Vue: `bootstrap-vue-next` only
- Bootstrap mode → Angular: `ng-bootstrap` only
- MUI mode → React: `@mui/material` only
- MUI mode → Vue: `vuetify` v3.x only (Vuetify is the Material Design equivalent for Vue)
- MUI mode → Angular: `@angular/material` only (matches Angular version exactly)
- Tailwind mode → all targets: no extra UI library, only Tailwind utility classes
- DO NOT cross-wire libraries (e.g., no Vuetify in Angular output, no Angular Material in Vue output)

## Version Constraints
- Always use latest stable, never beta or RC
- Always write exact version in package.json (no `^` or `~`)
- Version must be stored in `projectMeta.frameworkVersion` at project creation time
- Version displayed in project settings and export modal
- Builder must surface an update badge if a newer stable is available

## Component Generation Constraints
- Every Section = one component (no per-section opt-out in current scope)
- Component names are editable by user before export
- Component names must be valid identifiers (PascalCase for React/Vue, kebab-case for Angular)
- TypeScript and JavaScript are both valid output formats — user chooses at export time
- Full scaffolded project always generated (never component files only)

## Angular-Specific Constraints
- Use Angular 17+ standalone component pattern (`standalone: true`) as default
- `NgModule` pattern available as fallback only if user requests it
- Angular Material version must exactly match `@angular/core` version in package.json
- SCSS is the default stylesheet format for Angular exports (not CSS)

## StackBlitz Integration Constraints
- StackBlitz "Open" button available for React and Vue exports only
- Angular export links to StackBlitz Angular template with a copy-files note
- StackBlitz button must not block the download — show both options simultaneously