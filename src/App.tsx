import React, { useEffect, useState } from 'react';
import { AppProvider } from './context/AppContext';
import { ToastContainer } from './components/ToastContainer';
import { Navbar } from './components/public/Navbar';
import { HeroAndAbout } from './components/public/HeroAndAbout';
import { ProgramsAndMemberships } from './components/public/ProgramsAndMemberships';
import { LeadTrialSection } from './components/public/LeadTrialSection';
import { GalleryAndReviews } from './components/public/GalleryAndReviews';
import { FaqLocationFooter } from './components/public/FaqLocationFooter';
import { AdminPortal } from './components/admin/AdminPortal';

function MainRouter() {
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => {
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    return path.startsWith('/admin') || params.get('view') === 'admin';
  });

  const [selectedGoal, setSelectedGoal] = useState<string>('General Fitness');
  const [prefilledNote, setPrefilledNote] = useState<string>('');

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const params = new URLSearchParams(window.location.search);
      setIsAdminRoute(path.startsWith('/admin') || params.get('view') === 'admin');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToAdmin = () => {
    try {
      window.history.pushState({}, '', '/admin');
    } catch {
      // ignore in restricted iframe contexts
    }
    setIsAdminRoute(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToPublicSite = () => {
    try {
      window.history.pushState({}, '', '/');
    } catch {
      // ignore
    }
    setIsAdminRoute(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectGoalAndScroll = (goal = 'General Fitness', customMessage = '') => {
    setSelectedGoal(goal);
    if (customMessage) {
      setPrefilledNote(customMessage);
    }
    const el = document.getElementById('free-trial');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        const nameInput = document.getElementById('lead-name');
        if (nameInput) nameInput.focus();
      }, 350);
    }
  };

  if (isAdminRoute) {
    return (
      <>
        <AdminPortal onBackToSite={navigateToPublicSite} />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0B] text-[#F5F5F0]">
      <Navbar
        onNavigateAdmin={navigateToAdmin}
        onSelectTrialGoal={(goal) => handleSelectGoalAndScroll(goal)}
      />

      <main className="flex-1">
        <HeroAndAbout onBookTrialClick={(goal) => handleSelectGoalAndScroll(goal)} />
        <ProgramsAndMemberships onSelectGoalAndScroll={handleSelectGoalAndScroll} />
        <LeadTrialSection selectedGoal={selectedGoal} prefilledNote={prefilledNote} />
        <GalleryAndReviews />
        <FaqLocationFooter
          onBookTrialClick={() => handleSelectGoalAndScroll('General Fitness')}
          onNavigateAdmin={navigateToAdmin}
        />
      </main>

      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
}
