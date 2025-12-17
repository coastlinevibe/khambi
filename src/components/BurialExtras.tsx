import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Check, MessageSquare } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ExtraOption {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  image?: string;
}

interface ExtraCategory {
  id: string;
  title: string;
  icon: string;
  options: ExtraOption[];
}

const BurialExtras: React.FC = () => {
  const { isDark } = useTheme();
  const [selectedExtras, setSelectedExtras] = useState<{ [key: string]: string }>({});
  const [comments, setComments] = useState<{ [key: string]: string }>({});
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const scrollRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const extrasData: ExtraCategory[] = [
    {
      id: 'venue',
      title: 'Venue Rental',
      icon: '🏛️',
      options: [
        {
          id: 'venue-1',
          name: 'Community Hall',
          price: 2500,
          description: 'Spacious community hall suitable for 100-150 guests',
          features: ['Seating for 150', 'Sound system', 'Kitchen facilities', 'Parking available'],
          image: '/images/venue1.jpg'
        },
        {
          id: 'venue-2',
          name: 'Church Hall',
          price: 3500,
          description: 'Traditional church hall with elegant atmosphere',
          features: ['Seating for 200', 'Organ/Piano', 'Air conditioning', 'Catering area'],
          image: '/images/venue2.jpg'
        },
        {
          id: 'venue-3',
          name: 'Premium Event Center',
          price: 5000,
          description: 'Modern event center with full amenities',
          features: ['Seating for 300', 'AV equipment', 'Catering kitchen', 'VIP lounge'],
          image: '/images/venue3.jpg'
        }
      ]
    },
    {
      id: 'flowers',
      title: 'Floral Arrangements',
      icon: '🌸',
      options: [
        {
          id: 'flowers-1',
          name: 'Simple Bouquet',
          price: 800,
          description: 'Elegant white roses and lilies arrangement',
          features: ['White roses', 'Lilies', 'Greenery', 'Ribbon'],
          image: '/images/flowers1.jpg'
        },
        {
          id: 'flowers-2',
          name: 'Premium Spray',
          price: 1500,
          description: 'Large coffin spray with mixed seasonal flowers',
          features: ['Mixed flowers', 'Premium arrangement', 'Custom colors', 'Delivery included'],
          image: '/images/flowers2.jpg'
        },
        {
          id: 'flowers-3',
          name: 'Deluxe Package',
          price: 2500,
          description: 'Complete floral package including spray, wreaths, and arrangements',
          features: ['Coffin spray', '2 Wreaths', 'Altar arrangements', 'Graveside flowers'],
          image: '/images/flowers3.jpg'
        }
      ]
    },
    {
      id: 'music',
      title: 'Music & Entertainment',
      icon: '🎵',
      options: [
        {
          id: 'music-1',
          name: 'Recorded Music',
          price: 500,
          description: 'Professional sound system with curated playlist',
          features: ['Sound system', 'Curated playlist', 'Operator included', '4 hours'],
          image: '/images/music1.jpg'
        },
        {
          id: 'music-2',
          name: 'Live Choir',
          price: 2000,
          description: 'Professional choir for ceremony',
          features: ['4-6 singers', '5 hymns', 'Rehearsal included', 'Traditional songs'],
          image: '/images/music2.jpg'
        },
        {
          id: 'music-3',
          name: 'Full DJ Service',
          price: 3000,
          description: 'Professional DJ with equipment for ceremony and after-tears',
          features: ['Professional DJ', 'Premium equipment', 'Music library', '6 hours'],
          image: '/images/music3.jpg'
        }
      ]
    },
    {
      id: 'streaming',
      title: 'Live Streaming',
      icon: '📹',
      options: [
        {
          id: 'stream-1',
          name: 'Basic Streaming',
          price: 1000,
          description: 'Single camera live stream to online platform',
          features: ['1 camera', 'Live streaming', 'Recording included', 'Up to 100 viewers'],
          image: '/images/stream1.jpg'
        },
        {
          id: 'stream-2',
          name: 'Premium Streaming',
          price: 2000,
          description: 'Multi-camera professional streaming service',
          features: ['2 cameras', 'Professional editing', 'HD quality', 'Unlimited viewers'],
          image: '/images/stream2.jpg'
        }
      ]
    },
    {
      id: 'catering',
      title: 'Catering Services',
      icon: '🍽️',
      options: [
        {
          id: 'catering-1',
          name: 'Light Refreshments',
          price: 3000,
          description: 'Tea, coffee, and light snacks for 50 people',
          features: ['Tea & coffee', 'Sandwiches', 'Scones', 'Serves 50'],
          image: '/images/catering1.jpg'
        },
        {
          id: 'catering-2',
          name: 'Standard Meal',
          price: 5000,
          description: 'Full meal service for 50 people',
          features: ['Main course', 'Side dishes', 'Beverages', 'Serves 50'],
          image: '/images/catering2.jpg'
        },
        {
          id: 'catering-3',
          name: 'Premium Buffet',
          price: 8000,
          description: 'Deluxe buffet with multiple options for 50 people',
          features: ['Multiple mains', 'Salads & sides', 'Desserts', 'Full beverage service'],
          image: '/images/catering3.jpg'
        }
      ]
    },
    {
      id: 'transport',
      title: 'Additional Transportation',
      icon: '🚗',
      options: [
        {
          id: 'transport-1',
          name: 'Extra Family Car',
          price: 1500,
          description: 'Additional luxury sedan for family members',
          features: ['Luxury sedan', 'Professional driver', 'Full day service', 'Up to 4 passengers'],
          image: '/images/transport1.jpg'
        },
        {
          id: 'transport-2',
          name: 'Minibus',
          price: 2500,
          description: 'Minibus for extended family transport',
          features: ['14-seater minibus', 'Professional driver', 'Full day service', 'Air conditioned'],
          image: '/images/transport2.jpg'
        },
        {
          id: 'transport-3',
          name: 'Luxury Coach',
          price: 4000,
          description: 'Full-size luxury coach for large groups',
          features: ['50-seater coach', 'Professional driver', 'Full day service', 'Premium comfort'],
          image: '/images/transport3.jpg'
        }
      ]
    }
  ];

  const scroll = (categoryId: string, direction: 'left' | 'right') => {
    const container = scrollRefs.current[categoryId];
    if (container) {
      const scrollAmount = 320;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const toggleExtra = (categoryId: string, optionId: string) => {
    setSelectedExtras(prev => ({
      ...prev,
      [categoryId]: prev[categoryId] === optionId ? '' : optionId
    }));
  };

  const calculateTotal = () => {
    let total = 0;
    Object.entries(selectedExtras).forEach(([categoryId, optionId]) => {
      if (optionId) {
        const category = extrasData.find(c => c.id === categoryId);
        const option = category?.options.find(o => o.id === optionId);
        if (option) total += option.price;
      }
    });
    return total;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Burial Extras
        </h2>
        <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          Enhance the service with additional options. Select from each category and add special requests.
        </p>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        {extrasData.map((category) => {
          const isExpanded = expandedCategories.has(category.id);
          const isSelected = !!selectedExtras[category.id];
          
          return (
            <div 
              key={category.id} 
              style={{ borderColor: '#B8935E', borderWidth: '1px' }}
              className={`rounded-2xl overflow-hidden transition-all ${
                isDark ? 'bg-gray-800' : 'bg-white'
              } ${isSelected ? 'ring-2 ring-khambi-gold' : ''}`}
            >
              {/* Category Header - Clickable */}
              <button
                onClick={() => toggleCategory(category.id)}
                className={`w-full flex items-center justify-between p-6 transition-colors ${
                  isDark ? 'hover:bg-gray-750' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center ${
                    isDark ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    {category.options[0]?.image ? (
                      <img
                        src={category.options[0].image}
                        alt={category.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl">{category.icon}</span>
                    )}
                  </div>
                  <div className="text-left">
                    <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {category.title}
                    </h3>
                    {isSelected && (
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {category.options.find(o => o.id === selectedExtras[category.id])?.name} selected
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {isSelected && (
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-khambi-gold text-black text-sm font-semibold">
                      <Check className="w-4 h-4" />
                      R{category.options.find(o => o.id === selectedExtras[category.id])?.price.toLocaleString()}
                    </div>
                  )}
                  <ChevronRight className={`w-6 h-6 transition-transform ${
                    isExpanded ? 'rotate-90' : ''
                  } ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                </div>
              </button>

              {/* Collapsible Content */}
              {isExpanded && (
                <div className="px-6 pb-6 pt-4">
                  {/* Horizontal Slider */}
                  <div className="relative">
              {/* Left Arrow */}
              <button
                onClick={() => scroll(category.id, 'left')}
                className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-white hover:bg-gray-100 text-gray-900'
                } shadow-lg`}
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Options Container */}
              <div
                ref={el => scrollRefs.current[category.id] = el}
                className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-12"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {category.options.map((option) => {
                  const isSelected = selectedExtras[category.id] === option.id;
                  return (
                    <div
                      key={option.id}
                      onClick={() => toggleExtra(category.id, option.id)}
                      style={{ borderColor: '#B8935E', borderWidth: '1px' }}
                      className={`flex-shrink-0 w-72 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
                        isSelected ? 'shadow-lg scale-105 ring-2 ring-khambi-gold' : ''
                      } ${isDark ? 'bg-gray-750' : 'bg-gray-50'}`}
                    >
                      {/* Image */}
                      <div className={`h-40 relative ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        {option.image ? (
                          <img
                            src={option.image}
                            alt={option.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl">
                            {category.icon}
                          </div>
                        )}
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-khambi-gold flex items-center justify-center">
                            <Check className="w-5 h-5 text-black" />
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {option.name}
                          </h4>
                          <span className="text-lg font-bold text-khambi-gold whitespace-nowrap ml-2">
                            R{option.price.toLocaleString()}
                          </span>
                        </div>
                        <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {option.description}
                        </p>
                        <ul className="space-y-1">
                          {option.features.slice(0, 3).map((feature, idx) => (
                            <li key={idx} className={`text-xs flex items-center ${
                              isDark ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              <Check className="w-3 h-3 text-khambi-accent mr-1 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Arrow */}
              <button
                onClick={() => scroll(category.id, 'right')}
                className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-white hover:bg-gray-100 text-gray-900'
                } shadow-lg`}
                aria-label="Scroll right"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

                  {/* Comment Field */}
                  <div className="mt-4">
                    <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <MessageSquare className="w-4 h-4" />
                      Special requests for {category.title}
                    </label>
                    <textarea
                      value={comments[category.id] || ''}
                      onChange={(e) => setComments(prev => ({ ...prev, [category.id]: e.target.value }))}
                      placeholder={`Any specific requirements or preferences for ${category.title.toLowerCase()}...`}
                      rows={2}
                      className={`w-full px-4 py-2 rounded-lg border text-sm ${
                        isDark
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      } focus:outline-none focus:ring-2 focus:ring-khambi-accent`}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary & Checkout */}
      <div className={`mt-12 p-8 rounded-2xl ${
        isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <span className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Total Extras
          </span>
          <span className="text-4xl font-bold text-khambi-gold">
            R{calculateTotal().toLocaleString()}
          </span>
        </div>
        <button className={`w-full px-6 py-4 rounded-xl font-semibold text-lg transition-all ${
          isDark
            ? 'bg-khambi-accent hover:bg-khambi-gold text-black'
            : 'bg-khambi-accent hover:bg-khambi-gold text-black'
        } shadow-lg hover:shadow-xl`}>
          Continue to Payment
        </button>
      </div>
    </div>
  );
};

export default BurialExtras;
