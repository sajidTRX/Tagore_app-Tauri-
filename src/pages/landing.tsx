import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  listNotes,
  listNovels,
  listJournals,
  Note,
  Novel,
  Journal,
} from "../lib/api";

interface RecentDocument {
  id: string;
  title: string;
  type: "note" | "novel" | "journal";
  updatedAt: string;
  preview?: string;
  notebook?: string;
}

// Animated Star Component using React state - Blinking effect
const AnimatedStar = ({
  className,
  style,
  group = "a",
}: {
  className?: string;
  style?: React.CSSProperties;
  group?: "a" | "b";
}) => {
  const [opacity, setOpacity] = useState(group === "a" ? 0.4 : 0.9);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const duration = 1800;
    const steps = 60;
    const interval = duration / steps;
    let step = group === "a" ? 0 : steps / 2;

    const timer = setInterval(() => {
      step = (step + 1) % steps;
      const progress = Math.sin((step / steps) * Math.PI * 2);
      setOpacity(0.3 + (progress + 1) * 0.35);
      setScale(1 + (progress + 1) * 0.1);
    }, interval);

    return () => clearInterval(timer);
  }, [group]);

  return (
    <span
      className={className}
      style={{
        ...style,
        opacity,
        transform: `scale(${scale})`,
        transition: "opacity 50ms linear, transform 50ms linear",
        display: "inline-block",
        textShadow: "0 0 8px rgba(255,255,255,0.5), 0 0 4px rgba(0,0,0,0.3)",
      }}
    >
      ✦
    </span>
  );
};

