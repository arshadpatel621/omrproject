import * as XLSX from 'xlsx';
import { StudentResult } from '../data/mockData';

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

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToExcel = (data: StudentResult[], filename: string = 'student_results') => {
  const worksheet = XLSX.utils.json_to_sheet(
    data.map(student => ({
      'Student Name': student.studentName,
      'Student Roll No': student.rollNo,
      'Student Class': student.studentClass,
      'Student Marks': student.marks,
      'Total Marks': student.totalMarks,
      'Percentage': student.percentage,
      'Rank': student.rank,
      'Test Date': student.testDate,
      'Subject': student.subject
    }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Student Results');

  // Auto-size columns
  const colWidths = [
    { wch: 20 }, // Student Name
    { wch: 15 }, // Roll No
    { wch: 15 }, // Class
    { wch: 12 }, // Marks
    { wch: 12 }, // Total Marks
    { wch: 12 }, // Percentage
    { wch: 8 },  // Rank
    { wch: 12 }, // Test Date
    { wch: 15 }  // Subject
  ];
  worksheet['!cols'] = colWidths;

  XLSX.writeFile(workbook, `${filename}.xlsx`);
};
