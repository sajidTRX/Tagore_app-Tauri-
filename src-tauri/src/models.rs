use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Note {
    pub id: String,
    pub title: String,
    pub content_html: String,
    pub content_text: String,
    pub created_at: i64,
    pub updated_at: i64,
    pub deleted_at: Option<i64>,
    pub pinned: bool,
    pub tags: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Draft {
    pub id: String,
    pub note_id: Option<String>,
    pub content_html: String,
    pub updated_at: i64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct HistoryEntry {
    pub id: String,
    pub note_id: String,
    pub diff_summary: Option<String>,
    pub snapshot_html: String,
    pub created_at: i64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Journal {
    pub id: String,
    pub date_key: String,
    pub content_html: String,
    pub content_text: String,
    pub updated_at: i64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Novel {
    pub id: String,
    pub title: String,
    pub created_at: i64,
    pub updated_at: i64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Chapter {
    pub id: String,
    pub novel_id: String,
    pub chapter_no: i32,
    pub title: String,
    pub content_html: String,
    pub content_text: String,
    pub updated_at: i64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AIChatMessage {
    pub role: String,
    pub content: String,
}

#[allow(dead_code)]
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AIChatRequest {
    pub messages: Vec<AIChatMessage>,
    pub model: Option<String>,
    pub temperature: Option<f32>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AIChatResponse {
    pub content: String,
    pub model: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DriveStatus {
    pub connected: bool,
    pub email: Option<String>,
    pub last_sync: Option<i64>,
}
