import React from 'react';
import { Carousel, TestimonialCard } from './ui/retro-testimonial';
import { useTheme } from '../contexts/ThemeContext';

interface FeedbackProps {
  isSidebarCollapsed: boolean;
}

const testimonials = [
  {
    name: 'Vinesh Bissin',
    designation: 'Family Member',
    description: 'Khambi Funeral Services provided such compassionate care during our difficult time. Their team handled everything with dignity and respect for our traditions.',
    profileImage: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&auto=format&fit=crop&q=60'
  },
  {
    name: 'Bukeka Msibi',
    designation: 'Family Member',
    description: 'When we needed help with arrangements, Khambi was there. They guided us through every step and honored our cultural customs beautifully.',
    profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=60'
  },
  {
    name: 'Violet Joseph',
    designation: 'Family Member',
    description: 'The memorial service arranged by Khambi brought our community together. Their attention to detail and compassionate approach meant everything.',
    profileImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=60'
  },
  {
    name: 'Maria Maswangai',
    designation: 'Family Member',
    description: 'Khambi helped us create a meaningful farewell for our loved one. Their support during our time of grief was truly comforting.',
    profileImage: 'https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?w=400&auto=format&fit=crop&q=60'
  },
  {
    name: 'Salim Jadwat',
    designation: 'Family Member',
    description: 'From the initial consultation to the final ceremony, Khambi handled everything with such care and respect. We are deeply grateful.',
    profileImage: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=400&auto=format&fit=crop&q=60'
  },
  {
    name: 'Rakesh Ramal',
    designation: 'Family Member',
    description: 'Khambi understood our needs and helped us honor our loved one in a way that reflected our family\'s values and traditions.',
    profileImage: 'https://images.unsplash.com/photo-1546525848-3ce03ca516f6?w=400&auto=format&fit=crop&q=60'
  },
  {
    name: 'Trevor Williams',
    designation: 'Family Member',
    description: 'During our most difficult time, Khambi provided comfort and dignity. Their compassionate service helped us find peace.',
    profileImage: 'https://images.unsplash.com/photo-1544005313-ef5b7f8e3e32?w=400&auto=format&fit=crop&q=60'
  },
  {
    name: 'Martina Van Wyk',
    designation: 'Family Member',
    description: 'Khambi created a beautiful memorial that honored our loved one perfectly. Their care and attention to detail brought us comfort.',
    profileImage: 'https://images.unsplash.com/photo-1541216970279-affbfdd55aa8?w=400&auto=format&fit=crop&q=60'
  }
];

const Feedback: React.FC<FeedbackProps> = ({ isSidebarCollapsed }) => {
  const { isDark } = useTheme();
  return (
    <section className={`py-20 transition-all duration-700 ease-in-out border-b scroll-mt-32 ${
      isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'
    }`}>
      <div className="mx-auto px-4" style={{ maxWidth: '90rem' }}>
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
              Family Stories
            </span>
          </div>
          <h2 id="feedback" className={`text-4xl font-bold text-center mb-4 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
            Stories of Dignity & Care
          </h2>
          <p className={`text-xl text-center mb-16 max-w-3xl mx-auto ${
          isDark ? 'text-gray-300' : 'text-gray-600'
        }`}>
            Heartfelt stories from families who found comfort and dignity with Khambi Funeral Services.
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <Carousel
            items={testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                testimonial={testimonial}
                index={index}
                onCardClose={() => {}}
              />
            ))}
          />
        </div>
      </div>
    </section>
  );
};

export default Feedback;
