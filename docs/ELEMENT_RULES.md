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

---

# 🎨 FRAMEWORK-AWARE RENDERING

All elements must render with real framework class names based on `store.mode`.

## Rule

Every element calls `useFramework()` and returns framework-specific JSX via early returns:

```tsx
const framework = useFramework()
if (framework === 'bootstrap') return <bootstrapJSX />
if (framework === 'mui') return <muiJSX />
if (framework === 'tailwind') return <tailwindJSX />
// custom: original inline-styles render
```

## Framework CSS Injection

`FrameworkLoader` (mounted in `BuilderLayout`) injects the active framework's CSS into `<head>`:
- Bootstrap: CDN `<link>` tag
- Tailwind: Play CDN `<script>` tag  
- MUI: inline `<style>` with MUI-like CSS classes
- Custom: no injection

`applyFrameworkCSS(mode)` is the shared function — also used by the preview page.

## Preview Page

`/preview` is a separate route with no Zustand store. It reads `mode` from serialized sessionStorage state and calls `applyFrameworkCSS`. `useFramework()` reads from `PreviewStateContext` when in preview.

## Elements Implemented

- ButtonElement — all 4 frameworks
- CardElement — all 4 frameworks
- HeroElement — all 4 frameworks
- HeadingElement — all 4 frameworks
- NavbarElement — all 4 frameworks
- FormElement — all 4 frameworks
- DrawerElement — all 4 frameworks (refactored into BootstrapDrawer / MuiDrawer / TailwindDrawer / CustomDrawer sub-components)