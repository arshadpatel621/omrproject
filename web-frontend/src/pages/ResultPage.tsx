import { ArrowLeft, Award, Download, Filter, Search, TrendingUp, Trophy, Users } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResults } from '../contexts/ResultsContext';
import { classOptions, mockResults, subjectOptions } from '../data/mockData';
import { exportToCSV, exportToExcel, exportToPDF } from '../utils/exportUtils';

const ResultPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [sortBy, setSortBy] = useState<'rank' | 'name' | 'marks'>('rank');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const { results } = useResults();

  const filteredAndSortedResults = useMemo(() => {
    const source = results.length > 0 ? results : mockResults;
    let filtered = source.filter(result => {
      const matchesSearch = result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           result.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesClass = !selectedClass || result.studentClass === selectedClass;
      const matchesSubject = !selectedSubject || result.subject === selectedSubject;
      
      return matchesSearch && matchesClass && matchesSubject;
    });

    // Sort results
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'rank':
          comparison = a.rank - b.rank;
          break;
        case 'name':
          comparison = a.studentName.localeCompare(b.studentName);
          break;
        case 'marks':
          comparison = a.marks - b.marks;
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [searchTerm, selectedClass, selectedSubject, sortBy, sortOrder, results]);

  const handleExportCSV = () => {
    exportToCSV(filteredAndSortedResults, `student_results_${new Date().toISOString().split('T')[0]}`);
  };

  const handleExportExcel = () => {
    exportToExcel(filteredAndSortedResults, `student_results_${new Date().toISOString().split('T')[0]}`);
  };

  const handleExportPDF = () => {
    exportToPDF(filteredAndSortedResults, `student_results_${new Date().toISOString().split('T')[0]}`);
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return '#10b981'; // Green
    if (percentage >= 80) return '#3b82f6'; // Blue
    if (percentage >= 70) return '#8b5cf6'; // Purple
    if (percentage >= 60) return '#f59e0b'; // Orange
    return '#ef4444'; // Red
  };

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    return 'F';
  };

  const stats = useMemo(() => {
    const totalStudents = filteredAndSortedResults.length;
    const averageMarks = totalStudents > 0 ? 
      filteredAndSortedResults.reduce((sum, student) => sum + student.marks, 0) / totalStudents : 0;
    const passCount = filteredAndSortedResults.filter(student => student.percentage >= 50).length;
    const topPerformer = filteredAndSortedResults[0];

    return {
      totalStudents,
      averageMarks: averageMarks.toFixed(1),
      passRate: totalStudents > 0 ? ((passCount / totalStudents) * 100).toFixed(1) : '0',
      topPerformer
    };
  }, [filteredAndSortedResults]);

  return (
    <main className="container mx-auto py-8 min-h-screen overflow-auto">
      <div className="flex items-center gap-3 mb-8 cursor-pointer" onClick={() => navigate('/')}>
        <ArrowLeft size={20} />
        <span>Back to Dashboard</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Student Results
        </h1>
        <p className="text-gray-500 text-lg">
          View and manage student test results
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-5 mb-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        <div className="card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-blue-500" style={{ backgroundColor: '#3b82f620' }}>
            <Users size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800 mb-1">
              {stats.totalStudents}
            </div>
            <div className="text-gray-500 text-sm">
              Total Students
            </div>
          </div>
        </div>

        <div className="card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-emerald-500" style={{ backgroundColor: '#10b98120' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800 mb-1">
              {stats.averageMarks}
            </div>
            <div className="text-gray-500 text-sm">
              Average Marks
            </div>
          </div>
        </div>

        <div className="card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-purple-500" style={{ backgroundColor: '#8b5cf620' }}>
            <Award size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800 mb-1">
              {stats.passRate}%
            </div>
            <div className="text-gray-500 text-sm">
              Pass Rate
            </div>
          </div>
        </div>

        <div className="card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-amber-500" style={{ backgroundColor: '#f59e0b20' }}>
            <Trophy size={24} />
          </div>
          <div>
            <div className="text-lg font-bold text-gray-800 mb-1">
              {stats.topPerformer?.studentName || 'N/A'}
            </div>
            <div className="text-gray-500 text-sm">
              Top Performer
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="grid gap-4 mb-5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <div className="form-group">
            <label className="form-label">Search</label>
            <div className="relative">
              <input
                type="text"
                className="form-input pl-10"
                placeholder="Search by name or roll no..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Class</label>
            <select
              className="form-select"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="">All Classes</option>
              {classOptions.map((className) => (
                <option key={className} value={className}>
                  {className}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Subject</label>
            <select
              className="form-select"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="">All Subjects</option>
              {subjectOptions.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Sort By</label>
            <select
              className="form-select"
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split('-') as [typeof sortBy, typeof sortOrder];
                setSortBy(newSortBy);
                setSortOrder(newSortOrder);
              }}
            >
              <option value="rank-asc">Rank (Low to High)</option>
              <option value="rank-desc">Rank (High to Low)</option>
              <option value="marks-desc">Marks (High to Low)</option>
              <option value="marks-asc">Marks (Low to High)</option>
              <option value="name-asc">Name (A to Z)</option>
              <option value="name-desc">Name (Z to A)</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 justify-end flex-wrap">
          <button 
            className="btn btn-secondary"
            onClick={handleExportCSV}
          >
            <div className="flex items-center gap-2">
              <Download size={16} />
              <span>Export CSV</span>
            </div>
          </button>
          <button 
            className="btn btn-primary"
            onClick={handleExportExcel}
          >
            <div className="flex items-center gap-2">
              <Download size={16} />
              <span>Export Excel</span>
            </div>
          </button>
          <button 
            className="btn btn-success"
            onClick={handleExportPDF}
          >
            <div className="flex items-center gap-2">
              <Download size={16} />
              <span>Export PDF</span>
            </div>
          </button>
        </div>
      </div>

      {/* Results Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Student Name</th>
                <th>Roll No</th>
                <th>Class</th>
                <th>Subject</th>
                <th>Marks</th>
                <th>Percentage</th>
                <th>Grade</th>
                <th>Test Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedResults.map((student) => (
                <tr key={student.id}>
                  <td>
                    <div className="flex items-center gap-2 font-semibold">
                      {student.rank <= 3 && (
                        <Trophy 
                          size={16} 
                          color={student.rank === 1 ? '#f59e0b' : student.rank === 2 ? '#6b7280' : '#cd7f32'} 
                        />
                      )}
                      {student.rank}
                    </div>
                  </td>
                  <td className="font-medium">{student.studentName}</td>
                  <td>{student.rollNo}</td>
                  <td>{student.studentClass}</td>
                  <td>{student.subject}</td>
                  <td className="font-semibold">
                    {student.marks}/{student.totalMarks}
                  </td>
                  <td>
                    <span className="font-semibold" style={{ color: getGradeColor(student.percentage) }}>
                      {student.percentage.toFixed(1)}%
                    </span>
                  </td>
                  <td>
                    <span className="px-2 py-1 rounded text-xs font-semibold" style={{ 
                      backgroundColor: `${getGradeColor(student.percentage)}20`,
                      color: getGradeColor(student.percentage)
                    }}>
                      {getGrade(student.percentage)}
                    </span>
                  </td>
                  <td>{new Date(student.testDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAndSortedResults.length === 0 && (
          <div className="text-center p-10 text-gray-500">
            <Filter size={48} className="mx-auto mb-4 opacity-50" />
            <h3 className="mb-2">No results found</h3>
            <p>Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default ResultPage;
