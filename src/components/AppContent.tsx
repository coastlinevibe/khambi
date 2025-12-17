import React, { Suspense, lazy } from 'react';
import Header from './Header';
import Hero from './Hero';
import IntersectionObserverWrapper from './ui/intersection-observer';

// Lazy load non-critical components
const ToolsTabs = lazy(() => import('./ToolsTabs'));
const HowItWorks = lazy(() => import('./HowItWorks'));
const Feedback = lazy(() => import('./Feedback'));
const WhyChoose = lazy(() => import('./WhyChoose'));
const Contact = lazy(() => import('./Contact'));
const FAQs = lazy(() => import('./FAQs'));
const Footer = lazy(() => import('./Footer'));
const Obituaries = lazy(() => import('./Obituaries'));

interface AppContentProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  isFooterInView: boolean;
  scrollToSection: (sectionId: string) => void;
  specificSlide?: number | null;
}

const AppContent: React.FC<AppContentProps> = ({
  activeSection,
  setActiveSection,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  isFooterInView,
  scrollToSection,
  specificSlide
}) => {

  return (
    <>
      {/* Header/Sidebar - Fixed, outside scrolling container */}
      <Header 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onNavigate={scrollToSection}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        isFooterInView={isFooterInView}
      />
      
      {/* Main content area - with proper margin for fixed sidebar */}
      <div className={`min-h-screen transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-24' : 'md:ml-64'}`}>
        <main className="w-full">
            <Hero isSidebarCollapsed={isSidebarCollapsed} specificSlide={specificSlide} />
            <IntersectionObserverWrapper>
              <Suspense fallback={<div className="h-32 bg-gray-100 animate-pulse"></div>}>
                <div id="tools-tabs" data-section="tools-tabs">
                  <ToolsTabs isSidebarCollapsed={isSidebarCollapsed} />
                </div>
              </Suspense>
            </IntersectionObserverWrapper>
            <IntersectionObserverWrapper>
              <Suspense fallback={<div className="h-32 bg-gray-100 animate-pulse"></div>}>
                <div id="obituaries" data-section="obituaries">
                  <Obituaries isSidebarCollapsed={isSidebarCollapsed} />
                </div>
              </Suspense>
            </IntersectionObserverWrapper>
            <IntersectionObserverWrapper>
              <Suspense fallback={<div className="h-32 bg-gray-100 animate-pulse"></div>}>
                <div id="how-it-works" data-section="how-it-works">
                  <HowItWorks isSidebarCollapsed={isSidebarCollapsed} />
                </div>
              </Suspense>
            </IntersectionObserverWrapper>
            <IntersectionObserverWrapper>
              <Suspense fallback={<div className="h-32 bg-gray-100 animate-pulse"></div>}>
                <div id="feedback" data-section="feedback">
                  <Feedback isSidebarCollapsed={isSidebarCollapsed} />
                </div>
              </Suspense>
            </IntersectionObserverWrapper>
            <IntersectionObserverWrapper>
              <Suspense fallback={<div className="h-32 bg-gray-100 animate-pulse"></div>}>
                <div id="why-choose" data-section="why-choose">
                  <WhyChoose isSidebarCollapsed={isSidebarCollapsed} />
                </div>
              </Suspense>
            </IntersectionObserverWrapper>
            <IntersectionObserverWrapper>
              <Suspense fallback={<div className="h-32 bg-gray-100 animate-pulse"></div>}>
                <div id="contact" data-section="contact">
                  <Contact isSidebarCollapsed={isSidebarCollapsed} />
                </div>
              </Suspense>
            </IntersectionObserverWrapper>
            <IntersectionObserverWrapper>
              <Suspense fallback={<div className="h-32 bg-gray-100 animate-pulse"></div>}>
                <div id="faqs" data-section="faqs">
                  <FAQs isSidebarCollapsed={isSidebarCollapsed} />
                </div>
              </Suspense>
            </IntersectionObserverWrapper>
            <IntersectionObserverWrapper>
              <Suspense fallback={<div className="h-32 bg-gray-100 animate-pulse"></div>}>
                <div id="footer" data-section="footer">
                  <Footer isSidebarCollapsed={isSidebarCollapsed} />
                </div>
              </Suspense>
            </IntersectionObserverWrapper>
          </main>
        </div>
      </>
  );
};

export default AppContent;
