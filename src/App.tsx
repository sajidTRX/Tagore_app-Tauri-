import { Routes, Route, Navigate } from "react-router-dom";
import { EditorSettingsProvider } from "./lib/editor-settings-context";
import { FontThemeInitializer } from "./components/FontThemeInitializer";
import { Toaster } from "./components/ui/sonner";

// Pages
import UnlockPage from "./pages/unlock";
import LandingPage from "./pages/landing";
import HomePage from "./pages/home";
import NotePage from "./pages/note";
import NovelPage from "./pages/novel";
import JournalPage from "./pages/journal";
import HistoryPage from "./pages/history";
import SettingsPage from "./pages/settings";
import DeviceSettingsPage from "./pages/device-settings";
import ProfilePage from "./pages/profile";
import NotificationsPage from "./pages/notifications";
import HelpPage from "./pages/help";

function App() {
  return (
    <>
      <FontThemeInitializer />
      <EditorSettingsProvider>
        <Routes>
          {/* Root redirects to unlock */}
          <Route path="/" element={<Navigate to="/unlock" replace />} />

          {/* Main routes matching legacy paths */}
          <Route path="/unlock" element={<UnlockPage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/note" element={<NotePage />} />
          <Route path="/note/documents" element={<NotePage />} />
          <Route path="/novel" element={<NovelPage />} />
          <Route path="/novel/documents" element={<NovelPage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/device-settings" element={<DeviceSettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/help" element={<HelpPage />} />

          {/* Catch all - redirect to unlock */}
          <Route path="*" element={<Navigate to="/unlock" replace />} />
        </Routes>
        <Toaster />
      </EditorSettingsProvider>
    </>
  );
}

export default App;
