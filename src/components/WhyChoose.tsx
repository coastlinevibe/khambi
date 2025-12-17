import React from 'react';
import { Shield } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface WhyChooseProps {
  isSidebarCollapsed: boolean;
}

const WhyChoose: React.FC<WhyChooseProps> = ({ isSidebarCollapsed }) => {
  const { isDark } = useTheme();
  const features = [
    {
      // Replaces Lucide Shield with custom icon
      img: '/icons/immunity.png',
      title: "Dignified Service",
      description: "Every service is conducted with the utmost respect and dignity, honoring cultural traditions and family wishes with compassion.",
      size: 'w-[37px] h-[37px] md:w-[45px] md:h-[45px]'
    },
    {
      img: '/icons/duration-alt.png',
      title: "24/7 Support",
      description: "Our compassionate team is available around the clock to support families during their most difficult moments.",
    },
    {
      img: '/icons/features-alt.png',
      title: "Cultural Respect",
      description: "We honor diverse cultural and religious traditions across Gauteng, providing services that reflect each family's unique heritage.",
    },
    {
      img: '/icons/population-globe.png',
      title: "Community Network",
      description: "Extensive network of trusted funeral homes and service providers across Gauteng province for comprehensive support.",
    },
    {
      img: '/icons/users-loyalty.png',
      title: "Family-Centered",
      description: "We put families first, offering personalized guidance and support throughout the entire funeral planning process.",
    },
    {
      img: '/icons/skill.png',
      title: "Transparent Pricing",
      description: "Clear, honest pricing with no hidden fees. We believe families should focus on healing, not financial stress.",
    }
  ];

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
              Why Choose Khambi
            </span>
          </div>
          <h2 id="why-choose" className={`text-4xl lg:text-5xl font-bold mb-6 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Compassionate Funeral Care
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            We honor every life with dignity and respect. Here's what makes our approach to funeral services truly compassionate.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border group ${
                isDark 
                  ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
                  : 'bg-white border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ${
                isDark ? 'bg-khambi-accent/20' : 'bg-khambi-accent/10'
              } ring-1 ring-khambi-accent/30`}>
                {('img' in feature && feature.img) ? (
                  <img src={feature.img} alt={feature.title} className={`${(feature as any).size ?? 'w-8 h-8'} object-contain`} style={{ filter: 'sepia(100%) saturate(300%) brightness(70%) hue-rotate(15deg)' }} />
                ) : (
                  // Fallback to Lucide if needed
                  <Shield className="w-8 h-8 text-khambi-accent" />
                )}
              </div>
              <h3 className={`text-xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>{feature.title}</h3>
              <p className={`leading-relaxed ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20">
          <div className={`rounded-2xl shadow-lg p-8 md:p-12 ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-khambi-accent mb-2">1000's</div>
                <div className={isDark ? 'text-gray-300' : 'text-gray-600'}>of Families Cared For</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-khambi-accent mb-2">5+</div>
                <div className={isDark ? 'text-gray-300' : 'text-gray-600'}>Service Locations</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-khambi-accent mb-2">24/7</div>
                <div className={isDark ? 'text-gray-300' : 'text-gray-600'}>Compassionate Support</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-khambi-accent mb-2">98%</div>
                <div className={isDark ? 'text-gray-300' : 'text-gray-600'}>Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>


      </div>
    </section>
  );
};

export default WhyChoose;