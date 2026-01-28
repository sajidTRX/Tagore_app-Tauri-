import { useNavigate } from "react-router-dom";
import { ArrowLeft, Moon, Sun, Type, Volume2, Wifi } from "lucide-react";
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";
import { Slider } from "../components/ui/slider";
import { Label } from "../components/ui/label";
import { useState } from "react";

export default function SettingsPage() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [fontSize, setFontSize] = useState([16]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [syncEnabled, setSyncEnabled] = useState(false);

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
        <h1 className="text-xl font-semibold text-[#3d3225] ml-4">Settings</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Appearance Section */}
          <section className="bg-[#fffcf7] rounded-lg border border-[#d4c4a8] p-6">
            <h2 className="text-lg font-semibold text-[#3d3225] mb-4">
              Appearance
            </h2>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {darkMode ? (
                    <Moon className="h-5 w-5 text-[#4a3f32]" />
                  ) : (
                    <Sun className="h-5 w-5 text-[#4a3f32]" />
                  )}
                  <div>
                    <Label className="text-[#3d3225]">Dark Mode</Label>
                    <p className="text-sm text-[#6b5d4d]">Enable dark theme</p>
                  </div>
                </div>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Type className="h-5 w-5 text-[#4a3f32]" />
                  <div>
                    <Label className="text-[#3d3225]">Font Size</Label>
                    <p className="text-sm text-[#6b5d4d]">{fontSize[0]}px</p>
                  </div>
                </div>
                <Slider
                  value={fontSize}
                  onValueChange={setFontSize}
                  min={12}
                  max={24}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          </section>

          {/* Editor Section */}
          <section className="bg-[#fffcf7] rounded-lg border border-[#d4c4a8] p-6">
            <h2 className="text-lg font-semibold text-[#3d3225] mb-4">
              Editor
            </h2>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-[#3d3225]">Auto Save</Label>
                  <p className="text-sm text-[#6b5d4d]">
                    Automatically save your work
                  </p>
                </div>
                <Switch checked={autoSave} onCheckedChange={setAutoSave} />
              </div>
            </div>
          </section>

          {/* Sounds Section */}
          <section className="bg-[#fffcf7] rounded-lg border border-[#d4c4a8] p-6">
            <h2 className="text-lg font-semibold text-[#3d3225] mb-4">
              Sounds
            </h2>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Volume2 className="h-5 w-5 text-[#4a3f32]" />
                <div>
                  <Label className="text-[#3d3225]">Sound Effects</Label>
                  <p className="text-sm text-[#6b5d4d]">
                    Play sounds on actions
                  </p>
                </div>
              </div>
              <Switch
                checked={soundEnabled}
                onCheckedChange={setSoundEnabled}
              />
            </div>
          </section>

          {/* Sync Section */}
          <section className="bg-[#fffcf7] rounded-lg border border-[#d4c4a8] p-6">
            <h2 className="text-lg font-semibold text-[#3d3225] mb-4">
              Cloud Sync
            </h2>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Wifi className="h-5 w-5 text-[#4a3f32]" />
                <div>
                  <Label className="text-[#3d3225]">Google Drive Sync</Label>
                  <p className="text-sm text-[#6b5d4d]">
                    Sync your documents to the cloud
                  </p>
                </div>
              </div>
              <Switch checked={syncEnabled} onCheckedChange={setSyncEnabled} />
            </div>
            {syncEnabled && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate("/device-settings")}
              >
                Configure Cloud Settings
              </Button>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
