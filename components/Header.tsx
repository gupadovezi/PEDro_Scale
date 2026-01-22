
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <i className="fas fa-stethoscope text-white text-xl"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">PEDro Scale Analyzer</h1>
            <p className="text-xs text-slate-500 font-medium">AI-Powered Evidence Quality Assessment</p>
          </div>
        </div>
        <div className="hidden sm:block">
          <span className="text-xs px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100 font-semibold uppercase tracking-wider">
            v1.0 Beta
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
