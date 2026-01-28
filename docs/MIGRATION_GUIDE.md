# TAGORE Tauri 2 Migration - Complete Guide

This document summarizes the complete migration from the legacy Next.js + FastAPI web app to the new Tauri 2 desktop application.

## Migration Overview

**Source:** `/frontend` (Next.js 15.5.4) + `/backend` (FastAPI)
**Target:** `/tauri` (Tauri 2 + Vite + React 18 + Rust)
**Target Device:** Raspberry Pi 5 with 10.2" touchscreen (1200x800)

---

## File Structure Created

```
/tauri/
├── package.json              # Dependencies (React, Radix, TipTap, Tailwind)
├── vite.config.ts           # Vite configuration with path aliases
├── tsconfig.json            # TypeScript config with @/ alias
├── tailwind.config.js       # Tailwind with exact legacy theme
├── postcss.config.js        # PostCSS with Tailwind
├── index.html               # Entry HTML with fonts preload
├── .env.example             # Environment variables template
├── README.md                # Project documentation
│
├── src/
│   ├── main.tsx             # React entry with BrowserRouter
│   ├── App.tsx              # Router with all 14 routes
│   ├── index.css            # Global CSS (270 lines)
│   │
│   ├── components/
│   │   ├── TipTapEditor.tsx       # WYSIWYG editor
│   │   ├── FormattingToolbar.tsx  # Editor toolbar
│   │   ├── FontThemeInitializer.tsx
│   │   └── ui/                    # 15 UI primitives
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── select.tsx
│   │       ├── tooltip.tsx
│   │       ├── badge.tsx
│   │       ├── separator.tsx
│   │       ├── switch.tsx
│   │       ├── slider.tsx
│   │       ├── textarea.tsx
│   │       ├── label.tsx
│   │       ├── scroll-area.tsx
│   │       └── sonner.tsx
│   │
│   ├── lib/
│   │   ├── utils.ts              # cn() utility
│   │   ├── api.ts                # Tauri invoke wrapper
│   │   └── editor-settings-context.tsx
│   │
│   └── pages/
│       ├── unlock.tsx
│       ├── landing.tsx
│       ├── home.tsx
│       ├── note.tsx
│       ├── novel.tsx
│       ├── journal.tsx
│       ├── history.tsx
│       ├── settings.tsx
│       ├── device-settings.tsx
│       ├── profile.tsx
│       ├── notifications.tsx
│       └── help.tsx
│
├── src-tauri/
│   ├── Cargo.toml           # Rust dependencies
│   ├── tauri.conf.json      # Tauri configuration
│   └── src/
│       ├── main.rs          # Tauri entry point
│       ├── lib.rs           # App builder with commands
│       ├── commands.rs      # 30+ Tauri commands
│       ├── db.rs            # SQLite operations
│       └── models.rs        # Data structures
│
├── public/
│   └── tagore-icon.svg      # App icon
│
└── docs/
    ├── parity.md            # Feature parity checklist
    ├── deviations.md        # Known differences
    └── decisions.md         # Architecture decisions
```

---

## Key Mappings

### Routes (Next.js → React Router)

| Legacy             | Tauri              | Component           |
| ------------------ | ------------------ | ------------------- |
| `/unlock`          | `/unlock`          | unlock.tsx          |
| `/landing`         | `/landing`         | landing.tsx         |
| `/home`            | `/home`            | home.tsx            |
| `/note/[id]`       | `/note/:id?`       | note.tsx            |
| `/novel`           | `/novel`           | novel.tsx           |
| `/journal`         | `/journal`         | journal.tsx         |
| `/history`         | `/history`         | history.tsx         |
| `/settings`        | `/settings`        | settings.tsx        |
| `/device-settings` | `/device-settings` | device-settings.tsx |
| `/profile`         | `/profile`         | profile.tsx         |
| `/notifications`   | `/notifications`   | notifications.tsx   |
| `/help`            | `/help`            | help.tsx            |

### API (FastAPI → Tauri Commands)

