import { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { HeartPulse, Briefcase, UsersRound, Users2, ShieldCheck, Activity, Heart, Star } from 'lucide-react';
import { HeroCTAButton } from './ui/hero-cta-button';
import type { LucideProps } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import OptimizedImage from './ui/optimized-image';
import { HeroSkeleton } from './ui/loading-skeleton';

// Lazy load heavy components
const MagnetizeButton = lazy(() => import('@/components/ui/magnetize-button').then(module => ({ default: module.MagnetizeButton })));
const UniqueButton = lazy(() => import('@/components/ui/unique-button'));
const ShuffleCards = lazy(() => import('@/components/ui/shuffle-cards').then(module => ({ default: module.ShuffleCards })));
const Marquee = lazy(() => import('@/components/ui/3d-testimonials').then(module => ({ default: module.Marquee })));
const Avatar = lazy(() => import('@/components/ui/avatar').then(module => ({ default: module.Avatar })));
const AvatarFallback = lazy(() => import('@/components/ui/avatar').then(module => ({ default: module.AvatarFallback })));
const AvatarImage = lazy(() => import('@/components/ui/avatar').then(module => ({ default: module.AvatarImage })));
const Card = lazy(() => import('@/components/ui/card').then(module => ({ default: module.Card })));
const CardContent = lazy(() => import('@/components/ui/card').then(module => ({ default: module.CardContent })));
const SlideUpTypewriter = lazy(() => import('@/components/ui/slide-up-typewriter').then(module => ({ default: module.SlideUpTypewriter })));

type IconType = React.ComponentType<LucideProps>;

interface HeroProps {
  isSidebarCollapsed: boolean;
  specificSlide?: number | null;
}

interface TypewriterWord {
  text: string;
  icon: IconType;
}

interface HeroSlide {
  id: number;
  staticText: string;
  typewriterWords: TypewriterWord[];
  subheading: string;
  bgColor: string;
  icon?: IconType;
  textColor?: string;
  buttonBg?: string;
  iconColor?: string;
  backgroundImage?: string;
}

const heroSlides: HeroSlide[] = [
  {
    id: 0,
    staticText: 'you\'re one compassionate choice away',
    icon: HeartPulse,
    typewriterWords: [
      { text: 'Peaceful farewell', icon: ShieldCheck },
      { text: 'Dignity preserved', icon: Activity },
      { text: 'Cultural care', icon: Heart },
      { text: 'Family support', icon: Star }
    ],
    subheading: 'for honoring your loved ones.',
    bgColor: 'from-white to-white',
    textColor: 'text-gray-900',
    buttonBg: 'bg-[#16a34a] hover:bg-[#15803d]',
    iconColor: 'text-blue-500',
    backgroundImage: '/images/cas.jpg',
  },
];

// Testimonial data for slide 2 background
const testimonials = [
  {
    img: "https://avatar.vercel.sh/jack",
    name: "Jack",
    username: "@jack",
    body: "I've been using this for a few months now and it's amazing how much I've saved on my health insurance.",
    country: "🇦🇺",
    detailedStory: "After comparing 15+ health insurance providers, I chose Day1Health and saved $2,400 annually. The transition was seamless, and I got better coverage including dental and optical that my previous provider didn't offer. The mobile app makes claims super easy - I just take a photo of my receipt and get reimbursed within 48 hours.",
    age: 34,
    location: "Sydney, NSW",
    plan: "Comprehensive Plus",
    savings: "$2,400/year",
    memberSince: "March 2024",
    favoriteFeature: "Instant claim processing via mobile app"
  },
  {
    img: "https://avatar.vercel.sh/jill",
    name: "Jill",
    username: "@jill",
    body: "The coverage is comprehensive and the claims process is so simple. Highly recommend!",
    country: "🇦🇺",
    detailedStory: "As a single mom with two kids, I needed health insurance that wouldn't break the bank but still covered everything we needed. Day1Health's family plan covers all our medical, dental, and even physiotherapy for my son's sports injuries. The pediatric coverage is exceptional.",
    age: 42,
    location: "Melbourne, VIC",
    plan: "Family Essential",
    savings: "$1,800/year",
    memberSince: "January 2024",
    favoriteFeature: "Comprehensive pediatric coverage"
  },
  {
    img: "https://avatar.vercel.sh/john",
    name: "John",
    username: "@john",
    body: "Finally found health insurance that actually works for my family. Great value for money.",
    country: "🇦🇺",
    detailedStory: "My wife and I were paying over $400/month with our old provider and still had huge out-of-pocket expenses. With Day1Health, we pay $280/month and have better coverage. When my wife needed surgery last month, everything was covered with no surprise bills.",
    age: 38,
    location: "Brisbane, QLD",
    plan: "Couples Premium",
    savings: "$1,440/year",
    memberSince: "February 2024",
    favoriteFeature: "No surprise bills or hidden costs"
  },
  {
    img: "https://avatar.vercel.sh/jane",
    name: "Jane",
    username: "@jane",
    body: "The customer service is outstanding. They helped me through every step of my claim.",
    country: "🇦🇺",
    detailedStory: "When I was diagnosed with a chronic condition, I was worried about coverage and costs. The Day1Health support team assigned me a personal health advocate who helped navigate specialists, treatments, and claims. I've never felt more supported by an insurance company.",
    age: 56,
    location: "Perth, WA",
    plan: "Health Plus",
    savings: "$3,200/year",
    memberSince: "November 2023",
    favoriteFeature: "Personal health advocate support"
  },
  {
    img: "https://avatar.vercel.sh/jenny",
    name: "Jenny",
    username: "@jenny",
    body: "Switched from my old provider and couldn't be happier. Much better coverage at a lower cost.",
    country: "🇦🇺",
    detailedStory: "I'm a freelance graphic designer, so I needed flexible health insurance that I could afford during lean months. Day1Health's flexible payment options and comprehensive coverage for mental health services have been a game-changer for my wellbeing and financial peace of mind.",
    age: 29,
    location: "Adelaide, SA",
    plan: "Flexible Individual",
    savings: "$1,600/year",
    memberSince: "April 2024",
    favoriteFeature: "Flexible payment options and mental health coverage"
  },
  {
    img: "https://avatar.vercel.sh/james",
    name: "James",
    username: "@james",
    body: "The online portal makes managing my health insurance so easy. Everything is just a click away.",
    country: "🇦🇺",
    detailedStory: "As a tech professional, I appreciate when companies invest in good user experience. Day1Health's digital platform is intuitive, fast, and actually useful. I can track claims, book appointments with network providers, and even get health tips personalized to my profile.",
    age: 31,
    location: "Canberra, ACT",
    plan: "Digital Pro",
    savings: "$2,100/year",
    memberSince: "December 2023",
    favoriteFeature: "Seamless digital experience and provider network integration"
  },
  {
    name: 'Sarah Chen',
    username: '@sarah',
    body: 'Day1 Health saved me thousands on my medical bills!',
    img: 'https://randomuser.me/api/portraits/women/32.jpg',
    country: '🇦🇺 Australia',
  },
  {
    name: 'Marcus Johnson',
    username: '@marcus',
    body: 'Finally, health cover that actually works for freelancers.',
    img: 'https://randomuser.me/api/portraits/men/68.jpg',
    country: '🇺🇸 USA',
  },
  {
    name: 'Elena Rodriguez',
    username: '@elena',
    body: 'Simple, affordable, and stress-free coverage.',
    img: 'https://randomuser.me/api/portraits/women/51.jpg',
    country: '🇪🇸 Spain',
  },
  {
    name: 'David Kim',
    username: '@david',
    body: 'Best decision I made for my health this year.',
    img: 'https://randomuser.me/api/portraits/men/53.jpg',
    country: '🇰🇷 Korea',
  },
  {
    name: 'Lisa Thompson',
    username: '@lisa',
    body: 'Love how flexible and comprehensive it is!',
    img: 'https://randomuser.me/api/portraits/women/33.jpg',
    country: '🇨🇦 Canada',
  },
  {
    name: 'Ahmed Hassan',
    username: '@ahmed',
    body: 'Perfect for my busy lifestyle and budget.',
    img: 'https://randomuser.me/api/portraits/men/22.jpg',
    country: '🇪🇬 Egypt',
  },
  {
    name: 'Yuki Tanaka',
    username: '@yuki',
    body: 'Incredible support and fast claim processing.',
    img: 'https://randomuser.me/api/portraits/women/85.jpg',
    country: '🇯🇵 Japan',
  },
  {
    name: 'Tom Wilson',
    username: '@tom',
    body: 'Finally found health cover that fits my life.',
    img: 'https://randomuser.me/api/portraits/men/45.jpg',
    country: '🇬🇧 UK',
  },
  {
    name: 'Maria Santos',
    username: '@maria',
    body: 'Day1 Health made healthcare accessible for me.',
    img: 'https://randomuser.me/api/portraits/women/61.jpg',
    country: '🇧🇷 Brazil',
  },
];

function TestimonialCard({ 
  img, name, username, body, country, detailedStory, age, location, plan, savings: propSavings, memberSince, favoriteFeature,
  onOpenModal 
}: (typeof testimonials)[number] & { onOpenModal?: (testimonial: any) => void }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const { isDark } = useTheme();
  
  // Use provided savings or generate random amount for gamification
  const savings = propSavings || `$${Math.floor(Math.random() * 3000) + 500}`;
  
  const handleClick = () => {
    setIsClicked(!isClicked);
    // Open modal with detailed information if handler is provided
    if (onOpenModal) {
      onOpenModal({ 
        img, name, username, body, country, detailedStory, age, location, plan, 
        savings, memberSince, favoriteFeature 
      });
    }
    // Add a subtle pulse effect
    setTimeout(() => setIsClicked(false), 1000);
  };
  
  return (
    <Card 
      className={`w-64 mx-2 my-1 backdrop-blur-md shadow-md transition-all duration-300 cursor-pointer transform 
        ${isDark ? 'bg-gray-800/70 border-white/10' : 'bg-white/70 border-white/30'} 
        ${isHovered ? (isDark ? 'scale-105 shadow-xl bg-gray-800/90' : 'scale-105 shadow-xl bg-white/90') : ''}
        ${isClicked ? (isDark ? 'scale-110 shadow-2xl bg-emerald-900/30 border-emerald-700' : 'scale-110 shadow-2xl bg-green-50/90 border-green-200') : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <CardContent className="p-4 relative">
        {/* Savings reveal on hover */}
        {isHovered && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-bounce">
            Saved ${savings}
          </div>
        )}
        
        {/* Clicked state overlay */}
        {isClicked && (
          <div className={`absolute inset-0 rounded-lg flex items-center justify-center ${isDark ? 'bg-emerald-900/35' : 'bg-green-100/50'}` }>
            <div className={`${isDark ? 'text-emerald-300' : 'text-green-600'} font-bold text-lg animate-pulse`}>
              ✓ Protected!
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-2.5 mb-3">
          <Avatar className={`size-9 transition-all duration-300 ${isHovered ? 'ring-2 ring-green-400' : ''}`}>
            <AvatarImage src={img} alt={name} />
            <AvatarFallback className={`${isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-600'}`}>{name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <figcaption className={`text-sm font-medium ${isDark ? 'text-gray-100' : 'text-gray-800'} flex items-center gap-1`}>
              {name} <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{country}</span>
            </figcaption>
            <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{username}</p>
          </div>
        </div>
        <blockquote className={`text-sm leading-relaxed transition-colors duration-300 ${isClicked ? (isDark ? 'text-emerald-300' : 'text-green-700') : (isDark ? 'text-gray-300' : 'text-gray-700')}` }>
          {body}
        </blockquote>
      </CardContent>
    </Card>
  );
}

const Hero: React.FC<HeroProps> = ({ isSidebarCollapsed, specificSlide }: HeroProps) => {
  // Calculate padding based on sidebar state with more noticeable difference
  const getContentPadding = () => {
    if (isSidebarCollapsed) {
      return 'pl-6 md:pl-12 lg:pl-16';
    }
    return 'pl-6 md:pl-12 lg:pl-16 xl:pl-20';
  };
  const [currentSlide] = useState<number>(specificSlide ?? 0);
  const [currentText, setCurrentText] = useState<string>('');
  const [selectedTestimonial, setSelectedTestimonial] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTestimonial, setModalTestimonial] = useState<any>(null);
  const { isDark } = useTheme();
  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile for performance optimizations
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Modal handler function
  const handleOpenModal = (testimonial: any) => {
    setModalTestimonial(testimonial);
    setIsModalOpen(true);
  };

  // Get words for current slide
  const currentWords = heroSlides[currentSlide]?.typewriterWords || [];

  // Smooth typewriter effect that types sentences sequentially with pauses
  useEffect(() => {
    if (currentWords.length === 0) return;
    // Skip typewriter for slide 1 (id: 0) as it uses custom SlideUpTypewriter
    if (currentSlide === 0) return;

    let timeoutId: ReturnType<typeof setTimeout>;
    let charIndex = 0;
    let sentenceIndex = 0;
    
    const typeNextChar = () => {
      if (sentenceIndex >= currentWords.length) {
        // All sentences completed, restart after a longer pause
        timeoutId = setTimeout(() => {
          setCurrentText('');
          sentenceIndex = 0;
          charIndex = 0;
          typeNextChar();
        }, 3000); // 3 second pause before restarting
        return;
      }

      const currentSentence = currentWords[sentenceIndex]?.text || '';
      
      if (charIndex <= currentSentence.length) {
        // Type the next character
        setCurrentText(currentSentence.substring(0, charIndex));
        charIndex++;
        
        if (charIndex <= currentSentence.length) {
          // Continue typing current sentence
          timeoutId = setTimeout(typeNextChar, 80); // Smooth typing speed
        } else {
          // Sentence completed, pause before next sentence
          timeoutId = setTimeout(() => {
            sentenceIndex++;
            charIndex = 0;
            typeNextChar();
          }, 1000); // 1 second pause between sentences
        }
      }
    };

    // Start typing after initial delay
    setCurrentText('');
    timeoutId = setTimeout(typeNextChar, 500);
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [currentWords]);

  // Reset typewriter when slide changes
  useEffect(() => {
    // Don't reset text immediately to prevent flash
    const timer = setTimeout(() => {
      setCurrentText('');
    }, 50);
    
    return () => clearTimeout(timer);
  }, [currentSlide]);

  const getHeroPadding = () => {
    return isSidebarCollapsed ? 'pl-16 lg:pl-24' : 'pl-6 lg:pl-8';
  };

  return (
    <section id="hero" className={`relative overflow-hidden transition-all duration-500 w-full pt-[100px] md:pt-[25px] px-[25px] pb-[25px] ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <AnimatePresence mode="wait">
        {heroSlides.map((slide, index) => {
          // For specific slide routes, only render that slide
          if (specificSlide !== null && index !== specificSlide) return null;
          // For main route, show current slide
          if (specificSlide === null && currentSlide !== index) return null;

          return (
            <>
              {/* Stable Background Container - Outside of motion.div */}
              <div 
                className="absolute inset-0 rounded-3xl overflow-hidden"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: '1.5rem',
                  zIndex: 0
                }}
              >
                {/* Fixed Background Layer */}
                {slide.backgroundImage && (
                  <div 
                    className="hero-bg-fixed"
                    style={{
                      backgroundImage: `
                        rgba(0, 0, 0, 0.3),
                        url(${slide.backgroundImage})
                      `,
                      borderRadius: '1.5rem'
                    }}
                  />
                )}
              </div>

              <motion.div
              key={slide.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className={`min-h-[60vh] sm:min-h-[75vh] flex items-center justify-center transition-colors duration-500 ease-in-out relative rounded-3xl overflow-hidden ${
                slide.backgroundImage ? 'text-white bg-transparent' : 'bg-gradient-to-br'
              } ${
                !slide.backgroundImage && isDark && (slide.id === 3 || slide.id === 0)
                  ? (slide.id === 3 ? 'from-gray-900 to-gray-800' : 'from-gray-950 to-gray-900')
                  : (!slide.backgroundImage ? slide.bgColor : '')
              } ${
                slide.backgroundImage ? 'text-white' : 
                (isDark && (slide.id === 3 || slide.id === 0) ? 'text-white' : (slide.textColor || 'text-white'))
              }`}
              style={{
                marginLeft: window.innerWidth < 768 ? '0rem' : (isSidebarCollapsed ? '6rem' : '16rem'),
                borderRadius: '1.5rem',
                position: 'relative',
                zIndex: 1
              }}
            >
              <div 
                className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 transition-all duration-500 ease-in-out ${getContentPadding()}`}
                style={{
                  transitionProperty: 'padding',
                  transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                  transitionDuration: '500ms'
                }}
              >
                {slide.id === 3 ? (
                  /* Two-column layout for slide 3 */
                  <div className="w-full h-[60vh] sm:h-[75vh] flex items-start justify-center pt-4">
                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                      {/* Column 1: Testimonial Section */}
                      <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex justify-center"
                      >
                        <ShuffleCards 
                          className="bg-transparent" 
                          onTestimonialSelect={setSelectedTestimonial}
                          selectedTestimonialId={selectedTestimonial?.id}
                        />
                      </motion.div>
                      <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        className="text-center md:text-left space-y-6"
                      >
                        {selectedTestimonial ? (
                          <>
                            {/* Audio Player */}
                            {/* Removed Audio Player (TTS) to decouple voice features */}
                          
                            {/* Selected Testimonial Quote */}
                            <motion.blockquote 
                              key={selectedTestimonial.id}
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.6, duration: 0.6 }}
                              className={`text-xl sm:text-2xl ${isDark ? 'text-gray-100' : 'text-gray-800'} font-manrope font-medium italic leading-relaxed border-l-4 ${isDark ? 'border-emerald-400' : 'border-green-500'} pl-6 mb-4`}
                            >
                              "{selectedTestimonial.testimonial}"
                            </motion.blockquote>
                            
                            {/* Author */}
                            <motion.p 
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.7, duration: 0.6 }}
                              className={`text-lg ${isDark ? 'text-emerald-300' : 'text-green-600'} font-manrope font-semibold mb-6`}
                            >
                              — {selectedTestimonial.author}
                            </motion.p>
                            
                            {/* Detailed Description */}
                            <motion.p 
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.8, duration: 0.6 }}
                              className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'} font-manrope leading-relaxed`}
                            >
                              {selectedTestimonial.detailedDescription}
                            </motion.p>
                          </>
                        ) : (
                          /* Default content when no testimonial is selected */
                          <>
                            {/* Main Header */}
                            <motion.h1 
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.4, duration: 0.6 }}
                              className={`text-3xl sm:text-4xl md:text-5xl font-manrope font-bold leading-tight tracking-tight text-center md:text-left ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}
                            >
                              {slide.staticText}
                            </motion.h1>
                            
                            {/* Typewriter Section */}
                            <motion.div 
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.6, duration: 0.6 }}
                              className="mb-8"
                            >
                              <span className={`text-2xl sm:text-3xl md:text-4xl font-manrope font-bold transition-all duration-300 ${currentText ? (isDark ? 'text-emerald-400' : 'text-green-600') : 'text-transparent'}`}>
                                {currentText || 'placeholder'}
                              </span>
                            </motion.div>
                            
                            <motion.p 
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.8, duration: 0.6 }}
                              className={`text-lg text-center md:text-left ${isDark ? 'text-gray-300' : 'text-gray-600'} font-manrope leading-relaxed mb-6`}
                            >
                              Click on a testimonial card to hear real stories from our customers and learn more about their experience with Day1Health.
                            </motion.p>
                          </>
                        )}
                      </motion.div>
                    </div>
                  </div>
                ) : slide.id === 2 ? (
                  /* 3D Testimonials Marquee Background for slide 2 */
                  <div className="w-full h-[60vh] sm:h-[75vh] relative">
                    {/* 3D Testimonials Marquee Background */}
                    <div className="absolute inset-0 z-0 overflow-visible">
                      <div 
                        className="flex flex-row items-center gap-6 w-full h-full justify-center px-8"
                        style={{
                          transform: 'translateX(-30px) translateY(0px) translateZ(-30px) rotateX(10deg) rotateY(-5deg) rotateZ(10deg)',
                          perspective: '1000px'
                        }}
                      >
                        {/* Vertical Marquee Column 1 (downwards) */}
                        <div className="h-full w-72 flex-shrink-0">
                          <Marquee vertical pauseOnHover repeat={2} className="[--duration:80s] h-full w-full">
                            {testimonials.map((review) => (
                              <TestimonialCard key={`col1-${review.username}`} {...review} onOpenModal={handleOpenModal} />
                            ))}
                          </Marquee>
                        </div>
                        
                        {/* Vertical Marquee Column 2 (upwards) */}
                        <div className="h-full w-72 flex-shrink-0">
                          <Marquee vertical pauseOnHover reverse repeat={2} className="[--duration:75s] h-full w-full">
                            {testimonials.map((review) => (
                              <TestimonialCard key={`col2-${review.username}`} {...review} onOpenModal={handleOpenModal} />
                            ))}
                          </Marquee>
                        </div>
                        
                        {/* Vertical Marquee Column 3 (downwards) */}
                        <div className="h-full w-72 flex-shrink-0">
                          <Marquee vertical pauseOnHover repeat={2} className="[--duration:85s] h-full w-full">
                            {testimonials.map((review) => (
                              <TestimonialCard key={`col3-${review.username}`} {...review} onOpenModal={handleOpenModal} />
                            ))}
                          </Marquee>
                        </div>
                        
                        {/* Vertical Marquee Column 4 (upwards) */}
                        <div className="h-full w-72 flex-shrink-0">
                          <Marquee vertical pauseOnHover reverse repeat={2} className="[--duration:70s] h-full w-full">
                            {testimonials.map((review) => (
                              <TestimonialCard key={`col4-${review.username}`} {...review} onOpenModal={handleOpenModal} />
                            ))}
                          </Marquee>
                        </div>
                      </div>
                      
                      {/* Floating 3D Medical Icons - Immersive Layer */}
                      <div className="absolute inset-0 pointer-events-none z-5">
                        {/* Floating Shield Icons */}
                        <motion.div
                          className="absolute top-20 left-10 text-green-500/30"
                          animate={!shouldReduceMotion && !isMobile ? {
                            y: [0, -20, 0],
                            rotate: [0, 10, 0],
                            scale: [1, 1.1, 1]
                          } : {}}
                          transition={{
                            duration: isMobile ? 6 : 4,
                            repeat: shouldReduceMotion ? 0 : Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <ShieldCheck size={48} />
                        </motion.div>
                        
                        <motion.div
                          className="absolute top-40 right-16 text-blue-500/30"
                          animate={!shouldReduceMotion && !isMobile ? {
                            y: [0, 15, 0],
                            rotate: [0, -8, 0],
                            scale: [1, 0.9, 1]
                          } : {}}
                          transition={{
                            duration: isMobile ? 7 : 5,
                            repeat: shouldReduceMotion ? 0 : Infinity,
                            ease: "easeInOut",
                            delay: 1
                          }}
                        >
                          <Heart size={40} />
                        </motion.div>
                        
                        <motion.div
                          className="absolute bottom-32 left-20 text-blue-500/30"
                          animate={!shouldReduceMotion && !isMobile ? {
                            y: [0, -25, 0],
                            rotate: [0, 15, 0],
                            scale: [1, 1.2, 1]
                          } : {}}
                          transition={{
                            duration: isMobile ? 8 : 6,
                            repeat: shouldReduceMotion ? 0 : Infinity,
                            ease: "easeInOut",
                            delay: 2
                          }}
                        >
                          <Activity size={44} />
                        </motion.div>
                        
                        <motion.div
                          className="absolute bottom-20 right-24 text-green-500/30"
                          animate={!shouldReduceMotion && !isMobile ? {
                            y: [0, 20, 0],
                            rotate: [0, -12, 0],
                            scale: [1, 0.8, 1]
                          } : {}}
                          transition={{
                            duration: isMobile ? 6.5 : 4.5,
                            repeat: shouldReduceMotion ? 0 : Infinity,
                            ease: "easeInOut",
                            delay: 0.5
                          }}
                        >
                          <Star size={36} />
                        </motion.div>
                        
                        {/* Interactive Hotspots - Hidden on mobile for performance */}
                        {!isMobile && (
                          <motion.div
                            className="absolute top-1/2 left-1/4 w-4 h-4 bg-green-400/60 rounded-full cursor-pointer"
                            animate={!shouldReduceMotion ? {
                              scale: [1, 1.5, 1],
                              opacity: [0.6, 1, 0.6]
                            } : {}}
                            transition={{
                              duration: 2,
                              repeat: shouldReduceMotion ? 0 : Infinity,
                              ease: "easeInOut"
                            }}
                            whileHover={{
                              scale: 2,
                              backgroundColor: "rgba(34, 197, 94, 0.9)"
                            }}
                          />
                        )}
                        
                        {!isMobile && (
                          <motion.div
                            className="absolute top-1/3 right-1/3 w-3 h-3 bg-blue-400/60 rounded-full cursor-pointer"
                            animate={!shouldReduceMotion ? {
                              scale: [1, 1.3, 1],
                              opacity: [0.5, 0.9, 0.5]
                            } : {}}
                            transition={{
                              duration: 3,
                              repeat: shouldReduceMotion ? 0 : Infinity,
                              ease: "easeInOut",
                              delay: 1
                            }}
                            whileHover={{
                              scale: 2.5,
                              backgroundColor: "rgba(59, 130, 246, 0.9)"
                            }}
                          />
                        )}
                        
                        
                        {/* Floating Progress Indicator */}
                        <motion.div
                          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg"
                          initial={{ y: 100, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 2, duration: 1 }}
                        >
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <motion.div
                              className="w-2 h-2 bg-green-500 rounded-full"
                              animate={{
                                scale: [1, 1.2, 1],
                                opacity: [1, 0.7, 1]
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity
                              }}
                            />
                            <span className="font-medium">50,000+ Australians Protected</span>
                          </div>
                        </motion.div>
                      </div>

                    </div>
                  </div>
                ) : (
                  /* Default single-column layout for other slides */
                  <div className="w-full h-[60vh] sm:h-[75vh] flex flex-col items-center justify-center">
                    <motion.div
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="text-center w-full max-w-7xl px-6 transition-all duration-500 ease-in-out mx-auto"
                    >
                      {/* Main Heading - Bold and Centered - Hidden for slide 0 */}
                      {slide.id !== 0 && (
                        <h1 className="font-manrope font-bold leading-tight tracking-tight text-gray-900 text-4xl text-center mb-8">
                          {slide.staticText}
                        </h1>
                      )}

                      {/* Logo positioning: top-right corner */}
                      {slide.id === 0 && (
                        <motion.div 
                          className="absolute z-10 top-8 right-4 sm:top-12 sm:right-6 md:top-6 md:right-8 transition-all duration-500 ease-in-out"
                          initial={{ opacity: 0, x: 20, y: 20, scale: 0.9 }}
                          animate={{ opacity: 1, x: 0, y: 0, scale: 0.9 }}
                          transition={{ delay: 1, duration: 0.5 }}
                        >
                          <OptimizedImage
                            src="/assets/images/Logo.jpg"
                            alt="DAY1HEALTH logo"
                            className="w-12 sm:w-16 md:w-20 lg:w-24 xl:w-28 pointer-events-none select-none"
                            priority={true}
                            placeholder="Logo"
                          />
                        </motion.div>
                      )}
                      
                      {/* Typewriter Section - Large and Prominent */}
                      <div className={`${slide.id === 1 ? 'mb-4 sm:mb-8' : 'mb-4 sm:mb-8'} flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 items-center justify-center`} 
                           style={slide.id === 0 ? { marginLeft: isSidebarCollapsed ? '0px' : '0px' } : {}}>
                        {slide.id !== 1 && slide.id !== 0 && (
                          <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-manrope font-bold text-gray-900">
                            from
                          </span>
                        )}
                        <div className={`relative ${
                          slide.id === 1 ? 'w-full sm:min-w-[300px] md:min-w-[400px] h-auto' : 'min-w-[180px] sm:min-w-[200px] h-14 sm:h-20 md:h-24'
                        }`}>
                          {slide.id === 0 ? (
                            <>
                              {/* Large "Gift Ai" text above main heading - Mobile only */}
                              <motion.div
                                className="text-center mb-4 sm:mb-6 md:hidden"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                              >
                                <h1 className={`font-manrope font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl ${
                                  slide.backgroundImage ? 'text-white' : (isDark ? 'text-slate-300' : 'text-ubuntugift-primary')
                                } leading-tight`}>
                                  Gift Ai
                                </h1>
                              </motion.div>
                              
                              <Suspense fallback={<div className="h-16 bg-gray-200 animate-pulse rounded"></div>}>
                                <SlideUpTypewriter 
                                  words={slide.typewriterWords.map(word => word.text)}
                                  className={`font-manrope font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl leading-tight ${
                                    slide.backgroundImage ? 'text-white' : (isDark ? 'text-slate-300' : 'text-ubuntugift-primary')
                                  }`}
                                  letterDelay={80}
                                  wordDisplayTime={1500}
                                  wordExitTime={400}
                                />
                              </Suspense>
                            </>
                          ) : (
                            <span className={`font-manrope font-bold opacity-100 block ${
                              slide.id === 1 
                                ? 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl text-white tracking-tight leading-tight' 
                                : 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-ubuntugift-primary leading-tight'
                            }`}>
                              {currentText || ''}
                            </span>
                          )}
                          {/* Simple CTA Button for Slide 0 */}
                          {slide.id === 0 && (
                            <motion.div 
                              className="mt-[140px] flex justify-center md:justify-center" /* moved further down (+32px) and centered */
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 2, duration: 0.6 }}
                              style={{ marginTop: '140px' }}
                            >
                              <HeroCTAButton
                                className="font-manrope font-bold text-xl text-ubuntugift-primary"
                                defaultText="Chat to Gift Ai"
                                onClick={() => {
                                  // Wait for typewriter to finish before scrolling
                                  setTimeout(() => {
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
                                  }, 2700); // ~2.7s delay
                                }}
                              />
                              
                            </motion.div>
                          )}
                          
                          {/* Enhanced Heartbeat Line - Hidden for slide 2 */}

                          {slide.id !== 1 && (
                            <div className={`absolute -bottom-1 left-0 right-0 h-8 overflow-hidden transition-all duration-300 ${currentText ? 'opacity-100' : 'opacity-0'}`}>
                            <svg 
                              className="w-full h-full" 
                              viewBox="0 0 400 32" 
                              preserveAspectRatio="none"
                            >
                              <motion.path
                                d="M0,16 L80,16 L90,8 L100,24 L110,4 L120,28 L130,16 L400,16"
                                stroke="#4a5568"
                                strokeWidth="4"
                                fill="none"
                                initial={{ pathLength: 0 }}
                                animate={{ 
                                  pathLength: currentText ? 1 : 0 
                                }}
                                transition={{
                                  duration: 0.1,
                                  ease: "easeOut"
                                }}
                              />
                            </svg>
                          </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Subheading - Clean and Simple */}
                      <motion.p 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                        className={`text-lg sm:text-2xl md:text-3xl ${
                          slide.id === 0 
                            ? (slide.backgroundImage ? 'text-white' : (isDark ? 'text-gray-200' : 'text-black')) 
                            : (isDark ? 'text-gray-300' : 'text-gray-700')
                        } font-manrope font-bold leading-relaxed ${
                          slide.id === 1 
                            ? 'text-center mt-8 mb-8' // Reduced margins for slide 1
                            : (slide.id === 0 
                                ? 'mt-[70px] mb-12' // Increased further from mt-[50px] for more space
                                : 'mt-12 mb-12') // Default for other slides
                        }`}
                        style={slide.id === 0 ? { marginLeft: '0px', textAlign: 'center' } : {}}
                      >
                        {slide.subheading}
                      </motion.p>
                      
                      {/* CTA Button for Slide 0 is now the simple green button above */}
                      
                      {/* SendMessage Button for Slide 2 */}
                      {slide.id === 1 && (
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.8, duration: 0.6 }}
                          className="mt-4 flex justify-center"
                          style={{ marginTop: '0' }}
                        >
                          <MagnetizeButton
                            onClick={() => {
                              // Wait for "Sending Down" text to finish writing out (12 letters * 0.2s = 2.4s) + plane animation (0.8s) + 0.5s delay
                              setTimeout(() => {
                                // Scroll to Gift AI section
                                const section = document.querySelector('[data-gift-ai-section]');
                                if (section) {
                                  const targetPosition = section.getBoundingClientRect().top + window.pageYOffset - 80;
                                  window.scrollTo({
                                    top: targetPosition,
                                    behavior: 'smooth'
                                  });
                                }
                                // Then click the Gift AI tab after a delay
                                setTimeout(() => {
                                  const aiTab = document.querySelector('[data-tab-id="ai"]') as HTMLElement;
                                  if (aiTab) {
                                    aiTab.click();
                                  }
                                }, 300);
                              }, 3700); // 0.8s for plane + 2.4s for text + 0.5s delay
                            }}
                            className="font-manrope font-bold text-xl"
                          />
                          
                        </motion.div>
                      )}
                      
                      {/* CTA Button - Only show for slides other than the first two */}
                      {slide.id !== 0 && slide.id !== 1 && (
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.8, duration: 0.6 }}
                          className="mt-12"
                        >
                          <UniqueButton
                            width="220px"
                            height="70px"
                            className="font-manrope font-bold text-xl"
                          >
                            Get Started Today
                          </UniqueButton>
                        </motion.div>
                      )}
                    </motion.div>
                  </div>
                )}
              </div>
            </motion.div>
            </>
          );
        })}
      </AnimatePresence>



      {/* Bottom Tabs - Moved to be part of the hero content */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-sm border-t border-white/10">

      </div>

      {/* Section Separator */}
      <div className={`absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t ${isDark ? 'from-gray-900' : 'from-white'} to-transparent`}></div>
      
      {/* Testimonial Detail Modal */}
      <AnimatePresence>
        {isModalOpen && modalTestimonial && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              className={`${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className={`relative p-6 border-b ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  ✕
                </button>
                
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={modalTestimonial.img} alt={modalTestimonial.name} />
                    <AvatarFallback className={`${isDark ? 'bg-emerald-900/30 text-emerald-300' : 'bg-green-100 text-green-600'} text-xl font-semibold`}>
                      {modalTestimonial.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{modalTestimonial.name}</h2>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} flex items-center gap-2`}>
                      <span>{modalTestimonial.location}</span>
                      <span>{modalTestimonial.country}</span>
                    </p>
                    <p className={`text-sm ${isDark ? 'text-emerald-300' : 'text-green-600'} font-medium mt-1`}>
                      Member since {modalTestimonial.memberSince}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className={`${isDark ? 'bg-emerald-900/20 border border-emerald-700/40' : 'bg-green-50'} rounded-lg p-4 text-center`}>
                    <div className={`text-2xl font-bold ${isDark ? 'text-emerald-300' : 'text-green-600'}`}>{modalTestimonial.savings}</div>
                    <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Annual Savings</div>
                  </div>
                  <div className={`${isDark ? 'bg-blue-900/20 border border-blue-700/40' : 'bg-blue-50'} rounded-lg p-4 text-center`}>
                    <div className={`text-2xl font-bold ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>{modalTestimonial.age}</div>
                    <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Age</div>
                  </div>
                  <div className={`${isDark ? 'bg-emerald-900/20 border border-emerald-700/40' : 'bg-green-50'} rounded-lg p-4 text-center col-span-2 md:col-span-1`}>
                    <div className={`text-lg font-bold ${isDark ? 'text-emerald-300' : 'text-green-600'}`}>{modalTestimonial.plan}</div>
                    <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Plan</div>
                  </div>
                </div>
                
                {/* Original Testimonial */}
                <div className={`${isDark ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg p-4`}>
                  <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Quick Review</h3>
                  <blockquote className={`${isDark ? 'text-gray-300' : 'text-gray-700'} italic`}>
                    "{modalTestimonial.body}"
                  </blockquote>
                </div>
                
                {/* Detailed Story */}
                <div>
                  <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Here's more information</h3>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed text-lg`}>
                    {modalTestimonial.detailedStory}
                  </p>
                </div>
                
                {/* Favorite Feature */}
                <div className={`bg-gradient-to-r ${isDark ? 'from-emerald-900/20 to-cyan-900/20 border border-white/10' : 'from-green-50 to-blue-50'} rounded-lg p-4`}>
                  <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Favorite Feature</h3>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{modalTestimonial.favoriteFeature}</p>
                </div>
                

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Hero;
