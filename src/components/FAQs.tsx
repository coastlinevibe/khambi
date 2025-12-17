import React, { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

interface FAQsProps {
  isSidebarCollapsed: boolean;
}

const FAQs: React.FC<FAQsProps> = ({ isSidebarCollapsed }) => {
  // Support opening multiple and a global open/close all toggle
  const [expandedAll, setExpandedAll] = useState(false);
  const [openSet, setOpenSet] = useState<Set<number>>(new Set());
  const [showFaqs, setShowFaqs] = useState(false);
  const { isDark } = useTheme();

  // Selected 8 most relevant FAQs from the list provided by the user
  const faqs = [
    {
      question: "What services does Khambi Funeral Services provide?",
      answer: "We offer comprehensive funeral services including traditional ceremonies, modern memorials, casket selection (flat lid, face-view, and half-view), transportation with hearse and family cars, graveside decor, bereavement counseling, late estate services, and repatriation."
    },
    {
      question: "What funeral packages do you offer?",
      answer: "We offer three packages: Bronze (R15,000 cover) with flat lid coffin, Silver (R20,000 cover) with face-view casket and coffin spray, and Gold (R25,000 cover) with half-view casket, funeral programs, and VIP facilities. All packages include essential services like transportation, chairs, ox liver, and bereavement counseling."
    },
    {
      question: "Do you serve all cultural and religious traditions?",
      answer: "Yes, we honor all cultural and religious traditions across Gauteng province. Our team includes cultural specialists who understand and respect diverse customs, from traditional African ceremonies to various religious observances."
    },
    {
      question: "Can I pre-plan my funeral arrangements?",
      answer: "Absolutely. Pre-planning gives you peace of mind and allows you to make decisions according to your wishes. We offer consultation services to help you plan ahead and relieve your family of this burden during difficult times."
    },
    {
      question: "What if I need services outside regular hours?",
      answer: "Our compassionate team is available 24/7 for emergencies at 084 583 7299. We understand that loss can happen at any time and we're here to support families whenever they need us, including weekends and holidays."
    },
    {
      question: "What's included in the Bronze package?",
      answer: "The Bronze package (R15,000 cover) includes: Flat Lid Coffin, Hearse + 1 Family Car, 50 Chairs & Standard Toilet, 10KG Ox Liver, Graveside Decor, Bereavement Counseling, Late Estate (Will), and Repatriation services."
    },
    {
      question: "Can I customize the ceremony according to our traditions?",
      answer: "Absolutely. We work closely with families to create personalized ceremonies that reflect your loved one's life, values, and cultural heritage. From music selections to traditional rituals, we honor your unique wishes."
    },
    {
      question: "How can I contact Khambi Funeral Services?",
      answer: "You can reach us at 012 820 1084 (main line), 084 583 7299 (mobile/24-7 emergency), email us at khambi@khambifunerals.co.za, or visit our website at www.khambifunerals.com. We're based in Gauteng and serve families throughout the province."
    }
  ];

  const allOpen = useMemo(() => expandedAll || openSet.size === faqs.length, [expandedAll, openSet, faqs.length]);

  const toggleAll = () => {
    if (allOpen) {
      setExpandedAll(false);
      setOpenSet(new Set());
    } else {
      setExpandedAll(true);
      setOpenSet(new Set(faqs.map((_, i) => i)));
    }
  };

  return (
    <section 
      className={`py-20 transition-all duration-700 ease-in-out border-b scroll-mt-32 ${
        isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className={`inline-block px-6 py-3 rounded-xl mb-6 ${
            isDark 
              ? 'bg-khambi-accent/20' 
              : 'bg-khambi-accent/10'
          }`} style={{ borderColor: '#B8935E', borderWidth: '1px' }}>
            <span className={`text-2xl font-bold ${
              isDark 
                ? 'text-khambi-accent' 
                : 'text-khambi-primary'
            }`}>
              Common Questions
            </span>
          </div>
          <h2 id="faqs" className={`text-4xl lg:text-5xl font-bold mb-6 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center gap-3 mb-8 w-full mt-[26px]">
            <button
              onClick={() => setShowFaqs(v => !v)}
              className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-colors flex items-center gap-2 ${
                isDark
                  ? 'bg-khambi-accent/20 text-khambi-accent hover:bg-khambi-accent/30 border-khambi-accent'
                  : 'bg-khambi-accent/10 text-khambi-primary hover:bg-khambi-accent/20 border-khambi-accent'
              }`}
            >
              {showFaqs ? 'Hide FAQs' : 'Show Frequently Asked Questions'}
              <ChevronDown className={`w-6 h-6 flex-shrink-0 transition-transform duration-300 ${
                showFaqs ? 'rotate-180' : ''
              } ${
                isDark ? 'text-khambi-accent' : 'text-khambi-primary'
              }`} />
            </button>
            {showFaqs && (
              <button
                onClick={toggleAll}
                className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-colors ${
                  isDark
                    ? 'bg-gray-800 text-gray-200 hover:bg-gray-700 border-gray-700'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-300'
                }`}
              >
                {allOpen ? 'Collapse all' : 'Expand all'}
              </button>
            )}
          </div>
          {showFaqs && faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`mb-4 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 ${
                isDark ? 'bg-gray-800' : 'bg-gray-50'
              }`}
              whileHover={{ 
                scale: 1.02,
                boxShadow: isDark 
                  ? '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1)'
                  : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
              }}
              
            >
              <motion.button
                className={`w-full px-8 py-6 text-left flex items-center justify-between transition-colors duration-200 ${
                  isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
                onClick={() => {
                  // If previously in expand-all mode, switch to manual and toggle this item
                  setExpandedAll(false);
                  setOpenSet(prev => {
                    const next = new Set(prev);
                    if (next.has(index)) next.delete(index); else next.add(index);
                    return next;
                  });
                }}
                whileTap={{ scale: 0.98 }}
              >
                <h3 className={`text-lg font-semibold pr-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>{faq.question}</h3>
                <motion.div
                  animate={{ rotate: (expandedAll || openSet.has(index)) ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <ChevronDown className={`w-6 h-6 flex-shrink-0 ${
                    isDark ? 'text-gray-400' : 'text-gray-400'
                  }`} />
                </motion.div>
              </motion.button>
              
              <AnimatePresence>
                {(expandedAll || openSet.has(index)) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ 
                      duration: 0.4,
                      ease: [0.04, 0.62, 0.23, 0.98]
                    }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-6">
                      <motion.div 
                        className={`w-full h-px mb-6 ${
                          isDark ? 'bg-gray-600' : 'bg-gray-200'
                        }`}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      ></motion.div>
                      <motion.p 
                        className={`leading-relaxed ${
                          isDark ? 'text-gray-300' : 'text-gray-600'
                        }`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                      >
                        {faq.answer}
                      </motion.p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center">
          <div className={`rounded-2xl p-8 max-w-2xl mx-auto ${
            isDark ? 'bg-ubuntugift-secondary/30' : 'bg-ubuntugift-light'
          }`}>
            <h3 className={`text-2xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Still Have Questions?
            </h3>
            <p className={`mb-6 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Our friendly consultants are available to help you understand your options and find the right plan for your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  window.dispatchEvent(new Event('openCallModal'));
                }}
                aria-label="Call Khambi Funerals"
                className="bg-khambi-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-khambi-darkgray transition-colors text-center"
              >
                Call 012 820 1084
              </button>
              <button
                onClick={() => {
                  // Scroll to contact section and open Prospective modal
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  // Support both immediate event and delayed open via sessionStorage (in case of navigation)
                  try { sessionStorage.setItem('openProspective', '1'); } catch {}
                  window.dispatchEvent(new Event('openProspective'));
                }}
                className={`border-2 px-6 py-3 rounded-xl font-semibold transition-colors ${
                  isDark 
                    ? 'border-khambi-accent text-khambi-accent hover:bg-khambi-accent hover:text-black' 
                    : 'border-khambi-primary text-khambi-primary hover:bg-khambi-primary hover:text-white'
                }`}
              >
                Email Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQs;