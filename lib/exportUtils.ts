import { StudentResult } from './mockData';

export const exportToCSV = (data: StudentResult[], filename: string = 'student_results') => {
  const csvContent = [
    ['Student Name', 'Student Roll No', 'Student Class', 'Student Marks', 'Total Marks', 'Percentage', 'Rank', 'Test Date', 'Subject'],
    ...data.map(student => [
      student.studentName,
      student.rollNo,
      student.studentClass,
      student.marks.toString(),
      student.totalMarks.toString(),
      student.percentage.toFixed(1),
      student.rank.toString(),
      student.testDate,
      student.subject
    ])
  ].map(row => row.join(',')).join('\n');

  // For React Native, we'll use a different approach
  // In a real app, you might want to use react-native-fs or similar
  console.log('CSV Content:', csvContent);
  
  // For demo purposes, we'll just show an alert
  return csvContent;
};

export const exportToExcel = (data: StudentResult[], filename: string = 'student_results') => {
  // For React Native, Excel export would require additional libraries
  // For now, we'll return the same CSV format
  return exportToCSV(data, filename);
};

export const downloadFile = (content: string, filename: string, type: 'csv' | 'xlsx') => {
  // In a real React Native app, you would use:
  // - react-native-fs to save files
  // - react-native-share to share files
  // - or send to a server for download
  
  console.log(`Downloading ${filename}.${type}:`, content);
  
  // For demo purposes, we'll just log the content
  return true;
};
