/**
 * Help Center Types
 * Module 15: Help Center & Knowledge Base
 */

export interface HelpCategory {
  category_id: string;
  name: string;
  description?: string;
  slug: string;
  icon?: string;
  order: number;
  parent_id?: string;
  articles_count: number;
  created_at: string;
  updated_at: string;
}

export interface HelpArticle {
  article_id: string;
  category_id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  status: 'draft' | 'published' | 'archived';
  author_id: string;
  author_name?: string;
  views_count: number;
  helpful_count: number;
  not_helpful_count: number;
  tags?: string[];
  related_articles?: string[];
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface ArticleFeedback {
  feedback_id: string;
  article_id: string;
  user_id?: string;
  rating: 'helpful' | 'not_helpful';
  comment?: string;
  created_at: string;
}
