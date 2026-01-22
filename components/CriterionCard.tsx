
import React from 'react';
import { PedroCriterion, AnalysisResult } from '../types';

interface CriterionCardProps {
  criterion: PedroCriterion;
  result?: AnalysisResult;
}

const CriterionCard: React.FC<CriterionCardProps> = ({ criterion, result }) => {
  const isMet = result?.met;

  return (
    <div className={`p-4 rounded-xl border transition-all ${
      !result 
        ? 'bg-white border-slate-200' 
        : isMet 
          ? 'bg-emerald-50 border-emerald-200' 
          : 'bg-rose-50 border-rose-200'
    }`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-slate-400 uppercase">Criterion {criterion.id}</span>
            {!criterion.isScored && (
              <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded font-bold uppercase">Not Scored</span>
            )}
          </div>
          <h3 className="font-semibold text-slate-800 leading-tight mb-1">{criterion.title}</h3>
          <p className="text-sm text-slate-600 mb-3">{criterion.description}</p>
          
          {result && (
            <div className="mt-3 space-y-2">
              <div className="text-sm">
                <span className="font-bold text-slate-700">Reasoning: </span>
                <span className="text-slate-600 italic">{result.reasoning}</span>
              </div>
              {result.location && (
                <div className="text-xs text-slate-500 bg-white/50 p-2 rounded border border-slate-100">
                  <span className="font-bold">Evidence: </span>
                  "{result.location}"
                </div>
              )}
            </div>
          )}
        </div>

        {result && (
          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
            isMet ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
          }`}>
            <i className={`fas ${isMet ? 'fa-check' : 'fa-times'} text-lg`}></i>
          </div>
        )}
      </div>
    </div>
  );
};

export default CriterionCard;
