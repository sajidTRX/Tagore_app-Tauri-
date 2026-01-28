mod commands;
mod db;
mod models;

use commands::AppState;
use std::sync::Mutex;
use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Load .env file for development
    dotenvy::dotenv().ok();

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            // Initialize database path
            let db_path = db::get_db_path(&app.handle())?;
            
            // Initialize database
            let conn = db::open_connection(&db_path)
                .map_err(|e| format!("Failed to init database: {}", e))?;
            drop(conn); // Close initial connection
            
            // Store app state
            app.manage(Mutex::new(AppState { db_path }));
            
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            // Notes
            commands::list_notes,
            commands::get_note,
            commands::create_note,
            commands::update_note,
            commands::delete_note,
            commands::search_notes,
            commands::pin_note,
            // Drafts
            commands::save_draft,
            commands::get_draft,
            commands::delete_draft,
            // History
            commands::list_history,
            commands::get_history_entry,
            // Journals
            commands::get_journal,
            commands::upsert_journal,
            // Novels
            commands::list_novels,
            commands::create_novel,
            commands::list_chapters,
            commands::get_chapter,
            commands::upsert_chapter,
            // Settings
            commands::get_setting,
            commands::set_setting,
            commands::get_all_settings,
            // AI
            commands::ai_chat,
            // Drive sync
            commands::drive_status,
            commands::drive_connect,
            commands::drive_sync_now,
            commands::drive_disconnect,
            // Session
            commands::get_active_context,
            commands::set_active_note,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