export default function LandingPage() {
  const [recentDocuments, setRecentDocuments] = useState<RecentDocument[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        let allDocs: RecentDocument[] = [];

        // Fetch notes from SQLite
        try {
          const notes = await listNotes({});
          const noteDocs = notes.map((note: Note) => ({
            id: note.id,
            title: note.title,
            type: "note" as const,
            updatedAt: new Date(note.updated_at).toISOString(),
            preview: note.content_text?.substring(0, 200) || "",
          }));
          allDocs = [...allDocs, ...noteDocs];
        } catch (e) {
          console.log("Notes fetch error:", e);
        }

        // Fetch novels from SQLite
        try {
          const novels = await listNovels();
          const novelDocs = novels.map((novel: Novel) => ({
            id: novel.id,
            title: novel.title,
            type: "novel" as const,
            updatedAt: new Date(novel.updated_at).toISOString(),
            preview: "",
          }));
          allDocs = [...allDocs, ...novelDocs];
        } catch (e) {
          console.log("Novels fetch error:", e);
        }

        // Fetch journals from SQLite
        try {
          const journals = await listJournals();
          const journalDocs = journals.map((journal: Journal) => ({
            id: journal.id,
            title: `Journal - ${journal.date_key}`,
            type: "journal" as const,
            updatedAt: new Date(journal.updated_at).toISOString(),
            preview: journal.content_text?.substring(0, 200) || "",
          }));
          allDocs = [...allDocs, ...journalDocs];
        } catch (e) {
          console.log("Journals fetch error:", e);
        }

        // Combine all and sort by most recent, limit to 6
        const combined = allDocs
          .sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
          )
          .slice(0, 6);

        setRecentDocuments(combined);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    fetchDocuments();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }) +
      ", " +
      date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  const handleDocumentClick = (doc: RecentDocument) => {
    if (doc.type === "note") {
      navigate(`/note?id=${encodeURIComponent(doc.id)}`);
    } else if (doc.type === "novel") {
      navigate(`/novel?id=${encodeURIComponent(doc.id)}`);
    } else if (doc.type === "journal") {
      navigate(`/journal`);
    }
  };

  const handleStartWriting = () => {
    navigate("/home");
  };

  return (
    <div className="h-screen w-screen fixed inset-0 overflow-hidden bg-[#e8e2d8]">
      {/* Background Image - tagore-theme.png */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src="/tagore-theme.png"
          alt="Tagore Theme Background"
          className="w-full h-full object-contain"
          style={{
            zIndex: 0,
            objectPosition: "center center",
          }}
        />
      </div>

      {/* Animated Blinking Stars Overlay */}
      <AnimatedStar
        className="absolute text-[#e8ddd0] z-20"
        style={{ top: "8%", left: "8%", fontSize: "24px" }}
        group="a"
      />
      <AnimatedStar
        className="absolute text-[#e8ddd0] z-20"
        style={{ top: "8%", right: "8%", fontSize: "24px" }}
        group="a"
      />
      <AnimatedStar
        className="absolute text-[#d4c4a8] z-20"
        style={{ top: "15%", left: "18%", fontSize: "18px" }}
        group="b"
      />
      <AnimatedStar
        className="absolute text-[#d4c4a8] z-20"
        style={{ top: "15%", right: "18%", fontSize: "18px" }}
        group="b"
      />
      <AnimatedStar
        className="absolute text-[#c9b896] z-20"
        style={{ top: "22%", left: "25%", fontSize: "20px" }}
        group="a"
      />
      <AnimatedStar
        className="absolute text-[#c9b896] z-20"
        style={{ top: "22%", right: "25%", fontSize: "20px" }}
        group="a"
      />
      <AnimatedStar
        className="absolute text-[#e8ddd0] z-20"
        style={{ top: "30%", left: "12%", fontSize: "16px" }}
        group="b"
      />
      <AnimatedStar
        className="absolute text-[#e8ddd0] z-20"
        style={{ top: "30%", right: "12%", fontSize: "16px" }}
        group="b"
      />
      <AnimatedStar
        className="absolute text-[#8b7d6b] z-20"
        style={{ top: "45%", left: "5%", fontSize: "14px" }}
        group="a"
      />
      <AnimatedStar
        className="absolute text-[#8b7d6b] z-20"
        style={{ top: "45%", right: "5%", fontSize: "14px" }}
        group="a"
      />
      <AnimatedStar
        className="absolute text-[#6b5d4d] z-20"
        style={{ bottom: "15%", left: "10%", fontSize: "18px" }}
        group="b"
      />
      <AnimatedStar
        className="absolute text-[#6b5d4d] z-20"
        style={{ bottom: "15%", right: "10%", fontSize: "18px" }}
        group="b"
      />
      <AnimatedStar
        className="absolute text-[#4a3f32] z-20"
        style={{ bottom: "8%", left: "20%", fontSize: "22px" }}
        group="a"
      />
      <AnimatedStar
        className="absolute text-[#4a3f32] z-20"
        style={{ bottom: "8%", right: "20%", fontSize: "22px" }}
        group="a"
      />
      <AnimatedStar
        className="absolute text-[#5a4a3a] z-20"
        style={{ top: "4%", left: "4%", fontSize: "28px" }}
        group="b"
      />
      <AnimatedStar
        className="absolute text-[#5a4a3a] z-20"
        style={{ top: "4%", right: "4%", fontSize: "28px" }}
        group="b"
      />
      <AnimatedStar
        className="absolute text-[#5a4a3a] z-20"
        style={{ bottom: "4%", left: "4%", fontSize: "28px" }}
        group="a"
      />
      <AnimatedStar
        className="absolute text-[#5a4a3a] z-20"
        style={{ bottom: "4%", right: "4%", fontSize: "28px" }}
        group="a"
      />

      {/* Start Writing Button */}
      <button
        onClick={handleStartWriting}
        className="
          absolute z-30
          px-12 py-4
          min-h-[56px]
          rounded-full
          bg-[#e8e2d8] hover:bg-[#f0ebe3]
          border-2 border-[#4a4540]
          text-[#2d2820]
          font-medium
          tracking-wide
          transition-all duration-150
          hover:scale-105
          active:scale-95 active:translate-y-[1px]
          focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4a4540] focus-visible:ring-offset-2
          shadow-md hover:shadow-lg
          cursor-pointer
          font-mono
        "
        style={{
          top: "33%",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "18px",
          letterSpacing: "0.05em",
          boxShadow:
            "0 4px 8px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.4)",
        }}
        aria-label="Start Writing"
      >
        Start Writing
      </button>

      {/* Document Cards */}
      <div
        className="absolute z-40 flex flex-nowrap items-start justify-center gap-[1vw] px-[2vw] overflow-hidden"
        style={{
          top: "52%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "90%",
          maxWidth: "1000px",
          maxHeight: "40%",
        }}
      >
        {recentDocuments.length > 0
          ? recentDocuments.slice(0, 6).map((doc) => (
              <button
                key={doc.id}
                onClick={() => handleDocumentClick(doc)}
                className="flex-1 min-w-0 cursor-pointer group transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4a4540] focus-visible:ring-offset-2 rounded-lg"
                style={{ maxWidth: "clamp(80px, 14vw, 140px)" }}
                aria-label={`Open ${doc.type}: ${doc.title}`}
              >
                <div
                  className="relative rounded-lg overflow-hidden border border-[#c8c4bc] shadow-md group-hover:shadow-lg transition-shadow"
                  style={{
                    width: "100%",
                    aspectRatio: "3/4",
                    background:
                      "linear-gradient(135deg, #ffffff 0%, #f8f6f2 50%, #f0ece4 100%)",
                    boxShadow:
                      "0 3px 10px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.8)",
                  }}
                >
                  <div className="p-2 sm:p-3 h-full overflow-hidden">
                    <p
                      className="leading-tight opacity-50 font-mono line-clamp-6"
                      style={{
                        fontSize: "clamp(5px, 0.9vw, 7px)",
                        color: "#4a4540",
                        lineHeight: 1.5,
                      }}
                    >
                      {doc.preview || "The blank page awaits your words..."}
                    </p>
                  </div>
                  <div
                    className="absolute top-1 right-1 px-1 py-0.5 rounded font-medium"
                    style={{
                      fontSize: "clamp(5px, 0.7vw, 8px)",
                      backgroundColor:
                        doc.type === "note"
                          ? "#e8ddd0"
                          : doc.type === "novel"
                            ? "#d4c4a8"
                            : "#c9b896",
                      color: "#4a4540",
                    }}
                  >
                    {doc.type}
                  </div>
                </div>
                <div className="mt-1 text-center px-0.5">
                  <h3
                    className="truncate font-medium font-mono"
                    style={{
                      fontSize: "clamp(7px, 1vw, 12px)",
                      color: "#e8ddd0",
                      textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                    }}
                    title={doc.title}
                  >
                    {doc.title}
                  </h3>
                  <p
                    className="truncate mt-0.5 font-mono hidden md:block"
                    style={{
                      fontSize: "clamp(6px, 0.8vw, 10px)",
                      color: "#a89880",
                    }}
                  >
                    {formatDate(doc.updatedAt)}
                  </p>
                </div>
              </button>
            ))
          : // Placeholder cards when no documents exist
            Array.from({ length: 6 }).map((_, index) => {
              const types = [
                "note",
                "novel",
                "journal",
                "note",
                "novel",
                "journal",
              ];
              const type = types[index];
              const routes: Record<string, string> = {
                note: "/note",
                novel: "/novel",
                journal: "/journal",
              };
              return (
                <button
                  key={`placeholder-${index}`}
                  onClick={() => navigate(routes[type])}
                  className="flex-1 min-w-0 cursor-pointer group transition-all duration-200 hover:scale-105 hover:opacity-100 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4a4540] focus-visible:ring-offset-2 rounded-lg opacity-70"
                  style={{ maxWidth: "clamp(80px, 14vw, 140px)" }}
                  aria-label={`Create new ${type}`}
                >
                  <div
                    className="rounded-lg overflow-hidden border border-[#c8c4bc] shadow-sm group-hover:shadow-lg transition-shadow"
                    style={{
                      width: "100%",
                      aspectRatio: "3/4",
                      background:
                        "linear-gradient(135deg, #ffffff 0%, #f8f6f2 50%, #f0ece4 100%)",
                    }}
                  >
                    <div className="p-2 sm:p-3 h-full flex items-center justify-center">
                      <p
                        className="text-center opacity-40 group-hover:opacity-60 font-mono"
                        style={{
                          fontSize: "clamp(8px, 1.2vw, 11px)",
                          color: "#6b6560",
                        }}
                      >
                        + New {type}
                      </p>
                    </div>
                  </div>
                  <div className="mt-1 text-center">
                    <h3
                      className="font-medium capitalize font-mono"
                      style={{
                        fontSize: "clamp(7px, 1vw, 12px)",
                        color: "#a89880",
                      }}
                    >
                      {type}
                    </h3>
                  </div>
                </button>
              );
            })}
      </div>
    </div>
  );
}
