import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import FileDropZone from '../components/FileDropZone';
import { CheckCircle, Loader } from 'lucide-react';

interface StudentResult {
  name: string;
  rollNumber: string;
  class: string;
  marks: number;
  totalQuestions: number;
  correctAnswers: number;
  rank: number;
}

const Upload = () => {
  const [answerKey, setAnswerKey] = useState<File[]>([]);
  const [studentSheets, setStudentSheets] = useState<File[]>([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const navigate = useNavigate();

  const calculateResults = async () => {
    setIsScanning(true);
    setScanComplete(false);

    try {
      // Generate mock answer key
      const parsedAnswerKey = Array.from({ length: 50 }, (_, i) => ({
        question: i + 1,
        answer: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)]
      }));

      // Generate mock student data
      const students = [
        { name: 'John Doe', rollNumber: '001', answers: parsedAnswerKey.map(() => ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)]) },
        { name: 'Jane Smith', rollNumber: '002', answers: parsedAnswerKey.map(() => ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)]) },
        { name: 'Mike Johnson', rollNumber: '003', answers: parsedAnswerKey.map(() => ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)]) },
        { name: 'Emily Brown', rollNumber: '004', answers: parsedAnswerKey.map(() => ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)]) },
        { name: 'David Wilson', rollNumber: '005', answers: parsedAnswerKey.map(() => ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)]) },
      ];

      // Calculate marks
      const results: StudentResult[] = students.map(student => {
        let correctAnswers = 0;
        parsedAnswerKey.forEach((keyAnswer, index) => {
          if (student.answers[index] === keyAnswer.answer) {
            correctAnswers++;
          }
        });
        
        const totalQuestions = parsedAnswerKey.length;
        const marks = Math.round((correctAnswers / totalQuestions) * 100);

        return {
          name: student.name,
          rollNumber: student.rollNumber,
          class: selectedClass || 'Not specified',
          marks,
          totalQuestions,
          correctAnswers,
          rank: 0
        };
      });

      // Sort by marks and assign ranks
      results.sort((a, b) => b.marks - a.marks);
      results.forEach((result, index) => {
        result.rank = index + 1;
      });

      // Save to localStorage
      localStorage.setItem('omr_results', JSON.stringify(results));
      localStorage.setItem('last_scan_time', new Date().toLocaleString());

      // Simulate scanning delay
      setTimeout(() => {
        setIsScanning(false);
        setScanComplete(true);
        setTimeout(() => {
          navigate('/results');
        }, 1500);
      }, 2000);
    } catch (error) {
      console.error('Error scanning sheets:', error);
      setIsScanning(false);
      alert('Error processing files. Please check the format and try again.');
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Upload Sheets</h1>
        <p className="text-gray-600">
          Upload answer keys and student sheets to scan
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Section 1: Upload Answer Key
        </h2>
        <FileDropZone
          onFilesSelected={setAnswerKey}
          accept=".csv,.xlsx,.txt"
          multiple={false}
          label="Answer Key File"
        />
        <p className="text-sm text-gray-500 mt-3">
          Format: Each row should contain question number and correct answer (e.g., 1,A)
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Section 2: Upload Student Sheets
        </h2>
        <FileDropZone
          onFilesSelected={setStudentSheets}
          accept=".csv,.xlsx,.txt"
          multiple={true}
          label="Student Answer Sheets"
        />
        <p className="text-sm text-gray-500 mt-3">
          Format: name, roll_number, answer1, answer2, ... (one student per row)
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Section 3: Select Class
        </h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Class/Grade
          </label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="input-field"
          >
            <option value="">Select a class</option>
            <option value="Class 9">Class 9</option>
            <option value="Class 10">Class 10</option>
            <option value="Class 11">Class 11</option>
            <option value="Class 12">Class 12</option>
          </select>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex justify-center"
      >
        {!scanComplete ? (
          <button
            onClick={calculateResults}
            disabled={isScanning}
            className="btn-primary px-8 py-3 text-lg flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isScanning ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Scanning...
              </>
            ) : (
              'Scan Sheets'
            )}
          </button>
        ) : (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-3 text-green-600 text-lg font-semibold"
          >
            <CheckCircle className="w-6 h-6" />
            Scan Complete! Redirecting...
          </motion.div>
        )}
      </motion.div>

      {(answerKey.length === 0 && studentSheets.length === 0) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="card bg-yellow-50 border-yellow-200"
        >
          <p className="text-sm text-yellow-800">
            <strong>Demo Mode:</strong> You can click "Scan Sheets" without uploading files to see a demo with mock data.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default Upload;
