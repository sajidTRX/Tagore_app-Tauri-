/**
 * API Layer - Wraps Tauri invoke calls for all backend operations
 * This provides the same interface as the legacy FastAPI backend
 */

import { invoke } from "@tauri-apps/api/core";

// ============================================================================
// Types
// ============================================================================

export interface Note {
  id: string;
  title: string;
  content_html: string;
  content_text: string;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
  pinned: boolean;
  tags: string[];
}

export interface Draft {
  id: string;
  note_id: string | null;
  content_html: string;
  updated_at: number;
}

export interface HistoryEntry {
  id: string;
  note_id: string;
  diff_summary: string | null;
  snapshot_html: string;
  created_at: number;
}

export interface Journal {
  id: string;
  date_key: string; // YYYY-MM-DD
  content_html: string;
  content_text: string;
  updated_at: number;
}

export interface Novel {
  id: string;
  title: string;
  created_at: number;
  updated_at: number;
}

export interface Chapter {
  id: string;
  novel_id: string;
  chapter_no: number;
  title: string;
  content_html: string;
  content_text: string;
  updated_at: number;
}

export interface Settings {
  [key: string]: unknown;
}

export interface AIChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AIChatResponse {
  content: string;
  model: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface NoteFilters {
  search?: string;
  pinned?: boolean;
  tags?: string[];
  limit?: number;
  offset?: number;
}

// ============================================================================
// Notes API
// ============================================================================

export async function listNotes(filters?: NoteFilters): Promise<Note[]> {
  return invoke<Note[]>("list_notes", { filters: filters || {} });
}

export async function getNote(id: string): Promise<Note | null> {
  return invoke<Note | null>("get_note", { id });
}

export async function createNote(
  title: string,
  contentHtml: string,
): Promise<Note> {
  return invoke<Note>("create_note", { title, contentHtml });
}

export async function updateNote(
  id: string,
  title: string,
  contentHtml: string,
): Promise<Note> {
  return invoke<Note>("update_note", { id, title, contentHtml });
}

export async function deleteNote(id: string): Promise<void> {
  return invoke<void>("delete_note", { id });
}

export async function searchNotes(query: string): Promise<Note[]> {
  return invoke<Note[]>("search_notes", { query });
}

export async function pinNote(id: string, pinned: boolean): Promise<Note> {
  return invoke<Note>("pin_note", { id, pinned });
}

// ============================================================================
// Drafts API
// ============================================================================

export async function saveDraft(
  noteId: string | null,
  contentHtml: string,
): Promise<Draft> {
  return invoke<Draft>("save_draft", { noteId, contentHtml });
}

export async function getDraft(noteId: string | null): Promise<Draft | null> {
  return invoke<Draft | null>("get_draft", { noteId });
}

export async function deleteDraft(noteId: string | null): Promise<void> {
  return invoke<void>("delete_draft", { noteId });
}

// ============================================================================
// History API
// ============================================================================

export async function listHistory(noteId: string): Promise<HistoryEntry[]> {
  return invoke<HistoryEntry[]>("list_history", { noteId });
}

export async function getHistoryEntry(
  id: string,
): Promise<HistoryEntry | null> {
  return invoke<HistoryEntry | null>("get_history_entry", { id });
}

// ============================================================================
// Journals API
// ============================================================================

export async function getJournal(dateKey: string): Promise<Journal | null> {
  return invoke<Journal | null>("get_journal", { dateKey });
}

export async function upsertJournal(
  dateKey: string,
  contentHtml: string,
): Promise<Journal> {
  return invoke<Journal>("upsert_journal", { dateKey, contentHtml });
}

export async function listJournals(): Promise<Journal[]> {
  return invoke<Journal[]>("list_journals", {});
}

// ============================================================================
// Novel API
// ============================================================================

export async function listNovels(): Promise<Novel[]> {
  return invoke<Novel[]>("list_novels", {});
}

export async function createNovel(title: string): Promise<Novel> {
  return invoke<Novel>("create_novel", { title });
}

export async function getNovel(id: string): Promise<Novel | null> {
  return invoke<Novel | null>("get_novel", { id });
}

export async function updateNovel(id: string, title: string): Promise<Novel> {
  return invoke<Novel>("update_novel", { id, title });
}

export async function deleteNovel(id: string): Promise<void> {
  return invoke<void>("delete_novel", { id });
}

// ============================================================================
// Chapters API
// ============================================================================

export async function listChapters(novelId: string): Promise<Chapter[]> {
  return invoke<Chapter[]>("list_chapters", { novelId });
}

export async function getChapter(id: string): Promise<Chapter | null> {
  return invoke<Chapter | null>("get_chapter", { id });
}

export async function upsertChapter(
  novelId: string,
  chapterNo: number,
  title: string,
  contentHtml: string,
): Promise<Chapter> {
  return invoke<Chapter>("upsert_chapter", {
    novelId,
    chapterNo,
    title,
    contentHtml,
  });
}

export async function deleteChapter(id: string): Promise<void> {
  return invoke<void>("delete_chapter", { id });
}

// ============================================================================
// Export API
// ============================================================================

export async function exportNotePdf(
  noteId: string,
  outPath: string,
): Promise<string> {
  return invoke<string>("export_note_pdf", { noteId, outPath });
}

export async function exportJournalPdf(
  dateKey: string,
  outPath: string,
): Promise<string> {
  return invoke<string>("export_journal_pdf", { dateKey, outPath });
}

// ============================================================================
// Session API
// ============================================================================

export async function getActiveContext(): Promise<{ noteId: string | null }> {
  return invoke<{ noteId: string | null }>("get_active_context", {});
}

export async function setActiveNote(noteId: string | null): Promise<void> {
  return invoke<void>("set_active_note", { noteId });
}

// ============================================================================
// AI API (OpenRouter)
// ============================================================================

export async function aiChat(
  messages: AIChatMessage[],
  model?: string,
  temperature?: number,
): Promise<AIChatResponse> {
  return invoke<AIChatResponse>("ai_chat", {
    messages,
    model: model || "mistralai/devstral-2512:free",
    temperature: temperature || 0.7,
  });
}

// ============================================================================
// Cloud Sync API (Google Drive)
// ============================================================================

export async function driveStatus(): Promise<{
  connected: boolean;
  email: string | null;
  lastSync: number | null;
}> {
  return invoke("drive_status", {});
}

export async function driveConnect(): Promise<{
  success: boolean;
  error?: string;
}> {
  return invoke("drive_connect", {});
}

export async function driveSyncNow(): Promise<{
  success: boolean;
  error?: string;
}> {
  return invoke("drive_sync_now", {});
}

export async function driveDisconnect(): Promise<void> {
  return invoke("drive_disconnect", {});
}

// ============================================================================
// Settings API
// ============================================================================

export async function getSetting<T>(key: string): Promise<T | null> {
  return invoke<T | null>("get_setting", { key });
}

export async function setSetting<T>(key: string, value: T): Promise<void> {
  return invoke<void>("set_setting", { key, value: JSON.stringify(value) });
}

export async function getAllSettings(): Promise<Settings> {
  return invoke<Settings>("get_all_settings", {});
}

// ============================================================================
// File System Helpers (for compatibility)
// ============================================================================

export async function listDocuments(path?: string): Promise<string[]> {
  return invoke<string[]>("list_documents", { path: path || "" });
}

export async function readDocument(path: string): Promise<string> {
  return invoke<string>("read_document", { path });
}

export async function writeDocument(
  path: string,
  content: string,
): Promise<void> {
  return invoke<void>("write_document", { path, content });
}

export async function deleteDocument(path: string): Promise<void> {
  return invoke<void>("delete_document", { path });
}

export async function renameDocument(
  oldPath: string,
  newPath: string,
): Promise<void> {
  return invoke<void>("rename_document", { oldPath, newPath });
}

export async function createFolder(path: string): Promise<void> {
  return invoke<void>("create_folder", { path });
}
