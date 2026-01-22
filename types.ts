
export interface PedroCriterion {
  id: number;
  title: string;
  description: string;
  isScored: boolean; // Criterion 1 is not used for total score
}

export interface AnalysisResult {
  criterionId: number;
  met: boolean;
  reasoning: string;
  location?: string;
}

export interface TrialAnalysis {
  results: AnalysisResult[];
  totalScore: number;
  summary: string;
}

export const PEDRO_CRITERIA: PedroCriterion[] = [
  { id: 1, title: "Eligibility criteria", description: "Eligibility criteria were specified", isScored: false },
  { id: 2, title: "Random allocation", description: "Subjects were randomly allocated to groups", isScored: true },
  { id: 3, title: "Concealed allocation", description: "Allocation was concealed", isScored: true },
  { id: 4, title: "Baseline similarity", description: "Groups were similar at baseline regarding most important prognostic indicators", isScored: true },
  { id: 5, title: "Blinding (Subjects)", description: "There was blinding of all subjects", isScored: true },
  { id: 6, title: "Blinding (Therapists)", description: "There was blinding of all therapists who administered therapy", isScored: true },
  { id: 7, title: "Blinding (Assessors)", description: "There was blinding of all assessors who measured key outcomes", isScored: true },
  { id: 8, title: "Adequate follow-up", description: "Outcome measures obtained from >85% of subjects initially allocated", isScored: true },
  { id: 9, title: "Intention-to-treat", description: "All subjects received treatment as allocated, or data analyzed by intention to treat", isScored: true },
  { id: 10, title: "Between-group comparisons", description: "Results of between-group statistical comparisons reported for >1 key outcome", isScored: true },
  { id: 11, title: "Point & variability measures", description: "Study provides point measures and measures of variability for >1 key outcome", isScored: true }
];
