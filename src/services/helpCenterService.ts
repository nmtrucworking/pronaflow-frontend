/**
 * Help Center Service
 * Module 15: Help Center & Knowledge Base
 * 
 * Handles help articles, categories, search, and contextual help
 */

import axiosClient from '@/lib/axiosClient';
import type { AxiosResponse } from 'axios';

// ============================================================================
// TYPES
// ============================================================================

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

export interface ArticleVersion {
  version_id: string;
  article_id: string;
  version_number: number;
  title: string;
  content: string;
  changes_summary?: string;
  created_by: string;
  created_at: string;
}

export interface ArticleTranslation {
  translation_id: string;
  version_id: string;
  locale: string;
  title: string;
  content: string;
  translated_by?: string;
  created_at: string;
}

export interface RouteMapping {
  mapping_id: string;
  route_pattern: string;
  article_id: string;
  priority: number;
  created_at: string;
}

export interface ArticleFeedback {
  feedback_id: string;
  article_id: string;
  user_id?: string;
  rating: 'helpful' | 'not_helpful';
  comment?: string;
  created_at: string;
}

export interface SearchResult {
  article_id: string;
  title: string;
  excerpt: string;
  category_name: string;
  relevance_score: number;
  highlighted_content?: string;
}

// ============================================================================
// CATEGORIES
// ============================================================================

/**
 * Create help category
 */
export const createCategory = async (
  data: {
    name: string;
    description?: string;
    slug: string;
    icon?: string;
    parent_id?: string;
    order?: number;
  }
): Promise<AxiosResponse<HelpCategory>> => {
  return axiosClient.post('/help-center/categories', data);
};

/**
 * Get all categories
 */
export const getCategories = async (
  params?: {
    parent_id?: string;
    include_children?: boolean;
  }
): Promise<AxiosResponse<{ categories: HelpCategory[] }>> => {
  return axiosClient.get('/help-center/categories', { params });
};

/**
 * Get category by ID
 */
export const getCategoryById = async (
  categoryId: string
): Promise<AxiosResponse<HelpCategory>> => {
  return axiosClient.get(`/help-center/categories/${categoryId}`);
};

/**
 * Update category
 */
export const updateCategory = async (
  categoryId: string,
  data: Partial<HelpCategory>
): Promise<AxiosResponse<HelpCategory>> => {
  return axiosClient.patch(`/help-center/categories/${categoryId}`, data);
};

/**
 * Delete category
 */
export const deleteCategory = async (
  categoryId: string
): Promise<AxiosResponse<{ message: string }>> => {
  return axiosClient.delete(`/help-center/categories/${categoryId}`);
};

// ============================================================================
// ARTICLES
// ============================================================================

/**
 * Create help article
 */
export const createArticle = async (
  data: {
    category_id: string;
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    status?: 'draft' | 'published';
    tags?: string[];
  }
): Promise<AxiosResponse<HelpArticle>> => {
  return axiosClient.post('/help-center/articles', data);
};

/**
 * Get all articles
 */
export const getArticles = async (
  params?: {
    category_id?: string;
    status?: string;
    tag?: string;
    page?: number;
    page_size?: number;
  }
): Promise<AxiosResponse<{ articles: HelpArticle[]; pagination: any }>> => {
  return axiosClient.get('/help-center/articles', { params });
};

/**
 * Get article by ID
 */
export const getArticleById = async (
  articleId: string
): Promise<AxiosResponse<HelpArticle>> => {
  return axiosClient.get(`/help-center/articles/${articleId}`);
};

/**
 * Get article by slug
 */
export const getArticleBySlug = async (
  slug: string
): Promise<AxiosResponse<HelpArticle>> => {
  return axiosClient.get(`/help-center/articles/slug/${slug}`);
};

/**
 * Update article
 */
export const updateArticle = async (
  articleId: string,
  data: Partial<HelpArticle>
): Promise<AxiosResponse<HelpArticle>> => {
  return axiosClient.patch(`/help-center/articles/${articleId}`, data);
};

/**
 * Delete article
 */
export const deleteArticle = async (
  articleId: string
): Promise<AxiosResponse<{ message: string }>> => {
  return axiosClient.delete(`/help-center/articles/${articleId}`);
};

/**
 * Publish article
 */
export const publishArticle = async (
  articleId: string
): Promise<AxiosResponse<HelpArticle>> => {
  return axiosClient.post(`/help-center/articles/${articleId}/publish`);
};

/**
 * Get article reader view (increments view count)
 */
export const getArticleReaderView = async (
  articleId: string,
  locale?: string
): Promise<AxiosResponse<HelpArticle & { translated_content?: string }>> => {
  return axiosClient.get(`/help-center/articles/${articleId}/reader`, {
    params: { locale }
  });
};

// ============================================================================
// VERSIONS & TRANSLATIONS
// ============================================================================

/**
 * Create article version
 */
export const createArticleVersion = async (
  articleId: string,
  data: {
    title: string;
    content: string;
    changes_summary?: string;
  }
): Promise<AxiosResponse<ArticleVersion>> => {
  return axiosClient.post(`/help-center/articles/${articleId}/versions`, data);
};

