# 🧩 Builder Modes

BuilderPro must support 4 modes:

1. Bootstrap
2. MUI
3. Tailwind
4. Custom

Users select mode before builder initialization.

---

# Bootstrap Mode Rules

Requirements:
- Use container
- Use row
- Use col
- Follow 12-column grid
- Use Bootstrap responsive breakpoints

Generated export must remain Bootstrap-compatible.

---

# MUI Mode Rules

Requirements:
- Use Grid
- Use Box
- Use Stack
- Use Container

Must follow official MUI responsive architecture.

---

# Tailwind Mode Rules

Requirements:
- Use utility-first classes
- Use Tailwind responsive utilities
- Use Tailwind spacing scale
- Use Tailwind layout standards

Generated export must remain Tailwind-compatible.

---

# Custom Mode Rules

Requirements:
- Fully custom CSS
- Internal responsive system
- Native BuilderPro components
- No framework dependency

Strictly avoid:
- Bootstrap classes
- Tailwind utility classes
- MUI components

---

# 🎯 Mode Isolation Rules

Each builder mode must remain isolated.

DO NOT:
- Mix framework classes
- Mix responsive systems
- Mix component architectures

Selected mode controls:
- Layout generation
- Export structure
- Styling engine
- Responsive behavior