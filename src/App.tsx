import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home as Dashboard } from './pages/Home';
import { Landing } from './pages/Landing';
import { Pricing } from './pages/Pricing';
import { FAQ } from './pages/FAQ';
import { Admin } from './pages/Admin';
import { Profile } from './pages/Profile';
import { Changelog } from './pages/Changelog';
import { Roadmap } from './pages/Roadmap';
import { CollabSpace } from './pages/CollabSpace';
import { AuthModal } from './components/AuthModal';
import { CookieBanner } from './components/CookieBanner';
import { PremiumModal } from './components/PremiumModal';
import { FeedbackWidget } from './components/FeedbackWidget';
import { useAuthStore } from './stores/useAuthStore';
import { useAppStore } from './stores/useAppStore';
import { AppLayout } from './layouts/AppLayout';
import { Loader2 } from 'lucide-react';
import { Toaster } from 'sonner';

function AppContent() {
  const { checkAuth, isLoading } = useAuthStore();
  const { isPremiumModalOpen, setIsPremiumModalOpen, setIsPremium } = useAppStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<Dashboard />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/changelog" element={<Changelog />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/collab" element={<CollabSpace />} />
        <Route path="*" element={<Landing />} />
      </Routes>
      <AuthModal />
      <CookieBanner />
      <PremiumModal 
        isOpen={isPremiumModalOpen} 
        onClose={() => setIsPremiumModalOpen(false)} 
        onSuccess={() => setIsPremium(true)} 
      />
      <FeedbackWidget />
      <Toaster theme="dark" position="bottom-right" />
    </AppLayout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
