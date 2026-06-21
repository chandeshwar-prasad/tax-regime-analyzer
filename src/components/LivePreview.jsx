import { useTaxData } from '../context/TaxContext';
import { calculateNewRegime, calculateOldRegime } from '../utils/taxEngine';

export default function LivePreview() {
  const { data } = useTaxData();

  // Basic calculation for Phase 3/4
  const inhand = Number(data.inhand) || 0;
  const pf = Number(data.pf) || 0;
  const tds = Number(data.tds) || 0;
  const pt = Number(data.pt) || 0;
  const otherIncome = Number(data.otherIncome) || 0;

  const monthlyGross = inhand + pf + tds + pt;
  const annualGross = (monthlyGross * 12) + otherIncome;
  const annualPT = pt * 12;

  const housingData = {
    paysRent: data.paysRent,
    monthlyRent: data.monthlyRent,
    isMetro: data.isMetro,
    hasHomeLoan: data.hasHomeLoan,
    homeLoanInterest: data.homeLoanInterest,
  };

  const investmentsData = {
    pf: pf * 12, // Annualized PF
    invest80c: data.invest80c,
    healthInsurance: data.healthInsurance,
    nps: data.nps,
  };

  // Phase 4/5/6: Engine connection
  const newRegimeResult = calculateNewRegime(annualGross, annualPT);
  const oldRegimeResult = calculateOldRegime(annualGross, data.ageGroup, annualPT, investmentsData, housingData); 

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Live Preview</h2>
      
      <div className="space-y-6 flex-1">
        {/* Gross Income */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Estimated Annual Gross</p>
          <p className="text-2xl font-bold text-gray-900">
            ₹ {annualGross.toLocaleString('en-IN')}
          </p>
        </div>

        {/* Regimes Comparison */}
        <div className="space-y-3">
          <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-indigo-900">New Regime</span>
              <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">Default</span>
            </div>
            <p className="text-sm text-indigo-700/80 mb-1">Estimated Tax</p>
            <p className="text-xl font-bold text-indigo-700">₹ {newRegimeResult.totalTax.toLocaleString('en-IN')}</p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700">Old Regime</span>
            </div>
            <p className="text-sm text-gray-500 mb-1">Estimated Tax</p>
            <p className="text-xl font-bold text-gray-700">₹ {oldRegimeResult.totalTax.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-gray-100 text-xs text-gray-400 text-center flex items-center justify-center gap-1">
        <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Updates automatically as you type
      </div>
    </div>
  );
}
