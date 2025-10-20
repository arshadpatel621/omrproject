import React from 'react';
import { StudentResult } from '../data/mockData';
import { exportToCSV } from '../utils/exportUtils';

interface Props {
  data: StudentResult[];
  showRank?: boolean;
}

const ResultsTable: React.FC<Props> = ({ data, showRank = true }) => {
  const handleDownload = () => {
    exportToCSV(data, `student_results_${new Date().toISOString().split('T')[0]}`);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <button className="btn btn-secondary" onClick={handleDownload}>Download Results</button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="table">
          <thead>
            <tr>
              {showRank && <th>Rank</th>}
              <th>Student Name</th>
              <th>Roll No</th>
              <th>Class</th>
              <th>Marks</th>
            </tr>
          </thead>
          <tbody>
            {data.map((s, i) => (
              <tr key={s.id || i}>
                {showRank && <td>{s.rank}</td>}
                <td style={{ fontWeight: 600 }}>{s.studentName}</td>
                <td>{s.rollNo}</td>
                <td>{s.studentClass}</td>
                <td style={{ fontWeight: 700 }}>{s.marks}/{s.totalMarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsTable;
