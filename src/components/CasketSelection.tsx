import React, { useState } from 'react';
import { CreditCard, Check, Phone, Mail } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface Casket {
  id: number;
  name: string;
  material: string;
  price: string;
  description: string;
  features: string[];
  category: 'traditional' | 'modern' | 'premium' | 'budget';
  image?: string;
}

interface Tombstone {
  id: number;
  name: string;
  material: string;
  price: string;
  description: string;
  features: string[];
  category: 'granite' | 'marble' | 'bronze' | 'custom';
  image?: string;
}

const CasketSelection: React.FC = () => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'coffins' | 'tombstones'>('coffins');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAllCoffins, setShowAllCoffins] = useState(false);
  const [showAllTombstones, setShowAllTombstones] = useState(false);

  // Track expanded cards (collapsed by default)
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
  const toggleCard = (id: number) => {
    setExpandedCards(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const caskets: Casket[] = [
    {
      id: 1,
      name: "Cherry Elegance",
      material: "Cherry Wood",
      price: "R12,500",
      description: "Deep cherry wood with silver handles and white satin interior",
      category: 'traditional',
      features: ["Solid cherry wood", "Silver handles", "White satin interior", "Half-couch design"],
      image: "/images/cas1.jpg"
    },
    {
      id: 2,
      name: "Pecan Heritage",
      material: "Pecan Wood",
      price: "R15,800",
      description: "Medium brown pecan with gold handles and white interior",
      category: 'traditional',
      features: ["Solid pecan wood", "Gold handles", "White interior", "Half-couch design"],
      image: "/images/cas2.jpg"
    },
    {
      id: 3,
      name: "Mahogany Prestige",
      material: "Mahogany",
      price: "R18,900",
      description: "Rich mahogany with gold handles and premium finish",
      category: 'premium',
      features: ["Solid mahogany", "Gold handles", "Premium finish", "Half-couch design"],
      image: "/images/cas3.jpg"
    },
    {
      id: 4,
      name: "Charcoal Dignity",
      material: "Steel",
      price: "R14,200",
      description: "Dark grey steel with silver handles and white interior",
      category: 'modern',
      features: ["Steel construction", "Silver handles", "White interior", "Half-couch design"],
      image: "/images/cas4.jpg"
    },
    {
      id: 5,
      name: "Navy Serenity",
      material: "Steel",
      price: "R16,500",
      description: "Deep blue steel with gold handles and white interior",
      category: 'premium',
      features: ["Steel construction", "Gold handles", "White satin interior", "Half-couch design"],
      image: "/images/cas5.jpg"
    },
    {
      id: 6,
      name: "Pecan Comfort",
      material: "Pecan Wood",
      price: "R13,800",
      description: "Light pecan wood with gold handles and ruffled white interior",
      category: 'budget',
      features: ["Pecan wood", "Gold handles", "Ruffled interior", "Half-couch design"],
      image: "/images/cas6.jpg"
    }
  ];

  const tombstones: Tombstone[] = [
    {
      id: 1,
      name: "Royal Monument",
      material: "Black Granite",
      price: "R28,500",
      description: "Premium black granite full monument with pillars and platform",
      category: 'granite',
      features: ["Polished black granite", "Decorative pillars", "Full platform base", "Custom engraving"],
      image: "/images/tomb1.jpeg"
    },
    {
      id: 2,
      name: "Classic Upright",
      material: "Grey Granite",
      price: "R12,000",
      description: "Traditional grey granite upright headstone",
      category: 'granite',
      features: ["Grey granite", "Upright design", "Standard engraving", "Weather resistant"],
      image: "/images/tomb2.jpeg"
    },
    {
      id: 3,
      name: "Heritage Stone",
      material: "Mixed Granite",
      price: "R18,500",
      description: "Beige granite with black panels and modern design",
      category: 'custom',
      features: ["Beige and black granite", "Mixed materials", "Photo panel option", "Custom inscription"],
      image: "/images/tomb3.jpeg"
    },
    {
      id: 4,
      name: "Azure Memorial",
      material: "Blue Granite",
      price: "R15,800",
      description: "Striking blue granite upright with decorative elements",
      category: 'granite',
      features: ["Blue granite", "Decorative design", "Photo engraving", "Custom lettering"],
      image: "/images/tomb4.jpeg"
    },
    {
      id: 5,
      name: "Eternal Rest",
      material: "Grey Granite",
      price: "R22,000",
      description: "Full grey granite monument with vase holder and headstone",
      category: 'granite',
      features: ["Grey granite", "Full monument", "Vase holder", "Premium finish"],
      image: "/images/tomb5.jpeg"
    },
    {
      id: 6,
      name: "Ocean Tribute",
      material: "Blue Granite",
      price: "R16,500",
      description: "Blue granite flat grave cover with bronze anchor emblem",
      category: 'bronze',
      features: ["Blue granite base", "Bronze anchor emblem", "Flat grave cover", "Custom inscription"],
      image: "/images/tomb6.jpeg"
    }
  ];

  const filteredCaskets = selectedCategory === 'all'
    ? caskets
    : caskets.filter(casket => casket.category === selectedCategory);

  const filteredTombstones = selectedCategory === 'all'
    ? tombstones
    : tombstones.filter(tombstone => tombstone.category === selectedCategory);

  // Show only 6 items initially
  const displayedCoffins = showAllCoffins ? filteredCaskets : filteredCaskets.slice(0, 6);
  const displayedTombstones = showAllTombstones ? filteredTombstones : filteredTombstones.slice(0, 6);

  const coffinCategories = [
    { id: 'all', label: 'All Coffins', count: caskets.length },
    { id: 'traditional', label: 'Traditional', count: caskets.filter(c => c.category === 'traditional').length },
    { id: 'modern', label: 'Modern', count: caskets.filter(c => c.category === 'modern').length },
    { id: 'premium', label: 'Premium', count: caskets.filter(c => c.category === 'premium').length },
    { id: 'budget', label: 'Budget Friendly', count: caskets.filter(c => c.category === 'budget').length }
  ];

  const tombstoneCategories = [
    { id: 'all', label: 'All Tombstones', count: tombstones.length },
    { id: 'granite', label: 'Granite', count: tombstones.filter(t => t.category === 'granite').length },
    { id: 'marble', label: 'Marble', count: tombstones.filter(t => t.category === 'marble').length },
    { id: 'bronze', label: 'Bronze', count: tombstones.filter(t => t.category === 'bronze').length },
    { id: 'custom', label: 'Custom', count: tombstones.filter(t => t.category === 'custom').length }
  ];

  const currentCategories = activeTab === 'coffins' ? coffinCategories : tombstoneCategories;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-full mb-6 ${
          isDark ? 'bg-khambi-accent/20 text-khambi-accent' : 'bg-khambi-accent/10 text-khambi-gold'
        }`}>
          <CreditCard className="w-5 h-5" />
          <span className="font-medium">{activeTab === 'coffins' ? 'Coffin' : 'Tombstone'} Selection</span>
        </div>
        <h2 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Choose with Dignity
        </h2>
        <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          Our collection honors every life with beauty and respect. Each piece is crafted with care,
          reflecting the dignity of those we serve across Gauteng.
        </p>
      </div>

      {/* Main Tabs: Coffins | Tombstones */}
      <div className="mb-8">
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => {
              setActiveTab('coffins');
              setSelectedCategory('all');
              setExpandedCards(new Set());
            }}
            className={`px-8 py-3 rounded-xl text-lg font-semibold transition-all ${
              activeTab === 'coffins'
                ? 'bg-khambi-primary text-white ring-2 ring-white'
                : (isDark ? 'bg-gray-700 text-gray-300 hover:bg-khambi-darkgray' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
            }`}
          >
            Coffins
          </button>
          <button
            onClick={() => {
              setActiveTab('tombstones');
              setSelectedCategory('all');
              setExpandedCards(new Set());
            }}
            className={`px-8 py-3 rounded-xl text-lg font-semibold transition-all ${
              activeTab === 'tombstones'
                ? 'bg-khambi-primary text-white ring-2 ring-white'
                : (isDark ? 'bg-gray-700 text-gray-300 hover:bg-khambi-darkgray' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
            }`}
          >
            Tombstones
          </button>
        </div>

        {/* Category Filter Options */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {currentCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? (isDark ? 'bg-khambi-gold text-black' : 'bg-khambi-gold text-black')
                  : (isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
              }`}
            >
              {category.label} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      <div className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {activeTab === 'coffins' ? (
            displayedCoffins.map((casket) => {
              const isExpanded = expandedCards.has(casket.id);
              return (
                <div
                  key={casket.id}
                  className={`rounded-2xl overflow-hidden shadow-lg border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                    isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}
                >
                  {/* Image */}
                  <div className={`aspect-square relative overflow-hidden ${
                    isDark ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    {casket.image ? (
                      <img
                        src={casket.image}
                        alt={casket.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
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
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={`text-lg font-semibold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {casket.name}
                      </h3>
                      <span className="text-lg font-bold text-khambi-gold">
                        {casket.price}
                      </span>
                    </div>

                    <p className={`text-sm mb-3 font-medium ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {casket.material}
                    </p>

                    {isExpanded && (
                      <>
                        <p className={`text-sm mb-4 leading-relaxed ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {casket.description}
                        </p>

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
                                <Check className="w-3 h-3 text-khambi-accent mr-2 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
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
                          ? 'bg-khambi-accent hover:bg-khambi-gold text-black'
                          : 'bg-khambi-accent hover:bg-khambi-gold text-black'
                      }`}>
                        Inquire Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            displayedTombstones.map((tombstone) => {
              const isExpanded = expandedCards.has(tombstone.id);
              return (
                <div
                  key={tombstone.id}
                  className={`rounded-2xl overflow-hidden shadow-lg border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                    isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}
                >
                  {/* Image */}
                  <div className={`aspect-square relative overflow-hidden ${
                    isDark ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    {tombstone.image ? (
                      <img
                        src={tombstone.image}
                        alt={tombstone.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <CreditCard className={`w-16 h-16 mx-auto mb-4 ${
                            isDark ? 'text-gray-500' : 'text-gray-400'
                          }`} />
                          <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {tombstone.name}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={`text-lg font-semibold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {tombstone.name}
                      </h3>
                      <span className="text-lg font-bold text-khambi-gold">
                        {tombstone.price}
                      </span>
                    </div>

                    <p className={`text-sm mb-3 font-medium ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {tombstone.material}
                    </p>

                    {isExpanded && (
                      <>
                        <p className={`text-sm mb-4 leading-relaxed ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {tombstone.description}
                        </p>

                        <div className="mb-4">
                          <h4 className={`text-sm font-medium mb-2 ${
                            isDark ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            Includes:
                          </h4>
                          <ul className="text-xs space-y-1">
                            {tombstone.features.map((feature, index) => (
                              <li key={index} className={`flex items-center ${
                                isDark ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                <Check className="w-3 h-3 text-khambi-accent mr-2 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleCard(tombstone.id)}
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
                          ? 'bg-khambi-accent hover:bg-khambi-gold text-black'
                          : 'bg-khambi-accent hover:bg-khambi-gold text-black'
                      }`}>
                        Inquire Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Read More Button */}
        {activeTab === 'coffins' && filteredCaskets.length > 6 && !showAllCoffins && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setShowAllCoffins(true)}
              className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                isDark
                  ? 'bg-khambi-accent hover:bg-khambi-gold text-black'
                  : 'bg-khambi-accent hover:bg-khambi-gold text-black'
              }`}
            >
              Read More ({filteredCaskets.length - 6} more coffins)
            </button>
          </div>
        )}

        {activeTab === 'tombstones' && filteredTombstones.length > 6 && !showAllTombstones && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setShowAllTombstones(true)}
              className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                isDark
                  ? 'bg-khambi-accent hover:bg-khambi-gold text-black'
                  : 'bg-khambi-accent hover:bg-khambi-gold text-black'
              }`}
            >
              Read More ({filteredTombstones.length - 6} more tombstones)
            </button>
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
            href="tel:0128201084"
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              isDark ? 'bg-khambi-accent hover:bg-khambi-gold text-black' : 'bg-khambi-accent hover:bg-khambi-gold text-black'
            } shadow-lg`}
          >
            <Phone className="w-5 h-5" />
            Call: 012 820 1084
          </a>
          <a
            href="mailto:khambi@khambifunerals.co.za"
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 border ${
              isDark
                ? 'border-khambi-accent text-khambi-accent hover:bg-khambi-accent hover:text-black'
                : 'border-khambi-accent text-khambi-primary hover:bg-khambi-accent hover:text-black'
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
