use rusqlite::{Connection, Result};
use std::path::PathBuf;
use std::fs;
use tauri::Manager;

/// Get the database path in the app data directory
pub fn get_db_path(app_handle: &tauri::AppHandle) -> Result<PathBuf, String> {
    let app_data_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data dir: {}", e))?;
    
    // Create the directory if it doesn't exist
    fs::create_dir_all(&app_data_dir)
        .map_err(|e| format!("Failed to create app data dir: {}", e))?;
    
    Ok(app_data_dir.join("tagore.db"))
}

/// Initialize the database with schema
pub fn init_db(conn: &Connection) -> Result<()> {
    // Notes table
    conn.execute(
        "CREATE TABLE IF NOT EXISTS notes (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            content_html TEXT NOT NULL,
            content_text TEXT NOT NULL,
            created_at INTEGER NOT NULL,
            updated_at INTEGER NOT NULL,
            deleted_at INTEGER,
            pinned INTEGER NOT NULL DEFAULT 0,
            tags TEXT
        )",
        [],
    )?;

    // Drafts table
    conn.execute(
        "CREATE TABLE IF NOT EXISTS drafts (
            id TEXT PRIMARY KEY,
            note_id TEXT,
            content_html TEXT NOT NULL,
            updated_at INTEGER NOT NULL
        )",
        [],
    )?;

    // History table
    conn.execute(
        "CREATE TABLE IF NOT EXISTS history (
            id TEXT PRIMARY KEY,
            note_id TEXT NOT NULL,
            diff_summary TEXT,
            snapshot_html TEXT NOT NULL,
            created_at INTEGER NOT NULL
        )",
        [],
    )?;

    // Journals table
    conn.execute(
        "CREATE TABLE IF NOT EXISTS journals (
            id TEXT PRIMARY KEY,
            date_key TEXT NOT NULL UNIQUE,
            content_html TEXT NOT NULL,
            content_text TEXT NOT NULL,
            updated_at INTEGER NOT NULL
        )",
        [],
    )?;

    // Novels table
    conn.execute(
        "CREATE TABLE IF NOT EXISTS novels (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            created_at INTEGER NOT NULL,
            updated_at INTEGER NOT NULL
        )",
        [],
    )?;

    // Chapters table
    conn.execute(
        "CREATE TABLE IF NOT EXISTS chapters (
            id TEXT PRIMARY KEY,
            novel_id TEXT NOT NULL,
            chapter_no INTEGER NOT NULL,
            title TEXT NOT NULL,
            content_html TEXT NOT NULL,
            content_text TEXT NOT NULL,
            updated_at INTEGER NOT NULL,
            UNIQUE(novel_id, chapter_no)
        )",
        [],
    )?;

    // Settings table
    conn.execute(
        "CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL
        )",
        [],
    )?;

    // Create FTS5 virtual table for full-text search
    conn.execute(
        "CREATE VIRTUAL TABLE IF NOT EXISTS notes_fts USING fts5(
            id,
            title,
            content_text,
            content='notes',
            content_rowid='rowid'
        )",
        [],
    )?;

    // Create triggers to keep FTS in sync
    conn.execute(
        "CREATE TRIGGER IF NOT EXISTS notes_ai AFTER INSERT ON notes BEGIN
            INSERT INTO notes_fts(id, title, content_text) VALUES (new.id, new.title, new.content_text);
        END",
        [],
    )?;

    conn.execute(
        "CREATE TRIGGER IF NOT EXISTS notes_ad AFTER DELETE ON notes BEGIN
            DELETE FROM notes_fts WHERE id = old.id;
        END",
        [],
    )?;

    conn.execute(
        "CREATE TRIGGER IF NOT EXISTS notes_au AFTER UPDATE ON notes BEGIN
            DELETE FROM notes_fts WHERE id = old.id;
            INSERT INTO notes_fts(id, title, content_text) VALUES (new.id, new.title, new.content_text);
        END",
        [],
    )?;

    Ok(())
}

/// Open a connection to the database
pub fn open_connection(db_path: &PathBuf) -> Result<Connection> {
    let conn = Connection::open(db_path)?;
    init_db(&conn)?;
    Ok(conn)
}
