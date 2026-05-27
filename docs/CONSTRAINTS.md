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