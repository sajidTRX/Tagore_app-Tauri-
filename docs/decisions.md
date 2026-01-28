# TAGORE Desktop - Architecture Decisions

This document records key architectural decisions made during the migration.

---

## Decision 1: Vite + React over Next.js

**Date:** 2024
**Context:** Need to create a desktop app from Next.js web app
**Decision:** Use Vite + React + TypeScript instead of trying to bundle Next.js
**Rationale:**

- Tauri requires static assets, Next.js SSR is incompatible
- Vite provides fast builds and HMR
- React Router provides equivalent routing capability
- Smaller bundle size without Next.js overhead

---

## Decision 2: SQLite as Primary Storage

**Date:** 2024
**Context:** Legacy uses file-based storage, need offline-first desktop storage
**Decision:** Use SQLite with rusqlite for all data persistence
**Rationale:**

- Single file database, easy to backup
- Full ACID compliance for data integrity
- FTS5 provides excellent full-text search
- Works completely offline
- Easy to query and migrate

---

## Decision 3: Rust for Backend Logic

**Date:** 2024
**Context:** Need backend functionality in desktop app
**Decision:** Implement all backend logic in Rust via Tauri commands
**Rationale:**

- Native performance
- Direct SQLite integration without IPC overhead
- Secure handling of API keys
- Can make HTTP requests for AI features
- Type safety from frontend to backend

---

## Decision 4: Keep TipTap Editor

**Date:** 2024
**Context:** Legacy uses TipTap for WYSIWYG editing
**Decision:** Port TipTap exactly as-is
**Rationale:**

- Same editing experience for users
- Same HTML output format (important for history/export)
- Same keyboard shortcuts
- Custom extensions can be reused

---

## Decision 5: Radix UI for Primitives

**Date:** 2024
**Context:** Legacy uses shadcn/ui which is built on Radix
**Decision:** Use same Radix primitives in Tauri app
**Rationale:**

- Exact visual and behavioral parity
- Accessible components out of the box
- Touch-friendly with proper focus management
- Same API means less rewriting

---

## Decision 6: CSS Variables for Theming

**Date:** 2024
**Context:** Need to support multiple themes and font sizes
**Decision:** Use CSS custom properties (variables) for all theme values
**Rationale:**

- Matches legacy approach exactly
- Easy runtime switching
- Can persist in localStorage
- Works with Tailwind

---

## Decision 7: History on Every Save

**Date:** 2024
**Context:** Need to track document history
**Decision:** Create history snapshot on every update_note call
**Rationale:**

- Matches legacy behavior (history on save)
- Simple implementation
- Storage is cheap on local SQLite
- Can implement cleanup policy later if needed

---

## Decision 8: Soft Delete for Notes

**Date:** 2024
**Context:** How to handle note deletion
**Decision:** Use soft delete (deleted_at timestamp) instead of hard delete
**Rationale:**

- Can implement "Recently Deleted" feature
- Accidental deletion is recoverable
- Matches common note app patterns
- Can hard delete in background later

---

## Decision 9: Draft Auto-Save to Database

**Date:** 2024
**Context:** Need to preserve unsaved work
**Decision:** Save drafts to SQLite drafts table
**Rationale:**

- Persists across app restarts
- Can recover from crashes
- Separate from actual notes until explicitly saved
- Matches legacy draft behavior

---

## Decision 10: OpenRouter for AI

**Date:** 2024
**Context:** Legacy uses OpenRouter for AI features
**Decision:** Keep OpenRouter, call from Rust backend
**Rationale:**

- Exact parity with legacy AI behavior
- API key stays in Rust (more secure than frontend)
- Same model defaults
- Same response format

---

## Decision 11: Window Size Fixed

**Date:** 2024
**Context:** Target device is 10.2" 1200x800 display
**Decision:** Set fixed window size of 1200x800, allow resize
**Rationale:**

- Optimized for target hardware
- Can still use on larger displays
- Prevents layout issues from unexpected sizes
- Matches AGENTS.md requirements

---

## Decision 12: Placeholder Auth

**Date:** 2024
**Context:** Legacy has placeholder fingerprint auth
**Decision:** Keep placeholder, implement real PIN
**Rationale:**

- Maintains parity with legacy
- PIN works on all platforms
- Can add biometric later if needed
- Simple and effective

---

## File Structure

```
/tauri
├── src/                    # Vite React frontend
│   ├── components/         # UI components (ported from legacy)
│   │   └── ui/            # Primitive components
│   ├── lib/               # Utilities and API layer
│   ├── pages/             # Route components
│   ├── App.tsx            # Router configuration
│   ├── main.tsx           # React entry point
│   └── index.css          # Global styles
├── src-tauri/
│   └── src/
│       ├── main.rs        # Tauri entry point
│       ├── lib.rs         # App configuration
│       ├── commands.rs    # Tauri command handlers
│       ├── db.rs          # SQLite operations
│       └── models.rs      # Data structures
├── docs/                   # Documentation
│   ├── parity.md          # Parity checklist
│   ├── deviations.md      # Known differences
│   └── decisions.md       # This file
└── public/                # Static assets
```
