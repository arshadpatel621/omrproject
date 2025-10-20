import React, { createContext, useContext, useEffect, useState } from 'react';
import { StudentResult } from '../data/mockData';

interface ResultsContextType {
  results: StudentResult[];
  setResults: (r: StudentResult[]) => void;
  addResults: (r: StudentResult[]) => void;
  clearResults: () => void;
}

const ResultsContext = createContext<ResultsContextType | undefined>(undefined);

export const useResults = () => {
  const ctx = useContext(ResultsContext);
  if (!ctx) throw new Error('useResults must be used within ResultsProvider');
  return ctx;
};

export const ResultsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [results, setResultsState] = useState<StudentResult[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('student_results');
    if (saved) {
      try {
        setResultsState(JSON.parse(saved));
      } catch {
        setResultsState([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('student_results', JSON.stringify(results));
  }, [results]);

  const setResults = (r: StudentResult[]) => setResultsState(r);
  const addResults = (r: StudentResult[]) => setResultsState(prev => [...r]);
  const clearResults = () => setResultsState([]);

  return (
    <ResultsContext.Provider value={{ results, setResults, addResults, clearResults }}>
      {children}
    </ResultsContext.Provider>
  );
};

export default ResultsContext;
