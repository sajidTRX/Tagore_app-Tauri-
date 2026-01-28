import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { listHistory, getHistoryEntry, HistoryEntry } from "../lib/api";
import { useState, useEffect } from "react";
import { ScrollArea } from "../components/ui/scroll-area";

export default function HistoryPage() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null);

  useEffect(() => {
    // Note: In actual implementation, we'd need a note ID or fetch all history
    // For now, show empty state
    setIsLoading(false);
  }, []);

  return (
    <div className="flex flex-col h-screen w-full bg-[#f5e6c8]">
      {/* Header */}
      <div className="h-16 bg-[#efe6d5] border-b border-[#d4c4a8] flex items-center px-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/home")}
          className="text-[#4a3f32]"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-xl font-semibold text-[#3d3225] ml-4">History</h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <p className="text-center text-[#6b5d4d]">Loading history...</p>
          ) : history.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#6b5d4d] text-lg mb-2">No history yet</p>
              <p className="text-[#a89880] text-sm">
                Your document version history will appear here as you make edits
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-8rem)]">
              <div className="space-y-4">
                {history.map((entry) => (
                  <button
                    key={entry.id}
                    onClick={() => setSelectedEntry(entry)}
                    className={`w-full text-left p-4 rounded-lg border transition-colors ${
                      selectedEntry?.id === entry.id
                        ? "border-[#8b7d6b] bg-[#efe6d5]"
                        : "border-[#d4c4a8] bg-[#fffcf7] hover:bg-[#f8f3eb]"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-[#3d3225]">
                          {entry.diff_summary || "Edit"}
                        </p>
                        <p className="text-sm text-[#6b5d4d] mt-1">
                          {new Date(entry.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  );
}
