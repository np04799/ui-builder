# 🧩 Element Rules – BuilderPro MVP-1

---

# 🎯 PURPOSE

This document defines:
- Element behaviors
- Placeholder behavior
- Editing rules
- Styling rules
- Responsive behavior
- Interaction behavior

Claude MUST follow these rules strictly.

---

# 🧱 GLOBAL ELEMENT RULES

All elements must:

- Be draggable
- Be editable
- Be selectable
- Be responsive
- Support hover state
- Support active state
- Support delete
- Support duplicate
- Support move/reorder

---

# 🎨 COMMON STYLING SUPPORT

All text-based elements must support:

- Font family
- Font size
- Font weight
- Text color
- Alignment
- Line height
- Letter spacing
- Margin
- Padding

---

# 🖱 INTERACTION STATES

Every element supports:

## Default State
Normal rendering.

---

## Hover State
- Show subtle outline
- Show drag handle
- Show quick actions

---

## Selected State
- Blue outline
- Context toolbar visible
- Editable controls visible

---

# 🧩 HEADING ELEMENT

---

## Default Content

"Your Heading Here"

---

## Features

- H1–H6 support
- Inline editing
- Responsive typography
- Drag-drop support

---

## Toolbar Controls

- Font size
- Weight
- Alignment
- Color
- Letter spacing
- Line height

---

# 🧩 PARAGRAPH ELEMENT

---

## Default Content

Lorem ipsum placeholder paragraph.

---

## Features

- Inline editing
- Rich text basic support
- Responsive typography

---

## Toolbar Controls

- Typography
- Color
- Alignment
- Spacing

---

# 🧩 BUTTON ELEMENT

---

## Default Content

"Click Here"

---

## Features

- Editable text
- Link support
- Hover state
- Responsive sizing

---

## Variants

- Primary
- Secondary
- Outline
- Ghost

---

## Styling

- Background color
- Text color
- Radius
- Padding
- Border

---

# 🧩 IMAGE ELEMENT

---

## Default State

Placeholder image with:
"No image selected"

---

## Features

- Replace image
- Responsive sizing
- Drag resize
- Object fit controls

---

## Supported Object Fit

- cover
- contain
- fill

---

## Rules

- Images must never overflow containers
- Maintain responsive behavior

---

# 🧩 VIDEO ELEMENT

---

## Default State

Video placeholder block.

---

## Supported Sources

- YouTube
- Vimeo

---

## Rules

- Responsive embeds
- Maintain aspect ratio

---

# 🧩 DIVIDER ELEMENT

---

## Features

- Adjustable width
- Adjustable thickness
- Adjustable color

---

# 🧩 SPACER ELEMENT

---

## Features

- Adjustable height
- Responsive spacing

---

# 🧩 ICON ELEMENT

---

## Features

- Icon picker
- Adjustable size
- Adjustable color

---

# 🧩 FORM ELEMENT

---

## Included Fields

- Input
- Textarea
- Select
- Checkbox
- Radio
- Submit button

---

## Rules

- Mobile responsive
- Accessible labels
- Consistent spacing

---

# 🧩 NAVBAR ELEMENT

---

## Default Content

- Home
- About
- Contact

---

## Features

- Logo placeholder
- Responsive mobile menu
- CTA button support

---

# 🧩 HERO ELEMENT

---

## Default Content

- Heading
- Paragraph
- CTA button
- Placeholder image

---

## Rules

- Responsive layout
- Proper spacing
- Mobile stacking

---

# 🧩 CARD ELEMENT

---

## Included Content

- Image
- Title
- Description
- Button

---

## Rules

- Equal spacing
- Responsive stacking

---

# 🧩 FOOTER ELEMENT

---

## Features

- Links
- Copyright
- Social placeholders

---

# 🚨 INVALID BEHAVIOR

DO NOT:
- Allow elements outside columns
- Allow overflow by default
- Allow broken responsive layouts
- Allow invisible text in themes