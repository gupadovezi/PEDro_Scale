
import React, { useState } from 'react';
import Header from './components/Header';
import CriterionCard from './components/CriterionCard';
import { analyzeTrial } from './services/geminiService';
import { PEDRO_CRITERIA, TrialAnalysis } from './types';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<TrialAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setInputText(''); // Clear text if file is chosen
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const runAnalysis = async () => {
    if (!inputText && !file) {
      setError("Please provide trial text or an image of the trial.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);

    try {
      let input;
      if (file) {
        const base64 = await fileToBase64(file);
        input = { data: base64, mimeType: file.type };
      } else {
        input = inputText;
      }

      const result = await analyzeTrial(input);
      setAnalysis(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred during analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setAnalysis(null);
    setInputText('');
    setFile(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow max-w-5xl mx-auto w-full p-4 sm:p-6 pb-24">
        {!analysis ? (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Evaluate Clinical Trial Quality</h2>
              <p className="text-slate-600">Provide the text or an image of the study's Methods and Results sections to automatically calculate its PEDro score.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <i className="fas fa-file-lines text-indigo-500"></i>
                  <span className="text-sm font-bold uppercase tracking-wider text-slate-500">Input Source</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Paste Study Text</label>
                    <textarea
                      className="w-full h-48 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
                      placeholder="Paste methods, blinding, and results sections here..."
                      value={inputText}
                      onChange={(e) => {
                        setInputText(e.target.value);
                        if (e.target.value) setFile(null);
                      }}
                      disabled={isAnalyzing}
                    />
                  </div>

                  <div className="relative">
                    <div className="flex items-center gap-3">
                      <div className="flex-grow border-t border-slate-200"></div>
                      <span className="text-xs font-bold text-slate-400 uppercase">OR</span>
                      <div className="flex-grow border-t border-slate-200"></div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Upload Study Image/PDF Screenshot</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-slate-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-indigo-50 file:text-indigo-700
                          hover:file:bg-indigo-100"
                        disabled={isAnalyzing}
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 text-sm rounded-lg flex items-center gap-2">
                    <i className="fas fa-circle-exclamation"></i>
                    {error}
                  </div>
                )}

                <button
                  onClick={runAnalysis}
                  disabled={isAnalyzing || (!inputText && !file)}
                  className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                    isAnalyzing || (!inputText && !file)
                      ? 'bg-slate-300 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]'
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <i className="fas fa-circle-notch fa-spin"></i>
                      Analyzing Study...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-wand-magic-sparkles"></i>
                      Analyze with PEDro Scale
                    </>
                  )}
                </button>
              </div>
            </div>
            
            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
              <h4 className="text-xs font-bold text-indigo-700 uppercase mb-2">How it works</h4>
              <p className="text-xs text-indigo-600 leading-relaxed">
                This tool uses advanced AI to scan your provided text for specific methodological details required by the PEDro scale. It follows the official 1999 administration guidelines to ensure conservative and accurate scoring.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex-grow text-center sm:text-left space-y-1">
                  <h2 className="text-2xl font-bold text-slate-900">Analysis Results</h2>
                  <p className="text-slate-500 max-w-lg">{analysis.summary}</p>
                </div>
                <div className="flex-shrink-0 flex flex-col items-center justify-center bg-slate-50 rounded-2xl p-6 border border-slate-200 min-w-[160px]">
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Total Score</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-6xl font-black text-indigo-600">{analysis.totalScore}</span>
                    <span className="text-2xl font-bold text-slate-300">/10</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PEDRO_CRITERIA.map((criterion) => {
                const result = analysis.results.find(r => r.criterionId === criterion.id);
                return (
                  <CriterionCard 
                    key={criterion.id} 
                    criterion={criterion} 
                    result={result} 
                  />
                );
              })}
            </div>

            <div className="flex justify-center pt-4">
              <button
                onClick={reset}
                className="px-8 py-3 bg-white border border-slate-200 rounded-full font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
              >
                Analyze Another Study
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-2">
          <p className="text-xs text-slate-500 font-medium">
            Based on the PEDro Scale (Last amended June 21st, 1999).
          </p>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest">
            AI analysis should be verified by a qualified human rater.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
