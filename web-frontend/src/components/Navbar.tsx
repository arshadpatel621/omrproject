import { BarChart3, Home, LogOut, Upload } from 'lucide-react';
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

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
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <ul className="navbar-nav">
              <li>
                <Link 
                  to="/" 
                  className={isActive('/') ? 'active' : ''}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Home size={18} />
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/upload" 
                  className={isActive('/upload') ? 'active' : ''}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Upload size={18} />
                  Upload
                </Link>
              </li>
              <li>
                <Link 
                  to="/results" 
                  className={isActive('/results') ? 'active' : ''}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <BarChart3 size={18} />
                  Results
                </Link>
              </li>
            </ul>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: '#6b7280', fontSize: '14px' }}>
                Welcome, {user?.username}
              </span>
              <button 
                onClick={handleLogout}
                className="btn btn-secondary"
                style={{ 
                  padding: '8px 16px', 
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
