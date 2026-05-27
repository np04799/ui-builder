# 📤 Export Rules – BuilderPro MVP-1

---

# 🎯 PURPOSE

Define export engine behavior.

Exports must remain:
- Clean
- Responsive
- Framework-compatible

---

# 📦 EXPORT TYPES

Supported:
- HTML
- CSS
- ZIP package

Future:
- React
- Next.js
- Vue

NOT in MVP-1.

---

# 📁 ZIP STRUCTURE

/export
  index.html
  styles.css
  /assets

---

# 🧩 EXPORT RULES

Exports must:
- Be semantic
- Be responsive
- Avoid invalid nesting
- Avoid inline style chaos

---

# 🧱 STRUCTURE MAPPING

Section → section
Row → div.row
Column → div.col
Element → semantic element

---

# 🧩 FRAMEWORK EXPORTS

---

## Bootstrap Mode

Use:
- container
- row
- col-*

---

## Tailwind Mode

Use:
- utility classes
- responsive utilities

---

## MUI Mode

Use:
- Grid
- Stack
- Box

---

## Custom Mode

Use:
- Custom CSS only
- No framework classes

---

# 🖼 IMAGE EXPORT RULES

Store inside:
/assets/images

---

# 🎨 CSS RULES

Must:
- Generate reusable classes
- Avoid duplicated styles
- Use responsive media queries

---

# 📱 RESPONSIVE EXPORT

Must support:
- Desktop
- Tablet
- Mobile

---

# 🚨 INVALID EXPORTS

DO NOT:
- Export broken nesting
- Export hidden builder controls
- Export editor overlays
- Export unused styles