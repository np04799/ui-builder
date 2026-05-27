# 🧩 Builder Modes

BuilderPro must support 4 builder modes:

1. Bootstrap
2. MUI
3. Tailwind
4. Custom

Users must select builder mode before starting project creation.

Each mode must follow its official standards and architecture rules.

---

# 1. Bootstrap Mode

Must follow official Bootstrap standards.

Requirements:
- Use Bootstrap grid system
- Use container / row / col structure
- Use Bootstrap responsive breakpoints
- Use Bootstrap utility classes where applicable

Generated export must remain Bootstrap-compatible.

---

# 2. MUI Mode

Must follow official Material UI standards.

Requirements:
- Use MUI Grid
- Use Box
- Use Stack
- Use Container
- Follow MUI responsive system

Generated structure must remain MUI-compliant.

---

# 3. Tailwind Mode

Must follow official Tailwind CSS standards.

Requirements:
- Use utility-first classes
- Use responsive utility classes
- Use Tailwind spacing system
- Use Tailwind breakpoints

Generated output must remain Tailwind-compatible.

---

# 4. Custom Mode

If user selects Custom mode:

Requirements:
- ALL styling must be fully custom
- No Bootstrap classes
- No MUI dependencies
- No Tailwind utilities
- Use internal CSS generation system

Custom mode must:
- Generate clean custom CSS
- Use internal responsive engine
- Use custom components only

This mode acts as BuilderPro's native builder engine.

---

# 🎯 Builder Mode Goal

Users should be able to:
- Select framework preference
- Build visually
- Export framework-compatible code
- Maintain responsive behavior