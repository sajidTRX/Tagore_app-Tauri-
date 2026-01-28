# TAGORE Desktop Parity Checklist

This document tracks feature parity between the legacy web app (`/frontend` + `/backend`) and the new Tauri desktop app (`/tauri`).

## Legend

- ✅ Complete
- 🟡 In Progress
- ❌ Not Started
- ⏸️ Deferred

---

## Screens / Routes

| Route           | Legacy Path        | Tauri Path         | Status |
| --------------- | ------------------ | ------------------ | ------ |
| Unlock/Auth     | `/unlock`          | `/unlock`          | ✅     |
| Landing         | `/landing`         | `/landing`         | ✅     |
| Home            | `/home`            | `/home`            | ✅     |
| Note Editor     | `/note/[id]`       | `/note/:id`        | ✅     |
| Novel Editor    | `/novel`           | `/novel`           | ✅     |
| Journal         | `/journal`         | `/journal`         | ✅     |
| History         | `/history`         | `/history`         | ✅     |
| Settings        | `/settings`        | `/settings`        | ✅     |
| Device Settings | `/device-settings` | `/device-settings` | ✅     |
| Profile         | `/profile`         | `/profile`         | ✅     |
| Notifications   | `/notifications`   | `/notifications`   | ✅     |
| Help            | `/help`            | `/help`            | ✅     |

---

## UI Components

| Component      | Status | Notes               |
| -------------- | ------ | ------------------- |
| Button         | ✅     | Exact styling match |
| Input          | ✅     | Exact styling match |
| Card           | ✅     | Exact styling match |
| Dialog         | ✅     | Radix UI based      |
| Dropdown Menu  | ✅     | Radix UI based      |
| Select         | ✅     | Radix UI based      |
| Tooltip        | ✅     | Radix UI based      |
| Badge          | ✅     | Exact styling match |
| Separator      | ✅     | Exact styling match |
| Switch         | ✅     | Exact styling match |
| Slider         | ✅     | Exact styling match |
| Textarea       | ✅     | Exact styling match |
| Label          | ✅     | Exact styling match |
| ScrollArea     | ✅     | Radix UI based      |
| Toast (Sonner) | ✅     | Sonner integration  |

---

## Editor Features

| Feature               | Status | Notes                   |
| --------------------- | ------ | ----------------------- |
| TipTap Core           | ✅     | StarterKit integration  |
| Bold/Italic/Underline | ✅     | Via FormattingToolbar   |
| Headings (H1, H2)     | ✅     | Via FormattingToolbar   |
| Bullet List           | ✅     | Via FormattingToolbar   |
| Ordered List          | ✅     | Via FormattingToolbar   |
| Blockquote            | ✅     | Via FormattingToolbar   |
| Undo/Redo             | ✅     | Via FormattingToolbar   |
| Clear Formatting      | ✅     | Via FormattingToolbar   |
| Font Size             | 🟡     | Custom extension needed |
| Line Height           | 🟡     | Custom extension needed |
| Placeholder Text      | ✅     | TipTap extension        |
| AI Selection Bubble   | 🟡     | Deferred to Phase 2     |
| Concept Highlight     | ⏸️     | Deferred to Phase 2     |
| Concept Map           | ⏸️     | Deferred to Phase 2     |

---

## Backend Features (Rust Commands)

| Feature           | Status | Notes                    |
| ----------------- | ------ | ------------------------ |
| List Notes        | ✅     | SQLite FTS5              |
| Get Note          | ✅     |                          |
| Create Note       | ✅     | Auto UUID, timestamps    |
| Update Note       | ✅     | Creates history snapshot |
| Delete Note       | ✅     | Soft delete              |
| Search Notes      | ✅     | FTS5 full-text search    |
| Pin Note          | ✅     |                          |
| Save Draft        | ✅     |                          |
| Get Draft         | ✅     |                          |
| Delete Draft      | ✅     |                          |
| List History      | ✅     |                          |
| Get History Entry | ✅     |                          |
| Get Journal       | ✅     |                          |
| Upsert Journal    | ✅     |                          |
| List Novels       | ✅     |                          |
| Create Novel      | ✅     |                          |
| List Chapters     | ✅     |                          |
| Get Chapter       | ✅     |                          |
| Upsert Chapter    | ✅     |                          |
| Settings CRUD     | ✅     | Key-value storage        |
| AI Chat           | ✅     | OpenRouter integration   |
| Drive Status      | 🟡     | Stub only                |
| Drive Connect     | 🟡     | Stub only                |
| Drive Sync        | 🟡     | Stub only                |
| Drive Disconnect  | 🟡     | Stub only                |

---

## Storage

| Feature            | Status | Notes             |
| ------------------ | ------ | ----------------- |
| SQLite Database    | ✅     | Using rusqlite    |
| Notes Table        | ✅     |                   |
| Drafts Table       | ✅     |                   |
| History Table      | ✅     |                   |
| Journals Table     | ✅     |                   |
| Novels Table       | ✅     |                   |
| Chapters Table     | ✅     |                   |
| Settings Table     | ✅     |                   |
| FTS5 Search Index  | ✅     |                   |
| Auto-sync Triggers | ✅     | FTS stays in sync |

---

## Touch / Display Compatibility

| Feature           | Status | Notes                |
| ----------------- | ------ | -------------------- |
| 1200x800 Layout   | ✅     | Window configured    |
| Touch Tap Targets | ✅     | Min 44px targets     |
| No Hover-Only     | ✅     | All actions tappable |
| Scroll Containers | ✅     | ScrollArea component |
| Modal Fit         | ✅     | Responsive dialogs   |

---

## Keyboard Shortcuts

| Shortcut | Legacy    | Tauri     | Status |
| -------- | --------- | --------- | ------ |
| Ctrl+B   | Bold      | Bold      | ✅     |
| Ctrl+I   | Italic    | Italic    | ✅     |
| Ctrl+U   | Underline | Underline | ✅     |
| Ctrl+Z   | Undo      | Undo      | ✅     |
| Ctrl+Y   | Redo      | Redo      | ✅     |

---

## Styling Parity

| Element          | Status | Notes                     |
| ---------------- | ------ | ------------------------- |
| Color Palette    | ✅     | Sepia theme exact match   |
| Typography Scale | ✅     | All sizes match           |
| Font Families    | ✅     | Mono, serif, sans options |
| Spacing          | ✅     | Tailwind config match     |
| Shadows          | ✅     | Custom shadow values      |
| Border Radius    | ✅     | Consistent rounding       |
| Animations       | 🟡     | Basic transitions only    |

---

## Phase 1 Completion Criteria

All items below must be ✅ for Phase 1 to be complete:

- [x] App launches at 1200x800
- [x] Navigation works between all routes
- [x] Can create a new note
- [x] Can edit note with TipTap
- [x] Can save note to SQLite
- [x] Can list all notes
- [x] Can reopen saved note
- [x] Works fully offline
- [x] Touch compatible
- [ ] No compile errors
- [ ] Passes smoke test on target device

---

## Known Deviations

See `/tauri/docs/deviations.md` for documented differences from legacy.

---

## Next Steps

1. Test full compile on Raspberry Pi 5
2. Add font-size and line-height TipTap extensions
3. Implement AI Selection Bubble
4. Complete Google Drive sync
5. Add PDF export functionality