| Legacy Endpoint          | Tauri Command    |
| ------------------------ | ---------------- |
| `GET /api/notes`         | `list_notes`     |
| `GET /api/notes/:id`     | `get_note`       |
| `POST /api/notes`        | `create_note`    |
| `PUT /api/notes/:id`     | `update_note`    |
| `DELETE /api/notes/:id`  | `delete_note`    |
| `GET /api/notes/search`  | `search_notes`   |
| `POST /api/drafts`       | `save_draft`     |
| `GET /api/drafts/:id`    | `get_draft`      |
| `GET /api/history/:id`   | `list_history`   |
| `GET /api/journal/:date` | `get_journal`    |
| `POST /api/journal`      | `upsert_journal` |
| `GET /api/novels`        | `list_novels`    |
| `POST /api/novels`       | `create_novel`   |
| `GET /api/chapters/:id`  | `list_chapters`  |
| `POST /api/chapters`     | `upsert_chapter` |
| `POST /api/ai/chat`      | `ai_chat`        |

### Storage (Files → SQLite)

| Legacy                     | Tauri                        |
| -------------------------- | ---------------------------- |
| `/backend/documents/*.txt` | `notes` table                |
| Session file               | `drafts` table               |
| History files              | `history` table              |
| Daily journal files        | `journals` table             |
| Novel directories          | `novels` + `chapters` tables |
| Config files               | `settings` table             |

---

## SQLite Schema

```sql
-- notes
CREATE TABLE notes (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content_html TEXT NOT NULL,
    content_text TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    deleted_at INTEGER,
    pinned INTEGER NOT NULL DEFAULT 0,
    tags TEXT
);

-- Full-text search
CREATE VIRTUAL TABLE notes_fts USING fts5(id, title, content_text);

-- drafts
CREATE TABLE drafts (
    id TEXT PRIMARY KEY,
    note_id TEXT,
    content_html TEXT NOT NULL,
    updated_at INTEGER NOT NULL
);

-- history
CREATE TABLE history (
    id TEXT PRIMARY KEY,
    note_id TEXT NOT NULL,
    diff_summary TEXT,
    snapshot_html TEXT NOT NULL,
    created_at INTEGER NOT NULL
);

-- journals
CREATE TABLE journals (
    id TEXT PRIMARY KEY,
    date_key TEXT NOT NULL UNIQUE,
    content_html TEXT NOT NULL,
    content_text TEXT NOT NULL,
    updated_at INTEGER NOT NULL
);

-- novels
CREATE TABLE novels (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

-- chapters
CREATE TABLE chapters (
    id TEXT PRIMARY KEY,
    novel_id TEXT NOT NULL,
    chapter_no INTEGER NOT NULL,
    title TEXT NOT NULL,
    content_html TEXT NOT NULL,
    content_text TEXT NOT NULL,
    updated_at INTEGER NOT NULL,
    UNIQUE(novel_id, chapter_no)
);

-- settings
CREATE TABLE settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);
```

---

## Build Commands

```bash
# Install dependencies
cd tauri && npm install

# Development
npm run tauri:dev

# Production build
npm run tauri:build

# Just frontend dev
npm run dev

# Check Rust
cd src-tauri && cargo check
```

---

## Environment Variables

Create `.env` in `/tauri/` directory:

```
OPENROUTER_API_KEY=your_key_here
```

---

## Known Limitations

1. **Font Size/Line Height Extensions** - TipTap custom extensions not yet ported
2. **AI Selection Bubble** - Deferred to Phase 2
3. **Concept Map** - Deferred to Phase 2
4. **Google Drive Sync** - Stub implementation only
5. **PDF Export** - Not yet implemented

---

## Testing Checklist

- [ ] App launches at 1200x800
- [ ] Can navigate between all routes
- [ ] Can create a new note
- [ ] Can edit with TipTap toolbar
- [ ] Can save note (persists to SQLite)
- [ ] Can list all notes
- [ ] Can reopen a saved note
- [ ] Search finds notes
- [ ] Journal saves by date
- [ ] Novel/chapter management works
- [ ] Settings persist
- [ ] Touch targets are 44px minimum
- [ ] Works fully offline

---

## Next Steps

1. Run `npm install` to get dependencies
2. Run `cargo check` in src-tauri to verify Rust builds
3. Run `npm run tauri:dev` to test the full app
4. Test on Raspberry Pi 5 target device
5. Port remaining TipTap extensions
6. Implement Google Drive OAuth for desktop
