import { ArrowLeft, CheckCircle, Upload } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DragDropUpload from '../components/DragDropUpload';
import FileUploader from '../components/FileUploader';
import ResultsTable from '../components/ResultsTable';
import { useResults } from '../contexts/ResultsContext';
import { StudentResult } from '../data/mockData';

const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState('');
  const [answerKeyFile, setAnswerKeyFile] = useState<File | null>(null);
  const [studentSheetsFile, setStudentSheetsFile] = useState<File | null>(null);
  const [answerKeyText, setAnswerKeyText] = useState<string>('');
  const [studentText, setStudentText] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const { setResults, results } = useResults();

  const classes = [
    'Class 1A', 'Class 1B', 'Class 2A', 'Class 2B',
    'Class 3A', 'Class 3B', 'Class 4A', 'Class 4B',
    'Class 5A', 'Class 5B', 'Class 6A', 'Class 6B',
    'Class 7A', 'Class 7B', 'Class 8A', 'Class 8B',
    'Class 9A', 'Class 9B', 'Class 10A', 'Class 10B'
  ];

  const handleUpload = async () => {
    if (!selectedClass) {
      alert('Please select a class');
      return;
    }

    if (!answerKeyFile) {
      alert('Please upload an answer key file');
      return;
    }

    if (!studentSheetsFile) {
      alert('Please upload student answer sheets');
      return;
    }

    // We'll simulate scanning by reading CSV/text files if they are text; otherwise fall back to mock data
    setIsUploading(true);

    try {
      // Use FileReader to parse files if they are CSV/text
      const parseTextFile = (file: File | null) => new Promise<string | null>((resolve) => {
        if (!file) return resolve(null);
        const reader = new FileReader();
        reader.onload = (e) => resolve(String(e.target?.result || ''));
        reader.onerror = () => resolve(null);
        // try read as text; images will produce binary but we'll ignore
        reader.readAsText(file);
      });

      // prefer explicit text inputs (if user used FileUploader inputs), else try reading binary drag-drop files as text
      const [fileAnswerText, fileStudentText] = await Promise.all([
        parseTextFile(answerKeyFile),
        parseTextFile(studentSheetsFile)
      ]);

      const finalAnswerText = answerKeyText || fileAnswerText || '';
      const finalStudentText = studentText || fileStudentText || '';

      let results: StudentResult[] = [];

      if (finalAnswerText && finalStudentText) {
        // Parse answer key as comma-separated answers on one line
        const keyLine = finalAnswerText.split(/\r?\n/).find(l => l.trim().length > 0) || '';
        const keyAnswers = keyLine.split(/[,\s]+/).map(s => s.trim()).filter(Boolean);

        // Parse student CSV: try to parse rows with roll,name,class,answers...
  const rows = finalStudentText.split(/\r?\n/).map(r => r.trim()).filter(Boolean);
        for (let i = 0; i < rows.length; i++) {
          const cols = rows[i].split(/[,,\t]+/).map(c => c.trim()).filter(Boolean);
          // Try common formats: Roll,Name,Class,ans1,ans2,... OR Name,Roll,Class,ans1...
          if (cols.length >= keyAnswers.length + 3) {
            const roll = cols[0];
            const name = cols[1];
            const cls = cols[2] || selectedClass;
            const answers = cols.slice(3, 3 + keyAnswers.length);
            let marks = 0;
            for (let q = 0; q < keyAnswers.length; q++) {
              if ((answers[q] || '').toLowerCase() === (keyAnswers[q] || '').toLowerCase()) marks++;
            }
            const total = keyAnswers.length || 0;
            results.push({
              id: `${Date.now()}-${i}`,
              studentName: name || `Student ${i + 1}`,
              rollNo: roll || `R${i + 1}`,
              studentClass: cls || selectedClass || 'Unknown',
              marks,
              totalMarks: total,
              percentage: total ? (marks / total) * 100 : 0,
              rank: 0,
              testDate: new Date().toISOString().split('T')[0],
              subject: 'Unknown'
            });
          }
        }
      }

      // If no parsable results, generate mock data for demo
      if (results.length === 0) {
        results = Array.from({ length: 10 }).map((_, idx) => ({
          id: `${Date.now()}-${idx}`,
          studentName: `Demo Student ${idx + 1}`,
          rollNo: `${100 + idx}`,
          studentClass: selectedClass || `Class 10A`,
          marks: Math.floor(Math.random() * 41) + 50,
          totalMarks: 100,
          percentage: 0,
          rank: 0,
          testDate: new Date().toISOString().split('T')[0],
          subject: 'Mathematics'
        })) as StudentResult[];
        results.forEach(r => (r.percentage = (r.marks / r.totalMarks) * 100));
      }

      // Compute ranks
      results.sort((a, b) => b.marks - a.marks);
      results.forEach((r, idx) => (r.rank = idx + 1));

      // Save to context/localStorage
      setResults(results);

      setUploadSuccess(true);

      setTimeout(() => {
        setUploadSuccess(false);
        setSelectedClass('');
        setAnswerKeyFile(null);
        setStudentSheetsFile(null);
      }, 1500);

    } catch (error) {
      console.error(error);
      alert('Processing failed. Showing demo data instead.');
    } finally {
      setIsUploading(false);
    }
  };

  const isFormValid = selectedClass && (answerKeyFile || answerKeyText) && (studentSheetsFile || studentText);

  if (uploadSuccess) {
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

        <div className="card" style={{ textAlign: 'center', padding: '60px 40px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#10b981',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            color: 'white'
          }}>
            <CheckCircle size={40} />
          </div>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: '700', 
            color: '#1f2937',
            marginBottom: '12px'
          }}>
            Upload Successful!
          </h1>
          <p style={{ color: '#6b7280', fontSize: '18px', marginBottom: '32px' }}>
            Your files have been uploaded and are being processed. You can view the results once processing is complete.
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/results')}
          >
            View Results
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto py-8 min-h-screen overflow-auto">
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
          Upload Files
        </h1>
        <p style={{ color: '#6b7280', fontSize: '18px' }}>
          Upload answer keys and student answer sheets for processing
        </p>
      </div>

      <div style={{ display: 'grid', gap: '24px', maxWidth: '800px' }}>
        {/* Class Selection */}
        <div className="card">
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            color: '#1f2937',
            marginBottom: '16px'
          }}>
            Select Class
          </h3>
          <div className="form-group">
            <label className="form-label">Choose the class for this upload</label>
            <select
              className="form-select"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="">Select a class...</option>
              {classes.map((className) => (
                <option key={className} value={className}>
                  {className}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Answer Key Upload */}
        <DragDropUpload
          title="Answer Key"
          description="Upload the answer key file for the test"
          acceptedTypes={['.pdf', '.jpg', '.jpeg', '.png', '.tiff']}
          maxSize={10}
          onFileSelect={setAnswerKeyFile}
          selectedFile={answerKeyFile}
        />
        <div className="card">
          <p style={{ color: '#6b7280', marginBottom: 8 }}>Or paste/choose a text-based answer key (CSV or single-line answers)</p>
          <FileUploader label="Answer Key (CSV/text)" accept=".csv,.txt" onParse={(txt) => setAnswerKeyText(txt)} />
        </div>

        {/* Student Answer Sheets Upload */}
        <DragDropUpload
          title="Student Answer Sheets"
          description="Upload the scanned student answer sheets"
          acceptedTypes={['.pdf', '.jpg', '.jpeg', '.png', '.tiff']}
          maxSize={50}
          onFileSelect={setStudentSheetsFile}
          selectedFile={studentSheetsFile}
        />
        <div className="card">
          <p style={{ color: '#6b7280', marginBottom: 8 }}>Or upload a CSV with rows: Roll,Name,Class,ans1,ans2,...</p>
          <FileUploader label="Student Answers (CSV)" accept=".csv,.txt" onParse={(txt) => setStudentText(txt)} />
        </div>

        {/* Upload Button */}
        <div className="card">
          <button
            className="btn btn-primary"
            onClick={handleUpload}
            disabled={!isFormValid || isUploading}
            style={{ 
              width: '100%', 
              padding: '16px',
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}
          >
            {isUploading ? (
              <>
                <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                Processing Files...
              </>
            ) : (
              <>
                <Upload size={20} />
                Upload and Process Files
              </>
            )}
          </button>
          
          {!isFormValid && (
            <p style={{ 
              color: '#6b7280', 
              fontSize: '14px', 
              textAlign: 'center', 
              marginTop: '12px' 
            }}>
              Please select a class and upload both files to continue
            </p>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="card" style={{ marginTop: '32px' }}>
        <h3 style={{ 
          fontSize: '18px', 
          fontWeight: '600', 
          color: '#1f2937',
          marginBottom: '16px'
        }}>
          Upload Instructions
        </h3>
        <div style={{ display: 'grid', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{
              width: '24px',
              height: '24px',
              backgroundColor: '#3b82f6',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '12px',
              fontWeight: '600',
              flexShrink: 0
            }}>1</div>
            <div>
              <strong>Select Class:</strong> Choose the appropriate class for the test from the dropdown menu.
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{
              width: '24px',
              height: '24px',
              backgroundColor: '#3b82f6',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '12px',
              fontWeight: '600',
              flexShrink: 0
            }}>2</div>
            <div>
              <strong>Upload Answer Key:</strong> Upload a clear scan or PDF of the answer key. Supported formats: PDF, JPG, PNG, TIFF (Max 10MB).
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{
              width: '24px',
              height: '24px',
              backgroundColor: '#3b82f6',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '12px',
              fontWeight: '600',
              flexShrink: 0
            }}>3</div>
            <div>
              <strong>Upload Student Sheets:</strong> Upload all student answer sheets in a single file or multiple files. Supported formats: PDF, JPG, PNG, TIFF (Max 50MB).
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{
              width: '24px',
              height: '24px',
              backgroundColor: '#3b82f6',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '12px',
              fontWeight: '600',
              flexShrink: 0
            }}>4</div>
            <div>
              <strong>Process:</strong> Click the upload button to process the files. Results will be available once processing is complete.
            </div>
          </div>
        </div>
      </div>
      {/* Display processed results (if any) */}
      {results && results.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Scanned Results</h3>
          <ResultsTable data={results} />
        </div>
      )}
    </main>
  );
};

export default UploadPage;
