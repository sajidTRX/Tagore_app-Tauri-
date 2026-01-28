import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Save, Folder, Plus, Trash2, Settings } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import {
  listNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  saveDraft,
  getDraft,
  Note,
} from "../lib/api";
import TipTapEditor from "../components/TipTapEditor";

export default function NotePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const noteIdFromUrl = searchParams.get("id");

  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [editorContent, setEditorContent] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Load notes list
  useEffect(() => {
    const loadNotes = async () => {
      try {
        const notesList = await listNotes({});
        setNotes(notesList);
        setIsLoading(false);

        // If we have a note ID in the URL, load that note
        if (noteIdFromUrl) {
          const note = await getNote(noteIdFromUrl);
          if (note) {
            setSelectedNote(note);
            setEditorContent(note.content_html);
            setNoteTitle(note.title);
          }
        }
      } catch (error) {
        console.error("Failed to load notes:", error);
        setIsLoading(false);
      }
    };

    loadNotes();
  }, [noteIdFromUrl]);

  // Auto-save draft
  useEffect(() => {
    const saveDraftContent = async () => {
      if (editorContent && (selectedNote || !noteIdFromUrl)) {
        try {
          await saveDraft(selectedNote?.id || null, editorContent);
        } catch (e) {
          console.error("Draft save error:", e);
        }
      }
    };

    const timer = setTimeout(saveDraftContent, 2000);
    return () => clearTimeout(timer);
  }, [editorContent, selectedNote, noteIdFromUrl]);

  const handleSave = useCallback(async () => {
    if (!noteTitle.trim()) return;

    setIsSaving(true);
    try {
      if (selectedNote) {
        const updated = await updateNote(
          selectedNote.id,
          noteTitle,
          editorContent,
        );
        setSelectedNote(updated);
        setNotes((prev) =>
          prev.map((n) => (n.id === updated.id ? updated : n)),
        );
      } else {
        const created = await createNote(noteTitle, editorContent);
        setSelectedNote(created);
        setNotes((prev) => [created, ...prev]);
      }
    } catch (error) {
      console.error("Save failed:", error);
    }
    setIsSaving(false);
  }, [noteTitle, editorContent, selectedNote]);

  const handleNewNote = () => {
    setSelectedNote(null);
    setEditorContent("");
    setNoteTitle("");
  };

  const handleSelectNote = async (note: Note) => {
    setSelectedNote(note);
    setEditorContent(note.content_html);
    setNoteTitle(note.title);
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await deleteNote(noteId);
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
      if (selectedNote?.id === noteId) {
        handleNewNote();
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#f5e6c8]">
      {/* Sidebar */}
      {showSidebar && (
        <div className="w-64 bg-[#efe6d5] border-r border-[#d4c4a8] flex flex-col">
          <div className="p-4 border-b border-[#d4c4a8]">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/home")}
                className="text-[#4a3f32]"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNewNote}
                className="text-[#4a3f32]"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <h2 className="text-lg font-semibold text-[#3d3225]">Notes</h2>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {isLoading ? (
                <p className="text-center text-[#6b5d4d] py-4">Loading...</p>
              ) : notes.length === 0 ? (
                <p className="text-center text-[#6b5d4d] py-4">No notes yet</p>
              ) : (
                notes.map((note) => (
                  <button
                    key={note.id}
                    onClick={() => handleSelectNote(note)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedNote?.id === note.id
                        ? "bg-[#d4c4a8] text-[#3d3225]"
                        : "hover:bg-[#e8ddd0] text-[#4a3f32]"
                    }`}
                  >
                    <div className="font-medium truncate">{note.title}</div>
                    <div className="text-xs text-[#6b5d4d] truncate mt-1">
                      {note.content_text?.substring(0, 50) || "Empty note"}
                    </div>
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="h-14 bg-[#efe6d5] border-b border-[#d4c4a8] flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSidebar(!showSidebar)}
              className="text-[#4a3f32]"
            >
              <Folder className="h-4 w-4" />
            </Button>
            <Input
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder="Note title..."
              className="w-64 bg-transparent border-none text-lg font-medium text-[#3d3225] placeholder:text-[#a89880] focus-visible:ring-0"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              disabled={isSaving || !noteTitle.trim()}
              className="text-[#4a3f32] border-[#d4c4a8]"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
            {selectedNote && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteNote(selectedNote.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-100"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 overflow-hidden">
          <TipTapEditor
            content={editorContent}
            onUpdate={setEditorContent}
            placeholder="Start writing your note..."
          />
        </div>
      </div>
    </div>
  );
}
