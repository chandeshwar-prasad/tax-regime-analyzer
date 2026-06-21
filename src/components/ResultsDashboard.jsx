import { useState } from 'react';
import { useTaxData } from '../context/TaxContext';
import { calculateNewRegime, calculateOldRegime } from '../utils/taxEngine';
import ChartsRow from './ChartsRow';
import { CheckCircle2, ChevronDown, ChevronUp, AlertCircle, Copy, Share2, Printer, FileText, Check } from 'lucide-react';

const formatCurrency = (amount) => `₹ ${amount.toLocaleString('en-IN')}`;

const Collapsible = ({ title, children, defaultOpen = false, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white mb-6 shadow-fintech no-print">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex justify-between items-center bg-white hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-5 h-5 text-slate-500" />}
          <span className="font-bold text-slate-800">{title}</span>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
      </button>
      {isOpen && (
        <div className="p-6 border-t border-slate-100 bg-white">
          {children}
        </div>
      )}
    </div>
  );
};

export default function ResultsDashboard() {
  const { data } = useTaxData();
  const [copied, setCopied] = useState(false);

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
    pf: pf * 12,
    invest80c: data.invest80c,
    healthInsurance: data.healthInsurance,
    nps: data.nps,
  };

  const newR = calculateNewRegime(annualGross, annualPT);
  const oldR = calculateOldRegime(annualGross, data.ageGroup, annualPT, investmentsData, housingData);

  const bestRegime = newR.totalTax <= oldR.totalTax ? 'NEW' : 'OLD';
  const savings = Math.abs(newR.totalTax - oldR.totalTax);
  const maxTax = Math.max(newR.totalTax, oldR.totalTax);
  const savingsPercent = maxTax > 0 ? (savings / maxTax) * 100 : 0;

  const handleCopy = () => {
    const text = `Tax Calculator Summary (FY 2025-26)\nGross Income: ${formatCurrency(annualGross)}\nRecommended Regime: ${bestRegime}\nSavings: ${formatCurrency(savings)}\nFinal Tax (${bestRegime}): ${formatCurrency(bestRegime === 'NEW' ? newR.totalTax : oldR.totalTax)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  const RegimeCard = ({ title, result, isWinner, isNew }) => {
    const rate = ((result.totalTax / result.annualGross) * 100) || 0;
    
    return (
      <div className={`p-6 md:p-8 rounded-3xl border-2 transition-all duration-300 ${isWinner ? 'border-blue-600 shadow-[0_8px_30px_rgb(37,99,235,0.12)] relative bg-white scale-[1.02]' : 'border-slate-200 bg-slate-50/50 hover:bg-white'} print-border`}>
        {isWinner && (
          <div className="absolute -top-3.5 right-8 bg-green-100 text-green-700 border border-green-200 text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> RECOMMENDED
          </div>
        )}
        
        <div className="mb-8">
          <h3 className={`text-2xl font-extrabold mb-1 ${isWinner ? 'text-blue-900' : 'text-slate-800'}`}>{title}</h3>
          <p className="text-sm text-slate-500">
            {isNew ? 'Lower tax with simplified rules' : 'More deductions, higher tax slabs'}
          </p>
        </div>
        
        <div className="mb-8">
          <p className="text-sm font-semibold text-slate-500 mb-1">Total Tax Payable</p>
          <div className={`text-4xl font-extrabold ${isWinner ? 'text-blue-600' : 'text-slate-900'} tracking-tight`}>
            {formatCurrency(result.totalTax)}
          </div>
          <div className="mt-2 flex items-center gap-2 text-sm font-medium">
            <span className="text-slate-500">Effective Tax Rate</span>
            <span className={`px-2 py-0.5 rounded-md ${isWinner ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-700'}`}>
              {rate.toFixed(1)}%
            </span>
          </div>
        </div>
        
        <div className="space-y-3.5 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Total Income</span>
            <span className="font-semibold text-slate-900">{formatCurrency(result.annualGross)}</span>
          </div>
          <div className="flex justify-between items-center text-slate-500">
            <span>Total Deductions</span>
            <span className="font-semibold">-{formatCurrency(result.totalDeductions)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Taxable Income</span>
            <span className="font-semibold text-slate-900">{formatCurrency(result.taxableIncome)}</span>
          </div>
        </div>

        {isWinner && savings > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center bg-green-50/50 -mx-6 -mb-6 px-6 py-5 rounded-b-[1.35rem]">
            <span className="font-bold text-green-800">You Save</span>
            <span className="font-bold text-green-700 text-lg">{formatCurrency(savings)}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full h-full bg-slate-50 overflow-y-auto p-4 md:p-8 lg:p-10">
      
      {/* Header & Export Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Tax Dashboard</h2>
            <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-400 text-xs font-semibold rounded-full border border-blue-500/20">
              FY 2025-26
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-1">Real-time analysis of your tax profile</p>
        </div>
        <div className="flex gap-2 no-print">
          <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-medium rounded-lg shadow-sm transition-colors">
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          {navigator.share && (
            <button onClick={handleShare} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-medium rounded-lg shadow-sm transition-colors">
              <Share2 className="w-4 h-4" /> Share
            </button>
          )}
          <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors">
            <Printer className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      <div className="print-header hidden mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Tax Calculation Report</h1>
        <p className="text-slate-500">Financial Year 2025-26 • Generated on {new Date().toLocaleDateString()}</p>
      </div>

      {/* Hero Recommendation Banner */}
      <div className="bg-white border border-green-200 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8 mb-8 shadow-fintech relative overflow-hidden print-border">
        {/* Decorative background circle */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-green-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        
        <div className="flex items-start gap-5 relative z-10 w-full md:w-auto">
          <div className="w-14 h-14 rounded-2xl bg-green-500 flex flex-shrink-0 items-center justify-center shadow-[0_8px_16px_rgba(22,163,74,0.25)] text-white">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <div className="text-green-700 font-bold text-sm tracking-wide uppercase mb-1 flex items-center gap-1.5">
              Recommended for you
            </div>
            {savings > 0 ? (
              <>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                  {bestRegime} Regime saves you <span className="text-green-600">{formatCurrency(savings)}</span>
                </h2>
                <p className="text-slate-500 text-base">
                  You pay {formatCurrency(savings)} less tax with the {bestRegime} Regime compared to the alternative.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                  Both regimes are identical for you.
                </h2>
                <p className="text-slate-500 text-base">
                  Your tax liability is exactly the same under both the Old and New regimes.
                </p>
              </>
            )}
          </div>
        </div>

        {savings > 0 && (
          <div className="flex items-center gap-8 md:gap-12 relative z-10 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-6 md:pt-0 border-slate-100">
            <div className="text-center">
              {/* Fake SVG Gauge */}
              <div className="relative w-20 h-20 mb-2 mx-auto">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="40" cy="40" r="36" fill="transparent" stroke="#F0FDF4" strokeWidth="8" />
                  <circle cx="40" cy="40" r="36" fill="transparent" stroke="#22C55E" strokeWidth="8" strokeDasharray={`${savingsPercent * 2.26} 226`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-lg font-bold text-green-700">{savingsPercent.toFixed(1)}%</span>
                </div>
              </div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Tax Savings</span>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-slate-500 mb-1">You save</p>
              <p className="text-3xl font-extrabold text-green-600 tracking-tight">{formatCurrency(savings)}</p>
              <p className="text-xs text-slate-400 mt-1">with {bestRegime} Regime</p>
            </div>
          </div>
        )}
      </div>

      {/* Regime Comparison Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8 page-break-inside-avoid">
        <RegimeCard title="New Regime" result={newR} isWinner={bestRegime === 'NEW'} isNew={true} />
        <RegimeCard title="Old Regime" result={oldR} isWinner={bestRegime === 'OLD'} isNew={false} />
      </div>

      {/* Charts Row */}
      <ChartsRow newR={newR} oldR={oldR} bestRegime={bestRegime} savings={savings} />

      {/* Insights & Assumptions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 page-break-inside-avoid">
        
        {/* Why this regime is better */}
        <div className="bg-white rounded-2xl border border-blue-100 p-6 md:p-8 shadow-fintech">
          <h3 className="font-bold text-blue-900 text-lg mb-6 flex items-center gap-2">
            Why {bestRegime} Regime is better for you?
          </h3>
          <ul className="space-y-4">
            {savings > 0 && (
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-slate-700"><strong>Lower tax outgo</strong> by {formatCurrency(savings)} ({savingsPercent.toFixed(1)}% savings)</span>
              </li>
            )}
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <span className="text-slate-700"><strong>More take-home salary</strong> every month to invest as you please.</span>
            </li>
            {bestRegime === 'NEW' ? (
              <>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700"><strong>Simpler tax structure</strong> with no investment locking or proof submissions required.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Benefits from the flat ₹75,000 standard deduction and wider tax slabs.</span>
                </li>
              </>
            ) : (
              <>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Your existing investments (like 80C) are working hard to lower your taxable base.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Better utilization of deductions like HRA and Health Insurance.</span>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Key Assumptions */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-fintech">
          <h3 className="font-bold text-slate-800 text-lg mb-6 flex items-center gap-2">
            Key Assumptions
          </h3>
          <ul className="space-y-3 list-disc pl-5 text-slate-600 text-sm marker:text-slate-400">
            <li>All monetary values are in INR (₹).</li>
            <li>Calculations apply to salaried individuals, resident of India.</li>
            <li>Standard Deduction of ₹75,000 (New) or ₹50,000 (Old) is automatically included in "Total Deductions".</li>
            <li>HRA exemption relies on standard heuristics (Basic assumed at 50% of Gross).</li>
            <li>Figures are estimates as per FY 2025-26 (AY 2026-27) tax laws.</li>
            <li>Actual tax liability may vary based on final assessment, surcharges, and exact salary component structures.</li>
          </ul>
        </div>
      </div>

      {/* Methodology Collapsible */}
      <Collapsible title="Calculation Methodology" icon={FileText}>
        <div className="space-y-6 text-sm text-slate-600">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">1</div>
            <div>
              <strong className="text-slate-900 block mb-1">Gross Income Computation</strong>
              Reconstructed your annual CTC by annualizing your monthly in-hand, PF, TDS, and PT, plus other taxable income.
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">2</div>
            <div>
              <strong className="text-slate-900 block mb-1">Deduction Application</strong>
              Subtracted regime-specific exemptions (Standard Deduction, 80C, 80D, HRA, Sec 24b). New regime only permits ₹75k standard deduction.
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">3</div>
            <div>
              <strong className="text-slate-900 block mb-1">Slab Rates & Rebates</strong>
              Applied FY 25-26 progressive tax brackets. If income fell below ₹12L (New) or ₹5L (Old), Section 87A rebate zeroed the tax. Marginal relief was applied near rebate boundaries.
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">4</div>
            <div>
              <strong className="text-slate-900 block mb-1">Cess & Surcharge</strong>
              Added mandatory 4% Health & Education Cess, plus applicable Surcharge brackets (10%-37%) if income exceeded ₹50 Lakhs.
            </div>
          </div>
        </div>
      </Collapsible>

      <div className="text-center mt-12 mb-8 no-print">
        <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5" />
          This is an estimate. Actual tax liability may vary based on final assessment.
        </p>
      </div>
    </div>
  );
}
