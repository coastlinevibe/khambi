import React, { useState, useEffect } from 'react';
import { Phone, Mail, ChevronLeft, ChevronRight, Home, Settings, HelpCircle, MessageSquare, Users, Package, Calendar, BookOpen, Globe, Star, Shield } from 'lucide-react';
import { useTheme } from './src/contexts/ThemeContext';

interface HeaderProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onNavigate: (section: string) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  isFooterInView: boolean;
}

const Header: React.FC<HeaderProps> = ({ activeSection, setActiveSection, onNavigate, isSidebarCollapsed, setIsSidebarCollapsed, isFooterInView: _isFooterInView }) => {
  const { isDark } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
    };

    window.addEventListener('resize', handleResize);
  }, []);

  // Removed legacy typewriter effect and related state

  const navItems = [
    { id: 'hero', label: 'Home', icon: Home },
    { id: 'tools-tabs', label: 'Services', icon: Package },
    { id: 'gift-ai', label: 'Talk to Gift AI', icon: MessageSquare },
    { id: 'obituaries', label: 'Obituaries', icon: BookOpen },
    { id: 'how-it-works', label: 'The Process', icon: Settings },
    { id: 'feedback', label: 'Reviews', icon: Star },
    { id: 'why-choose', label: 'Why Choose Us', icon: Users },
    { id: 'contact', label: 'Contact us', icon: Phone },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // No animations or dynamic behavior for hotline per request

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:fixed lg:left-0 lg:top-0 lg:h-full lg:shadow-xl lg:z-40 lg:flex lg:flex-col transition-all duration-700 ease-in-out ${
        isSidebarCollapsed ? 'w-24' : 'w-64'
      } ${isDark ? 'bg-gray-900' : 'bg-white'}`}
      style={{
        transition: 'width 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94), background-color 0.3s ease'
      }}>
        {/* Sidebar Toggle Button */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className={`absolute -right-4 top-8 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg hover:shadow-xl transform hover:scale-110 ${
            isDark 
              ? 'bg-gray-800 border border-gray-600 hover:bg-gray-700' 
              : 'bg-white border border-gray-200 hover:bg-gray-50'
          }`}
          style={{
            transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
        >
          {isSidebarCollapsed ? (
            <ChevronRight className={`w-4 h-4 ${
              isDark ? 'text-white' : 'text-gray-600'
            }`} />
          ) : (
            <ChevronLeft className={`w-4 h-4 ${
              isDark ? 'text-white' : 'text-gray-600'
            }`} />
          )}
        </button>
        
        <div className={`px-6 pt-4 pb-2 transition-all duration-700 ease-in-out ${
          isDark ? 'border-b border-gray-700' : 'border-b border-gray-200'
        }`}
        style={{
          transition: 'all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }}>
          <div 
          className="flex items-center justify-center h-16 w-full"
          style={{
            transition: 'all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }}>
            <a
              href="#hero"
              onClick={(e) => { e.preventDefault(); onNavigate('hero'); }}
              aria-label="Go to Home"
              className="relative w-48 h-16 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-ubuntugift-primary rounded-lg cursor-pointer"
            >
              <div className={`absolute inset-0 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ${isDark ? 'bg-gray-900 border-2 border-gray-700' : 'bg-white border-2 border-ubuntugift-primary'}`}>
                <div className="absolute inset-0 flex items-center justify-center p-1">
                  <img 
                    src="/assets/images/Logo.jpg" 
                    alt="Day 1 Health Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </a>
          </div>
        </div>
        
        <nav className="p-6 pb-2">
          <ul className="space-y-1">
            {navItems.map((item) => {
              // Direct matching - each button highlights only when its exact ID matches
              const isActive = _isFooterInView ? (item.id === 'footer') : (activeSection === item.id);
              
              const baseClasses = `w-full flex items-center rounded-lg transition-all duration-500 ease-in-out group relative transform ${
                isSidebarCollapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3 justify-start space-x-3'
              } ${
                isActive
                  ? 'bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 text-white shadow-xl scale-105 shadow-orange-500/25'
                  : isDark
                    ? 'text-gray-300 hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-700 hover:text-white hover:shadow-lg hover:scale-102'
                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900 hover:shadow-lg hover:scale-102'
              }`;
              if (item.id === 'footer') {
                return (
                  <li key={item.id}>
                    <a
                      href="#footer"
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate('footer');
                      }}
                      className={baseClasses}
                      style={{
                        transition: '0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                      }}
                    >
                      <item.icon className={`transition-all duration-500 ease-in-out transform w-5 h-5 ${
                        isActive ? 'text-white' : 'group-hover:scale-110'
                      }`} />
                      {!isSidebarCollapsed && (
                        <span className="font-medium text-sm transition-all duration-500 ease-in-out">
                          {item.label}
                        </span>
                      )}
                    </a>
                  </li>
                );
              }
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      // SET ACTIVE SECTION ON CLICK - NO SCROLL TRACKING
                      setActiveSection(item.id);
                      
                      if (item.id === 'gift-ai') {
                        // For Gift AI, scroll to section and click the AI tab
                        const section = document.querySelector('[data-gift-ai-section]');
                        if (section) {
                          section.scrollIntoView({ behavior: 'smooth' });
                        }
                        setTimeout(() => {
                          const aiTab = document.querySelector('[data-tab-id="ai"]') as HTMLElement;
                          if (aiTab) {
                            aiTab.click();
                          }
                        }, 300);
                      } else if (item.id === 'tools-tabs') {
                        // For Services, scroll to section and click Packages tab
                        const section = document.querySelector('[data-services-section]');
                        if (section) {
                          section.scrollIntoView({ behavior: 'smooth' });
                        }
                        setTimeout(() => {
                          const packagesTab = document.querySelector('[data-tab-id="daytoday"]') as HTMLElement;
                          if (packagesTab) {
                            packagesTab.click();
                          }
                        }, 300);
                      } else {
                        onNavigate(item.id);
                      }
                    }}
                    className={baseClasses}
                    style={{
                      transition: '0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                    }}
                  >
                    <item.icon className={`transition-all duration-500 ease-in-out transform w-5 h-5 ${
                      isActive ? 'text-white' : 'group-hover:scale-110'
                    }`} />
                    {!isSidebarCollapsed && (
                      <span className="font-medium text-sm transition-all duration-500 ease-in-out">
                        {item.label}
                      </span>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Quick Actions */}
        <div className={`${isSidebarCollapsed ? 'px-0' : 'px-6'} pt-1 pb-2 transition-all duration-700 ease-in-out`}>
          {!isSidebarCollapsed && (
            <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Quick Actions
            </h4>
          )}
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm ${isSidebarCollapsed ? 'p-2' : 'p-3'}`}>
            <div className={`flex ${isSidebarCollapsed ? 'flex-col gap-1' : 'flex-row gap-2'} w-full`}>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  // Scroll to Gift AI section
                  const section = document.querySelector('[data-gift-ai-section]');
                  if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                  }
                  // Then click the Gift AI tab after a delay
                  setTimeout(() => {
                    const aiTab = document.querySelector('[data-tab-id="ai"]') as HTMLElement;
                    if (aiTab) {
                      aiTab.click();
                    }
                  }, 300);
                }}
                aria-label="Talk to Gift AI"
                className={`rounded-lg text-sm font-medium transition-colors border ${
                  isDark
                    ? 'border-gray-600 text-gray-200 hover:bg-gray-700'
                    : 'border-gray-300 text-gray-800 hover:bg-gray-50'
                } ${isSidebarCollapsed ? 'w-10 h-10 flex items-center justify-center mx-auto px-0' : 'w-full px-3 py-2'}`}
              >
                {isSidebarCollapsed ? (
                  <MessageSquare className={`w-5 h-5 shrink-0 ${isDark ? 'text-gray-200' : 'text-gray-900'}`} />
                ) : (
                  'Gift AI'
                )}
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  window.dispatchEvent(new Event('openCallModal'));
                }}
                aria-label="Call UbuntuGift"
                className={`rounded-lg text-sm font-medium transition-colors ${
                  isDark
                    ? 'bg-ubuntugift-primary text-ubuntugift-light hover:bg-ubuntugift-secondary'
                    : 'bg-ubuntugift-primary text-ubuntugift-light hover:bg-ubuntugift-secondary'
                } ${isSidebarCollapsed ? 'w-10 h-10 flex items-center justify-center mx-auto px-0' : 'w-full px-3 py-2'} text-center`}
              >
                {isSidebarCollapsed ? (
                  <Phone className="w-5 h-5 shrink-0 text-white" />
                ) : (
                  'Call Now'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Contact Information - Always visible */}
        <div className={`p-6 mt-auto transition-all duration-300 ${
          isDark 
            ? 'border-t border-gray-700 bg-gradient-to-b from-gray-800 to-gray-900' 
            : 'border-t border-gray-200 bg-gradient-to-b from-gray-50 to-gray-100'
        }`}>
          {!isSidebarCollapsed && (
            <h4 className={`font-medium mb-4 text-sm uppercase tracking-wide ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>Contact Info</h4>
          )}
          <div className={`space-y-3 ${
            isSidebarCollapsed ? 'flex flex-col items-center' : ''
          }`}>
            <div className={`flex items-center transition-all duration-300 ${
              isSidebarCollapsed ? 'justify-center' : 'space-x-3'
            }`}>
              <div className={`p-2 rounded-lg ${
                isDark ? 'bg-ubuntugift-primary' : 'bg-ubuntugift-light'
              }`}>
                <Phone className={`w-4 h-4 ${
                  isDark ? 'text-ubuntugift-light' : 'text-ubuntugift-primary'
                }`} />
              </div>
              {!isSidebarCollapsed && (
                <div className="flex flex-col">
                  <span className={`text-sm font-medium ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>0860 111 222</span>
                  <span className={`text-xs ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>24/7 Support Line</span>
                </div>
              )}
            </div>
            <div className={`flex items-center transition-all duration-300 ${
              isSidebarCollapsed ? 'justify-center' : 'space-x-3'
            }`}>
              <div className={`p-2 rounded-lg ${
                isDark ? 'bg-ubuntugift-primary' : 'bg-ubuntugift-light'
              }`}>
                <Mail className={`w-4 h-4 ${
                  isDark ? 'text-ubuntugift-light' : 'text-ubuntugift-primary'
                }`} />
              </div>
              {!isSidebarCollapsed && (
                <div className="flex flex-col">
                  <span className={`text-sm font-medium ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>admin@giftai.co.za</span>
                  <span className={`text-xs ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>Email us anytime</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 dark:bg-gray-900/95 dark:border-gray-800">
        <div className="flex items-center justify-around px-2 py-2">
          {[
            { id: 'hero', label: 'Home', icon: Home },
            { id: 'tools-tabs', label: 'Services', icon: Package },
            { id: 'gift-ai', label: 'Gift AI', icon: MessageSquare },
            { id: 'contact', label: 'Support', icon: Phone }
          ].map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 min-w-0 ${
                  isActive
                    ? 'text-white bg-ubuntugift-primary'
                    : 'text-gray-700 dark:text-gray-300 hover:text-ubuntugift-primary hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <item.icon className={`w-6 h-6 mb-1 transition-transform duration-200 ${
                  isActive ? 'scale-110 text-white' : 'text-gray-700 dark:text-gray-300'
                }`} />
                <span className={`text-xs font-medium transition-colors duration-200 ${
                  isActive ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Header;