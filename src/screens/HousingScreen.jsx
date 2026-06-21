import { useTaxData } from '../context/TaxContext';

export default function HousingScreen({ onNext }) {
  const { data, updateData } = useTaxData();

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    if (e.target.type === 'number' && value < 0) return;
    updateData({ [e.target.name]: value });
  };

  const setRadio = (name, value) => {
    updateData({ [name]: value });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-xl mx-auto">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Housing & Rent</h2>
      <p className="text-gray-500 mb-8">This is where the Old Tax Regime usually shines. Let's see if we can get you some tax breaks for where you live.</p>

      <div className="space-y-8">
        
        {/* Rent Section */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
             <label className="text-lg font-semibold text-gray-900">Do you pay rent?</label>
             <div className="flex items-center bg-gray-100 rounded-lg p-1">
               <button 
                 onClick={() => setRadio('paysRent', true)}
                 className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${data.paysRent ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
               >Yes</button>
               <button 
                 onClick={() => {
                   setRadio('paysRent', false);
                   updateData({ monthlyRent: '', isMetro: false });
                 }}
                 className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${!data.paysRent ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
               >No</button>
             </div>
          </div>

          {data.paysRent && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300 pt-4 border-t border-gray-100 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">How much rent per month?</label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">₹</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    name="monthlyRent"
                    value={data.monthlyRent}
                    onChange={handleChange}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-8 pr-12 sm:text-sm border-gray-300 rounded-lg py-2.5 border"
                    placeholder="e.g. 15000"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 sm:text-sm">/mo</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="isMetro"
                    checked={data.isMetro}
                    onChange={handleChange}
                    className="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" 
                  />
                  <span className="text-sm font-medium text-gray-700">I live in a Metro city (Delhi, Mumbai, Kolkata, Chennai)</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Home Loan Section */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
             <label className="text-lg font-semibold text-gray-900">Paying EMI for a home loan?</label>
             <div className="flex items-center bg-gray-100 rounded-lg p-1">
               <button 
                 onClick={() => setRadio('hasHomeLoan', true)}
                 className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${data.hasHomeLoan ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
               >Yes</button>
               <button 
                 onClick={() => {
                   setRadio('hasHomeLoan', false);
                   updateData({ homeLoanInterest: '' });
                 }}
                 className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${!data.hasHomeLoan ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
               >No</button>
             </div>
          </div>

          {data.hasHomeLoan && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300 pt-4 border-t border-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-1">Annual Interest part of your EMI</label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">₹</span>
                </div>
                <input
                  type="number"
                  min="0"
                  name="homeLoanInterest"
                  value={data.homeLoanInterest}
                  onChange={handleChange}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-8 pr-12 sm:text-sm border-gray-300 rounded-lg py-2.5 border"
                  placeholder="e.g. 150000"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 sm:text-sm">/yr</span>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500">Only the interest component is deductible here (up to ₹2 Lakhs).</p>
              {data.homeLoanInterest > 200000 && <p className="mt-1 text-xs font-semibold text-amber-600">Note: Maximum deduction allowed under Section 24(b) is ₹2,00,000.</p>}
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
