# OMR Scanner Web App - Quick Start Guide

## 🚀 Get Started

### 1. Install Dependencies
```bash
cd web-frontend
npm install
```

### 2. Start Development Server
```bash
npm start
```

The app will open at `http://localhost:3000`

## 🔑 Login Credentials
- **Username:** admin
- **Password:** admin123

## 📝 Quick Demo (No Files Needed!)

1. Login with credentials above
2. Click "Upload Sheets" in sidebar
3. Click "Scan Sheets" button (without uploading files)
4. View auto-generated demo results!
5. Download results as CSV, Excel, or PDF

## Features

### ✅ Authentication
- Single admin login page
- Session management with localStorage
- Protected routes

### ✅ Home Dashboard
- Statistics cards (Total Scanned, Average Marks, Last Scan Time)
- Quick action cards
- Getting started guide

### ✅ Upload Sheets
- Drag & drop file upload for answer keys
- Drag & drop for multiple student sheets
- Class selection dropdown
- Scan simulation with loading state
- Demo mode with mock data

### ✅ Results
- Responsive results table
- Sortable columns (rank, name, roll number, class, marks)
- Color-coded marks badges
- Special styling for top 3 ranks
- Summary statistics
- Export as CSV, Excel (.xlsx), or PDF

### ✅ UI/UX
- Modern dashboard interface
- Smooth scrolling
- Framer Motion animations
- Responsive design (mobile, tablet, desktop)
- Mobile sidebar menu
- Consistent design system

## 📦 Tech Stack

- React 18 with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- React Router DOM for routing
- Lucide React for icons
- XLSX for Excel export
- jsPDF for PDF export
- FileSaver for file downloads

## 🎯 Workflow

Login → Home → Upload (files + class + scan) → Results → Download

## 📱 Responsive Design

The app works perfectly on:
- Desktop (1920x1080+)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)

## 🔧 Troubleshooting

**Port already in use?**
- The app will automatically try the next available port

**Dependencies not installing?**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

Enjoy! 🎉
