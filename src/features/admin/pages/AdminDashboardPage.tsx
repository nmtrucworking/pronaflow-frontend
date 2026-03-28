/**
 * Admin Dashboard Page
 * Module 14: System Administration
 */

import {
  Users,
  AlertTriangle,
  TrendingUp,
  Server,
  Shield,
  Activity,
} from 'lucide-react';
import { useAdminAccess } from '../hooks/useAdminAccess';

interface StatCard {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  color: string;
}

const AdminDashboardPage = () => {
  const { isSuperAdmin } = useAdminAccess();

  const stats: StatCard[] = [
    {
      label: 'Total Users',
      value: '1,234',
      icon: <Users size={24} />,
      trend: '+5.2%',
      color: 'indigo',
    },
    {
      label: 'Active Sessions',
      value: '456',
      icon: <Activity size={24} />,
      trend: '+12.3%',
      color: 'emerald',
    },
    {
      label: 'Security Incidents',
      value: '12',
      icon: <AlertTriangle size={24} />,
      trend: '-2.4%',
      color: 'red',
    },
    {
      label: 'Server Status',
      value: '99.8%',
      icon: <Server size={24} />,
      trend: 'Healthy',
      color: 'emerald',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      indigo: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400',
      emerald:
        'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
      red: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    };
    return colors[color] || colors.indigo;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Welcome back! Here's what's happening with your system.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                  {stat.value}
                </p>
                {stat.trend && (
                  <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-2">
                    {stat.trend}
                  </p>
                )}
              </div>
              <div className={`p-3 rounded-lg ${getColorClasses(stat.color)}`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Incidents */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            Recent Security Incidents
          </h2>
          <div className="space-y-3">
            {[
              {
                type: 'Unauthorized Access Attempt',
                severity: 'high',
                time: '2 hours ago',
                user: 'Unknown User',
              },
              {
                type: 'Suspicious Activity',
                severity: 'medium',
                time: '4 hours ago',
                user: 'admin@pronaflow.com',
              },
              {
                type: 'Failed Login',
                severity: 'low',
                time: '6 hours ago',
                user: 'user123@pronaflow.com',
              },
            ].map((incident, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      incident.severity === 'high'
                        ? 'bg-red-500'
                        : incident.severity === 'medium'
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                    }`}
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {incident.type}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {incident.user} • {incident.time}
                    </p>
                  </div>
                </div>
                <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 text-sm font-medium">
                  Review
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="space-y-2">
            {[
              { label: 'Manage Users', icon: '👥' },
              { label: 'Configure System', icon: '⚙️' },
              { label: 'View Audit Logs', icon: '📋' },
              { label: 'Review Incidents', icon: '🚨' },
              { label: 'Feature Flags', icon: '🚩' },
            ].map((action, idx) => (
              <button
                key={idx}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                <span className="mr-2">{action.icon}</span>
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
          System Health
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'API Server', status: 'Operational', uptime: '99.9%' },
            { label: 'Database', status: 'Operational', uptime: '99.8%' },
            { label: 'Cache', status: 'Operational', uptime: '99.7%' },
          ].map((service, idx) => (
            <div key={idx} className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {service.label}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {service.status}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {service.uptime}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
