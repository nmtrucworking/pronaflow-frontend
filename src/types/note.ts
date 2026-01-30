/**
 * Note Entity
 * Module 6: Collaborative Execution & Decision Making
 * 
 * Ghi chú dự án có hỗ trợ cấu trúc phân cấp
 */

import type { Member } from './member';

export type NoteStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface Note {
  note_id: string;
  project_id: string;
  parent_note_id?: string; // Null if root level
  author_id: string;
  title: string;
  content: string; // Rich-text/Markdown
  status: NoteStatus;
  is_public: boolean; // For publishing outside project
  created_at: string;
  updated_at?: string;
  
  // Frontend only fields
  author?: Member;
  tags?: string[]; // Tag IDs
  child_notes?: Note[]; // Nested notes
}

export interface NoteVersion {
  version_id: string;
  note_id: string;
  version_no: number;
  author_id: string;
  content: string;
  created_at: string;
}

export interface CreateNoteDTO {
  project_id: string;
  title: string;
  content: string;
  parent_note_id?: string;
  is_public?: boolean;
  tag_ids?: string[];
}

export interface UpdateNoteDTO {
  title?: string;
  content?: string;
  status?: NoteStatus;
  is_public?: boolean;
  tag_ids?: string[];
}