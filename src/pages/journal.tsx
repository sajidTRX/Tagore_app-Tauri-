import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { getJournal, upsertJournal, Journal } from "../lib/api";
import TipTapEditor from "../components/TipTapEditor";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function getDateKey(date: Date): string {
  return date.toISOString().split("T")[0]; // YYYY-MM-DD
}

function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function JournalPage() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [editorContent, setEditorContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const dateKey = getDateKey(currentDate);

  // Load journal entry for current date
  useEffect(() => {
    const loadJournal = async () => {
      setIsLoading(true);
      try {
        const journal = await getJournal(dateKey);
        if (journal) {
          setEditorContent(journal.content_html);
        } else {
          setEditorContent("");
        }
      } catch (error) {
        console.error("Failed to load journal:", error);
        setEditorContent("");
      }
      setIsLoading(false);
    };

    loadJournal();
  }, [dateKey]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await upsertJournal(dateKey, editorContent);
    } catch (error) {
      console.error("Save failed:", error);
    }
    setIsSaving(false);
  };

  const goToPreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = getDateKey(new Date()) === dateKey;

  return (
    <div className="flex flex-col h-screen w-full bg-[#f5e6c8]">
      {/* Header */}
      <div className="h-16 bg-[#efe6d5] border-b border-[#d4c4a8] flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/home")}
            className="text-[#4a3f32]"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-semibold text-[#3d3225]">Journal</h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPreviousDay}
            className="text-[#4a3f32]"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div className="text-center min-w-[200px]">
            <div className="font-medium text-[#3d3225]">
              {formatDisplayDate(currentDate)}
            </div>
            {!isToday && (
              <button
                onClick={goToToday}
                className="text-xs text-[#6b5d4d] hover:text-[#4a3f32] underline"
              >
                Go to Today
              </button>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={goToNextDay}
            className="text-[#4a3f32]"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleSave}
          disabled={isSaving}
          className="text-[#4a3f32] border-[#d4c4a8]"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-[#6b5d4d]">
            Loading...
          </div>
        ) : (
          <TipTapEditor
            content={editorContent}
            onUpdate={setEditorContent}
            placeholder={`What's on your mind today, ${formatDisplayDate(currentDate)}?`}
          />
        )}
      </div>
    </div>
  );
}
