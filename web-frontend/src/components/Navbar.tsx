import { BarChart3, Home, LogOut, Moon, Sun, Upload } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldDark = stored ? stored === 'dark' : prefersDark;
    if (shouldDark) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            OMR Management System
          </Link>
          
          <div className="flex items-center gap-6">
            <ul className="navbar-nav">
              <li>
                <Link 
                  to="/" 
                  className={`${isActive('/') ? 'active' : ''} flex items-center gap-2`}
                >
                  <Home size={18} />
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/upload" 
                  className={`${isActive('/upload') ? 'active' : ''} flex items-center gap-2`}
                >
                  <Upload size={18} />
                  Upload
                </Link>
              </li>
              <li>
                <Link 
                  to="/results" 
                  className={`${isActive('/results') ? 'active' : ''} flex items-center gap-2`}
                >
                  <BarChart3 size={18} />
                  Results
                </Link>
              </li>
            </ul>
            
            <div className="flex items-center gap-3">
              <span className="text-gray-500 text-sm">
                Welcome, {user?.username}
              </span>
              <button
                onClick={toggleTheme}
                className="btn btn-secondary"
                title="Toggle theme"
              >
                <span className="flex items-center gap-2 text-sm">
                  {isDark ? <Sun size={16} /> : <Moon size={16} />}
                  {isDark ? 'Light' : 'Dark'}
                </span>
              </button>
              <button 
                onClick={handleLogout}
                className="btn btn-secondary"
              >
                <span className="flex items-center gap-2 text-sm">
                  <LogOut size={16} />
                  Logout
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
