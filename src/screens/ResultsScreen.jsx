import { useState } from 'react';
import { useTaxData } from '../context/TaxContext';
import { calculateNewRegime, calculateOldRegime } from '../utils/taxEngine';

// Reusable Collapsible Component
const Collapsible = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white mb-4 shadow-sm no-print">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <span className="font-bold text-gray-800">{title}</span>
        <svg className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="p-6 border-t border-gray-200 bg-white">
          {children}
        </div>
      )}
    </div>
  );
};

export default function ResultsScreen({ onBackToStart }) {
  const { data } = useTaxData();

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

  const newR = calculateNewRegime(annualGross, annualPT);
  const oldR = calculateOldRegime(annualGross, data.ageGroup, annualPT, investmentsData, housingData);

  const bestRegime = newR.totalTax <= oldR.totalTax ? 'NEW' : 'OLD';
  const savings = Math.abs(newR.totalTax - oldR.totalTax);

  const formatCurrency = (amount) => `₹ ${amount.toLocaleString('en-IN')}`;

  const handleCopy = () => {
    const text = `Tax Calculator Summary (FY 2025-26)\nGross Income: ${formatCurrency(annualGross)}\nRecommended Regime: ${bestRegime}\nSavings: ${formatCurrency(savings)}\nFinal Tax (${bestRegime}): ${formatCurrency(bestRegime === 'NEW' ? newR.totalTax : oldR.totalTax)}`;
    navigator.clipboard.writeText(text);
    alert('Summary copied to clipboard!');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Tax Calculation',
        text: `I just checked my tax savings for FY 2025-26! The ${bestRegime} regime saves me ${formatCurrency(savings)}!`,
      }).catch(console.error);
    } else {
      handleCopy();
    }
  };

  const TaxCard = ({ title, result, isWinner }) => (
    <div className={`p-6 rounded-2xl border-2 ${isWinner ? 'border-indigo-600 bg-indigo-50/30 shadow-md relative' : 'border-gray-200 bg-white'} print-border`}>
      {isWinner && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
          RECOMMENDED
        </div>
      )}
      <h3 className={`text-xl font-bold mb-6 text-center ${isWinner ? 'text-indigo-900' : 'text-gray-700'}`}>{title}</h3>
      
      <div className="space-y-4 text-sm">
        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
          <span className="text-gray-500">Gross Income</span>
          <span className="font-semibold text-gray-900">{formatCurrency(result.annualGross)}</span>
        </div>
        <div className="flex justify-between items-center pb-2 border-b border-gray-100 text-green-600">
          <span>Total Deductions</span>
          <span className="font-semibold">-{formatCurrency(result.totalDeductions)}</span>
        </div>
        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
          <span className="text-gray-500">Net Taxable Income</span>
          <span className="font-semibold text-gray-900">{formatCurrency(result.taxableIncome)}</span>
        </div>
        
        {/* Detailed Breakdown */}
        <div className="pt-2">
          <div className="flex justify-between items-center pb-1">
            <span className="text-gray-500">Base Income Tax</span>
            <span className="font-medium text-gray-900">{formatCurrency(result.baseTax)}</span>
          </div>
          {result.surcharge > 0 && (
            <div className="flex justify-between items-center pb-1">
              <span className="text-gray-500">Surcharge</span>
              <span className="font-medium text-gray-900">+{formatCurrency(result.surcharge)}</span>
            </div>
          )}
          <div className="flex justify-between items-center pb-2 border-b border-gray-100">
            <span className="text-gray-500">Health & Education Cess (4%)</span>
            <span className="font-medium text-gray-900">+{formatCurrency(result.cess)}</span>
          </div>
        </div>
        
        <div className={`pt-4 mt-2 flex justify-between items-center text-lg font-bold ${isWinner ? 'text-indigo-700' : 'text-gray-900'}`}>
          <span>Final Tax Payable</span>
          <span>{formatCurrency(result.totalTax)}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="animate-in fade-in zoom-in-95 duration-700 max-w-4xl mx-auto w-full pb-12">
      
      {/* Export Bar */}
      <div className="flex justify-end gap-3 mb-6 no-print">
        <button onClick={handleCopy} className="text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 px-4 py-2 rounded-lg shadow-sm transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
          Copy Summary
        </button>
        {navigator.share && (
          <button onClick={handleShare} className="text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 px-4 py-2 rounded-lg shadow-sm transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
            Share
          </button>
        )}
        <button onClick={() => window.print()} className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg shadow-sm transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          Download PDF
        </button>
      </div>

      <div className="print-header hidden mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Tax Calculation Report</h1>
        <p className="text-gray-500">Financial Year 2025-26 • Generated on {new Date().toLocaleDateString()}</p>
      </div>

      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          Pick the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">{bestRegime} Regime</span>.
        </h2>
        {savings > 0 ? (
          <p className="text-xl text-gray-600">
            You save <span className="font-bold text-green-600">{formatCurrency(savings)}</span> compared to the other.
          </p>
        ) : (
          <p className="text-xl text-gray-600">Both regimes result in the exact same tax for you.</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 page-break-inside-avoid">
        <TaxCard title="New Regime" result={newR} isWinner={bestRegime === 'NEW'} />
        <TaxCard title="Old Regime" result={oldR} isWinner={bestRegime === 'OLD'} />
      </div>

      {/* Smart Suggestions */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-12 print-bg-blue">
        <h4 className="text-blue-900 font-bold mb-2 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Smart Suggestion
        </h4>
        <p className="text-blue-800 text-sm leading-relaxed">
          {bestRegime === 'NEW' 
            ? "The New Regime gives you a flat ₹75,000 standard deduction and lower tax slabs. Since your current investments and rent don't provide enough deductions to offset the higher slabs of the Old Regime, sticking to the New Regime is mathematically better for you."
            : "Your rent and tax-saving investments (like 80C, PF, etc.) are working hard for you! They reduce your taxable income significantly enough to make the Old Regime's higher tax slabs worth it."}
        </p>
      </div>

      {/* Collapsibles */}
      <Collapsible title="Assumptions Used">
        <ul className="space-y-3 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            <span><strong>FY 2025-26 Rules:</strong> All tax slabs, rebates, and surcharges correspond to the latest budget.</span>
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            <span><strong>Standard Deduction:</strong> Automatically applied ₹75,000 for the New Regime and ₹50,000 for the Old Regime.</span>
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            <span><strong>Section 80C:</strong> Your inputted PF amount was annualized and added to your 80C, securely capped at the maximum ₹1.5L limit.</span>
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            <span><strong>HRA Logic:</strong> The engine automatically applied the "Minimum of 3 rules" heuristic, assuming Basic Pay is 50% of your Gross.</span>
          </li>
        </ul>
      </Collapsible>

      <Collapsible title="How We Calculated (5-Step Flow)">
        <div className="space-y-4 text-sm text-gray-600">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">1</div>
            <div>
              <strong className="text-gray-900 block mb-1">Gross Income</strong>
              We reconstructed your annual CTC by multiplying your monthly in-hand, PF, TDS, and PT by 12, then adding any other income.
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">2</div>
            <div>
              <strong className="text-gray-900 block mb-1">Less Deductions</strong>
              We subtracted all eligible exemptions (Standard Deduction, 80C, 80D, HRA, Section 24b) specific to each regime.
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">3</div>
            <div>
              <strong className="text-gray-900 block mb-1">Net Taxable Income</strong>
              This is the final reduced amount that is actually subject to tax slabs.
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">4</div>
            <div>
              <strong className="text-gray-900 block mb-1">Apply Slab Rates & Rebates</strong>
              We ran the Taxable Income through the FY 25-26 progressive tax brackets. If your income fell below ₹12L (New) or ₹5L (Old), we applied the Section 87A rebate to bring your tax to zero.
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">5</div>
            <div>
              <strong className="text-gray-900 block mb-1">Add Cess & Surcharge</strong>
              Finally, we added the mandatory 4% Health & Education Cess, plus any Surcharge if your income exceeded ₹50 Lakhs.
            </div>
          </div>
        </div>
      </Collapsible>

      <div className="text-center pt-8 no-print">
        <button 
          onClick={onBackToStart}
          className="text-gray-500 hover:text-gray-900 font-medium underline underline-offset-4"
        >
          Start Over
        </button>
      </div>
    </div>
  );
}
