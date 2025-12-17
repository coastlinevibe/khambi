import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { ChevronDown, Check } from 'lucide-react';
import MemberSignUpForm from './MemberSignUpForm';

interface ThreePlanProps {
  onClose?: () => void;
}

type PlanType = 'single' | 'family' | 'extended';

const ThreePlan: React.FC<ThreePlanProps> = ({ onClose }) => {
  const { isDark } = useTheme();
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [expandedBenefit, setExpandedBenefit] = useState<PlanType | null>(null);

  const plans = [
    { 
      id: 'single' as PlanType, 
      label: 'BRONZE Plan',
      price: 'R15,000 Cover',
      benefits: [
        'Flat Lid Coffin',
        'Hearse + 1 Family Car',
        '50 Chairs & Standard Toilet',
        '10KG Ox Liver',
        'Graveside Decor',
        'Bereavement Counseling',
        'Late Estate (Will)',
        'Repatriation',
      ]
    },
    { 
      id: 'family' as PlanType, 
      label: 'SILVER Plan',
      price: 'R20,000 Cover',
      benefits: [
        'Face-view Casket',
        'Coffin Spray',
        'Hearse + 2 Family Cars',
        '50 Chairs & Standard Toilet',
        '10KG Ox Liver',
        'Graveside Decor',
        'Bereavement Counseling',
        'Late Estate (Will)',
        'Repatriation',
      ]
    },
    { 
      id: 'extended' as PlanType, 
      label: 'GOLD Plan',
      price: 'R25,000 Cover',
      benefits: [
        'Half-view Casket',
        'Coffin Spray',
        'Hearse + 2 Family Cars',
        '100 Chairs & VIP Toilet',
        'Funeral Programs + 1 Digital',
        '10KG Ox Liver',
        'Graveside Decor',
        'Bereavement Counseling',
        'Late Estate (Will)',
        'Repatriation',
      ]
    },
  ];

  const handlePlanSelect = (planId: PlanType) => {
    setSelectedPlan(planId);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        {onClose && (
          <button
            onClick={onClose}
            className={`mb-4 px-4 py-2 rounded-lg ${
              isDark ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}
          >
            ← Back
          </button>
        )}

        <div className="text-center mb-8">
          <h1 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Choose Your Funeral Plan
          </h1>
          <p className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Select a plan and click <span className="text-khambi-accent font-bold">"APPLY NOW"</span> to get started
          </p>
        </div>

        {/* Show form when a plan is selected */}
        {selectedPlan ? (
          <MemberSignUpForm planType={selectedPlan} onClose={() => setSelectedPlan(null)} />
        ) : (
          <div className="space-y-6">
            {/* Plan Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan, index) => (
                <div
                  key={plan.id}
                  style={{ borderColor: '#B8935E', borderWidth: '1px' }}
                  className={`rounded-xl overflow-hidden transition-all ${
                    isDark ? 'bg-gray-800' : 'bg-white'
                  } ${expandedBenefit === plan.id ? 'ring-2 ring-khambi-accent' : ''}`}
                >
                  {/* Plan Header with Background Image */}
                  <div className="relative h-48 overflow-hidden">
                    {/* Background Image */}
                    <img
                      src={index === 0 ? '/images/venue1.jpg' : index === 1 ? '/images/flowers2.jpg' : '/images/catering3.jpg'}
                      alt={plan.label}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>
                    {/* Content */}
                    <div className="relative h-full flex flex-col items-center justify-center text-center p-6">
                      <h3 className="text-3xl font-bold mb-2 text-white drop-shadow-lg">
                        {plan.label}
                      </h3>
                      <p className="text-4xl font-bold text-khambi-accent drop-shadow-lg">{plan.price}</p>
                    </div>
                  </div>

                  {/* Benefits List */}
                  <div className="p-6">
                    <button
                      onClick={() => setExpandedBenefit(expandedBenefit === plan.id ? null : plan.id)}
                      className={`w-full flex items-center justify-between mb-4 text-sm ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      <span>{expandedBenefit === plan.id ? 'Hide' : 'View'} Benefits</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          expandedBenefit === plan.id ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {expandedBenefit === plan.id && (
                      <ul className="space-y-2 mb-6">
                        {plan.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-khambi-accent flex-shrink-0 mt-0.5" />
                            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                              {benefit}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Apply Now Button */}
                    <button
                      onClick={() => handlePlanSelect(plan.id)}
                      className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
                        index === 0 
                          ? 'bg-[#CD7F32] hover:bg-[#B8935E] text-white' 
                          : index === 1 
                            ? 'bg-[#C0C0C0] hover:bg-[#A8A8A8] text-black' 
                            : 'bg-khambi-accent hover:bg-khambi-gold text-black'
                      } shadow-lg hover:shadow-xl hover:scale-105`}
                    >
                      APPLY NOW
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreePlan;
