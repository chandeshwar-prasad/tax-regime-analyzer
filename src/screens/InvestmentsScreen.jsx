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
        <span className="text-gray-400 sm:text-sm">/yr</span>
      </div>
    </div>
    {desc && <p className="mt-2 text-sm text-gray-500">{desc}</p>}
    {name === 'invest80c' && value > 150000 && <p className="mt-1 text-xs font-semibold text-amber-600">Note: Maximum deduction allowed under 80C is ₹1,50,000.</p>}
    {name === 'nps' && value > 50000 && <p className="mt-1 text-xs font-semibold text-amber-600">Note: Maximum extra deduction allowed under 80CCD(1B) is ₹50,000.</p>}
    {name === 'healthInsurance' && value > 50000 && <p className="mt-1 text-xs font-semibold text-amber-600">Note: Maximum deduction allowed is ₹50,000 for senior citizens (₹25,000 otherwise).</p>}
  </div>
);

export default function InvestmentsScreen({ onNext }) {
  const { data, updateData } = useTaxData();

  const handleChange = (e) => {
    let val = e.target.value;
    if (val < 0) return;
    updateData({ [e.target.name]: val });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-xl mx-auto">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Tax Saving Investments</h2>
      <p className="text-gray-500 mb-8">Let's see if we can reduce your taxable income under the Old Regime with common investments.</p>

      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-2">
        <InputField 
          label="ELSS, PPF, LIC, etc. (Section 80C)" 
          name="invest80c" 
          value={data.invest80c}
          onChange={handleChange}
          placeholder="e.g. 50000" 
          desc="Your company PF deduction is already counted. Add any other 80C investments here (Max benefit ₹1.5L)."
        />
        
        <InputField 
          label="Health Insurance Premium (Section 80D)" 
          name="healthInsurance" 
          value={data.healthInsurance}
          onChange={handleChange}
          placeholder="e.g. 15000" 
          desc="Premium paid for yourself or parents. (Usually max ₹25k, or ₹50k for senior citizens)."
        />
        
        <InputField 
          label="NPS - National Pension System (Section 80CCD)" 
          name="nps" 
          value={data.nps}
          onChange={handleChange}
          placeholder="e.g. 50000" 
          desc="Extra deduction available if you invest in NPS on your own (Max ₹50k benefit)."
        />
      </div>

      <div className="mt-8">
         <button
          onClick={onNext}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 text-base font-semibold text-white transition-all duration-200 bg-indigo-600 border border-transparent rounded-xl shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
        >
          See Final Results
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
}
