export interface ArchiveItem {
  id: string;
  name: string;
  type: 'Project' | 'Task' | 'Document' | 'Workspace';
  archived_at: string;
  expiry_date: string;
  size: string;
  archived_by: string;
  reason: string;
  status: 'Safe' | 'Expiring' | 'Locked';
}
