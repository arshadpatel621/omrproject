import { ArrowLeft, CheckCircle, Upload } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DragDropUpload from '../components/DragDropUpload';

const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState('');
  const [answerKeyFile, setAnswerKeyFile] = useState<File | null>(null);
  const [studentSheetsFile, setStudentSheetsFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

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

    setIsUploading(true);

    // Simulate upload process
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock successful upload
      setUploadSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setSelectedClass('');
        setAnswerKeyFile(null);
        setStudentSheetsFile(null);
        setUploadSuccess(false);
      }, 3000);
      
    } catch (error) {
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const isFormValid = selectedClass && answerKeyFile && studentSheetsFile;

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

        {/* Student Answer Sheets Upload */}
        <DragDropUpload
          title="Student Answer Sheets"
          description="Upload the scanned student answer sheets"
          acceptedTypes={['.pdf', '.jpg', '.jpeg', '.png', '.tiff']}
          maxSize={50}
          onFileSelect={setStudentSheetsFile}
          selectedFile={studentSheetsFile}
        />

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
    </div>
  );
};

export default UploadPage;
