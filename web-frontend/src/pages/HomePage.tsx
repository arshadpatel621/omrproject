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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Dashboard
        </h1>
        <p className="text-gray-500 text-lg">
          Welcome to the OMR Management System. Manage your tests and view results efficiently.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-5 mb-10" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        {stats.map((stat, index) => (
          <div key={index} className="card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
              {stat.icon}
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800 mb-1">
                {stat.value}
              </div>
              <div className="text-gray-500 text-sm">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-5">
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
        <h2 className="text-2xl font-semibold text-gray-800 mb-5">
          Recent Activity
        </h2>
        <div className="flex flex-col gap-4">
          {[
            { action: 'Uploaded test results for Class 10A', time: '2 hours ago', type: 'upload' },
            { action: 'Generated report for Mathematics Test', time: '1 day ago', type: 'report' },
            { action: 'Processed 45 answer sheets', time: '2 days ago', type: 'process' },
            { action: 'Added new student batch', time: '3 days ago', type: 'student' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 rounded-full" style={{
                backgroundColor: activity.type === 'upload' ? '#10b981' : 
                               activity.type === 'report' ? '#3b82f6' :
                               activity.type === 'process' ? '#8b5cf6' : '#f59e0b'
              }}></div>
              <div className="flex-1">
                <div className="text-gray-700 font-medium">
                  {activity.action}
                </div>
                <div className="text-gray-500 text-sm">
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