/**
 * Get article versions
 */
export const getArticleVersions = async (
  articleId: string
): Promise<AxiosResponse<{ versions: ArticleVersion[] }>> => {
  return axiosClient.get(`/help-center/articles/${articleId}/versions`);
};

/**
 * Create translation
 */
export const createTranslation = async (
  versionId: string,
  data: {
    locale: string;
    title: string;
    content: string;
  }
): Promise<AxiosResponse<ArticleTranslation>> => {
  return axiosClient.post(`/help-center/versions/${versionId}/translations`, data);
};

/**
 * Get translations
 */
export const getTranslations = async (
  versionId: string
): Promise<AxiosResponse<{ translations: ArticleTranslation[] }>> => {
  return axiosClient.get(`/help-center/versions/${versionId}/translations`);
};

// ============================================================================
// CONTEXTUAL HELP & ROUTE MAPPINGS
// ============================================================================

/**
 * Create route mapping
 */
export const createRouteMapping = async (
  data: {
    route_pattern: string;
    article_id: string;
    priority?: number;
  }
): Promise<AxiosResponse<RouteMapping>> => {
  return axiosClient.post('/help-center/route-mappings', data);
};

/**
 * Get route mappings
 */
export const getRouteMappings = async (
  params?: {
    article_id?: string;
  }
): Promise<AxiosResponse<{ mappings: RouteMapping[] }>> => {
  return axiosClient.get('/help-center/route-mappings', { params });
};

/**
 * Get contextual help for route
 */
export const getContextualHelp = async (
  route: string
): Promise<AxiosResponse<{ articles: HelpArticle[] }>> => {
  return axiosClient.get('/help-center/contextual', {
    params: { route }
  });
};

/**
 * Set article visibility
 */
export const setArticleVisibility = async (
  articleId: string,
  data: {
    visible_to_roles?: string[];
    visible_to_plans?: string[];
  }
): Promise<AxiosResponse<{ message: string }>> => {
  return axiosClient.post(`/help-center/articles/${articleId}/visibility`, data);
};

// ============================================================================
// FEEDBACK & ENGAGEMENT
// ============================================================================

/**
 * Submit article feedback
 */
export const submitFeedback = async (
  articleId: string,
  data: {
    rating: 'helpful' | 'not_helpful';
    comment?: string;
  }
): Promise<AxiosResponse<ArticleFeedback>> => {
  return axiosClient.post(`/help-center/articles/${articleId}/feedback`, data);
};

/**
 * Get article feedback
 */
export const getArticleFeedback = async (
  articleId: string,
  params?: {
    rating?: string;
    page?: number;
    page_size?: number;
  }
): Promise<AxiosResponse<{ feedback: ArticleFeedback[]; pagination: any }>> => {
  return axiosClient.get(`/help-center/articles/${articleId}/feedback`, { params });
};

// ============================================================================
// SEARCH
// ============================================================================

/**
 * Search help articles
 */
export const searchArticles = async (
  query: string,
  params?: {
    category_id?: string;
    locale?: string;
    page?: number;
    page_size?: number;
  }
): Promise<AxiosResponse<{ results: SearchResult[]; pagination: any }>> => {
  return axiosClient.get('/help-center/search', {
    params: { q: query, ...params }
  });
};

/**
 * Log failed search
 */
export const logFailedSearch = async (
  data: {
    query: string;
    user_id?: string;
    context?: string;
  }
): Promise<AxiosResponse<{ message: string }>> => {
  return axiosClient.post('/help-center/search/failed', data);
};

/**
 * Get popular articles
 */
export const getPopularArticles = async (
  params?: {
    category_id?: string;
    limit?: number;
  }
): Promise<AxiosResponse<{ articles: HelpArticle[] }>> => {
  return axiosClient.get('/help-center/articles/popular', { params });
};

/**
 * Get recent articles
 */
export const getRecentArticles = async (
  params?: {
    limit?: number;
  }
): Promise<AxiosResponse<{ articles: HelpArticle[] }>> => {
  return axiosClient.get('/help-center/articles/recent', { params });
};

/**
 * Get related articles
 */
export const getRelatedArticles = async (
  articleId: string
): Promise<AxiosResponse<{ articles: HelpArticle[] }>> => {
  return axiosClient.get(`/help-center/articles/${articleId}/related`);
};

export default {
  // Categories
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  
  // Articles
  createArticle,
  getArticles,
  getArticleById,
  getArticleBySlug,
  updateArticle,
  deleteArticle,
  publishArticle,
  getArticleReaderView,
  
  // Versions & Translations
  createArticleVersion,
  getArticleVersions,
  createTranslation,
  getTranslations,
  
  // Contextual Help
  createRouteMapping,
  getRouteMappings,
  getContextualHelp,
  setArticleVisibility,
  
  // Feedback
  submitFeedback,
  getArticleFeedback,
  
  // Search
  searchArticles,
  logFailedSearch,
  getPopularArticles,
  getRecentArticles,
  getRelatedArticles,
};
