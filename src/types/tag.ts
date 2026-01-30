/**
 * Tag Entity
 * Module 4 & 15: Task Organization & Knowledge Base
 * 
 * Thẻ phân loại cho Tasks, Projects, Notes
 */

export type TagEntityType = 'TASK' | 'PROJECT' | 'NOTE' | 'ALL';

export interface Tag {
  tag_id: string;
  workspace_id: string;
  name: string;
  color_code: string; // Hex color code (e.g., #FF5733)
  entity_type_limit: TagEntityType;
  created_at: string;
  updated_at?: string;
}

export interface CreateTagDTO {
  name: string;
  color_code: string;
  entity_type_limit?: TagEntityType;
}

export interface UpdateTagDTO {
  name?: string;
  color_code?: string;
  entity_type_limit?: TagEntityType;
}

/**
 * Relationships:
 * - Tag 1→* PROJECT_TAG_MAP
 * - Tag 1→* NOTE_TAG_MAP
 * - Tag 1→* TASK_TAG_MAP
 * - Tag 1→* PLUGIN_TAG_MAP
 * - Tag 1→* ARTICLE_TAG
 * 
 * entity_type_limit restricts tag usage to specific entity types
 */
