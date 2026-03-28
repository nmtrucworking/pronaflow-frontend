/**
 * Security Incidents Page
 * Module 14: System Administration
 */

import { AlertTriangle, Eye, Archive } from 'lucide-react';
import type { SecurityIncident } from '@/types/admin';

const SecurityIncidentsPage = () => {
  const mockIncidents: SecurityIncident[] = [
    {
      incident_id: 'sec_1',
      type: 'unauthorized_access',
      severity: 'high',
      status: 'investigating',
      description: 'Multiple failed login attempts from suspicious IP',
      user_id: 'user_123',
      ip_address: '192.168.1.100',
      detected_at: '2024-03-29T10:30:00Z',
      resolved_at: undefined,
      actions_taken: 'IP has been blocked',
    },
    {
      incident_id: 'sec_2',
      type: 'suspicious_activity',
      severity: 'medium',
      status: 'resolved',
      description: 'Unusual API request pattern detected',
      user_id: 'user_456',
      ip_address: '203.0.113.45',
      detected_at: '2024-03-28T14:20:00Z',
      resolved_at: '2024-03-28T16:00:00Z',
      actions_taken: 'User notified and password reset',
    },
    {
      incident_id: 'sec_3',
      type: 'other',
      severity: 'low',
      status: 'closed',
      description: 'Failed login attempt',
      user_id: 'user_789',
      ip_address: '198.51.100.32',
      detected_at: '2024-03-27T09:15:00Z',
      resolved_at: '2024-03-27T09:30:00Z',
      actions_taken: 'Logged and monitored',
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800';
      case 'high':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
      case 'low':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'investigating':
        return '🔍';
      case 'resolved':
        return '✅';
      case 'closed':
        return '🔒';
      default:
        return '❓';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Security Incidents
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Monitor and manage security incidents and threats
        </p>
      </div>

      {/* Incidents List */}
      <div className="space-y-4">
        {mockIncidents.map((incident) => (
          <div
            key={incident.incident_id}
            className={`bg-white dark:bg-slate-900 rounded-lg border-2 p-6 ${getSeverityColor(
              incident.severity
            )}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex gap-4 flex-1">
                <div>
                  <AlertTriangle size={24} className="mt-1" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-lg capitalize">
                      {incident.type.replace(/_/g, ' ')}
                    </h3>
                    <span className="text-sm">{getStatusIcon(incident.status)}</span>
                  </div>
                  <p className="text-sm">{incident.description}</p>
                  <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div>
                      <p className="opacity-75">User ID</p>
                      <p className="font-mono font-bold">{incident.user_id || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="opacity-75">IP Address</p>
                      <p className="font-mono font-bold">{incident.ip_address}</p>
                    </div>
                    <div>
                      <p className="opacity-75">Detected</p>
                      <p className="font-mono font-bold">
                        {new Date(incident.detected_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="opacity-75">Status</p>
                      <p className="font-mono font-bold capitalize">{incident.status}</p>
                    </div>
                  </div>
                  {incident.actions_taken && (
                    <div className="mt-3 p-3 bg-black/10 dark:bg-white/10 rounded text-xs">
                      <p className="font-semibold mb-1">Actions Taken:</p>
                      <p>{incident.actions_taken}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 ml-4">
                <button className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-colors">
                  <Eye size={18} />
                </button>
                {incident.status !== 'closed' && (
                  <button className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-colors">
                    <Archive size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecurityIncidentsPage;
