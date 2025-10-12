import { CheckCircle, Upload, X } from 'lucide-react';
import React, { useRef, useState } from 'react';

interface DragDropUploadProps {
  title: string;
  description: string;
  acceptedTypes: string[];
  maxSize: number; // in MB
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}

const DragDropUpload: React.FC<DragDropUploadProps> = ({
  title,
  description,
  acceptedTypes,
  maxSize,
  onFileSelect,
  selectedFile
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    // Check file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.includes(`.${fileExtension}`)) {
      setError(`Invalid file type. Accepted types: ${acceptedTypes.join(', ')}`);
      return false;
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size too large. Maximum size: ${maxSize}MB`);
      return false;
    }

    setError('');
    return true;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    onFileSelect(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="card">
      <h3 style={{ 
        fontSize: '18px', 
        fontWeight: '600', 
        color: '#1f2937',
        marginBottom: '8px'
      }}>
        {title}
      </h3>
      <p style={{ color: '#6b7280', marginBottom: '20px' }}>
        {description}
      </p>

      <div
        className={`drag-drop-area ${isDragOver ? 'drag-over' : ''} ${selectedFile ? 'has-files' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />

        {selectedFile ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#10b981',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <CheckCircle size={24} />
            </div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontWeight: '600', color: '#1f2937' }}>
                {selectedFile.name}
              </div>
              <div style={{ color: '#6b7280', fontSize: '14px' }}>
                {formatFileSize(selectedFile.size)}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeFile();
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#6b7280',
                padding: '8px'
              }}
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <div>
            <div style={{
              width: '64px',
              height: '64px',
              backgroundColor: '#eff6ff',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              color: '#3b82f6'
            }}>
              <Upload size={32} />
            </div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
              Drop files here or click to browse
            </div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>
              Accepted formats: {acceptedTypes.join(', ')} (Max {maxSize}MB)
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginTop: '16px' }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default DragDropUpload;
