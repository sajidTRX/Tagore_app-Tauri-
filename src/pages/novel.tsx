import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Plus, Trash2, BookOpen } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import {
  listNovels,
  createNovel,
  listChapters,
  getChapter,
  upsertChapter,
  deleteNovel,
  Novel,
  Chapter,
} from "../lib/api";
import TipTapEditor from "../components/TipTapEditor";

export default function NovelPage() {
  const navigate = useNavigate();

  const [novels, setNovels] = useState<Novel[]>([]);
  const [selectedNovel, setSelectedNovel] = useState<Novel | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [editorContent, setEditorContent] = useState("");
  const [chapterTitle, setChapterTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newNovelTitle, setNewNovelTitle] = useState("");
  const [showNewNovelInput, setShowNewNovelInput] = useState(false);

  // Load novels
  useEffect(() => {
    const loadNovels = async () => {
      try {
        const novelsList = await listNovels();
        setNovels(novelsList);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load novels:", error);
        setIsLoading(false);
      }
    };
    loadNovels();
  }, []);

  // Load chapters when novel is selected
  useEffect(() => {
    const loadChapters = async () => {
      if (selectedNovel) {
        try {
          const chaptersList = await listChapters(selectedNovel.id);
          setChapters(chaptersList);
        } catch (error) {
          console.error("Failed to load chapters:", error);
        }
      }
    };
    loadChapters();
  }, [selectedNovel]);

  const handleCreateNovel = async () => {
    if (!newNovelTitle.trim()) return;
    try {
      const novel = await createNovel(newNovelTitle);
      setNovels((prev) => [novel, ...prev]);
      setSelectedNovel(novel);
      setNewNovelTitle("");
      setShowNewNovelInput(false);
    } catch (error) {
      console.error("Failed to create novel:", error);
    }
  };

  const handleSelectNovel = (novel: Novel) => {
    setSelectedNovel(novel);
    setSelectedChapter(null);
    setEditorContent("");
    setChapterTitle("");
  };

  const handleSelectChapter = async (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setEditorContent(chapter.content_html);
    setChapterTitle(chapter.title);
  };

  const handleNewChapter = () => {
    setSelectedChapter(null);
    setEditorContent("");
    setChapterTitle(`Chapter ${chapters.length + 1}`);
  };

  const handleSave = async () => {
    if (!selectedNovel || !chapterTitle.trim()) return;

    setIsSaving(true);
    try {
      const chapterNo = selectedChapter?.chapter_no || chapters.length + 1;
      const chapter = await upsertChapter(
        selectedNovel.id,
        chapterNo,
        chapterTitle,
        editorContent,
      );
      setSelectedChapter(chapter);

      // Update chapters list
      const chaptersList = await listChapters(selectedNovel.id);
      setChapters(chaptersList);
    } catch (error) {
      console.error("Save failed:", error);
    }
    setIsSaving(false);
  };

  const handleDeleteNovel = async (novelId: string) => {
    try {
      await deleteNovel(novelId);
      setNovels((prev) => prev.filter((n) => n.id !== novelId));
      if (selectedNovel?.id === novelId) {
        setSelectedNovel(null);
        setChapters([]);
        setSelectedChapter(null);
        setEditorContent("");
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#f5e6c8]">
      {/* Sidebar - Novels List */}
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
              onClick={() => setShowNewNovelInput(true)}
              className="text-[#4a3f32]"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <h2 className="text-lg font-semibold text-[#3d3225]">Novels</h2>
        </div>

        {showNewNovelInput && (
          <div className="p-4 border-b border-[#d4c4a8]">
            <Input
              value={newNovelTitle}
              onChange={(e) => setNewNovelTitle(e.target.value)}
              placeholder="Novel title..."
              className="mb-2"
              onKeyDown={(e) => e.key === "Enter" && handleCreateNovel()}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleCreateNovel}>
                Create
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowNewNovelInput(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {isLoading ? (
              <p className="text-center text-[#6b5d4d] py-4">Loading...</p>
            ) : novels.length === 0 ? (
              <p className="text-center text-[#6b5d4d] py-4">No novels yet</p>
            ) : (
              novels.map((novel) => (
                <div key={novel.id} className="group">
                  <button
                    onClick={() => handleSelectNovel(novel)}
                    className={`w-full text-left p-3 rounded-lg transition-colors flex items-center justify-between ${
                      selectedNovel?.id === novel.id
                        ? "bg-[#d4c4a8] text-[#3d3225]"
                        : "hover:bg-[#e8ddd0] text-[#4a3f32]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span className="font-medium truncate">
                        {novel.title}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNovel(novel.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3 text-red-500" />
                    </Button>
                  </button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Chapters Sidebar */}
      {selectedNovel && (
        <div className="w-48 bg-[#f0e9de] border-r border-[#d4c4a8] flex flex-col">
          <div className="p-4 border-b border-[#d4c4a8]">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-[#3d3225]">Chapters</h3>
              <Button variant="ghost" size="icon" onClick={handleNewChapter}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {chapters.map((chapter) => (
                <button
                  key={chapter.id}
                  onClick={() => handleSelectChapter(chapter)}
                  className={`w-full text-left p-2 rounded text-sm transition-colors ${
                    selectedChapter?.id === chapter.id
                      ? "bg-[#d4c4a8] text-[#3d3225]"
                      : "hover:bg-[#e8ddd0] text-[#4a3f32]"
                  }`}
                >
                  {chapter.title}
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        <div className="h-14 bg-[#efe6d5] border-b border-[#d4c4a8] flex items-center justify-between px-4">
          <Input
            value={chapterTitle}
            onChange={(e) => setChapterTitle(e.target.value)}
            placeholder="Chapter title..."
            disabled={!selectedNovel}
            className="w-64 bg-transparent border-none text-lg font-medium text-[#3d3225] placeholder:text-[#a89880] focus-visible:ring-0"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={isSaving || !selectedNovel || !chapterTitle.trim()}
            className="text-[#4a3f32] border-[#d4c4a8]"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>

        <div className="flex-1 overflow-hidden">
          {selectedNovel ? (
            <TipTapEditor
              content={editorContent}
              onUpdate={setEditorContent}
              placeholder="Start writing your chapter..."
            />
          ) : (
            <div className="flex items-center justify-center h-full text-[#6b5d4d]">
              Select or create a novel to start writing
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
