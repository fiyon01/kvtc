"use client";

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import TopBanner from './TopBanner';
import FloatingWhatsApp from './FloatingWhatsApp';
import SplashScreen from './SplashScreen';
import { ToastProvider } from './ToastProvider';

export default function ClientLayoutWrapper({ children }) {
  const pathname = usePathname();
  const isDocumentView = pathname.startsWith('/prospectus') || pathname.startsWith('/fee-structure');
  const isApp = !pathname.startsWith('/admin') && !isDocumentView;

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
    </ToastProvider>
  );
}
