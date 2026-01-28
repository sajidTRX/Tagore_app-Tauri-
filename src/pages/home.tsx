import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  ClipboardList,
  Minimize2,
  Settings,
  User,
  HelpCircle,
  ChevronDown,
} from "lucide-react";

const modes = [
  {
    id: "novel",
    name: "Novel",
    path: "/novel",
    icon: <BookOpen className="h-12 w-12 text-[#4a3f32]" />,
    description:
      "For writing long-form fiction with chapter management and creative tools.",
    features: [
      "Chapter organization",
      "AI writing assistance",
      "Character development",
    ],
    color: "bg-[#f5f0e8]",
  },
  {
    id: "note",
    name: "Note",
    path: "/note",
    icon: <ClipboardList className="h-12 w-12 text-[#4a3f32]" />,
    description:
      "For academic notes with mathematical symbols and study tools.",
    features: ["Symbol insertion", "Formula support", "AI study assistance"],
    color: "bg-[#f5f0e8]",
  },
  {
    id: "journal",
    name: "Journal",
    path: "/journal",
    icon: <Minimize2 className="h-12 w-12 text-[#4a3f32]" />,
    description: "Minimal interface for focused writing without distractions.",
    features: ["Hidden controls", "Focus timer", "Minimal UI"],
    color: "bg-[#f5f0e8]",
  },
];

function CurrentClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formattedTime = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const formattedDate = time.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="text-right text-[#6b5d4d]">
      <div className="font-medium text-[clamp(0.75rem,1.5vw,0.875rem)]">
        {formattedTime}
      </div>
      <div className="text-[clamp(0.625rem,1.25vw,0.75rem)]">
        {formattedDate}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [selectedMode, setSelectedMode] = useState("note");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const navigate = useNavigate();

  const currentMode = modes.find((m) => m.id === selectedMode) || modes[1];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !isDropdownOpen) {
        navigate(currentMode.path);
      }

      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        if (isDropdownOpen) {
          e.preventDefault();
          const currentIndex = modes.findIndex((m) => m.id === selectedMode);
          if (e.key === "ArrowUp" && currentIndex > 0) {
            setSelectedMode(modes[currentIndex - 1].id);
          } else if (e.key === "ArrowDown" && currentIndex < modes.length - 1) {
            setSelectedMode(modes[currentIndex + 1].id);
          }
        }
      }

      if (e.key === "Escape") {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedMode, isDropdownOpen, currentMode.path, navigate]);

  const handleSelectMode = () => {
    navigate(currentMode.path);
  };

  return (
    <div className="flex h-screen w-full flex-col bg-[#f5e6c8] overflow-hidden">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between px-[2vw] py-[1vh] flex-shrink-0">
        <div className="flex items-center gap-2">
          <h1 className="text-[clamp(1rem,2.5vw,1.5rem)] font-semibold text-[#3d3225]">
            Tagore
          </h1>
        </div>
        <CurrentClock />
      </div>

      <div className="flex flex-1 overflow-auto min-h-0">
        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-start px-[2vw] py-[2vh] min-h-0">
          {/* Header Section */}
          <div className="text-center mb-[1.5vh] flex-shrink-0">
            <h1 className="text-[clamp(1.1rem,3.5vw,2.25rem)] font-serif text-[#3d3225] mb-[0.5vh]">
              What do you want to write?
            </h1>
            <p className="text-[clamp(0.6rem,1.2vw,0.8rem)] italic text-[#6b5d4d]">
              "The art of writing is the art of discovering what you believe."
            </p>
          </div>

          {/* Mode Selection Card */}
          <div className="w-[clamp(260px,45vw,420px)] flex-shrink-0">
            <div className="bg-[#fffcf7] rounded-[clamp(0.5rem,1.5vw,1rem)] shadow-md p-[clamp(0.5rem,1.5vw,1.25rem)] border border-[#e8dcc8]">
              {/* Icon */}
              <div className="flex justify-center mb-[0.75vh]">
                <div className="p-[clamp(0.25rem,0.75vw,0.5rem)] rounded-lg bg-[#f5ede0] border border-[#d4c4a8]">
                  {React.cloneElement(currentMode.icon, {
                    className:
                      "h-[clamp(1.25rem,4vw,2.5rem)] w-[clamp(1.25rem,4vw,2.5rem)] text-[#4a3f32]",
                  })}
                </div>
              </div>

              {/* Title */}
              <h2 className="text-[clamp(0.8rem,1.75vw,1.125rem)] font-semibold text-[#3d3225] text-center mb-[0.25vh]">
                {currentMode.name}
              </h2>

              {/* Description */}
              <p className="text-[clamp(0.55rem,1.1vw,0.75rem)] text-[#6b5d4d] text-center mb-[0.75vh]">
                {currentMode.description}
              </p>

              {/* Feature Tags */}
              <div className="flex flex-wrap justify-center gap-[clamp(0.2rem,0.4vw,0.375rem)] mb-[1vh]">
                {currentMode.features.map((feature, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-[#d4c4a8] bg-[#f8f3eb] px-[clamp(0.3rem,0.75vw,0.5rem)] py-[clamp(0.1rem,0.3vw,0.2rem)] text-[clamp(0.45rem,0.9vw,0.65rem)] text-[#4a3f32]"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              {/* Mode Selector Dropdown */}
              <div className="mb-[1vh]">
                <label className="block text-[clamp(0.55rem,1vw,0.75rem)] text-[#6b5d4d] mb-[0.4vh]">
                  Select Writing Mode
                </label>
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full flex items-center justify-between px-[clamp(0.4rem,1vw,0.75rem)] py-[clamp(0.3rem,0.75vh,0.5rem)] bg-[#f8f3eb] border border-[#d4c4a8] rounded-lg text-[clamp(0.65rem,1.1vw,0.8rem)] text-[#3d3225] hover:border-[#a89880] transition-colors"
                  >
                    <span>{currentMode.name}</span>
                    <ChevronDown
                      className={`h-[clamp(0.65rem,1.25vw,0.875rem)] w-[clamp(0.65rem,1.25vw,0.875rem)] text-[#6b5d4d] transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-[#fffcf7] border border-[#d4c4a8] rounded-lg shadow-lg z-10 overflow-hidden">
                      {modes.map((mode) => (
                        <button
                          key={mode.id}
                          onClick={() => {
                            setSelectedMode(mode.id);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full flex items-center gap-[clamp(0.3rem,0.75vw,0.5rem)] px-[clamp(0.4rem,1vw,0.75rem)] py-[clamp(0.3rem,0.75vh,0.5rem)] text-left text-[clamp(0.65rem,1.1vw,0.8rem)] hover:bg-[#f5f0e8] transition-colors ${
                            selectedMode === mode.id ? "bg-[#f5f0e8]" : ""
                          }`}
                        >
                          <div className="flex-shrink-0">
                            {React.cloneElement(mode.icon, {
                              className:
                                "h-[clamp(0.65rem,1.25vw,1rem)] w-[clamp(0.65rem,1.25vw,1rem)] text-[#4a3f32]",
                            })}
                          </div>
                          <span className="text-[#3d3225]">{mode.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Select Mode Button */}
              <button
                onClick={handleSelectMode}
                className="w-full py-[clamp(0.4rem,1vh,0.625rem)] bg-[#8B4513] hover:bg-[#6d3610] text-white text-[clamp(0.65rem,1.25vw,0.875rem)] font-medium rounded-full transition-colors"
              >
                Select Mode
              </button>
            </div>
          </div>

          {/* Tip of the Day */}
          <div className="mt-[1.5vh] text-center flex-shrink-0">
            <p className="text-[clamp(0.55rem,1vw,0.75rem)] font-medium text-[#6b5d4d]">
              Tip of the Day
            </p>
            <p className="text-[clamp(0.55rem,1vw,0.75rem)] italic text-[#4a3f32] mt-[0.25vh]">
              "Write with the door closed, rewrite with the door open." -
              Stephen King
            </p>
          </div>
        </div>
      </div>

      {/* Floating User Icon - Bottom Left */}
      <div className="fixed bottom-[2vh] left-[2vw]">
        <button
          onClick={() => navigate("/profile")}
          className="h-[clamp(2rem,5vw,3rem)] w-[clamp(2rem,5vw,3rem)] rounded-full bg-[#2c3e50] text-white flex items-center justify-center text-[clamp(0.75rem,2vw,1.125rem)] font-semibold shadow-lg hover:bg-[#34495e] transition-colors"
        >
          N
        </button>
      </div>

      {/* Floating Settings Icon - Bottom Right */}
      <div className="fixed bottom-[2vh] right-[2vw] z-50">
        <div className="relative">
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            aria-label="Settings"
            className="h-[clamp(1.5rem,3.5vw,2.25rem)] w-[clamp(1.5rem,3.5vw,2.25rem)] rounded-full bg-[#4a3f32] text-white flex items-center justify-center shadow-lg hover:bg-[#5a4a3a] transition-colors"
          >
            <Settings className="h-[clamp(0.75rem,1.75vw,1.125rem)] w-[clamp(0.75rem,1.75vw,1.125rem)]" />
          </button>

          {isSettingsOpen && (
            <div className="absolute bottom-full right-0 mb-2 bg-[#fffcf7] border border-[#d4c4a8] rounded-lg shadow-lg overflow-hidden min-w-[clamp(100px,15vw,140px)]">
              <button
                onClick={() => {
                  navigate("/device-settings");
                  setIsSettingsOpen(false);
                }}
                className="w-full flex items-center gap-2 px-[clamp(0.5rem,1vw,0.75rem)] py-[clamp(0.375rem,1vh,0.625rem)] text-left text-[clamp(0.625rem,1.25vw,0.875rem)] hover:bg-[#f5f0e8] transition-colors text-[#3d3225]"
              >
                <Settings className="h-[clamp(0.75rem,1.5vw,1rem)] w-[clamp(0.75rem,1.5vw,1rem)] text-[#4a3f32]" />
                <span>Settings</span>
              </button>
              <button
                onClick={() => {
                  navigate("/profile");
                  setIsSettingsOpen(false);
                }}
                className="w-full flex items-center gap-2 px-[clamp(0.5rem,1vw,0.75rem)] py-[clamp(0.375rem,1vh,0.625rem)] text-left text-[clamp(0.625rem,1.25vw,0.875rem)] hover:bg-[#f5f0e8] transition-colors text-[#3d3225]"
              >
                <User className="h-[clamp(0.75rem,1.5vw,1rem)] w-[clamp(0.75rem,1.5vw,1rem)] text-[#4a3f32]" />
                <span>Profile</span>
              </button>
              <button
                onClick={() => {
                  navigate("/help");
                  setIsSettingsOpen(false);
                }}
                className="w-full flex items-center gap-2 px-[clamp(0.5rem,1vw,0.75rem)] py-[clamp(0.375rem,1vh,0.625rem)] text-left text-[clamp(0.625rem,1.25vw,0.875rem)] hover:bg-[#f5f0e8] transition-colors text-[#3d3225]"
              >
                <HelpCircle className="h-[clamp(0.75rem,1.5vw,1rem)] w-[clamp(0.75rem,1.5vw,1rem)] text-[#4a3f32]" />
                <span>Help</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
