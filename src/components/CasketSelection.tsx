import React, { useState } from 'react';
import { CreditCard, Check, Phone, Mail, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface Casket {
  id: number;
  name: string;
  material: string;
  price: string;
  description: string;
  features: string[];
  category: 'traditional' | 'modern' | 'premium' | 'budget';
}

const CasketSelection: React.FC = () => {
  const { isDark } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Track expanded casket cards (collapsed by default)
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
  const toggleCard = (id: number) => {
    setExpandedCards(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);

  // Items per slide configuration
  const itemsPerSlide = {
    mobile: 1,
    tablet: 2,
    desktop: 3
  };

  const caskets: Casket[] = [
    {
      id: 1,
      name: "Maple Serenity",
      material: "Solid Maple",
      price: "R12,500",
      description: "Elegant solid maple with satin finish",
      category: 'traditional',
      features: ["Solid hardwood", "Satin finish", "Full interment"]
    },
    {
      id: 2,
      name: "Oak Heritage",
      material: "American Oak",
      price: "R15,800",
      description: "Classic American oak with brass accents",
      category: 'premium',
      features: ["American oak", "Brass hardware", "Velvet interior"]
    },
    {
      id: 3,
      name: "Cherry Blossom",
      material: "Cherry Wood",
      price: "R11,200",
      description: "Beautiful cherry wood with natural grain",
      category: 'modern',
      features: ["Cherry hardwood", "Natural finish", "Basic interment"]
    },
    {
      id: 4,
      name: "Ebony Majesty",
      material: "Ebony Veneer",
      price: "R18,900",
      description: "Luxurious ebony veneer with gold accents",
      category: 'premium',
      features: ["Ebony veneer", "Gold hardware", "Premium interior", "Full service"]
    },
    {
      id: 5,
      name: "Pine Comfort",
      material: "Knotty Pine",
      price: "R8,500",
      description: "Warm knotty pine for traditional ceremonies",
      category: 'budget',
      features: ["Knotty pine", "Simple design", "Budget friendly"]
    },
    {
      id: 6,
      name: "Mahogany Royal",
      material: "Mahogany",
      price: "R22,000",
      description: "Premium mahogany with ornate carvings",
      category: 'premium',
      features: ["Solid mahogany", "Ornate carvings", "Luxury interior", "Complete service"]
    },
    {
      id: 7,
      name: "Walnut Classic",
      material: "Walnut",
      price: "R14,200",
      description: "Rich walnut with traditional styling",
      category: 'traditional',
      features: ["Solid walnut", "Traditional design", "Full interment"]
    },
    {
      id: 8,
      name: "Birch Harmony",
      material: "Birch Wood",
      price: "R9,800",
      description: "Light birch wood with clean lines",
      category: 'modern',
      features: ["Birch hardwood", "Modern design", "Essential service"]
    }
  ];

  const filteredCaskets = selectedCategory === 'all'
    ? caskets
    : caskets.filter(casket => casket.category === selectedCategory);

  // Carousel navigation functions
  const getItemsPerSlide = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 768) return itemsPerSlide.mobile;
      if (window.innerWidth < 1024) return itemsPerSlide.tablet;
      return itemsPerSlide.desktop;
    }
    return itemsPerSlide.desktop;
  };

  const maxSlides = Math.ceil(filteredCaskets.length / getItemsPerSlide());

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % maxSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + maxSlides) % maxSlides);
  };

  const getVisibleCaskets = () => {
    const itemsPerSlide = getItemsPerSlide();
    const startIndex = currentSlide * itemsPerSlide;
    return filteredCaskets.slice(startIndex, startIndex + itemsPerSlide);
  };

  const categories = [
    { id: 'all', label: 'All Caskets', count: caskets.length },
    { id: 'traditional', label: 'Traditional', count: caskets.filter(c => c.category === 'traditional').length },
    { id: 'modern', label: 'Modern', count: caskets.filter(c => c.category === 'modern').length },
    { id: 'premium', label: 'Premium', count: caskets.filter(c => c.category === 'premium').length },
    { id: 'budget', label: 'Budget Friendly', count: caskets.filter(c => c.category === 'budget').length }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      

      {/* Header */}
      <div className="text-center mb-12">
        <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-full mb-6 ${
          isDark ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-800'
        }`}>
          <CreditCard className="w-5 h-5" />
          <span className="font-medium">Casket Selection</span>
        </div>
        <h2 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Choose with Dignity
        </h2>
        <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          Our collection of caskets honors every life with beauty and respect. Each piece is crafted with care,
          reflecting the dignity of those we serve across South Africa.
        </p>
      </div>

      {/* Filter Options */}
      <div className="mb-8">
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? (isDark ? 'bg-green-600 text-white' : 'bg-green-500 text-white')
                  : (isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
              }`}
            >
              {category.label} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Caskets Carousel */}
      <div className="relative mb-12">
        {/* Navigation Arrows */}
        {maxSlides > 1 && (
          <>
            <button
              onClick={prevSlide}
              className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full shadow-lg transition-all duration-200 ${
                isDark
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white'
                  : 'bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900'
              }`}
              aria-label="Previous caskets"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full shadow-lg transition-all duration-200 ${
                isDark
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white'
                  : 'bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900'
              }`}
              aria-label="Next caskets"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Carousel Container */}
        <div className="overflow-hidden">
          <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {Array.from({ length: maxSlides }).map((_, slideIndex) => (
              <div key={slideIndex} className="flex-shrink-0 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
                  {filteredCaskets.slice(slideIndex * getItemsPerSlide(), (slideIndex + 1) * getItemsPerSlide()).map((casket) => {
                    const isExpanded = expandedCards.has(casket.id);
                    return (
                      <div
                        key={casket.id}
                        className={`rounded-2xl overflow-hidden shadow-lg border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                        }`}
                      >
                        {/* Casket Image Placeholder */}
                        <div className={`aspect-square relative overflow-hidden ${
                          isDark ? 'bg-gray-700' : 'bg-gray-100'
                        }`}>
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center">
                              <CreditCard className={`w-16 h-16 mx-auto mb-4 ${
                                isDark ? 'text-gray-500' : 'text-gray-400'
                              }`} />
                              <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                {casket.name}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Casket Details */}
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className={`text-lg font-semibold ${
                              isDark ? 'text-white' : 'text-gray-900'
                            }`}>
                              {casket.name}
                            </h3>
                            <span className="text-lg font-bold text-green-600">
                              {casket.price}
                            </span>
                          </div>

                          <p className={`text-sm mb-3 font-medium ${
                            isDark ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {casket.material}
                          </p>

                          {isExpanded && (
                            <p className={`text-sm mb-4 leading-relaxed ${
                              isDark ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              {casket.description}
                            </p>
                          )}

                          {/* Features */}
                          {isExpanded && (
                            <div className="mb-4">
                              <h4 className={`text-sm font-medium mb-2 ${
                                isDark ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                                Includes:
                              </h4>
                              <ul className="text-xs space-y-1">
                                {casket.features.map((feature, index) => (
                                  <li key={index} className={`flex items-center ${
                                    isDark ? 'text-gray-400' : 'text-gray-600'
                                  }`}>
                                    <Check className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => toggleCard(casket.id)}
                              className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                isDark
                                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {isExpanded ? 'Hide Details' : 'View Details'}
                            </button>
                            <button className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                              isDark
                                ? 'bg-green-600 hover:bg-green-500 text-white'
                                : 'bg-green-500 hover:bg-green-600 text-white'
                            }`}>
                              Inquire Now
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Indicators */}
        {maxSlides > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: maxSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentSlide
                    ? (isDark ? 'bg-green-400' : 'bg-green-600')
                    : (isDark ? 'bg-gray-600' : 'bg-gray-300')
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className={`text-center p-8 rounded-2xl ${
        isDark ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'
      }`}>
        <h3 className={`text-2xl font-bold mb-4 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          Need Personal Guidance?
        </h3>
        <p className={`text-lg mb-6 ${
          isDark ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Our compassionate team is here to help you choose the perfect casket with dignity and care.
          Every selection reflects the unique life being honored.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="tel:0860111222"
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              isDark ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-green-500 hover:bg-green-600 text-white'
            } shadow-lg`}
          >
            <Phone className="w-5 h-5" />
            Call: 0860 111 222
          </a>
          <a
            href="mailto:support@ubuntugift.co.za"
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 border ${
              isDark
                ? 'border-green-600 text-green-400 hover:bg-green-600 hover:text-white'
                : 'border-green-500 text-green-600 hover:bg-green-500 hover:text-white'
            }`}
          >
            <Mail className="w-5 h-5" />
            Email Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default CasketSelection;
