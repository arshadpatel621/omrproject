# OMR Scanner App - Frontend

A complete working frontend UI for an OMR (Optical Mark Recognition) Scanner App built with React, TypeScript, and TailwindCSS.

## 🎯 Features

### ✅ Admin Login System
- **Demo Credentials**: Username: `admin`, Password: `admin`
- Session management using localStorage
- Secure logout functionality
- Protected routes with authentication

### ✅ Dashboard Home Page
- Clean, modern dashboard layout
- Quick navigation to Upload and Results pages
- Statistics cards showing system overview
- Recent activity feed
- Responsive design for all screen sizes

### ✅ Upload Page (OMR Scanning Simulation)
- **Dual Upload Zones**:
  - Answer Key upload (PDF, JPG, PNG, TIFF)
  - Student OMR Sheets upload (PDF, JPG, PNG, TIFF)
- **Class Selection**: Dropdown with 20 class options
- **Frontend OMR Simulation**: 
  - Parses CSV/text files for answer keys and student responses
  - Compares student answers with answer key
  - Calculates marks and percentages
  - Generates ranked results
- **Demo Data Generator**: One-click demo data for testing
- **Format Examples**: Clear instructions for file formats
- **Real-time Processing**: Shows processing status and results

### ✅ Results Page
- **Ranked Student List**: Sortable table with rankings
- **Advanced Filtering**: Search by name/roll number, filter by class/subject
- **Multiple Sort Options**: Rank, marks, name (ascending/descending)
- **Export Functionality**: 
  - CSV export
  - Excel export (.xlsx)
  - PDF export with formatted tables
- **Statistics Dashboard**: Total students, average marks, pass rate, top performer
- **Grade System**: Color-coded grades (A+, A, B+, B, C, F)
- **Responsive Table**: Horizontal scroll for mobile devices

### ✅ Global Features
- **TailwindCSS Styling**: Modern, consistent design
- **Smooth Scrolling**: Enhanced user experience
- **Responsive Design**: Works on desktop, tablet, and mobile
- **React Router**: Seamless navigation between pages
- **Client-Side Processing**: No backend required
- **localStorage Persistence**: Data persists between sessions

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Navigate to the frontend directory**:
   ```bash
   cd web-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

### Login
- Username: `admin`
- Password: `admin`

## 📁 Project Structure

```
web-frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── DragDropUpload.tsx
│   │   ├── FileUploader.tsx
│   │   ├── Navbar.tsx
│   │   └── ResultsTable.tsx
│   ├── contexts/           # React contexts for state management
│   │   ├── AuthContext.tsx
│   │   └── ResultsContext.tsx
│   ├── pages/              # Main application pages
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── UploadPage.tsx
│   │   └── ResultPage.tsx
│   ├── data/               # Mock data and types
│   │   └── mockData.ts
│   ├── utils/              # Utility functions
│   │   └── exportUtils.ts
│   ├── App.tsx             # Main app component
│   ├── index.tsx           # App entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── package.json
├── tailwind.config.js
└── README.md
```

## 🔧 Usage Guide

### 1. Login
- Use the demo credentials: `admin` / `admin`
- Session is automatically saved in localStorage

### 2. Upload and Process OMR Sheets

#### Option A: Use Demo Data (Recommended for Testing)
1. Select a class from the dropdown
2. Click "🎯 Generate Demo Data" button
3. Click "Upload and Process Files"

#### Option B: Upload Real Files
1. **Select Class**: Choose the appropriate class
2. **Upload Answer Key**: 
   - Drag & drop or click to upload answer key file
   - Or use text input with format: `A,B,C,D,A,B,C,D`
3. **Upload Student Sheets**:
   - Drag & drop or click to upload student answer sheets
   - Or use CSV format: `Roll,Name,Class,Answer1,Answer2,...`
4. **Process**: Click "Upload and Process Files"

#### Supported File Formats
- **Answer Key**: PDF, JPG, PNG, TIFF, CSV, TXT
- **Student Sheets**: PDF, JPG, PNG, TIFF, CSV, TXT

#### CSV Format Examples
**Answer Key**:
```
A,B,C,D,A,B,C,D,A,B,C,D,A,B,C,D,A,B,C,D
```

**Student Data**:
```
001,John Smith,Class 10A,A,B,C,D,A,B,C,D,A,B,C,D,A,B,C,D,A,B,C,D
002,Jane Doe,Class 10A,B,B,C,D,A,B,C,D,A,B,C,D,A,B,C,D,A,B,C,D
```

### 3. View Results
- Navigate to Results page
- Use filters to search and sort
- Export results in CSV, Excel, or PDF format
- View detailed statistics and rankings

## 🎨 Styling and Theming

The app uses TailwindCSS with custom CSS for enhanced styling:

- **Color Scheme**: Blue primary (#3b82f6), Green success (#10b981)
- **Typography**: System fonts with proper hierarchy
- **Components**: Cards, buttons, forms with consistent styling
- **Animations**: Smooth transitions and loading states
- **Responsive**: Mobile-first design approach

## 📊 Data Management

- **Authentication**: localStorage-based session management
- **Results Storage**: Results persist in localStorage
- **Export Options**: CSV, Excel, and PDF formats
- **Mock Data**: Built-in demo data for testing

## 🔒 Security Features

- **Protected Routes**: Authentication required for all pages except login
- **Session Management**: Automatic logout on token expiration
- **Input Validation**: File type and size validation
- **Error Handling**: Graceful error handling throughout the app

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Static Hosting
The built files in the `build/` directory can be deployed to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

## 🛠️ Development

### Available Scripts
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Key Dependencies
- **React 18** - UI framework
- **TypeScript** - Type safety
- **React Router** - Navigation
- **TailwindCSS** - Styling
- **Lucide React** - Icons
- **jsPDF** - PDF generation
- **XLSX** - Excel export

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support or questions:
1. Check the demo data generator for testing
2. Review the format examples in the upload page
3. Ensure you're using supported file formats
4. Check browser console for any errors

---

**Note**: This is a frontend-only implementation with simulated OMR processing. For production use with real OMR scanning, integrate with appropriate backend services and image processing libraries.