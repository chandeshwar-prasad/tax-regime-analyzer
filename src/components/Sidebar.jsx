import { useState } from 'react';
import { useTaxData } from '../context/TaxContext';
import { Calculator, UserCircle, Briefcase, IndianRupee, Home, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';

const InputField = ({ label, name, value, onChange, placeholder, desc, prefix = '₹', type = 'number', options = null }) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-semibold text-slate-700 mb-1.5">
        {label}
      </label>
      <div className="relative rounded-xl shadow-sm">
        {prefix && type !== 'select' && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <span className="text-slate-400 font-medium">{prefix}</span>
          </div>
        )}
        
        {type === 'select' ? (
          <select
            name={name}
            id={name}
            value={value}
            onChange={onChange}
            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-10 py-2.5 text-sm border-slate-300 rounded-xl border bg-white text-slate-900 transition-colors"
          >
            {options.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            min="0"
            name={name}
            id={name}
            value={value}
            onChange={onChange}
            className={`focus:ring-blue-500 focus:border-blue-500 block w-full ${prefix ? 'pl-9' : 'pl-3.5'} pr-4 text-sm border-slate-300 rounded-xl py-2.5 border transition-colors bg-white text-slate-900`}
            placeholder={placeholder}
          />
        )}
      </div>
      {desc && <p className="mt-1.5 text-xs text-slate-500">{desc}</p>}
    </div>
  );
};

const Section = ({ title, icon: Icon, step, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="mb-6 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
            {step}
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
          </div>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>
      
      {isOpen && (
        <div className="p-5 border-t border-slate-100">
          {children}
        </div>
      )}
    </div>
  );
};

export default function Sidebar() {
  const { data, updateData } = useTaxData();

  const handleNumChange = (e) => {
    let val = e.target.value;
    if (e.target.type === 'number' && val < 0) return;
    updateData({ [e.target.name]: val });
  };

  const handleCheckboxChange = (e) => {
    updateData({ [e.target.name]: e.target.checked });
  };

  return (
    <div className="w-full h-full bg-white border-r border-slate-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10">
        <div className="flex items-center gap-2">
          <Calculator className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Tax Calculator</h1>
        </div>
        <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
          FY 2025-26
        </span>
      </div>

      {/* Form Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
        
        <Section title="Your Profile & Salary" step="1" icon={UserCircle}>
          <InputField 
            label="Age Category" 
            name="ageGroup" 
            type="select"
            prefix=""
            value={data.ageGroup}
            onChange={handleNumChange}
            options={[
              { value: '', label: 'Select your age bracket...' },
              { value: '<60', label: 'Below 60 years' },
              { value: '60-79', label: '60 to 79 years (Senior)' },
              { value: '80+', label: '80 years & above (Super Senior)' },
            ]}
          />
          <InputField 
            label="Monthly In-hand Salary" 
            name="inhand" 
            value={data.inhand}
            onChange={handleNumChange}
            placeholder="e.g. 85000" 
          />
          <InputField 
            label="Monthly PF Deduction" 
            name="pf" 
            value={data.pf}
            onChange={handleNumChange}
            placeholder="e.g. 3500" 
            desc="Your contribution only."
          />
          <InputField 
            label="Monthly TDS Deducted" 
            name="tds" 
            value={data.tds}
            onChange={handleNumChange}
            placeholder="e.g. 5000" 
            desc="Tax already deducted by employer."
          />
          <InputField 
            label="Monthly Professional Tax (PT)" 
            name="pt" 
            value={data.pt}
            onChange={handleNumChange}
            placeholder="e.g. 200" 
            desc="Deducted by employer (₹0 – ₹200)."
          />
        </Section>

        <Section title="Income Details" step="2" icon={Briefcase}>
          <InputField 
            label="Other Taxable Income (Annual)" 
            name="otherIncome" 
            value={data.otherIncome}
            onChange={handleNumChange}
            placeholder="e.g. 50000" 
            desc="Freelance, interest, capital gains, etc."
          />
        </Section>

        <Section title="Deductions & Investments" step="3" icon={IndianRupee}>
          <p className="text-xs text-slate-500 mb-4 bg-slate-100 p-2.5 rounded-lg border border-slate-200">
            For Old Regime only. Standard Deduction of ₹75k (New) / ₹50k (Old) is applied automatically.
          </p>

          <InputField 
            label="Section 80C (Max ₹1.5L)" 
            name="invest80c" 
            value={data.invest80c}
            onChange={handleNumChange}
            placeholder="e.g. 150000" 
            desc="ELSS, LIC, PPF, etc. PF is automatically added to this."
          />
          {data.invest80c > 150000 && <p className="mt-1 mb-3 text-xs font-semibold text-amber-600">Note: Max allowed is ₹1,50,000.</p>}
          
          <InputField 
            label="Health Insurance (Section 80D)" 
            name="healthInsurance" 
            value={data.healthInsurance}
            onChange={handleNumChange}
            placeholder="e.g. 25000" 
          />
          
          <InputField 
            label="NPS (Section 80CCD)" 
            name="nps" 
            value={data.nps}
            onChange={handleNumChange}
            placeholder="e.g. 50000" 
          />

          <hr className="my-5 border-slate-200" />
          <h4 className="font-semibold text-slate-700 text-sm mb-3">Housing & Rent</h4>

          <div className="flex items-center mb-4">
            <input
              id="paysRent"
              name="paysRent"
              type="checkbox"
              checked={data.paysRent}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
            />
            <label htmlFor="paysRent" className="ml-2 block text-sm text-slate-700 font-medium">
              I pay monthly rent
            </label>
          </div>

          {data.paysRent && (
            <div className="pl-6 border-l-2 border-slate-200 space-y-4 mb-4">
              <InputField 
                label="Monthly Rent Paid" 
                name="monthlyRent" 
                value={data.monthlyRent}
                onChange={handleNumChange}
                placeholder="e.g. 15000" 
              />
              <div className="flex items-center">
                <input
                  id="isMetro"
                  name="isMetro"
                  type="checkbox"
                  checked={data.isMetro}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                />
                <label htmlFor="isMetro" className="ml-2 block text-sm text-slate-700">
                  I live in a Metro city (50% HRA)
                </label>
              </div>
            </div>
          )}

          <div className="flex items-center mb-4">
            <input
              id="hasHomeLoan"
              name="hasHomeLoan"
              type="checkbox"
              checked={data.hasHomeLoan}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
            />
            <label htmlFor="hasHomeLoan" className="ml-2 block text-sm text-slate-700 font-medium">
              Paying EMI for a Home Loan
            </label>
          </div>

          {data.hasHomeLoan && (
            <div className="pl-6 border-l-2 border-slate-200 space-y-4 mb-4">
               <InputField 
                label="Annual Interest Paid (Sec 24b)" 
                name="homeLoanInterest" 
                value={data.homeLoanInterest}
                onChange={handleNumChange}
                placeholder="e.g. 150000" 
              />
              {data.homeLoanInterest > 200000 && <p className="mt-1 text-xs font-semibold text-amber-600">Note: Max allowed under Sec 24(b) is ₹2,00,000.</p>}
            </div>
          )}

        </Section>
      </div>

      {/* Footer Security Badge */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-center gap-2 text-slate-500 text-xs font-medium">
        <ShieldCheck className="w-4 h-4 text-blue-600" />
        100% Private. Data never leaves your browser.
      </div>
    </div>
  );
}
