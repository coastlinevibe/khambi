import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ShieldCheck, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { AnimatedPaymentButton } from './ui/animated-payment-button';
import { AnimatedContactButton } from './ui/animated-contact-button';
import { RollingNumber } from './ui/rolling-number';
import Header from './Header';
import Footer from './Footer';
import { useTheme } from '../contexts/ThemeContext';
import { DownloadHeroButton } from './ui/download-hero-button';
import MemberSignUpForm from './MemberSignUpForm';

const coverItems = [
  'Lorem ipsum dolor',
  'Sed do eiusmod',
  'Tempor incididunt',
];


const descriptionItems: { title: string; text: string }[] = [
  {
    title: 'Lorem Ipsum Dolor',
    text:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    title: 'Sed Do Eiusmod',
    text:
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
  {
    title: 'Tempor Incididunt',
    text:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  },
  {
    title: 'Ut Labore Et',
    text:
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
  {
    title: 'Dolore Magna',
    text:
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
  },
];

const legalCopy = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

const PlanDetailPage: React.FC = () => {
  const { isDark } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [option, setOption] = useState('');
  const [childCount, setChildCount] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const variantParam = (searchParams.get('variant') || 'single').toLowerCase();
  const variantDisplay = variantParam === 'couple' || variantParam === 'couples' ? 'Family Members Plan' : variantParam === 'family' ? 'Extended Family Members Plan' : 'Single Member Plan';
  const pageTitle = variantDisplay;
  // Expanded state for Related products cards
  type CardKey = 'single' | 'couple' | 'family';
  const [expanded, setExpanded] = useState<Record<CardKey, boolean>>({
    single: false,
    couple: false,
    family: false,
  });
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const toggleExpanded = (key: CardKey) =>
    setExpanded((prev) => {
      const willOpen = !prev[key];
      return {
        single: false,
        couple: false,
        family: false,
        [key]: willOpen,
      } as Record<CardKey, boolean>;
    });
  // Pagination for description list
  const pageSize = 4;
  const [page, setPage] = useState(0);
  const pageCount = Math.ceil(descriptionItems.length / pageSize);
  const pagedItems = descriptionItems.slice(page * pageSize, page * pageSize + pageSize);
  
  // Scroll to top when this page loads (e.g., after clicking "Choose Plan")
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Handle sidebar navigation (mirror BlogPage behavior)
  const handleNavigate = (section: string) => {
    const targetSection = section === 'home' ? 'hero' : section;
    // Persist target for main app to pick up and scroll
    sessionStorage.setItem('navigatingToSection', targetSection);
    // Redirect to main site with hash
    window.location.href = `/#${targetSection}`;
    // Ensure top scroll during transition
    window.scrollTo(0, 0);
  };

  // Initialize selected option based on URL variant
  useEffect(() => {
    const initial = (variantParam === 'couple' || variantParam === 'couples')
      ? 'couple'
      : (variantParam === 'family' ? 'family' : 'single');
    setOption(initial);
  }, [variantParam]);

  // Initialize child count from query param for family and single
  useEffect(() => {
    const raw = searchParams.get('children');
    const parsed = raw ? parseInt(raw, 10) : NaN;
    if (variantParam === 'family') {
      const clamped = Math.max(1, Math.min(4, isNaN(parsed) ? 1 : parsed));
      setChildCount(clamped);
    } else if (variantParam === 'single') {
      const clamped = Math.max(0, Math.min(4, isNaN(parsed) ? 0 : parsed));
      setChildCount(clamped);
    } else {
      setChildCount(0);
    }
  }, [variantParam, searchParams]);

  // Quantity is fixed at 1 for non-family variants; no qty URL handling

  // Pricing rules
  const SINGLE_PRICE = 385;
  const COUPLE_PRICE = 674;
  const FAMILY_CHILD_PRICE = 193;
  const [currentPrice, setCurrentPrice] = useState(() => {
    const v = (option || (variantParam === 'couples' ? 'couple' : variantParam)) as 'single' | 'couple' | 'family';
    if (v === 'family') return FAMILY_CHILD_PRICE * childCount;
    if (v === 'couple') return COUPLE_PRICE;
    // single: base + per-child
    return SINGLE_PRICE + FAMILY_CHILD_PRICE * childCount;
  });

  useEffect(() => {
    const v = (option || (variantParam === 'couples' ? 'couple' : variantParam)) as 'single' | 'couple' | 'family';
    let next = SINGLE_PRICE + FAMILY_CHILD_PRICE * childCount;
    if (v === 'family') next = FAMILY_CHILD_PRICE * childCount;
    else if (v === 'couple') next = COUPLE_PRICE;
    setCurrentPrice(next);
  }, [childCount, option, variantParam]);

  // Helper to keep URL in sync with selections
  const updateUrl = (nextVariant: string, nextChildren?: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('variant', nextVariant);
    if (nextVariant === 'family') {
      const c = Math.max(1, Math.min(4, nextChildren ?? childCount));
      params.set('children', String(c));
    } else if (nextVariant === 'single') {
      const c = Math.max(0, Math.min(4, nextChildren ?? childCount));
      params.set('children', String(c));
    } else {
      params.delete('children');
    }
    // Always remove qty for Single/Couple to enforce a fixed quantity of 1
    params.delete('qty');
    setSearchParams(params);
  };

  return (
    <div
      className={`min-h-screen overflow-x-hidden transition-all duration-700 ease-in-out ${isDark ? 'bg-gray-900' : 'bg-gray-50'} ${
        isSidebarCollapsed ? 'lg:ml-24 lg:w-[calc(100%-6rem)]' : 'lg:ml-64 lg:w-[calc(100%-16rem)]'
      }`}
      style={{
        transition: 'margin-left 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94), width 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      }}
    >
      <div className="flex min-h-screen w-full">
        <Header
          activeSection="plans"
          onNavigate={handleNavigate}
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
          isFooterInView={false}
        />

        <div className="flex-1 w-0">
          <main className="w-full pt-20 md:pt-8 pb-8 md:pb-12">
            {/* Page header */}
            <motion.div
              className={`max-w-[73rem] mx-auto px-4 md:px-6`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
            </motion.div>

            {/* Hero / Title */}
            <section className={`${isDark ? 'bg-gradient-to-b from-gray-900 via-gray-900 to-gray-900' : 'bg-gradient-to-b from-white via-gray-50 to-gray-50'} border-y ${isDark ? 'border-gray-800' : 'border-gray-200'} py-6 md:py-8 mb-6`}>
              <motion.div
                className={`max-w-[73rem] mx-auto px-4 md:px-6`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                {/* Breadcrumb */}
                <nav aria-label="Breadcrumb" className="mb-3 md:mb-4">
                  <ol className="flex items-center gap-1 text-[13px]">
                    <li>
                      <Link
                        to="/"
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavigate('plans');
                        }}
                        className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-sm px-0.5`}
                      >
                        Back
                      </Link>
                    </li>
                    <li aria-hidden="true" className={`${isDark ? 'text-gray-500' : 'text-gray-400'} px-1`}>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </li>
                    <li>
                      <span className={`${isDark ? 'text-white/90' : 'text-gray-900'} font-medium`}>{pageTitle}</span>
                    </li>
                  </ol>
                </nav>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="flex items-start gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${isDark ? 'bg-emerald-400/10 text-emerald-300' : 'bg-emerald-50 text-emerald-700'}`}>
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <h1 className={`text-2xl md:text-3xl font-bold leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{pageTitle}</h1>
                    </div>
                  </div>
                  {/* Right side price block removed per request; title now reflects selected plan name */}
                </div>
                {/* Cover highlights */}
                <motion.div
                  className={`mt-4 rounded-xl border p-4 ${isDark ? 'bg-gray-800/60 border-gray-700' : 'bg-white/70 backdrop-blur-md border-gray-200'}`}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <div className={`text-xs uppercase tracking-wide ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>Cover:</div>
                    {coverItems.map((c, i) => (
                      <motion.span
                        key={c}
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs border ${isDark ? 'bg-emerald-500/10 border-emerald-200/20 text-emerald-200' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.05 * i }}
                        whileHover={{ scale: 1.03 }}
                      >
                        <Check className="w-3.5 h-3.5" /> {c}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
              </section>

            {/* Main content grid */}
            <div className={`max-w-[73rem] mx-auto px-4 md:px-6`}>
              <div className="grid grid-cols-12 gap-6">
                {/* Left: Details & Tabs */}
                <motion.div 
                  className="col-span-12 lg:col-span-8 xl:col-span-9"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                  {/* Tab content */}
                  {true && (
                    <motion.div 
                      className={`rounded-xl border p-5 ${isDark ? 'bg-gray-800/80 border-gray-700 text-gray-100' : 'bg-white border-gray-200 text-gray-900'}`}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    >
                      <div className="prose max-w-none">
                        <ul className="space-y-5">
                          {pagedItems.map((item, i) => (
                            <motion.li 
                              key={item.title}
                              initial={{ opacity: 0, y: 10 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.4, delay: 0.03 * i }}
                            >
                              <div className="font-semibold">{item.title}</div>
                              <div className="text-sm opacity-90 leading-relaxed">{item.text}</div>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                      {/* Pagination controls */}
                      {pageCount > 1 && (
                        <div className="mt-6 flex items-center justify-center gap-3">
                          <button
                            type="button"
                            aria-label="Previous page"
                            onClick={() => setPage(p => Math.max(0, p - 1))}
                            disabled={page === 0}
                            className={`inline-flex items-center justify-center h-9 w-9 rounded-full border transition ${
                              isDark ? 'border-gray-700 text-gray-200 hover:bg-gray-700/60 disabled:opacity-40' : 'border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-40'
                            }`}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          <div className="flex items-center gap-2">
                            {Array.from({ length: pageCount }).map((_, idx) => (
                              <button
                                key={idx}
                                type="button"
                                aria-label={`Go to page ${idx + 1}`}
                                onClick={() => setPage(idx)}
                                className={`h-2.5 w-2.5 rounded-full transition-all ${
                                  idx === page
                                    ? (isDark ? 'bg-emerald-400 w-6' : 'bg-emerald-600 w-6')
                                    : (isDark ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400')
                                }`}
                              />
                            ))}
                          </div>
                          <button
                            type="button"
                            aria-label="Next page"
                            onClick={() => setPage(p => Math.min(pageCount - 1, p + 1))}
                            disabled={page === pageCount - 1}
                            className={`inline-flex items-center justify-center h-9 w-9 rounded-full border transition ${
                              isDark ? 'border-gray-700 text-gray-200 hover:bg-gray-700/60 disabled:opacity-40' : 'border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-40'
                            }`}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                      <div className="mt-6 text-xs opacity-80 whitespace-pre-line">{legalCopy}</div>
                      <div className="mt-4">
                        <DownloadHeroButton
                          href="/assets/pdf's/Day1 Health Day to Day Plan 2025.pdf"
                          className="hero-cta-xs hero-cta-green hero-cta-fast hero-cta-left"
                          sentText="Downloaded info Plan"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Related products */}
                  <div className="mt-8">
                    <h2 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Other related products</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 items-start">
                      {/* Single - replicate full expand behavior */}
                      <motion.div 
                        className={`relative self-start group rounded-2xl shadow-lg py-6 px-4 lg:py-7 lg:px-5 border-2 transition-all overflow-visible transform-gpu w-full ${
                          isDark 
                            ? 'bg-gray-800 border-green-700 hover:border-green-500' 
                            : 'bg-white border-green-200 hover:border-green-400'
                        } min-h-[160px]`}
                        initial={{ opacity: 0, y: 30, scale: 0.98 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.45, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                        viewport={{ once: true, margin: '-50px' }}
                      >
                        {expanded.single && (
                          <motion.div
                            key="single-bg"
                            aria-hidden
                            className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden z-0"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25, ease: [0.4, 0.0, 0.2, 1] }}
                          >
                            <img
                              src="/assets/images/single (1).jpg"
                              alt=""
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            <div className={`${isDark ? 'bg-black/30' : 'bg-black/20'} absolute inset-0`} />
                          </motion.div>
                        )}
                        <div className="mb-[17px]">
                          <AnimatePresence mode="wait" initial={false}>
                            {expanded.single ? (
                              <motion.div
                                key="hdr-expanded-single"
                                className={`relative z-20 flex items-center justify-between`}
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 6 }}
                                transition={{ duration: 0.18 }}
                              >
                                <motion.span
                                  className={`inline-flex items-center rounded-md px-2 py-0.5 border backdrop-blur-sm ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'} text-lg font-bold text-emerald-400`}
                                  initial={{ opacity: 0, x: -8 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -8 }}
                                  transition={{ duration: 0.18 }}
                                >
                                  <motion.span
                                    className="inline-flex"
                                    initial="hidden"
                                    animate="show"
                                    variants={{ show: { transition: { staggerChildren: 0.035 } } }}
                                  >
                                    {'Burial Plan'.split('')?.map((ch, i) => (
                                      <motion.span
                                        key={i}
                                        className="inline-block"
                                        variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                                        transition={{ duration: 0.18 }}
                                      >
                                        {ch === ' ' ? '\u00A0' : ch}
                                      </motion.span>
                                    ))}
                                  </motion.span>
                                </motion.span>
                                <motion.span
                                  className={`inline-flex items-center rounded-md px-2 py-0.5 border backdrop-blur-sm ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'} text-lg font-bold text-emerald-400`}
                                  initial={{ opacity: 0, x: 8 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: 8 }}
                                  transition={{ duration: 0.18 }}
                                >
                                  Single
                                </motion.span>
                              </motion.div>
                            ) : (
                              <motion.h3
                                key="hdr-collapsed-single"
                                className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 6 }}
                                transition={{ duration: 0.18 }}
                              >
                                Single
                              </motion.h3>
                            )}
                          </AnimatePresence>
                        </div>
                        {expanded.single && (
                          <motion.div
                            layoutId="student-price"
                            className={`relative z-10 mb-4 inline-flex items-baseline gap-2 rounded-xl border backdrop-blur-sm px-3 py-1 ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}
                            transition={{ type: 'tween', duration: 0.22, ease: [0.4, 0.0, 0.2, 1] }}
                          >
                            <span className="text-2xl font-bold text-emerald-400">R385</span>
                            <span className={`text-white text-sm font-normal`}>/month</span>
                          </motion.div>
                        )}
                        <motion.div key="single-content"
                          initial={false}
                          animate={{ height: expanded.single ? 'auto' : 0, opacity: expanded.single ? 1 : 0 }}
                          transition={{ duration: 0.22, ease: [0.4, 0.0, 0.2, 1] }}
                          style={{ overflow: 'hidden' }}
                          aria-hidden={!expanded.single}
                          className="relative z-10"
                        >
                           <div className={`rounded-xl border ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'} backdrop-blur-sm p-4 mb-6`}>
                            <ul className="space-y-3">
                              <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>GP and specialist consultations</span></li>
                              <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Acute and chronic medication</span></li>
                              <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Blood tests and x-rays</span></li>
                              <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Dentistry and optometry</span></li>
                              <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Funeral benefit</span></li>
                            </ul>
                          </div>
                        </motion.div>
                        <div className={(expanded.single ? 'mt-[-3px] ' : 'mt-6 ') + 'relative z-10'}>
                          <AnimatedPaymentButton 
                            text="Choose Plan"
                            className="bronze"
                            hoverMessages={[
                              'GP and specialist consultations',
                              'Acute and chronic medication',
                              'Blood tests and x-rays',
                              'Dentistry and optometry',
                              'Funeral benefit',
                            ]}
                            hoverIcons={['wallet','card','payment','check']}
                            showArrow={false}
                            expanded={expanded.single}
                            onToggleExpand={() => toggleExpanded('single')}
                            to={`/plans/day-to-day?variant=single`}
                          />
                          <button
                            type="button"
                            aria-label={expanded.single ? 'Collapse Single details' : 'Expand Single details'}
                            className={`absolute left-1/2 -translate-x-1/2 bottom-[-36px] inline-flex items-center justify-center w-8 h-8 rounded-full border backdrop-blur-sm z-[999]
                              transition-transform duration-200 ease-out shadow-md hover:shadow-lg hover:scale-105 focus:outline-none
                              ${isDark 
                                ? 'bg-gray-900/60 border-white/15 text-white ring-1 ring-white/10'
                                : 'bg-white/80 border-gray-200 text-gray-800 ring-1 ring-black/5'}
                              ${expanded.single ? 'rotate-180' : ''}`}
                            onClick={() => toggleExpanded('single')}
                          >
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                              <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
                            </svg>
                          </button>
                        </div>
                        {/* Hover Badge (collapsed only) */}
                        {!expanded.single && (
                          <div
                            className={`pointer-events-none absolute top-3 right-3 rounded-xl px-3 py-2 shadow-sm border text-right opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10 backdrop-blur-sm ${
                              isDark ? 'bg-white/10 border-white/15' : 'bg-white/30 border-white/40'
                            }`}
                          >
                            <div className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>Burial Plan</div>
                            <motion.div layoutId="student-price" className={`leading-none text-emerald-400`} transition={{ type: 'tween', duration: 0.22, ease: [0.4, 0.0, 0.2, 1] }}>
                              <span className="text-sm align-top mr-1">R</span>
                              <span className="text-2xl font-bold">385</span>
                              <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-[10px] ml-1`}>/mo</span>
                            </motion.div>
                          </div>
                        )}
                      </motion.div>

                      {/* Couple - replicate full expand behavior */}
                      <motion.div 
                        className={`relative self-start group rounded-2xl shadow-lg py-6 px-[19px] lg:py-7 lg:px-[23px] border-2 transition-all overflow-visible transform-gpu ${
                          isDark 
                            ? 'bg-gray-800 border-green-700 hover:border-green-500' 
                            : 'bg-white border-green-200 hover:border-green-400'
                        } min-h-[180px]`}
                        initial={{ opacity: 0, y: 30, scale: 0.98 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                        viewport={{ once: true, margin: '-50px' }}
                      >
                        {expanded.couple && (
                          <motion.div
                            key="couple-bg"
                            aria-hidden
                            className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden z-0"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25, ease: [0.4, 0.0, 0.2, 1] }}
                          >
                            <img
                              src="/assets/images/couple (1).jpg"
                              alt=""
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            <div className={`${isDark ? 'bg-black/30' : 'bg-black/20'} absolute inset-0`} />
                          </motion.div>
                        )}
                        <div className="mb-[17px]">
                          <AnimatePresence mode="wait" initial={false}>
                            {expanded.couple ? (
                              <motion.div
                                key="hdr-expanded-couple"
                                className={`relative z-20 flex items-center justify-between`}
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 6 }}
                                transition={{ duration: 0.18 }}
                              >
                                <motion.span
                                  className={`inline-flex items-center rounded-md px-2 py-0.5 border backdrop-blur-sm ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'} text-lg font-bold text-emerald-400`}
                                  initial={{ opacity: 0, x: -8 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -8 }}
                                  transition={{ duration: 0.18 }}
                                >
                                  <motion.span
                                    className="inline-flex"
                                    initial="hidden"
                                    animate="show"
                                    variants={{ show: { transition: { staggerChildren: 0.035 } } }}
                                  >
                                    {'Burial Plan'.split('')?.map((ch, i) => (
                                      <motion.span
                                        key={i}
                                        className="inline-block"
                                        variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                                        transition={{ duration: 0.18 }}
                                      >
                                        {ch === ' ' ? '\u00A0' : ch}
                                      </motion.span>
                                    ))}
                                  </motion.span>
                                </motion.span>
                                <motion.span
                                  className={`inline-flex items-center rounded-md px-2 py-0.5 border backdrop-blur-sm ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'} text-lg font-bold text-emerald-400`}
                                  initial={{ opacity: 0, x: 8 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: 8 }}
                                  transition={{ duration: 0.18 }}
                                >
                                  Couples
                                </motion.span>
                              </motion.div>
                            ) : (
                              <motion.h3
                                key="hdr-collapsed-couple"
                                className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 6 }}
                                transition={{ duration: 0.18 }}
                              >
                                Couples
                              </motion.h3>
                            )}
                          </AnimatePresence>
                        </div>
                        {expanded.couple && (
                          <motion.div
                            layoutId="basic-price"
                            className={`relative z-10 mb-4 inline-flex items-baseline gap-2 rounded-xl border backdrop-blur-sm px-3 py-1 ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}
                            transition={{ type: 'tween', duration: 0.22, ease: [0.4, 0.0, 0.2, 1] }}
                          >
                            <span className="text-2xl font-bold text-emerald-400">R674</span>
                            <span className={`text-white text-sm font-normal`}>/month</span>
                          </motion.div>
                        )}
                        <motion.div key="couple-content"
                          initial={false}
                          animate={{ height: expanded.couple ? 'auto' : 0, opacity: expanded.couple ? 1 : 0 }}
                          transition={{ duration: 0.22, ease: [0.4, 0.0, 0.2, 1] }}
                          style={{ overflow: 'hidden' }}
                          aria-hidden={!expanded.couple}
                          className="relative z-10"
                        >
                          <div className={`rounded-xl border ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'} backdrop-blur-sm p-4 mb-6`}>
                            <ul className="space-y-3">
                              <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>GP and specialist consultations</span></li>
                              <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Acute and chronic medication</span></li>
                              <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Blood tests and x-rays</span></li>
                              <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Dentistry and optometry</span></li>
                              <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Funeral benefit</span></li>
                            </ul>
                          </div>
                        </motion.div>
                        <div className={(expanded.couple ? 'mt-[-3px] ' : 'mt-6 ') + 'relative z-10'}>
                          <AnimatedPaymentButton 
                            text="Choose Plan"
                            className="silver"
                            hoverMessages={[
                              'GP and specialist consultations',
                              'Acute and chronic medication',
                              'Blood tests and x-rays',
                              'Dentistry and optometry',
                              'Funeral benefit',
                            ]}
                            hoverIcons={['wallet','card','payment','check']}
                            showArrow={false}
                            expanded={expanded.couple}
                            onToggleExpand={() => toggleExpanded('couple')}
                            to={`/plans/day-to-day?variant=couple`}
                          />
                          <button
                            type="button"
                            aria-label={expanded.couple ? 'Collapse Couples details' : 'Expand Couples details'}
                            className={`absolute left-1/2 -translate-x-1/2 bottom-[-36px] inline-flex items-center justify-center w-8 h-8 rounded-full border backdrop-blur-sm z-[999]
                              transition-transform duration-200 ease-out shadow-md hover:shadow-lg hover:scale-105 focus:outline-none
                              ${isDark 
                                ? 'bg-gray-900/60 border-white/15 text-white ring-1 ring-white/10'
                                : 'bg-white/80 border-gray-200 text-gray-800 ring-1 ring-black/5'}
                              ${expanded.couple ? 'rotate-180' : ''}`}
                            onClick={() => toggleExpanded('couple')}
                          >
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                              <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
                            </svg>
                          </button>
                        </div>
                        {/* Hover Badge (collapsed only) */}
                        {!expanded.couple && (
                          <div
                            className={`pointer-events-none absolute top-3 right-3 rounded-xl px-3 py-2 shadow-sm border text-right opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10 backdrop-blur-sm ${
                              isDark ? 'bg-white/10 border-white/15' : 'bg-white/30 border-white/40'
                            }`}
                          >
                            <div className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>Burial Plan</div>
                            <motion.div layoutId="basic-price" className={`leading-none text-emerald-400`} transition={{ type: 'tween', duration: 0.22, ease: [0.4, 0.0, 0.2, 1] }}>
                              <span className="text-sm align-top mr-1">R</span>
                              <span className="text-2xl font-bold">674</span>
                              <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-[10px] ml-1`}>/mo</span>
                            </motion.div>
                          </div>
                        )}
                      </motion.div>

                      {/* Family - replicate full expand behavior */}
                      <motion.div 
                        className={`relative self-start group rounded-2xl shadow-lg py-6 px-4 lg:py-7 lg:px-5 border-2 transition-all overflow-visible transform-gpu w-full ${
                          isDark 
                            ? 'bg-gray-800 border-green-700 hover:border-green-500' 
                            : 'bg-white border-green-200 hover:border-green-400'
                        } min-h-[160px]`}
                        initial={{ opacity: 0, y: 30, scale: 0.98 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.45, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                        viewport={{ once: true, margin: '-50px' }}
                      >
                        {expanded.family && (
                          <motion.div
                            key="family-bg"
                            aria-hidden
                            className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden z-0"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25, ease: [0.4, 0.0, 0.2, 1] }}
                          >
                            <img
                              src="/assets/images/family (1).jpg"
                              alt=""
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            <div className={`${isDark ? 'bg-black/30' : 'bg-black/20'} absolute inset-0`} />
                          </motion.div>
                        )}
                        <div className="mb-[17px]">
                          <AnimatePresence mode="wait" initial={false}>
                            {expanded.family ? (
                              <motion.div
                                key="hdr-expanded-family"
                                className={`relative z-20 flex items-center justify-between`}
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 6 }}
                                transition={{ duration: 0.18 }}
                              >
                                <motion.span
                                  className={`inline-flex items-center rounded-md px-2 py-0.5 border backdrop-blur-sm ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'} text-lg font-bold text-emerald-400`}
                                  initial={{ opacity: 0, x: -8 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -8 }}
                                  transition={{ duration: 0.18 }}
                                >
                                  <motion.span
                                    className="inline-flex"
                                    initial="hidden"
                                    animate="show"
                                    variants={{ show: { transition: { staggerChildren: 0.035 } } }}
                                  >
                                    {'Burial Plan'.split('')?.map((ch, i) => (
                                      <motion.span
                                        key={i}
                                        className="inline-block"
                                        variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                                        transition={{ duration: 0.18 }}
                                      >
                                        {ch === ' ' ? '\u00A0' : ch}
                                      </motion.span>
                                    ))}
                                  </motion.span>
                                </motion.span>
                                <motion.span
                                  className={`inline-flex items-center rounded-md px-2 py-0.5 border backdrop-blur-sm ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'} text-lg font-bold text-emerald-400`}
                                  initial={{ opacity: 0, x: 8 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: 8 }}
                                  transition={{ duration: 0.18 }}
                                >
                                  Family
                                </motion.span>
                              </motion.div>
                            ) : (
                              <motion.h3
                                key="hdr-collapsed-family"
                                className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 6 }}
                                transition={{ duration: 0.18 }}
                              >
                                Family
                              </motion.h3>
                            )}
                          </AnimatePresence>
                        </div>
                        {expanded.family && (
                          <motion.div
                            layoutId="family-price"
                            className={`relative z-10 mb-4 inline-flex items-baseline gap-2 rounded-xl border backdrop-blur-sm px-3 py-1 ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}
                            transition={{ type: 'tween', duration: 0.22, ease: [0.4, 0.0, 0.2, 1] }}
                          >
                            <span className="text-2xl font-bold text-emerald-400">R193</span>
                            <span className={`text-white text-sm font-normal`}>/child</span>
                          </motion.div>
                        )}
                        <motion.div key="family-content"
                          initial={false}
                          animate={{ height: expanded.family ? 'auto' : 0, opacity: expanded.family ? 1 : 0 }}
                          transition={{ duration: 0.22, ease: [0.4, 0.0, 0.2, 1] }}
                          style={{ overflow: 'hidden' }}
                          aria-hidden={!expanded.family}
                          className="relative z-10"
                        >
                          <div className={`rounded-xl border ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'} backdrop-blur-sm p-4 mb-6`}>
                            <ul className="space-y-3">
                              <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>GP and specialist consultations</span></li>
                              <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Acute and chronic medication</span></li>
                              <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Blood tests and x-rays</span></li>
                              <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Dentistry and optometry</span></li>
                              <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Funeral benefit</span></li>
                              <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Up to 4 children</span></li>
                            </ul>
                          </div>
                        </motion.div>
                        <div className={(expanded.family ? 'mt-[-3px] ' : 'mt-6 ') + 'relative z-10'}>
                          <AnimatedPaymentButton 
                            text="Choose Plan"
                            className="bronze"
                            hoverMessages={[
                              'GP and specialist consultations',
                              'Acute and chronic medication',
                              'Blood tests and x-rays',
                              'Dentistry and optometry',
                              'Funeral benefit',
                              'Up to 4 children',
                            ]}
                            hoverIcons={['wallet','card','payment','check']}
                            showArrow={false}
                            expanded={expanded.family}
                            onToggleExpand={() => toggleExpanded('family')}
                            to={`/plans/day-to-day?variant=family&children=${childCount}`}
                          />
                          <button
                            type="button"
                            aria-label={expanded.family ? 'Collapse Family details' : 'Expand Family details'}
                            className={`absolute left-1/2 -translate-x-1/2 bottom-[-36px] inline-flex items-center justify-center w-8 h-8 rounded-full border backdrop-blur-sm z-[999]
                              transition-transform duration-200 ease-out shadow-md hover:shadow-lg hover:scale-105 focus:outline-none
                              ${isDark 
                                ? 'bg-gray-900/60 border-white/15 text-white ring-1 ring-white/10'
                                : 'bg-white/80 border-gray-200 text-gray-800 ring-1 ring-black/5'}
                              ${expanded.family ? 'rotate-180' : ''}`}
                            onClick={() => toggleExpanded('family')}
                          >
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                              <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
                            </svg>
                          </button>
                        </div>
                        {/* Hover Badge (collapsed only) */}
                        {!expanded.family && (
                          <div
                            className={`pointer-events-none absolute top-3 right-3 rounded-xl px-3 py-2 shadow-sm border text-right opacity-0 group-hover:opacity-100 transition-opacity duration-150 ${
                              isDark ? 'bg-gray-900/80 border-gray-700' : 'bg-white/90 border-gray-200'
                            }`}
                          >
                            <div className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-green-300' : 'text-green-700'}`}>Day-to-Day</div>
                            <motion.div layoutId="family-price" className={`leading-none text-green-600`}>
                              <span className="text-sm align-top mr-1">R</span>
                              <span className="text-2xl font-bold">193</span>
                              <span className={`ml-1 text-[10px] ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>/child</span>
                            </motion.div>
                          </div>
                        )}
                      </motion.div>
                    </div>
                  </div>
                </motion.div>

                {/* Right: Sticky summary / purchase card */}
                <aside className="col-span-12 lg:col-span-4 xl:col-span-3 -mt-4 sm:-mt-6 lg:mt-0">
                  <div className="lg:sticky lg:top-24">
                    <motion.div 
                      className={`rounded-xl border p-5 ${isDark ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-gray-200'}`}
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.55, ease: 'easeOut' }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Plan</div>
                          <div className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Burial Plan</div>
                        </div>
                        <RollingNumber
                          value={currentPrice}
                          prefix="R"
                          className={`text-lg font-semibold ${isDark ? 'text-emerald-300' : 'text-emerald-600'}`}
                          digitClassName={`${isDark ? 'text-emerald-300' : 'text-emerald-600'}`}
                        />
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-4">
                        <div>
                          <label className={isDark ? 'text-gray-200 text-sm' : 'text-gray-700 text-sm'}>Options</label>
                          <select
                            value={option}
                            onChange={(e) => {
                            const v = e.target.value;
                            setOption(v);
                            updateUrl(
                              v,
                              v === 'family' ? childCount : undefined
                            );
                          }}
                            className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none ${isDark ? 'bg-gray-900/70 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                          >
                            <option value="">Choose an option</option>
                            <option value="single">Single</option>
                            <option value="couple">Couples</option>
                            <option value="family">Family</option>
                          </select>
                        </div>

                        {option === 'single' && (
                          <div>
                            <div className="flex items-center justify-between">
                              <label className={isDark ? 'text-gray-200 text-sm' : 'text-gray-700 text-sm'}>Children</label>
                              <span className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>0–4</span>
                            </div>
                            <div className="mt-1 inline-flex items-center gap-2">
                              {[0,1,2,3,4].map((n) => (
                                <button
                                  key={n}
                                  type="button"
                                  aria-label={`Select ${n} ${n === 1 ? 'child' : 'children'}`}
                                  onClick={() => { setChildCount(n); updateUrl('single', n); }}
                                  className={[
                                    'h-8 px-2 rounded-md border text-xs transition-colors',
                                    isDark ? 'border-gray-700' : 'border-gray-300',
                                    childCount === n
                                      ? (isDark ? 'bg-emerald-600/30 text-white border-emerald-400' : 'bg-emerald-50 text-emerald-700 border-emerald-300')
                                      : (isDark ? 'bg-gray-900/60 text-gray-200 hover:border-gray-600' : 'bg-white text-gray-800 hover:border-gray-400')
                                  ].join(' ')}
                                  aria-pressed={n === childCount}
                                >
                                  {n}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        {option === 'family' ? (
                          <div>
                            <div className="flex items-center justify-between">
                              <label className={isDark ? 'text-gray-200 text-sm' : 'text-gray-700 text-sm'}>Children</label>
                              <span className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>1–4</span>
                            </div>
                            <div className="mt-1 inline-flex items-center gap-2">
                              {[1,2,3,4].map((n) => (
                                <button
                                  key={n}
                                  type="button"
                                  aria-label={`Select ${n} ${n === 1 ? 'child' : 'children'}`}
                                  onClick={() => { setChildCount(n); updateUrl('family', n); }}
                                  className={[
                                    'h-8 px-2 rounded-md border text-xs transition-colors',
                                    isDark ? 'border-gray-700' : 'border-gray-300',
                                    childCount === n
                                      ? (isDark ? 'bg-emerald-600/30 text-white border-emerald-400' : 'bg-emerald-50 text-emerald-700 border-emerald-300')
                                      : (isDark ? 'bg-gray-900/60 text-gray-200 hover:border-gray-600' : 'bg-white text-gray-800 hover:border-gray-400')
                                  ].join(' ')}
                                >
                                  {n}
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : null}
                      </div>

                      <div className="mt-5">
                        <AnimatedContactButton
                          type="button"
                          className="w-full"
                          labelDefault="Sign Up Now"
                          labelSent="Sent"
                          onClick={() => setShowSignUpModal(true)}
                        />
                      </div>

                      <div className={`mt-4 text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        <div>SKU: N/A</div>
                        <div>Category: Normal</div>
                      </div>
                    </motion.div>
                  </div>
                </aside>
              </div>
            </div>
          </main>

          <Footer id="footer" />
        </div>
      </div>

      {/* Sign Up Modal */}
      <AnimatePresence>
        {showSignUpModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowSignUpModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-6xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowSignUpModal(false)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-800/80 text-white hover:bg-gray-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <MemberSignUpForm
                planType={variantParam === 'family' ? 'extended' : variantParam === 'couple' || variantParam === 'couples' ? 'family' : 'single'}
                onClose={() => setShowSignUpModal(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlanDetailPage;
