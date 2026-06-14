"use client";

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import TopBanner from './TopBanner';
import FloatingWhatsApp from './FloatingWhatsApp';
import SplashScreen from './SplashScreen';
import { ToastProvider } from './ToastProvider';
import LeadCaptureModal from './LeadCaptureModal';
import FunnelTracker from './FunnelTracker';

export default function ClientLayoutWrapper({ children }) {
  const pathname = usePathname();
  const isDocumentView = pathname.startsWith('/prospectus') || pathname.startsWith('/fee-structure');
  const isAria = pathname.startsWith('/aria');
  const isAdmin = pathname.startsWith('/admin');
  const isApp = !isAdmin && !isDocumentView && !isAria;

  return (
    <ToastProvider>
      {isApp && <SplashScreen />}
      {isApp && <TopBanner />}
      {isApp && <Navbar />}
      <main style={{ minHeight: '100vh', background: !isApp ? '#f8f7f4' : 'transparent' }}>
        {children}
      </main>
      {isApp && <Footer />}
      {isApp && <FloatingWhatsApp />}
      {/* Track every public page visit for funnel analytics */}
      {isApp && <FunnelTracker stage="page_visits" />}
      {/* Exit-intent lead capture — only on public pages, not admin/aria */}
      {isApp && <LeadCaptureModal />}
    </ToastProvider>
  );
}
