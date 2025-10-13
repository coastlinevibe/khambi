import React, { useState, useEffect } from 'react';
import { Phone, Mail, ChevronLeft, ChevronRight, Home, Settings, HelpCircle, MessageSquare, Users, Package, BookOpen, Star, Menu, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onNavigate: (section: string) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  isFooterInView: boolean;
}

const Header: React.FC<HeaderProps> = ({
  activeSection,
  onNavigate,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  isFooterInView: _isFooterInView
}) => {
  const { isDark } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Removed legacy typewriter effect and related state
  const navItems = [
    { id: 'hero', label: 'Home', icon: Home },
    { id: 'tools-tabs', label: 'Services', icon: Package },
    { id: 'obituaries', label: 'Obituaries', icon: BookOpen },
    { id: 'how-it-works', label: 'The Process', icon: Settings },
    { id: 'feedback', label: 'Reviews', icon: Star },
    { id: 'why-choose', label: 'Why Choose Us', icon: Users },
    { id: 'contact', label: 'Contact us', icon: Phone },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
  ];

  // No animations or dynamic behavior for hotline per request
  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out hidden md:block ${
          isSidebarCollapsed ? 'w-24' : 'w-64'
        } ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-r`}
      >
        {/* Sidebar Header */}
        <div className={`flex h-16 shrink-0 items-center border-b ${isSidebarCollapsed ? 'justify-center px-2' : 'px-4'} ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10 ${isDark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}
            aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
          {!isSidebarCollapsed && (
            <div className="ml-4 flex flex-col">
              <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>GiftAi</span>
              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Funeral Services</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className={`flex flex-col gap-2 p-4 ${isSidebarCollapsed ? 'px-2 items-center' : ''}`}>
          <ul className={`space-y-1 ${isSidebarCollapsed ? 'w-full flex flex-col items-center' : ''}`}>
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              const baseClasses = `group flex items-center rounded-lg ${isSidebarCollapsed ? 'justify-center w-12 h-12' : 'px-3 py-2'} text-sm font-medium transition-all duration-200 ${
                isActive
                  ? `text-white ${isDark ? 'bg-ubuntugift-primary' : 'bg-ubuntugift-primary'}`
                  : `hover:bg-gray-100 ${isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`
              }`;

              return (
                <li key={item.id} className={isSidebarCollapsed ? 'flex justify-center' : ''}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      if (item.id === 'tools-tabs') {
                        // Scroll to tools section
                        const section = document.querySelector('[data-section="tools-tabs"]');
                        if (section) {
                          section.scrollIntoView({ behavior: 'smooth' });
                        }
                        // Then click the packages tab after a delay
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
                      <span className="font-medium text-sm transition-all duration-500 ease-in-out ml-3">
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
        <div className={`${isSidebarCollapsed ? 'px-2 flex justify-center' : 'px-6'} pt-1 pb-2 transition-all duration-700 ease-in-out`}>
          {!isSidebarCollapsed && (
            <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Quick Actions</h4>
          )}
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm ${isSidebarCollapsed ? 'p-2' : 'p-3'}`}>
            <div className={`flex flex-col gap-2 w-full`}>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  // Scroll to tools section where Gift AI is located
                  const toolsSection = document.getElementById('tools-tabs');
                  if (toolsSection) {
                    toolsSection.scrollIntoView({ behavior: 'smooth' });
                  }
                  // Navigate to gift-ai section
                  onNavigate('gift-ai');
                  // Try to trigger AI chat after a delay
                  setTimeout(() => {
                    // Try multiple selectors for the AI chat trigger
                    const aiButton = document.querySelector('[data-tab-id="ai"]') ||
                                   document.querySelector('.gift-ai-tab') ||
                                   document.querySelector('button[aria-label*="Gift AI" i]') ||
                                   document.querySelector('button[aria-label*="AI" i]');
                    if (aiButton) {
                      (aiButton as HTMLElement).click();
                    } else {
                      // Fallback: dispatch custom event for AI chat
                      window.dispatchEvent(new CustomEvent('openGiftAI'));
                    }
                  }, 500);
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
                  <div className="tooltip-container">
                    <span className="tooltip">Talk Now</span>
                    <span className="text">Gift AI</span>
                  </div>
                )}
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  window.dispatchEvent(new Event('openCallModal'));
                }}
                aria-label="Call GiftAi"
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
          <div className={`space-y-3 ${isSidebarCollapsed ? 'flex flex-col items-center' : ''}`}>
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

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 dark:bg-gray-900/95 dark:border-gray-800">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <div className="flex flex-col">
            <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-orange-600'}`}>GiftAi</span>
            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Funeral Services</span>
          </div>

          {/* Hamburger Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-orange-100 text-orange-600'
            }`}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className={`absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200 dark:bg-gray-900/95 dark:border-gray-800 shadow-lg`}>
            <nav className="px-4 py-4">
              <ul className="space-y-2">
                {navItems.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          if (item.id === 'tools-tabs') {
                            // Scroll to tools section
                            const section = document.querySelector('[data-section="tools-tabs"]');
                            if (section) {
                              section.scrollIntoView({ behavior: 'smooth' });
                            }
                            // Then click the packages tab after a delay
                            setTimeout(() => {
                              const packagesTab = document.querySelector('[data-tab-id="daytoday"]') as HTMLElement;
                              if (packagesTab) {
                                packagesTab.click();
                              }
                            }, 300);
                          } else {
                            onNavigate(item.id);
                          }
                          setIsMobileMenuOpen(false); // Close menu after navigation
                        }}
                        className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                          isActive
                            ? `text-white ${isDark ? 'bg-ubuntugift-primary' : 'bg-ubuntugift-primary'}`
                            : `${isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-white hover:bg-transparent'}`
                        }`}
                      >
                        <item.icon className="w-5 h-5 mr-3" />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        )}
      </header>

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
                onClick={() => {
                  if (item.id === 'gift-ai') {
                    // Navigate to tools section where Gift AI is located
                    const toolsSection = document.getElementById('tools-tabs');
                    if (toolsSection) {
                      toolsSection.scrollIntoView({ behavior: 'smooth' });
                    }
                    // Navigate to gift-ai section
                    onNavigate('gift-ai');
                    // Try to trigger AI chat after a delay
                    setTimeout(() => {
                      // Try multiple selectors for the AI chat trigger
                      const aiButton = document.querySelector('[data-tab-id="ai"]') ||
                                     document.querySelector('.gift-ai-tab') ||
                                     document.querySelector('button[aria-label*="Gift AI" i]');
                      if (aiButton) {
                        (aiButton as HTMLElement).click();
                        // After clicking the AI tab, wait and click "Talk with Gift"
                        setTimeout(() => {
                          const talkButton = document.querySelector('button:has(.lucide-mail)') ||
                                           document.querySelector('button:has([d*="M21.75"])') ||
                                           document.querySelector('button:contains("Talk with Gift")') ||
                                           Array.from(document.querySelectorAll('button')).find(btn => 
                                             btn.textContent?.includes('Talk with Gift')
                                           );
                          if (talkButton) {
                            (talkButton as HTMLElement).click();
                          }
                        }, 300);
                      }
                    }, 500);
                  } else {
                    onNavigate(item.id);
                  }
                }}
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
