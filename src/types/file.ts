/**
 * File Entity
 * Module 9: File Storage & Versioning
 * 
 * Quản lý tệp đính kèm
 */

export type FileStorageTier = 'HOT' | 'COLD';

export interface File {
  file_id: string;
  task_id: string;
  uploaded_by: string;
  filename: string;
  mime_type: string;
  size: number; // in bytes
  current_version: number;
  storage_tier: FileStorageTier;
  created_at: string;
  // Optional fields
  url?: string;
  preview_url?: string;
}

export interface FileVersion {
  version_id: string;
  file_id: string;
  version_no: number;
  uploaded_by: string;
  size: number;
  created_at: string;
  storage_path: string;
}

export interface UploadFileDTO {
  task_id: string;
  file: File; // Actually FormData in implementation
}

/**
 * Context: Files are attached to Tasks
 * Storage tiers: HOT (frequent access), COLD (archive)
 */
