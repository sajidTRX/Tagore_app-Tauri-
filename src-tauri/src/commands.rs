use crate::db;
use crate::models::*;
use rusqlite::params;
use std::sync::Mutex;
use tauri::State;
use uuid::Uuid;
use chrono::Utc;

pub struct AppState {
    pub db_path: std::path::PathBuf,
}

// Helper to strip HTML tags for plain text
fn html_to_text(html: &str) -> String {
    // Simple HTML tag stripper
    let mut result = String::new();
    let mut in_tag = false;
    for c in html.chars() {
        if c == '<' {
            in_tag = true;
        } else if c == '>' {
            in_tag = false;
        } else if !in_tag {
            result.push(c);
        }
    }
    // Clean up multiple whitespaces
    result.split_whitespace().collect::<Vec<_>>().join(" ")
}

// ==================== NOTES ====================

#[tauri::command]
pub fn list_notes(state: State<'_, Mutex<AppState>>) -> Result<Vec<Note>, String> {
    let state = state.lock().map_err(|e| e.to_string())?;
    let conn = db::open_connection(&state.db_path).map_err(|e| e.to_string())?;
    
    let mut stmt = conn
        .prepare("SELECT id, title, content_html, content_text, created_at, updated_at, deleted_at, pinned, tags FROM notes WHERE deleted_at IS NULL ORDER BY updated_at DESC")
        .map_err(|e| e.to_string())?;
    
    let notes = stmt
        .query_map([], |row| {
            Ok(Note {
                id: row.get(0)?,
                title: row.get(1)?,
                content_html: row.get(2)?,
                content_text: row.get(3)?,
                created_at: row.get(4)?,
                updated_at: row.get(5)?,
                deleted_at: row.get(6)?,
                pinned: row.get::<_, i32>(7)? != 0,
                tags: row.get(8)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;
    
    Ok(notes)
}

#[tauri::command]
pub fn get_note(state: State<'_, Mutex<AppState>>, id: String) -> Result<Option<Note>, String> {
    let state = state.lock().map_err(|e| e.to_string())?;
    let conn = db::open_connection(&state.db_path).map_err(|e| e.to_string())?;
    
    let mut stmt = conn
        .prepare("SELECT id, title, content_html, content_text, created_at, updated_at, deleted_at, pinned, tags FROM notes WHERE id = ?")
        .map_err(|e| e.to_string())?;
    
    let note = stmt
        .query_row([&id], |row| {
            Ok(Note {
                id: row.get(0)?,
                title: row.get(1)?,
                content_html: row.get(2)?,
                content_text: row.get(3)?,
                created_at: row.get(4)?,
                updated_at: row.get(5)?,
                deleted_at: row.get(6)?,
                pinned: row.get::<_, i32>(7)? != 0,
                tags: row.get(8)?,
            })
        })
        .ok();
    
    Ok(note)
}

#[tauri::command]
pub fn create_note(
    state: State<'_, Mutex<AppState>>,
    title: String,
    content_html: String,
) -> Result<Note, String> {
    let state = state.lock().map_err(|e| e.to_string())?;
    let conn = db::open_connection(&state.db_path).map_err(|e| e.to_string())?;
    
    let id = Uuid::new_v4().to_string();
    let now = Utc::now().timestamp();
    let content_text = html_to_text(&content_html);
    
    conn.execute(
        "INSERT INTO notes (id, title, content_html, content_text, created_at, updated_at, pinned) VALUES (?, ?, ?, ?, ?, ?, 0)",
        params![id, title, content_html, content_text, now, now],
    )
    .map_err(|e| e.to_string())?;
    
    Ok(Note {
        id,
        title,
        content_html,
        content_text,
        created_at: now,
        updated_at: now,
        deleted_at: None,
        pinned: false,
        tags: None,
    })
}

#[tauri::command]
pub fn update_note(
    state: State<'_, Mutex<AppState>>,
    id: String,
    title: String,
    content_html: String,
) -> Result<Note, String> {
    let state = state.lock().map_err(|e| e.to_string())?;
    let conn = db::open_connection(&state.db_path).map_err(|e| e.to_string())?;
    
    let now = Utc::now().timestamp();
    let content_text = html_to_text(&content_html);
    
    // Get existing note for history
    let existing: Option<Note> = conn
        .query_row(
            "SELECT id, title, content_html, content_text, created_at, updated_at, deleted_at, pinned, tags FROM notes WHERE id = ?",
            [&id],
            |row| {
                Ok(Note {
                    id: row.get(0)?,
                    title: row.get(1)?,
                    content_html: row.get(2)?,
                    content_text: row.get(3)?,
                    created_at: row.get(4)?,
                    updated_at: row.get(5)?,
                    deleted_at: row.get(6)?,
                    pinned: row.get::<_, i32>(7)? != 0,
                    tags: row.get(8)?,
                })
            },
        )
        .ok();
    
    // Save history snapshot
    if let Some(ref old_note) = existing {
        let history_id = Uuid::new_v4().to_string();
        conn.execute(
            "INSERT INTO history (id, note_id, snapshot_html, created_at) VALUES (?, ?, ?, ?)",
            params![history_id, id, old_note.content_html, now],
        )
        .map_err(|e| e.to_string())?;
    }
    
    conn.execute(
        "UPDATE notes SET title = ?, content_html = ?, content_text = ?, updated_at = ? WHERE id = ?",
        params![title, content_html, content_text, now, id],
    )
    .map_err(|e| e.to_string())?;
    
    let created_at = existing.map(|n| n.created_at).unwrap_or(now);
    
    Ok(Note {
        id,
        title,
        content_html,
        content_text,
        created_at,
        updated_at: now,
        deleted_at: None,
        pinned: false,
        tags: None,
    })
}

#[tauri::command]
pub fn delete_note(state: State<'_, Mutex<AppState>>, id: String) -> Result<(), String> {
    let state = state.lock().map_err(|e| e.to_string())?;
    let conn = db::open_connection(&state.db_path).map_err(|e| e.to_string())?;
    
    let now = Utc::now().timestamp();
    
    conn.execute(
        "UPDATE notes SET deleted_at = ? WHERE id = ?",
        params![now, id],
    )
    .map_err(|e| e.to_string())?;
    
    Ok(())
}

#[tauri::command]
pub fn search_notes(state: State<'_, Mutex<AppState>>, query: String) -> Result<Vec<Note>, String> {
    let state = state.lock().map_err(|e| e.to_string())?;
    let conn = db::open_connection(&state.db_path).map_err(|e| e.to_string())?;
    
    // Use FTS5 for search
    let search_query = format!("{}*", query);
    let mut stmt = conn
        .prepare(
            "SELECT n.id, n.title, n.content_html, n.content_text, n.created_at, n.updated_at, n.deleted_at, n.pinned, n.tags 
             FROM notes n 
             JOIN notes_fts fts ON n.id = fts.id 
             WHERE notes_fts MATCH ? AND n.deleted_at IS NULL 
             ORDER BY n.updated_at DESC",
        )
        .map_err(|e| e.to_string())?;
    
    let notes = stmt
        .query_map([&search_query], |row| {
            Ok(Note {
                id: row.get(0)?,
                title: row.get(1)?,
                content_html: row.get(2)?,
                content_text: row.get(3)?,
                created_at: row.get(4)?,
                updated_at: row.get(5)?,
                deleted_at: row.get(6)?,
                pinned: row.get::<_, i32>(7)? != 0,
                tags: row.get(8)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;
    
    Ok(notes)
}

#[tauri::command]
pub fn pin_note(state: State<'_, Mutex<AppState>>, id: String, pinned: bool) -> Result<(), String> {
    let state = state.lock().map_err(|e| e.to_string())?;
    let conn = db::open_connection(&state.db_path).map_err(|e| e.to_string())?;
    
    conn.execute(
        "UPDATE notes SET pinned = ? WHERE id = ?",
        params![pinned as i32, id],
    )
    .map_err(|e| e.to_string())?;
    
    Ok(())
}

// ==================== DRAFTS ====================

#[tauri::command]
pub fn save_draft(
    state: State<'_, Mutex<AppState>>,
    note_id: Option<String>,
    content_html: String,
) -> Result<Draft, String> {
    let state = state.lock().map_err(|e| e.to_string())?;
    let conn = db::open_connection(&state.db_path).map_err(|e| e.to_string())?;
    
    let id = Uuid::new_v4().to_string();
    let now = Utc::now().timestamp();
    
    // Delete existing draft for this note first
    if let Some(ref nid) = note_id {
        conn.execute("DELETE FROM drafts WHERE note_id = ?", params![nid])
            .map_err(|e| e.to_string())?;
    }
    
    conn.execute(
        "INSERT INTO drafts (id, note_id, content_html, updated_at) VALUES (?, ?, ?, ?)",
        params![id, note_id, content_html, now],
    )
    .map_err(|e| e.to_string())?;
    
    Ok(Draft {
        id,
        note_id,
        content_html,
        updated_at: now,
    })
}

#[tauri::command]
pub fn get_draft(
    state: State<'_, Mutex<AppState>>,
    note_id: Option<String>,
) -> Result<Option<Draft>, String> {
    let state = state.lock().map_err(|e| e.to_string())?;
    let conn = db::open_connection(&state.db_path).map_err(|e| e.to_string())?;
    
    let draft = if let Some(nid) = note_id {
        conn.query_row(
            "SELECT id, note_id, content_html, updated_at FROM drafts WHERE note_id = ?",
            [&nid],
            |row| {
                Ok(Draft {
                    id: row.get(0)?,
                    note_id: row.get(1)?,
                    content_html: row.get(2)?,
                    updated_at: row.get(3)?,
                })
            },
        )
        .ok()
    } else {
        conn.query_row(
            "SELECT id, note_id, content_html, updated_at FROM drafts WHERE note_id IS NULL ORDER BY updated_at DESC LIMIT 1",
            [],
            |row| {
                Ok(Draft {
                    id: row.get(0)?,
                    note_id: row.get(1)?,
                    content_html: row.get(2)?,
                    updated_at: row.get(3)?,
                })
            },
        )
        .ok()
    };
    
    Ok(draft)
}

#[tauri::command]
pub fn delete_draft(state: State<'_, Mutex<AppState>>, note_id: Option<String>) -> Result<(), String> {
    let state = state.lock().map_err(|e| e.to_string())?;
    let conn = db::open_connection(&state.db_path).map_err(|e| e.to_string())?;
    
    if let Some(nid) = note_id {
        conn.execute("DELETE FROM drafts WHERE note_id = ?", params![nid])
            .map_err(|e| e.to_string())?;
    } else {
        conn.execute("DELETE FROM drafts WHERE note_id IS NULL", [])
            .map_err(|e| e.to_string())?;
    }
    
    Ok(())
}

// ==================== HISTORY ====================

#[tauri::command]
pub fn list_history(
    state: State<'_, Mutex<AppState>>,
    note_id: String,
) -> Result<Vec<HistoryEntry>, String> {
    let state = state.lock().map_err(|e| e.to_string())?;
    let conn = db::open_connection(&state.db_path).map_err(|e| e.to_string())?;
    
    let mut stmt = conn
        .prepare("SELECT id, note_id, diff_summary, snapshot_html, created_at FROM history WHERE note_id = ? ORDER BY created_at DESC")
        .map_err(|e| e.to_string())?;
    
    let entries = stmt
        .query_map([&note_id], |row| {
            Ok(HistoryEntry {
                id: row.get(0)?,
                note_id: row.get(1)?,
                diff_summary: row.get(2)?,
                snapshot_html: row.get(3)?,
                created_at: row.get(4)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;
    
    Ok(entries)
}

#[tauri::command]
pub fn get_history_entry(
    state: State<'_, Mutex<AppState>>,
    id: String,
) -> Result<Option<HistoryEntry>, String> {
    let state = state.lock().map_err(|e| e.to_string())?;
    let conn = db::open_connection(&state.db_path).map_err(|e| e.to_string())?;
    
    let entry = conn
        .query_row(
            "SELECT id, note_id, diff_summary, snapshot_html, created_at FROM history WHERE id = ?",
            [&id],
            |row| {
                Ok(HistoryEntry {
                    id: row.get(0)?,
                    note_id: row.get(1)?,
                    diff_summary: row.get(2)?,
                    snapshot_html: row.get(3)?,
                    created_at: row.get(4)?,
                })
            },
        )
        .ok();
    
    Ok(entry)
}

// ==================== JOURNALS ====================

#[tauri::command]
pub fn get_journal(
    state: State<'_, Mutex<AppState>>,
    date_key: String,
) -> Result<Option<Journal>, String> {
    let state = state.lock().map_err(|e| e.to_string())?;
    let conn = db::open_connection(&state.db_path).map_err(|e| e.to_string())?;
    
    let journal = conn
        .query_row(
            "SELECT id, date_key, content_html, content_text, updated_at FROM journals WHERE date_key = ?",
            [&date_key],
            |row| {
                Ok(Journal {
                    id: row.get(0)?,
                    date_key: row.get(1)?,
                    content_html: row.get(2)?,
                    content_text: row.get(3)?,
                    updated_at: row.get(4)?,
                })
            },
        )
        .ok();
    
    Ok(journal)
}

#[tauri::command]
pub fn upsert_journal(
    state: State<'_, Mutex<AppState>>,
    date_key: String,
    content_html: String,
) -> Result<Journal, String> {
    let state = state.lock().map_err(|e| e.to_string())?;
    let conn = db::open_connection(&state.db_path).map_err(|e| e.to_string())?;
    
    let now = Utc::now().timestamp();
    let content_text = html_to_text(&content_html);
    
    // Check if exists
    let existing: Option<String> = conn
        .query_row(
            "SELECT id FROM journals WHERE date_key = ?",
            [&date_key],
            |row| row.get(0),
        )
        .ok();
    
    let id = if let Some(existing_id) = existing {
        conn.execute(
            "UPDATE journals SET content_html = ?, content_text = ?, updated_at = ? WHERE id = ?",
            params![content_html, content_text, now, existing_id],
        )
        .map_err(|e| e.to_string())?;
        existing_id
    } else {
        let new_id = Uuid::new_v4().to_string();
        conn.execute(
            "INSERT INTO journals (id, date_key, content_html, content_text, updated_at) VALUES (?, ?, ?, ?, ?)",
            params![new_id, date_key, content_html, content_text, now],
        )
        .map_err(|e| e.to_string())?;
        new_id
    };
    
    Ok(Journal {
        id,
        date_key,
        content_html,
        content_text,
        updated_at: now,
    })
}

// ==================== NOVELS ====================

#[tauri::command]
pub fn list_novels(state: State<'_, Mutex<AppState>>) -> Result<Vec<Novel>, String> {
    let state = state.lock().map_err(|e| e.to_string())?;
    let conn = db::open_connection(&state.db_path).map_err(|e| e.to_string())?;
    
    let mut stmt = conn
        .prepare("SELECT id, title, created_at, updated_at FROM novels ORDER BY updated_at DESC")
        .map_err(|e| e.to_string())?;
    
    let novels = stmt
        .query_map([], |row| {
            Ok(Novel {
                id: row.get(0)?,
                title: row.get(1)?,
                created_at: row.get(2)?,
                updated_at: row.get(3)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;
    
    Ok(novels)
}

#[tauri::command]
pub fn create_novel(state: State<'_, Mutex<AppState>>, title: String) -> Result<Novel, String> {
    let state = state.lock().map_err(|e| e.to_string())?;
    let conn = db::open_connection(&state.db_path).map_err(|e| e.to_string())?;
    
    let id = Uuid::new_v4().to_string();
    let now = Utc::now().timestamp();
    
    conn.execute(
        "INSERT INTO novels (id, title, created_at, updated_at) VALUES (?, ?, ?, ?)",
        params![id, title, now, now],
    )
    .map_err(|e| e.to_string())?;
    
    Ok(Novel {
        id,
        title,
        created_at: now,
        updated_at: now,
    })
}

#[tauri::command]
pub fn list_chapters(
    state: State<'_, Mutex<AppState>>,
    novel_id: String,
) -> Result<Vec<Chapter>, String> {
    let state = state.lock().map_err(|e| e.to_string())?;
    let conn = db::open_connection(&state.db_path).map_err(|e| e.to_string())?;
    
    let mut stmt = conn
        .prepare("SELECT id, novel_id, chapter_no, title, content_html, content_text, updated_at FROM chapters WHERE novel_id = ? ORDER BY chapter_no")
        .map_err(|e| e.to_string())?;
    
    let chapters = stmt
        .query_map([&novel_id], |row| {
            Ok(Chapter {
                id: row.get(0)?,
                novel_id: row.get(1)?,
                chapter_no: row.get(2)?,
                title: row.get(3)?,
                content_html: row.get(4)?,
                content_text: row.get(5)?,
                updated_at: row.get(6)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;
    
    Ok(chapters)
}

#[tauri::command]
pub fn get_chapter(state: State<'_, Mutex<AppState>>, id: String) -> Result<Option<Chapter>, String> {
    let state = state.lock().map_err(|e| e.to_string())?;
    let conn = db::open_connection(&state.db_path).map_err(|e| e.to_string())?;
    
    let chapter = conn
        .query_row(
            "SELECT id, novel_id, chapter_no, title, content_html, content_text, updated_at FROM chapters WHERE id = ?",
            [&id],
            |row| {
                Ok(Chapter {
                    id: row.get(0)?,
                    novel_id: row.get(1)?,
                    chapter_no: row.get(2)?,
                    title: row.get(3)?,
                    content_html: row.get(4)?,
                    content_text: row.get(5)?,
                    updated_at: row.get(6)?,
                })
            },
        )
        .ok();
    
    Ok(chapter)
}

#[tauri::command]
pub fn upsert_chapter(
    state: State<'_, Mutex<AppState>>,
    novel_id: String,
    chapter_no: i32,
    title: String,
    content_html: String,
) -> Result<Chapter, String> {
    let state = state.lock().map_err(|e| e.to_string())?;
    let conn = db::open_connection(&state.db_path).map_err(|e| e.to_string())?;
    
    let now = Utc::now().timestamp();
    let content_text = html_to_text(&content_html);
    
    // Check if exists
    let existing: Option<String> = conn
        .query_row(
            "SELECT id FROM chapters WHERE novel_id = ? AND chapter_no = ?",
            params![novel_id, chapter_no],
            |row| row.get(0),
        )
        .ok();
    
    let id = if let Some(existing_id) = existing {
        conn.execute(
            "UPDATE chapters SET title = ?, content_html = ?, content_text = ?, updated_at = ? WHERE id = ?",
            params![title, content_html, content_text, now, existing_id],
        )
        .map_err(|e| e.to_string())?;
        existing_id
    } else {
        let new_id = Uuid::new_v4().to_string();
        conn.execute(
            "INSERT INTO chapters (id, novel_id, chapter_no, title, content_html, content_text, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
            params![new_id, novel_id, chapter_no, title, content_html, content_text, now],
        )
        .map_err(|e| e.to_string())?;
        new_id
    };
    
    // Update novel's updated_at
    conn.execute(
        "UPDATE novels SET updated_at = ? WHERE id = ?",
        params![now, novel_id],
    )
    .map_err(|e| e.to_string())?;
    
    Ok(Chapter {
        id,
        novel_id,
        chapter_no,
        title,
        content_html,
        content_text,
        updated_at: now,
    })
}

// ==================== SETTINGS ====================

#[tauri::command]
pub fn get_setting(state: State<'_, Mutex<AppState>>, key: String) -> Result<Option<String>, String> {
    let state = state.lock().map_err(|e| e.to_string())?;
    let conn = db::open_connection(&state.db_path).map_err(|e| e.to_string())?;
    
    let value: Option<String> = conn
        .query_row("SELECT value FROM settings WHERE key = ?", [&key], |row| {
            row.get(0)
        })
        .ok();
    
    Ok(value)
}

#[tauri::command]
pub fn set_setting(
    state: State<'_, Mutex<AppState>>,
    key: String,
    value: String,
) -> Result<(), String> {
    let state = state.lock().map_err(|e| e.to_string())?;
    let conn = db::open_connection(&state.db_path).map_err(|e| e.to_string())?;
    
    conn.execute(
        "INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)",
        params![key, value],
    )
    .map_err(|e| e.to_string())?;
    
    Ok(())
}

#[tauri::command]
pub fn get_all_settings(state: State<'_, Mutex<AppState>>) -> Result<Vec<(String, String)>, String> {
    let state = state.lock().map_err(|e| e.to_string())?;
    let conn = db::open_connection(&state.db_path).map_err(|e| e.to_string())?;
    
    let mut stmt = conn
        .prepare("SELECT key, value FROM settings")
        .map_err(|e| e.to_string())?;
    
    let settings = stmt
        .query_map([], |row| Ok((row.get(0)?, row.get(1)?)))
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;
    
    Ok(settings)
}

// ==================== AI CHAT ====================

#[tauri::command]
pub async fn ai_chat(
    messages: Vec<AIChatMessage>,
    model: Option<String>,
    temperature: Option<f32>,
) -> Result<AIChatResponse, String> {
    let api_key = std::env::var("OPENROUTER_API_KEY")
        .map_err(|_| "OPENROUTER_API_KEY not set in environment".to_string())?;
    
    let model = model.unwrap_or_else(|| "mistralai/devstral-2512:free".to_string());
    let temperature = temperature.unwrap_or(0.7);
    
    let client = reqwest::Client::new();
    
    let body = serde_json::json!({
        "model": model,
        "messages": messages,
        "temperature": temperature,
    });
    
    let response = client
        .post("https://openrouter.ai/api/v1/chat/completions")
        .header("Authorization", format!("Bearer {}", api_key))
        .header("Content-Type", "application/json")
        .json(&body)
        .send()
        .await
        .map_err(|e| format!("Request failed: {}", e))?;
    
    if !response.status().is_success() {
        let status = response.status();
        let text = response.text().await.unwrap_or_default();
        return Err(format!("API error {}: {}", status, text));
    }
    
    let json: serde_json::Value = response
        .json()
        .await
        .map_err(|e| format!("Failed to parse response: {}", e))?;
    
    let content = json["choices"][0]["message"]["content"]
        .as_str()
        .unwrap_or("")
        .to_string();
    
    Ok(AIChatResponse { content, model })
}

// ==================== DRIVE SYNC (Stubs) ====================

#[tauri::command]
pub fn drive_status() -> Result<DriveStatus, String> {
    // Placeholder - returns disconnected status
    Ok(DriveStatus {
        connected: false,
        email: None,
        last_sync: None,
    })
}

#[tauri::command]
pub fn drive_connect() -> Result<DriveStatus, String> {
    // Placeholder - Google Drive OAuth would be implemented here
    Err("Google Drive sync not yet implemented".to_string())
}

#[tauri::command]
pub fn drive_sync_now() -> Result<(), String> {
    // Placeholder
    Err("Google Drive sync not yet implemented".to_string())
}

#[tauri::command]
pub fn drive_disconnect() -> Result<(), String> {
    // Placeholder
    Ok(())
}

// ==================== SESSION ====================

#[tauri::command]
pub fn get_active_context(state: State<'_, Mutex<AppState>>) -> Result<Option<String>, String> {
    get_setting(state, "active_note_id".to_string())
}

#[tauri::command]
pub fn set_active_note(state: State<'_, Mutex<AppState>>, note_id: String) -> Result<(), String> {
    set_setting(state, "active_note_id".to_string(), note_id)
}
