/**
 * Comment Entity
 * Module 6: Collaborative Execution & Decision Making
 * 
 * Bình luận lồng nhau trên Task
 */

export interface Comment {
  comment_id: string;
  task_id: string;
  parent_comment_id?: string; // NULL = root comment
  author_id: string;
  content: string; // Rich-text (HTML/JSON)
  is_edited: boolean;
  created_at: string;
  edited_at?: string;
  // Nested author data (optional)
  author?: {
    id: string;
    username: string;
    full_name?: string;
    avatar_url?: string;
  };
  // Nested replies (optional)
  replies?: Comment[];
}

export interface CreateCommentDTO {
  task_id: string;
  content: string;
  parent_comment_id?: string;
}

export interface UpdateCommentDTO {
  content: string;
}

/**
 * Self-referencing structure:
 * - parent_comment_id -> supports nested replies
 * - NULL parent_comment_id = root level comment
 */
