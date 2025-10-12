# OMR Management System - Frontend

A modern React + TypeScript frontend for the OMR (Optical Mark Recognition) Management System. This application provides a clean, professional interface for managing student test results, uploading answer keys and student answer sheets, and generating reports.

## Features

### 🔐 Authentication
- Single login page for all users
- Secure authentication with demo credentials
- Protected routes with automatic redirection

### 🏠 Dashboard
- Clean, professional dashboard with statistics
- Quick action cards for easy navigation
- Recent activity feed
- Responsive design for all devices

### 📤 Upload Management
- Class selection dropdown
- Drag-and-drop file upload for answer keys
- Drag-and-drop file upload for student answer sheets
- File validation (type and size)
- Real-time upload progress and feedback

### 📊 Results Management
- Comprehensive results table with sorting and filtering
- Search functionality by student name or roll number
- Class and subject filtering
- Export to CSV and Excel formats
- Rank-wise sorting with visual indicators
- Grade calculation and color coding

### 🎨 Design & UX
- Modern, clean interface with professional styling
- Responsive design that works on all devices
- Interactive buttons with hover effects
- Loading states and user feedback
- Consistent color scheme and typography

## Technology Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **React Router DOM** - Client-side routing
- **Lucide React** - Beautiful icons
- **XLSX** - Excel file generation
- **CSS3** - Modern styling with flexbox and grid

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Navigate to the web-frontend directory:
   ```bash
   cd web-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Demo Credentials

- **Username:** `admin`
- **Password:** `password`

## Project Structure

```
web-frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── DragDropUpload.tsx
│   │   └── Navbar.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── data/
│   │   └── mockData.ts
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── ResultPage.tsx
│   │   └── UploadPage.tsx
│   ├── utils/
│   │   └── exportUtils.ts
│   ├── App.tsx
│   ├── index.tsx
│   └── index.css
├── package.json
├── tsconfig.json
└── README.md
```

## Key Components

### Authentication
- `AuthContext.tsx` - Global authentication state management
- `LoginPage.tsx` - Login form with validation

### Navigation
- `Navbar.tsx` - Top navigation with user info and logout
- `App.tsx` - Main routing configuration

### Pages
- `HomePage.tsx` - Dashboard with statistics and quick actions
- `UploadPage.tsx` - File upload with drag-and-drop functionality
- `ResultPage.tsx` - Results table with filtering and export

### Utilities
- `DragDropUpload.tsx` - Reusable drag-and-drop file upload component
- `exportUtils.ts` - CSV and Excel export functionality
- `mockData.ts` - Sample data for development

## Features in Detail

### File Upload
- Supports PDF, JPG, JPEG, PNG, and TIFF formats
- File size validation (10MB for answer keys, 50MB for student sheets)
- Visual feedback for drag-and-drop interactions
- File preview with remove functionality

### Results Management
- Sortable columns (rank, name, marks)
- Advanced filtering by class and subject
- Search by student name or roll number
- Export functionality for CSV and Excel
- Grade calculation with color coding
- Trophy icons for top performers

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly interface
- Optimized for all screen sizes

## Customization

### Styling
The application uses CSS custom properties and modern CSS features. You can customize the color scheme by modifying the CSS variables in `src/index.css`.

### Data
Mock data is provided in `src/data/mockData.ts`. Replace this with real API calls to integrate with your backend.

### Authentication
The authentication system is currently using mock data. Integrate with your authentication API by modifying the `login` function in `AuthContext.tsx`.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
