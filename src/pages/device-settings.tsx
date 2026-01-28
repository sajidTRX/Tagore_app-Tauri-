import { useNavigate } from "react-router-dom";
import { ArrowLeft, HardDrive, Cloud, Key, Info } from "lucide-react";
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { useState } from "react";
import { driveStatus, driveConnect, driveDisconnect } from "../lib/api";

export default function DeviceSettingsPage() {
  const navigate = useNavigate();
  const [cloudConnected, setCloudConnected] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);

  const handleCloudConnect = async () => {
    try {
      if (cloudConnected) {
        await driveDisconnect();
        setCloudConnected(false);
      } else {
        const result = await driveConnect();
        if (result.success) {
          setCloudConnected(true);
        }
      }
    } catch (error) {
      console.error("Cloud connection error:", error);
    }
  };

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
        <h1 className="text-xl font-semibold text-[#3d3225] ml-4">
          Device Settings
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Storage Section */}
          <section className="bg-[#fffcf7] rounded-lg border border-[#d4c4a8] p-6">
            <div className="flex items-center gap-3 mb-4">
              <HardDrive className="h-5 w-5 text-[#4a3f32]" />
              <h2 className="text-lg font-semibold text-[#3d3225]">Storage</h2>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[#3d3225]">Local Storage</span>
                <span className="text-[#6b5d4d]">SQLite Database</span>
              </div>
              <div className="h-2 bg-[#e8ddd0] rounded-full overflow-hidden">
                <div className="h-full w-[15%] bg-[#8b7d6b] rounded-full" />
              </div>
              <p className="text-sm text-[#6b5d4d]">
                15% used of available storage
              </p>
            </div>
          </section>

          {/* Cloud Sync Section */}
          <section className="bg-[#fffcf7] rounded-lg border border-[#d4c4a8] p-6">
            <div className="flex items-center gap-3 mb-4">
              <Cloud className="h-5 w-5 text-[#4a3f32]" />
              <h2 className="text-lg font-semibold text-[#3d3225]">
                Google Drive Sync
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-[#3d3225]">
                    Connect to Google Drive
                  </Label>
                  <p className="text-sm text-[#6b5d4d]">
                    {cloudConnected ? "Connected" : "Not connected"}
                  </p>
                </div>
                <Switch
                  checked={cloudConnected}
                  onCheckedChange={handleCloudConnect}
                />
              </div>

              {cloudConnected && (
                <Button variant="outline" size="sm">
                  Sync Now
                </Button>
              )}
            </div>
          </section>

          {/* API Settings Section */}
          <section className="bg-[#fffcf7] rounded-lg border border-[#d4c4a8] p-6">
            <div className="flex items-center gap-3 mb-4">
              <Key className="h-5 w-5 text-[#4a3f32]" />
              <h2 className="text-lg font-semibold text-[#3d3225]">
                AI Settings
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-[#3d3225]">OpenRouter API Key</Label>
                <p className="text-sm text-[#6b5d4d] mb-2">
                  Required for AI writing assistance
                </p>
                <div className="flex gap-2">
                  <Input
                    type={showApiKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-or-..."
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? "Hide" : "Show"}
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* About Section */}
          <section className="bg-[#fffcf7] rounded-lg border border-[#d4c4a8] p-6">
            <div className="flex items-center gap-3 mb-4">
              <Info className="h-5 w-5 text-[#4a3f32]" />
              <h2 className="text-lg font-semibold text-[#3d3225]">About</h2>
            </div>

            <div className="space-y-2 text-[#6b5d4d]">
              <p>Tagore Desktop v1.0.0</p>
              <p>Built with Tauri 2.0</p>
              <p className="text-sm">
                Offline-first note taking for Raspberry Pi
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
