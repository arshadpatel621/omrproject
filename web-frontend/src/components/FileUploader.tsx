import React from 'react';

interface FileUploaderProps {
  onParse: (content: string) => void;
  accept?: string;
  label?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onParse, accept = '.csv,.txt', label }) => {
  const handleFile = (file?: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      onParse(text);
    };
    reader.readAsText(file);
  };

  return (
    <div>
      {label && <div style={{ marginBottom: 8, fontWeight: 600 }}>{label}</div>}
      <input
        type="file"
        accept={accept}
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />
    </div>
  );
};

export default FileUploader;
