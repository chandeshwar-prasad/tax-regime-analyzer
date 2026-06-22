import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const formatCurrency = (amount) => `₹ ${(amount === 0 ? 0 : amount).toLocaleString('en-IN')}`;

export default function ChartsRow({ newR, oldR, bestRegime, savings }) {
  // Bar Chart Data
  const barData = [
    { name: 'New Regime', tax: newR.totalTax },
    { name: 'Old Regime', tax: oldR.totalTax },
  ];

  // Donut Chart Data (Breakdown of the WINNING regime)
  const winnerR = bestRegime === 'NEW' ? newR : oldR;
  const donutData = [
    { name: 'Base Income Tax', value: winnerR.baseTax, color: '#3B82F6' },
  ];
  if (winnerR.surcharge > 0) {
    donutData.push({ name: 'Surcharge', value: winnerR.surcharge, color: '#F59E0B' });
  }
  donutData.push({ name: 'Health & Edu Cess', value: winnerR.cess, color: '#93C5FD' });

  // Effective Tax Rate calculations
  const newRate = ((newR.totalTax / newR.annualGross) * 100) || 0;
  const oldRate = ((oldR.totalTax / oldR.annualGross) * 100) || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 no-print">
      
      {/* Chart 1: Tax Comparison (Bar) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-fintech">
        <h3 className="font-bold text-slate-800 text-sm mb-1">Tax Comparison</h3>
        <p className="text-xs text-slate-500 mb-6">You Save {formatCurrency(savings)}</p>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} tickFormatter={(val) => `₹${val/1000}k`} />
              <RechartsTooltip cursor={{ fill: '#1F2937' }} formatter={(value) => [formatCurrency(value), 'Total Tax']} />
              <Bar dataKey="tax" radius={[4, 4, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.name.includes(bestRegime === 'NEW' ? 'New' : 'Old') ? '#3B82F6' : '#4B5563'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Tax Breakdown (Donut) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-fintech">
        <h3 className="font-bold text-slate-800 text-sm mb-1">Tax Breakdown</h3>
        <p className="text-xs text-slate-500 mb-2">Based on {bestRegime === 'NEW' ? 'New' : 'Old'} Regime</p>
        <div className="flex items-center justify-center h-48 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={donutData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {donutData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip formatter={(value) => [formatCurrency(value), 'Amount']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xs font-medium text-slate-500">Total Tax</span>
            <span className="text-sm font-bold text-slate-900">{formatCurrency(winnerR.totalTax)}</span>
          </div>
        </div>
      </div>

      {/* Chart 3: Effective Tax Rate (Custom CSS Radial/Gauge) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-fintech flex flex-col">
        <h3 className="font-bold text-slate-800 text-sm mb-6">Effective Tax Rate</h3>
        
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          {/* Simple Visual Gauges using flex bars */}
          <div className="w-full space-y-4">
            <div>
              <div className="flex justify-between items-end mb-1">
                <span className="text-xs font-semibold text-blue-700">New Regime</span>
                <span className="text-sm font-bold text-blue-900">{newRate.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${Math.min(newRate, 100)}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-1">
                <span className="text-xs font-semibold text-slate-500">Old Regime</span>
                <span className="text-sm font-bold text-slate-700">{oldRate.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-slate-400 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${Math.min(oldRate, 100)}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
