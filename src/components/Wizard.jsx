import { useState } from 'react';
import AgeScreen from '../screens/AgeScreen';
import IncomeScreen from '../screens/IncomeScreen';
import HousingScreen from '../screens/HousingScreen';
import InvestmentsScreen from '../screens/InvestmentsScreen';
import ResultsScreen from '../screens/ResultsScreen';
import LivePreview from './LivePreview';

const steps = [
  { id: 'age', title: 'Basic Profile' },
  { id: 'income', title: 'Income Details' },
  { id: 'housing', title: 'Housing & Rent' },
  { id: 'investments', title: 'Tax Saving Investments' },
];

export default function Wizard({ onBackToStart }) {
  const [currentStep, setCurrentStep] = useState(0);

  const goNext = () => {
    setCurrentStep(curr => curr + 1);
  };

  const goPrev = () => {
    if (currentStep > 0) {
      setCurrentStep(curr => curr - 1);
    } else {
      onBackToStart();
    }
  };

  const isFinalStep = currentStep === steps.length;
  const progressPercentage = isFinalStep ? 100 : ((currentStep + 1) / steps.length) * 100;

  if (isFinalStep) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] py-0 md:py-12 md:px-8 flex items-center justify-center">
        <div className="bg-white w-full max-w-6xl shadow-2xl rounded-none md:rounded-3xl overflow-y-auto border-0 md:border border-gray-200 p-6 md:p-12 lg:p-16 flex items-center justify-center min-h-screen md:min-h-[85vh]">
          <ResultsScreen onBackToStart={onBackToStart} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-0 md:py-12 md:px-8 flex items-center justify-center">
      <div className="bg-white w-full max-w-6xl shadow-2xl rounded-none md:rounded-3xl overflow-hidden border-0 md:border border-gray-200 flex flex-col md:flex-row min-h-screen md:min-h-[85vh]">
        
        {/* Left: Main Form Area */}
        <div className="flex-1 flex flex-col relative overflow-y-auto max-h-screen md:max-h-[85vh]">
          
          {/* Progress Bar */}
          <div className="sticky top-0 z-20 w-full bg-white/90 backdrop-blur border-b border-gray-100">
            <div className="h-1.5 bg-gray-100 w-full">
              <div 
                className="h-1.5 bg-indigo-600 transition-all duration-500 ease-out" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="px-6 py-4 flex items-center justify-between">
               <button 
                onClick={goPrev}
                className="text-gray-500 hover:text-gray-900 font-medium flex items-center gap-1 text-sm transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
              </button>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col max-w-3xl w-full mx-auto p-6 md:p-12 lg:p-16">
            <div className="flex-1">
              {currentStep === 0 && <AgeScreen onNext={goNext} />}
              {currentStep === 1 && <IncomeScreen onNext={goNext} />}
              {currentStep === 2 && <HousingScreen onNext={goNext} />}
              {currentStep === 3 && <InvestmentsScreen onNext={goNext} />}
            </div>
          </div>
        </div>

        {/* Right: Live Preview Panel */}
        <div className="w-full md:w-[400px] lg:w-[450px] bg-gray-50 border-t md:border-t-0 md:border-l border-gray-200 p-8 shadow-inner z-10 hidden md:block overflow-y-auto max-h-screen md:max-h-[85vh]">
          <LivePreview />
        </div>
        
        {/* Mobile Sticky Preview Footer (simplified) */}
        <div className="md:hidden sticky bottom-0 z-20 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500 font-medium">New Regime Tax</p>
              <p className="text-lg font-bold text-indigo-700">Check Results</p>
            </div>
            <button 
              className="text-sm font-semibold text-white bg-indigo-600 px-6 py-2.5 rounded-xl shadow-sm"
              onClick={goNext}
            >
              Next Step
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
