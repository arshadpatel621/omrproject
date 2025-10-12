import { ArrowLeft, Award, Download, Filter, Search, TrendingUp, Trophy, Users } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { classOptions, mockResults, subjectOptions } from '../data/mockData';
import { exportToCSV, exportToExcel } from '../utils/exportUtils';

const ResultPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [sortBy, setSortBy] = useState<'rank' | 'name' | 'marks'>('rank');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredAndSortedResults = useMemo(() => {
    let filtered = mockResults.filter(result => {
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
  }, [searchTerm, selectedClass, selectedSubject, sortBy, sortOrder]);

  const handleExportCSV = () => {
    exportToCSV(filteredAndSortedResults, `student_results_${new Date().toISOString().split('T')[0]}`);
  };

  const handleExportExcel = () => {
    exportToExcel(filteredAndSortedResults, `student_results_${new Date().toISOString().split('T')[0]}`);
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
    <div className="container">
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px', 
        marginBottom: '32px',
        cursor: 'pointer'
      }} onClick={() => navigate('/')}>
        <ArrowLeft size={20} />
        <span>Back to Dashboard</span>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: '700', 
          color: '#1f2937',
          marginBottom: '8px'
        }}>
          Student Results
        </h1>
        <p style={{ color: '#6b7280', fontSize: '18px' }}>
          View and manage student test results
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div className="card" style={{ 
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            backgroundColor: '#3b82f620',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#3b82f6'
          }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: '700', 
              color: '#1f2937',
              marginBottom: '4px'
            }}>
              {stats.totalStudents}
            </div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>
              Total Students
            </div>
          </div>
        </div>

        <div className="card" style={{ 
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            backgroundColor: '#10b98120',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#10b981'
          }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: '700', 
              color: '#1f2937',
              marginBottom: '4px'
            }}>
              {stats.averageMarks}
            </div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>
              Average Marks
            </div>
          </div>
        </div>

        <div className="card" style={{ 
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            backgroundColor: '#8b5cf620',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#8b5cf6'
          }}>
            <Award size={24} />
          </div>
          <div>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: '700', 
              color: '#1f2937',
              marginBottom: '4px'
            }}>
              {stats.passRate}%
            </div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>
              Pass Rate
            </div>
          </div>
        </div>

        <div className="card" style={{ 
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            backgroundColor: '#f59e0b20',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f59e0b'
          }}>
            <Trophy size={24} />
          </div>
          <div>
            <div style={{ 
              fontSize: '18px', 
              fontWeight: '700', 
              color: '#1f2937',
              marginBottom: '4px'
            }}>
              {stats.topPerformer?.studentName || 'N/A'}
            </div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>
              Top Performer
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px',
          marginBottom: '20px'
        }}>
          <div className="form-group">
            <label className="form-label">Search</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search by name or roll no..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '40px' }}
              />
              <Search 
                size={20} 
                style={{ 
                  position: 'absolute', 
                  left: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: '#6b7280'
                }} 
              />
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

        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          justifyContent: 'flex-end',
          flexWrap: 'wrap'
        }}>
          <button 
            className="btn btn-secondary"
            onClick={handleExportCSV}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Download size={16} />
            Export CSV
          </button>
          <button 
            className="btn btn-primary"
            onClick={handleExportExcel}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Download size={16} />
            Export Excel
          </button>
        </div>
      </div>

      {/* Results Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
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
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      fontWeight: '600'
                    }}>
                      {student.rank <= 3 && (
                        <Trophy 
                          size={16} 
                          color={student.rank === 1 ? '#f59e0b' : student.rank === 2 ? '#6b7280' : '#cd7f32'} 
                        />
                      )}
                      {student.rank}
                    </div>
                  </td>
                  <td style={{ fontWeight: '500' }}>{student.studentName}</td>
                  <td>{student.rollNo}</td>
                  <td>{student.studentClass}</td>
                  <td>{student.subject}</td>
                  <td style={{ fontWeight: '600' }}>
                    {student.marks}/{student.totalMarks}
                  </td>
                  <td>
                    <span style={{ 
                      color: getGradeColor(student.percentage),
                      fontWeight: '600'
                    }}>
                      {student.percentage.toFixed(1)}%
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      backgroundColor: `${getGradeColor(student.percentage)}20`,
                      color: getGradeColor(student.percentage),
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600'
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
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            color: '#6b7280'
          }}>
            <Filter size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
            <h3 style={{ marginBottom: '8px' }}>No results found</h3>
            <p>Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultPage;
