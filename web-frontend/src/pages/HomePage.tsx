import { BarChart3, CheckCircle, Clock, FileText, Upload, Users } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const dashboardCards = [
    {
      icon: <Upload size={32} />,
      title: 'Upload Files',
      description: 'Upload answer keys and student answer sheets for processing',
      action: () => navigate('/upload'),
      color: '#3b82f6'
    },
    {
      icon: <BarChart3 size={32} />,
      title: 'View Results',
      description: 'Check student results and download reports',
      action: () => navigate('/results'),
      color: '#10b981'
    },
    {
      icon: <Users size={32} />,
      title: 'Student Management',
      description: 'Manage student information and class details',
      action: () => alert('Student Management feature coming soon!'),
      color: '#8b5cf6'
    },
    {
      icon: <FileText size={32} />,
      title: 'Reports',
      description: 'Generate detailed reports and analytics',
      action: () => alert('Reports feature coming soon!'),
      color: '#f59e0b'
    }
  ];

  const stats = [
    { label: 'Total Students', value: '1,247', icon: <Users size={20} />, color: '#3b82f6' },
    { label: 'Processed Tests', value: '89', icon: <CheckCircle size={20} />, color: '#10b981' },
    { label: 'Pending Uploads', value: '3', icon: <Clock size={20} />, color: '#f59e0b' },
    { label: 'Average Score', value: '78.5%', icon: <BarChart3 size={20} />, color: '#8b5cf6' }
  ];

  return (
    <main className="container mx-auto py-8 min-h-screen overflow-auto">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: '700', 
          color: '#1f2937',
          marginBottom: '8px'
        }}>
          Dashboard
        </h1>
        <p style={{ color: '#6b7280', fontSize: '18px' }}>
          Welcome to the OMR Management System. Manage your tests and view results efficiently.
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px',
        marginBottom: '40px'
      }}>
        {stats.map((stat, index) => (
          <div key={index} className="card" style={{ 
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: `${stat.color}20`,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: stat.color
            }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: '700', 
                color: '#1f2937',
                marginBottom: '4px'
              }}>
                {stat.value}
              </div>
              <div style={{ color: '#6b7280', fontSize: '14px' }}>
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: '600', 
          color: '#1f2937',
          marginBottom: '20px'
        }}>
          Quick Actions
        </h2>
        <div className="dashboard-grid">
          {dashboardCards.map((card, index) => (
            <div 
              key={index} 
              className="dashboard-card"
              onClick={card.action}
            >
              <div 
                className="dashboard-card-icon"
                style={{ backgroundColor: `${card.color}20`, color: card.color }}
              >
                {card.icon}
              </div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: '600', 
          color: '#1f2937',
          marginBottom: '20px'
        }}>
          Recent Activity
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { action: 'Uploaded test results for Class 10A', time: '2 hours ago', type: 'upload' },
            { action: 'Generated report for Mathematics Test', time: '1 day ago', type: 'report' },
            { action: 'Processed 45 answer sheets', time: '2 days ago', type: 'process' },
            { action: 'Added new student batch', time: '3 days ago', type: 'student' }
          ].map((activity, index) => (
            <div key={index} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              padding: '12px',
              backgroundColor: '#f9fafb',
              borderRadius: '8px'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                backgroundColor: activity.type === 'upload' ? '#10b981' : 
                               activity.type === 'report' ? '#3b82f6' :
                               activity.type === 'process' ? '#8b5cf6' : '#f59e0b',
                borderRadius: '50%'
              }}></div>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#374151', fontWeight: '500' }}>
                  {activity.action}
                </div>
                <div style={{ color: '#6b7280', fontSize: '14px' }}>
                  {activity.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default HomePage;
