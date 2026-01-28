import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, Key } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useState } from "react";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [name, setName] = useState("Nikhil");
  const [email, setEmail] = useState("");

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
        <h1 className="text-xl font-semibold text-[#3d3225] ml-4">Profile</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center">
            <div className="h-24 w-24 rounded-full bg-[#2c3e50] flex items-center justify-center text-white text-3xl font-semibold mb-4">
              {name.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-semibold text-[#3d3225]">{name}</h2>
          </div>

          {/* Profile Info Section */}
          <section className="bg-[#fffcf7] rounded-lg border border-[#d4c4a8] p-6">
            <h2 className="text-lg font-semibold text-[#3d3225] mb-4">
              Profile Information
            </h2>

            <div className="space-y-4">
              <div>
                <Label className="text-[#3d3225] flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Display Name
                </Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-[#3d3225] flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email (optional)
                </Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="mt-2"
                />
              </div>
            </div>

            <Button className="mt-6 bg-[#8B4513] hover:bg-[#6d3610]">
              Save Changes
            </Button>
          </section>

          {/* Security Section */}
          <section className="bg-[#fffcf7] rounded-lg border border-[#d4c4a8] p-6">
            <div className="flex items-center gap-3 mb-4">
              <Key className="h-5 w-5 text-[#4a3f32]" />
              <h2 className="text-lg font-semibold text-[#3d3225]">Security</h2>
            </div>

            <div className="space-y-4">
              <Button variant="outline">Change PIN</Button>
              <p className="text-sm text-[#6b5d4d]">
                Your PIN is used to unlock the app
              </p>
            </div>
          </section>

          {/* Stats Section */}
          <section className="bg-[#fffcf7] rounded-lg border border-[#d4c4a8] p-6">
            <h2 className="text-lg font-semibold text-[#3d3225] mb-4">
              Writing Stats
            </h2>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-[#3d3225]">0</p>
                <p className="text-sm text-[#6b5d4d]">Notes</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#3d3225]">0</p>
                <p className="text-sm text-[#6b5d4d]">Novels</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#3d3225]">0</p>
                <p className="text-sm text-[#6b5d4d]">Journal Entries</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
