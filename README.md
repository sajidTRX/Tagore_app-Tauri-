# TAGORE Desktop

A Tauri 2 desktop application for offline-first note-taking and writing.

## Prerequisites

- **Node.js** >= 18.x
- **Rust** >= 1.70
- **Tauri CLI** (installed via npm)

## Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Create environment file:**

   ```bash
   cp .env.example .env
   # Edit .env and add your OPENROUTER_API_KEY
   ```

3. **Run in development mode:**

   ```bash
   npm run tauri:dev
   ```

4. **Build for production:**
   ```bash
   npm run tauri:build
   ```

## Project Structure

```
tauri/
├── src/                    # Frontend (Vite + React + TypeScript)
│   ├── components/         # UI components
│   │   └── ui/            # Primitive components (Button, Input, etc.)
│   ├── lib/               # Utilities and API layer
│   ├── pages/             # Route components
│   ├── App.tsx            # Router configuration
│   ├── main.tsx           # React entry point
│   └── index.css          # Global styles (Tailwind)
├── src-tauri/             # Backend (Rust)
│   └── src/
│       ├── main.rs        # Tauri entry point
│       ├── lib.rs         # App configuration
│       ├── commands.rs    # Tauri command handlers
│       ├── db.rs          # SQLite operations
│       └── models.rs      # Data structures
├── docs/                  # Documentation
│   ├── parity.md         # Parity checklist vs legacy
│   ├── deviations.md     # Known differences
│   └── decisions.md      # Architecture decisions
└── public/               # Static assets
```

## Technology Stack

- **Frontend:** Vite, React 18, TypeScript, React Router v6
- **UI:** Radix UI, Tailwind CSS, Lucide Icons
- **Editor:** TipTap (WYSIWYG)
- **Backend:** Rust, Tauri 2
- **Database:** SQLite with rusqlite
- **AI:** OpenRouter API

## Features

- 📝 Rich text note-taking with TipTap
- 📚 Novel/chapter organization
- 📓 Daily journal
- 📜 Version history
- 🔍 Full-text search (FTS5)
- 🤖 AI writing assistant
- 🌙 Sepia theme
- 📱 Touch-friendly (1200x800 optimized)

## Target Platform

Designed for Raspberry Pi 5 with 10.2" touchscreen at 1200x800 resolution.

## Development

```bash
# Run frontend only (for UI development)
npm run dev

# Run full Tauri app
npm run tauri:dev

# Build production app
npm run tauri:build
```

## Documentation

- [Parity Checklist](docs/parity.md) - Feature parity with legacy app
- [Deviations](docs/deviations.md) - Documented differences
- [Decisions](docs/decisions.md) - Architecture decisions

## License

Private - All rights reserved
