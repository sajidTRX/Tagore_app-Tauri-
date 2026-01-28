import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Book,
  Edit3,
  Sparkles,
  Keyboard,
  HelpCircle,
} from "lucide-react";
import { Button } from "../components/ui/button";

export default function HelpPage() {
  const navigate = useNavigate();

  const helpSections = [
    {
      icon: <Edit3 className="h-6 w-6 text-[#4a3f32]" />,
      title: "Getting Started",
      items: [
        "Create your first note by selecting 'Note' from the home screen",
        "Use the toolbar to format your text with bold, italic, and more",
        "Your work is automatically saved as you type",
      ],
    },
    {
      icon: <Book className="h-6 w-6 text-[#4a3f32]" />,
      title: "Writing Modes",
      items: [
        "Note: Perfect for academic notes and quick thoughts",
        "Novel: Organize chapters for long-form writing",
        "Journal: Daily entries with date navigation",
      ],
    },
    {
      icon: <Sparkles className="h-6 w-6 text-[#4a3f32]" />,
      title: "AI Assistant",
      items: [
        "Select text to see AI suggestions",
        "Use AI to help expand, summarize, or improve your writing",
        "Configure your OpenRouter API key in Device Settings",
      ],
    },
    {
      icon: <Keyboard className="h-6 w-6 text-[#4a3f32]" />,
      title: "Keyboard Shortcuts",
      items: [
        "Ctrl/Cmd + B: Bold text",
        "Ctrl/Cmd + I: Italic text",
        "Ctrl/Cmd + U: Underline text",
        "Ctrl/Cmd + S: Save document",
        "Ctrl/Cmd + Z: Undo",
      ],
    },
  ];

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
        <h1 className="text-xl font-semibold text-[#3d3225] ml-4">Help</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Welcome */}
          <div className="bg-[#fffcf7] rounded-lg border border-[#d4c4a8] p-6 text-center">
            <HelpCircle className="h-12 w-12 text-[#8b7d6b] mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-[#3d3225] mb-2">
              Welcome to Tagore
            </h2>
            <p className="text-[#6b5d4d]">
              Your offline-first writing companion for Raspberry Pi
            </p>
          </div>

          {/* Help Sections */}
          {helpSections.map((section, index) => (
            <div
              key={index}
              className="bg-[#fffcf7] rounded-lg border border-[#d4c4a8] p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                {section.icon}
                <h3 className="text-lg font-semibold text-[#3d3225]">
                  {section.title}
                </h3>
              </div>
              <ul className="space-y-2">
                {section.items.map((item, i) => (
                  <li key={i} className="text-[#6b5d4d] flex items-start gap-2">
                    <span className="text-[#8b7d6b]">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Support */}
          <div className="bg-[#fffcf7] rounded-lg border border-[#d4c4a8] p-6 text-center">
            <p className="text-[#6b5d4d]">
              Need more help? Check the documentation or contact support.
            </p>
            <p className="text-sm text-[#a89880] mt-2">Tagore Desktop v1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
