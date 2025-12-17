import { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { usePerformanceMonitor, useDeviceCapabilities } from './hooks/usePerformanceMonitor';
import LoadingSkeleton from './components/ui/loading-skeleton';
import { Toaster } from 'react-hot-toast';

// Lazy load components for better performance
const AppContent = lazy(() => import('./components/AppContent'));
const PlanDetailPage = lazy(() => import('./components/PlanDetailPage'));
const HospitalPlanDetailPage = lazy(() => import('./components/HospitalPlanDetailPage'));
const ComprehensivePlanDetailPage = lazy(() => import('./components/ComprehensivePlanDetailPage'));
const SeniorPlanDetailPage = lazy(() => import('./components/SeniorPlanDetailPage'));
const RegulatoryInformationPage = lazy(() => import('./components/RegulatoryInformationPage'));
const JuniorExecutivePlanDetailPage = lazy(() => import('./components/JuniorExecutivePlanDetailPage'));
const ProceduresPage = lazy(() => import('./components/ProceduresPage'));
const CasketsPage = lazy(() => import('./components/CasketsPage'));
const AdminLogin = lazy(() => import('./components/AdminLogin'));
const LoginPage = lazy(() => import('./components/LoginPage'));
const AuthDebug = lazy(() => import('./components/AuthDebug'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const AdminOnboarding = lazy(() => import('./components/AdminOnboarding'));
const NotFoundPage = lazy(() => import('./components/NotFoundPage'));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'));
import ProtectedRoute from './components/ProtectedRoute';
import { ThemeProvider } from './contexts/ThemeContext';

function CasketsPageWrapper() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <CasketsPage
      isSidebarCollapsed={isSidebarCollapsed}
      setIsSidebarCollapsed={setIsSidebarCollapsed}
    />
  );
}

function PrivacyPolicyWrapper() {
  const [isSidebarCollapsed] = useState(false);

  return (
    <PrivacyPolicy
      isSidebarCollapsed={isSidebarCollapsed}
    />
  );
}

function AppWrapper() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isFooterInView, setIsFooterInView] = useState(false);
  const location = useLocation();
  
  // Performance monitoring
  const { getMetrics } = usePerformanceMonitor(process.env.NODE_ENV === 'development');
  const { isLowEndDevice, shouldReduceAnimations } = useDeviceCapabilities();
  
  // Log performance metrics in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const logMetrics = () => {
        const metrics = getMetrics();
        console.log('Performance Metrics:', metrics);
      };
      
      const interval = setInterval(logMetrics, 10000); // Log every 10 seconds
      return () => clearInterval(interval);
    }
  }, [getMetrics]);

  // Get slide number from route
  const getSlideFromRoute = () => {
    const path = location.pathname;
    // Handle explicit slide paths
    if (path === '/slide-1') return 0;
    if (path === '/slide-2') return 1;
    if (path === '/slide-3') return 2;
    if (path === '/slide-4') return 3;
    // Handle dynamic /slide-:num pattern
    const match = path.match(/^\/slide-(\d+)$/);
    if (match) {
      const n = parseInt(match[1], 10);
      // Map slide-1..4 to indexes 0..3
      if (n >= 1 && n <= 4) return n - 1;
    }
    return null; // Main route
  };

  const specificSlide = getSlideFromRoute();

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    // Special case for footer: scroll all the way down
    if (sectionId === 'footer') {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
      return;
    }
    // Special case for home/hero section
    if (sectionId === 'hero') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      // For heading elements, scroll with some offset to position them better
      const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
      const offset = 60; // Adjust this value to move screen up/down
      window.scrollTo({
        top: elementTop - offset,
        behavior: 'smooth'
      });
    }
  };

  // Handle hash navigation when coming from blog
  useEffect(() => {
    const handleNavigation = () => {
      // First check URL hash
      const hash = window.location.hash.substring(1);
      if (hash) {
        if (hash === 'footer') {
          setTimeout(() => {
            window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
          }, 100);
          return;
        } else {
          const element = document.getElementById(hash);
          if (element) {
            setTimeout(() => {
              const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
              const offset = 60; // keep header clearance
              window.scrollTo({ top: elementTop - offset, behavior: 'smooth' });
            }, 100);
            return;
          }
        }
      }

      // Then check session storage for navigation from blog
      const storedSection = sessionStorage.getItem('navigatingToSection');
      if (storedSection) {
        // Clear the stored section
        sessionStorage.removeItem('navigatingToSection');
        // Scroll to the section after a short delay to ensure the page is loaded
        setTimeout(() => {
          const element = document.getElementById(storedSection);
          if (element) {
            const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
            const offset = 60; // keep header clearance
            window.scrollTo({ top: elementTop - offset, behavior: 'smooth' });
          }
        }, 300);
      }
    };

    // Initial check
    handleNavigation();

    // Also handle hash changes
    window.addEventListener('hashchange', handleNavigation);
    
    return () => {
      window.removeEventListener('hashchange', handleNavigation);
    };
  }, []);

  // Track active section and footer visibility based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'tools-tabs', 'obituaries', 'how-it-works', 'feedback', 'why-choose', 'contact', 'faqs'];
      const scrollPosition = window.scrollY + 100; // Reduced offset for better accuracy
      
      // Check if footer is in view
      const footer = document.getElementById('footer');
      if (footer) {
        const footerTop = footer.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        setIsFooterInView(footerTop < windowHeight * 0.8);
      }

      // Special case for hero section
      const heroSection = document.getElementById('hero');
      if (heroSection) {
        const heroRect = heroSection.getBoundingClientRect();
        if (heroRect.top <= 150 && heroRect.bottom >= window.innerHeight / 2) {
          setActiveSection('hero');
          return;
        }
      }

      // Update active section for other sections
      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i] === 'hero') continue; // Skip hero as we handle it above
        
        const element = document.getElementById(sections[i]);
        if (element) {
          // Try to get the parent section element, or use the element itself
          const section = element.closest('section') || element;
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;
          const sectionBottom = sectionTop + sectionHeight;
          
          // If scroll position is within this section's boundaries
          if (scrollPosition >= sectionTop - 200 && scrollPosition < sectionBottom - 200) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AppContent
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      isSidebarCollapsed={isSidebarCollapsed}
      setIsSidebarCollapsed={setIsSidebarCollapsed}
      isFooterInView={isFooterInView}
      scrollToSection={scrollToSection}
      specificSlide={specificSlide}
    />
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid #B8935E',
          },
          success: {
            iconTheme: {
              primary: '#B8935E',
              secondary: '#fff',
            },
          },
        }}
      />
      <Suspense fallback={<LoadingSkeleton />}>
        <Routes>
          <Route path="/" element={<AppWrapper />} />
          <Route path="/slide-1" element={<AppWrapper />} />
          <Route path="/slide-2" element={<AppWrapper />} />
          <Route path="/slide-3" element={<AppWrapper />} />
          <Route path="/slide-4" element={<AppWrapper />} />
          <Route path="/slide-:num" element={<AppWrapper />} />
          <Route path="/plans/day-to-day" element={<PlanDetailPage />} />
          <Route path="/plans/hospital" element={<HospitalPlanDetailPage />} />
          <Route path="/plans/comprehensive" element={<ComprehensivePlanDetailPage />} />
          <Route path="/plans/senior-plan" element={<SeniorPlanDetailPage />} />
          <Route path="/plans/junior-executive" element={<JuniorExecutivePlanDetailPage />} />
          <Route path="/regulatory-information" element={<RegulatoryInformationPage />} />
          <Route path="/procedures" element={<ProceduresPage />} />
          <Route path="/caskets" element={<CasketsPageWrapper />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth-debug" element={<AuthDebug />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute requireManager>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/admin/onboarding" element={<AdminOnboarding />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyWrapper />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </ThemeProvider>
  );
}