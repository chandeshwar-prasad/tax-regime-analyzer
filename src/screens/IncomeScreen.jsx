import { useState } from 'react';
import { useTaxData } from '../context/TaxContext';

const InputField = ({ label, name, placeholder, desc, value, onChange }) => (
  <div className="mb-6">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="relative rounded-lg shadow-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <span className="text-gray-500 sm:text-sm">₹</span>
      </div>
      <input
        type="number"
        min="0"
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-8 pr-12 sm:text-sm border-gray-300 rounded-lg py-3 bg-white border transition-colors hover:border-gray-400"
        placeholder={placeholder}
      />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <span className="text-gray-400 sm:text-sm">/mo</span>
      </div>
    </div>
    {desc && <p className="mt-2 text-sm text-gray-500">{desc}</p>}
  </div>
);

export default function IncomeScreen({ onNext }) {
  const { data, updateData } = useTaxData();
  const [showOther, setShowOther] = useState(!!data.otherIncome);

  const handleChange = (e) => {
    let val = e.target.value;
    // Prevent negative signs or invalid characters
    if (val < 0) return;
    updateData({ [e.target.name]: val });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-xl mx-auto">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Let's figure out your actual salary.</h2>
      <p className="text-gray-500 mb-8">Don't worry about CTC. Let's start with what you see in your bank account every month.</p>

      <div className="space-y-2">
        <InputField 
          label="Monthly In-hand Salary" 
          name="inhand" 
          value={data.inhand}
          onChange={handleChange}
          placeholder="e.g. 85000" 
        />
        
        <InputField 
          label="Monthly PF Deducted" 
          name="pf" 
          value={data.pf}
          onChange={handleChange}
          placeholder="e.g. 1800" 
          desc="Check your payslip. Usually 12% of your basic pay."
        />
        
        <InputField 
          label="Monthly TDS (Income Tax) Deducted" 
          name="tds" 
          value={data.tds}
          onChange={handleChange}
          placeholder="e.g. 2000" 
          desc="If your company already cuts tax."
        />
        
        <InputField 
          label="Monthly Professional Tax (PT)" 
          name="pt" 
          value={data.pt}
          onChange={handleChange}
          placeholder="e.g. 200" 
          desc="Usually ₹200 in most states."
        />

        <div className="pt-4 border-t border-gray-100">
          <label className="flex items-center gap-3 cursor-pointer mb-4">
            <input 
              type="checkbox" 
              checked={showOther}
              onChange={(e) => setShowOther(e.target.checked)}
              className="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" 
            />
            <span className="text-sm font-medium text-gray-700">I have other income (e.g. FD interest, freelancing)</span>
          </label>
          
          {showOther && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="block text-sm font-medium text-gray-700 mb-1">Annual Other Income</label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">₹</span>
                </div>
                <input
                  type="number"
                  name="otherIncome"
                  value={data.otherIncome}
                  onChange={handleChange}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-8 pr-12 sm:text-sm border-gray-300 rounded-lg py-3 bg-indigo-50/30 border transition-colors hover:border-gray-400"
                  placeholder="e.g. 50000"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 sm:text-sm">/yr</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
         <button
          onClick={onNext}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 text-base font-semibold text-white transition-all duration-200 bg-indigo-600 border border-transparent rounded-xl shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
        >
          Continue
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
}
