# BuilderPro Architecture

## Core Modules

1. Landing App
2. Builder Engine
3. Export Engine
4. Save System
5. Authentication

---

# Builder Engine

Main responsibilities:
- Render layouts
- Drag-drop
- Element editing
- Responsive preview

---

# Layout Structure

Section
 └── Row
      └── Column
            └── Element

---

# State Management

Use Zustand.

Store:
- Builder JSON
- Selection state
- Responsive mode
- Project metadata

---

# Canvas Components

- Canvas
- SectionRenderer
- RowRenderer
- ColumnRenderer
- ElementRenderer

---

# Elements

Basic:
- Text
- Heading
- Image
- Button
- Divider
- Spacer

Advanced:
- Navbar
- Hero
- Card
- Footer
- Form

---

# Responsive System

Modes:
- Desktop
- Tablet
- Mobile

---

# Export Engine

Convert:
JSON → HTML/CSS

Rules:
- Clean HTML
- Semantic structure
- Minimal wrappers

---

# Save System

Without login:
- localStorage

With login:
- Firestore

---

# Auth

Use Firebase:
- Google login
- Email/password

---

# Deployment

- Vercel