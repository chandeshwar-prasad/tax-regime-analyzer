import { useTaxData } from '../context/TaxContext';

export default function AgeScreen({ onNext }) {
  const { data, updateData } = useTaxData();

  const options = [
    { id: '<60', label: 'Under 60 years', desc: 'Standard tax slabs apply.' },
    { id: '60-79', label: '60 to 79 years', desc: 'Senior citizen tax benefits.' },
    { id: '80+', label: '80 years and above', desc: 'Super senior citizen benefits.' }
  ];

  const handleSelect = (id) => {
    updateData({ ageGroup: id });
    // Auto-advance as per PRD
    setTimeout(() => {
      onNext();
    }, 300);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-xl mx-auto">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Which age group do you belong to?</h2>
      <p className="text-gray-500 mb-8">Tax slabs in the Old Regime vary based on your age. The New Regime is the same for everyone.</p>

      <div className="space-y-4">
        {options.map((opt) => {
          const isSelected = data.ageGroup === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-200 group flex items-center justify-between ${
                isSelected 
                  ? 'border-indigo-600 bg-indigo-50/50 shadow-md scale-[1.02]' 
                  : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-gray-50'
              }`}
            >
              <div>
                <div className={`text-lg font-semibold ${isSelected ? 'text-indigo-900' : 'text-gray-900'}`}>
                  {opt.label}
                </div>
                <div className={`text-sm mt-1 ${isSelected ? 'text-indigo-700' : 'text-gray-500'}`}>
                  {opt.desc}
                </div>
              </div>
              
              <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-300'
              }`}>
                {isSelected && (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
