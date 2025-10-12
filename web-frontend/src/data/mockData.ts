export interface StudentResult {
  id: string;
  studentName: string;
  rollNo: string;
  studentClass: string;
  marks: number;
  totalMarks: number;
  percentage: number;
  rank: number;
  testDate: string;
  subject: string;
}

export const mockResults: StudentResult[] = [
  {
    id: '1',
    studentName: 'John Smith',
    rollNo: '001',
    studentClass: 'Class 10A',
    marks: 85,
    totalMarks: 100,
    percentage: 85.0,
    rank: 1,
    testDate: '2024-01-15',
    subject: 'Mathematics'
  },
  {
    id: '2',
    studentName: 'Sarah Johnson',
    rollNo: '002',
    studentClass: 'Class 10A',
    marks: 82,
    totalMarks: 100,
    percentage: 82.0,
    rank: 2,
    testDate: '2024-01-15',
    subject: 'Mathematics'
  },
  {
    id: '3',
    studentName: 'Michael Brown',
    rollNo: '003',
    studentClass: 'Class 10A',
    marks: 78,
    totalMarks: 100,
    percentage: 78.0,
    rank: 3,
    testDate: '2024-01-15',
    subject: 'Mathematics'
  },
  {
    id: '4',
    studentName: 'Emily Davis',
    rollNo: '004',
    studentClass: 'Class 10A',
    marks: 75,
    totalMarks: 100,
    percentage: 75.0,
    rank: 4,
    testDate: '2024-01-15',
    subject: 'Mathematics'
  },
  {
    id: '5',
    studentName: 'David Wilson',
    rollNo: '005',
    studentClass: 'Class 10A',
    marks: 72,
    totalMarks: 100,
    percentage: 72.0,
    rank: 5,
    testDate: '2024-01-15',
    subject: 'Mathematics'
  },
  {
    id: '6',
    studentName: 'Lisa Anderson',
    rollNo: '006',
    studentClass: 'Class 10A',
    marks: 70,
    totalMarks: 100,
    percentage: 70.0,
    rank: 6,
    testDate: '2024-01-15',
    subject: 'Mathematics'
  },
  {
    id: '7',
    studentName: 'Robert Taylor',
    rollNo: '007',
    studentClass: 'Class 10A',
    marks: 68,
    totalMarks: 100,
    percentage: 68.0,
    rank: 7,
    testDate: '2024-01-15',
    subject: 'Mathematics'
  },
  {
    id: '8',
    studentName: 'Jennifer Martinez',
    rollNo: '008',
    studentClass: 'Class 10A',
    marks: 65,
    totalMarks: 100,
    percentage: 65.0,
    rank: 8,
    testDate: '2024-01-15',
    subject: 'Mathematics'
  },
  {
    id: '9',
    studentName: 'Christopher Lee',
    rollNo: '009',
    studentClass: 'Class 10A',
    marks: 62,
    totalMarks: 100,
    percentage: 62.0,
    rank: 9,
    testDate: '2024-01-15',
    subject: 'Mathematics'
  },
  {
    id: '10',
    studentName: 'Amanda Garcia',
    rollNo: '010',
    studentClass: 'Class 10A',
    marks: 60,
    totalMarks: 100,
    percentage: 60.0,
    rank: 10,
    testDate: '2024-01-15',
    subject: 'Mathematics'
  },
  {
    id: '11',
    studentName: 'James Rodriguez',
    rollNo: '011',
    studentClass: 'Class 10A',
    marks: 58,
    totalMarks: 100,
    percentage: 58.0,
    rank: 11,
    testDate: '2024-01-15',
    subject: 'Mathematics'
  },
  {
    id: '12',
    studentName: 'Michelle White',
    rollNo: '012',
    studentClass: 'Class 10A',
    marks: 55,
    totalMarks: 100,
    percentage: 55.0,
    rank: 12,
    testDate: '2024-01-15',
    subject: 'Mathematics'
  },
  {
    id: '13',
    studentName: 'Daniel Harris',
    rollNo: '013',
    studentClass: 'Class 10A',
    marks: 52,
    totalMarks: 100,
    percentage: 52.0,
    rank: 13,
    testDate: '2024-01-15',
    subject: 'Mathematics'
  },
  {
    id: '14',
    studentName: 'Ashley Clark',
    rollNo: '014',
    studentClass: 'Class 10A',
    marks: 50,
    totalMarks: 100,
    percentage: 50.0,
    rank: 14,
    testDate: '2024-01-15',
    subject: 'Mathematics'
  },
  {
    id: '15',
    studentName: 'Matthew Lewis',
    rollNo: '015',
    studentClass: 'Class 10A',
    marks: 48,
    totalMarks: 100,
    percentage: 48.0,
    rank: 15,
    testDate: '2024-01-15',
    subject: 'Mathematics'
  }
];

export const classOptions = [
  'Class 1A', 'Class 1B', 'Class 2A', 'Class 2B',
  'Class 3A', 'Class 3B', 'Class 4A', 'Class 4B',
  'Class 5A', 'Class 5B', 'Class 6A', 'Class 6B',
  'Class 7A', 'Class 7B', 'Class 8A', 'Class 8B',
  'Class 9A', 'Class 9B', 'Class 10A', 'Class 10B'
];

export const subjectOptions = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology',
  'English', 'Hindi', 'Social Studies', 'Computer Science'
];
