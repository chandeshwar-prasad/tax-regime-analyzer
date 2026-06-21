import Sidebar from './Sidebar';
import ResultsDashboard from './ResultsDashboard';

export default function Dashboard() {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      {/* Left Sidebar (Inputs) */}
      <div className="w-full md:w-[35%] lg:w-[30%] h-[50vh] md:h-screen border-b md:border-b-0 md:border-r border-slate-200 bg-white no-print z-20 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
        <Sidebar />
      </div>
      
      {/* Right Dashboard (Results) */}
      <div className="w-full md:w-[65%] lg:w-[70%] h-[50vh] md:h-screen overflow-y-auto">
        <ResultsDashboard />
      </div>
    </div>
  );
}
