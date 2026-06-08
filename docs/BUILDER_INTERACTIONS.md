# 🖱 Builder Interaction Rules

---

# 🎯 PURPOSE

Define all builder interactions consistently.

Avoid inconsistent UX generation.

---

# 🧩 SELECTION RULES

---

## Single Click

Select element.

---

## Double Click

Enable inline editing.

---

## Selected State

Show:
- Blue outline
- Resize handles
- Context toolbar

---

# 🧩 HOVER RULES

On hover:
- Show subtle outline
- Show drag indicator
- Show quick actions

Avoid:
- Heavy overlays
- Distracting animations

---

# 🧩 DRAG RULES

Users can:
- Drag elements
- Reorder elements
- Move between columns

---

## Drop Zones

Must:
- Highlight clearly
- Show insertion line
- Prevent invalid drops

---

# 🧩 QUICK ACTIONS

On selection show:
- Duplicate
- Delete
- Copy
- Move

---

# 🧩 KEYBOARD SHORTCUTS

Support:

- Delete → remove element
- Ctrl+C → copy
- Ctrl+V → paste
- Ctrl+D → duplicate
- Ctrl+Z → undo
- Ctrl+Shift+Z → redo

---

# 🧩 CONTEXT TOOLBAR

Toolbar appears near selected element.

---

## Must Include

- Typography
- Color
- Alignment
- Spacing
- Border
- Radius

---

# 🧩 RESIZE RULES

Resizable:
- Images
- Columns
- Containers

Must:
- Respect responsive layout
- Prevent overflow

---

# 🧩 DUPLICATE RULES

Duplicate must:
- Preserve styles
- Preserve content
- Generate new IDs

---

# 🧩 DELETE RULES

Delete must:
- Remove safely
- Update builder state
- Avoid orphaned nodes

---

# 🧩 UNDO / REDO

Must track:
- Add
- Delete
- Move
- Edit
- Duplicate

---

# 🧩 RESPONSIVE PREVIEW

Modes:
- Desktop
- Tablet
- Mobile

Switching modes:
- Instant
- Smooth
- Non-destructive

---

# 🚨 UX RULES

DO NOT:
- Create cluttered controls
- Hide canvas excessively
- Use Elementor-style interactions

USE:
- Floating interactions
- Minimal overlays
- Context-based editing