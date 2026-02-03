/**
 * TASK COMMENT SECTION COMPONENT
 * Comment/discussion area in TaskDetailPanel for collaboration
 */

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Heart,
  MessageCircle,
  MoreVertical,
  Edit2,
  Trash2,
  AlertCircle,
  Loader,
} from 'lucide-react';
import { taskService, TaskComment } from '@/services/taskService';
import { useTheme } from '@/themes/ThemeProvider';

interface TaskCommentSectionProps {
  taskId: string;
  isLoading?: boolean;
}

export function TaskCommentSection({ taskId, isLoading: initialLoading = false }: TaskCommentSectionProps) {
  const { theme } = useTheme();
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load comments on mount
  useEffect(() => {
    loadComments();
  }, [taskId]);

  // Auto-scroll to latest comment
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [comments]);

  // Auto-expand textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [newComment, editContent]);

  const loadComments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await taskService.getComments(taskId);
      setComments(response.comments || []);
    } catch (err) {
      setError('Không thể tải bình luận. Vui lòng thử lại.');
      console.error('Failed to load comments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const newCommentData = await taskService.createComment(taskId, {
        content: newComment,
      });

      setComments([...comments, newCommentData]);
      setNewComment('');
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    } catch (err) {
      setError('Không thể gửi bình luận. Vui lòng thử lại.');
      console.error('Failed to create comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateComment = async (commentId: string) => {
    if (!editContent.trim()) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const updated = await taskService.updateComment(taskId, commentId, editContent);
      setComments(comments.map((c) => (c.comment_id === commentId ? updated : c)));
      setEditingId(null);
      setEditContent('');
    } catch (err) {
      setError('Không thể cập nhật bình luận. Vui lòng thử lại.');
      console.error('Failed to update comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bình luận này?')) return;

    try {
      setIsSubmitting(true);
      setError(null);

      await taskService.deleteComment(taskId, commentId);
      setComments(comments.filter((c) => c.comment_id !== commentId));
    } catch (err) {
      setError('Không thể xóa bình luận. Vui lòng thử lại.');
      console.error('Failed to delete comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleLike = (commentId: string) => {
    const newLiked = new Set(likedComments);
    if (newLiked.has(commentId)) {
      newLiked.delete(commentId);
    } else {
      newLiked.add(commentId);
    }
    setLikedComments(newLiked);
  };

  const currentUser = {
    id: 'current_user',
    name: 'You',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=current_user',
  };

  return (
    <div className="flex flex-col h-full max-h-96 bg-slate-50/30 rounded-lg border border-slate-200">
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 flex-shrink-0">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-slate-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Thảo luận ({comments.length})
          </h3>
        </div>
      </div>

      {/* ERROR STATE */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-2 bg-red-50 border-b border-red-200 flex items-center gap-2 text-red-700 text-sm"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </motion.div>
      )}

      {/* COMMENTS LIST */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-3 p-4 custom-scrollbar"
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-20">
            <Loader className="w-5 h-5 text-slate-400 animate-spin" />
          </div>
        ) : comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-20 text-slate-400">
            <MessageCircle className="w-6 h-6 mb-2 opacity-50" />
            <p className="text-sm">Chưa có bình luận nào</p>
          </div>
        ) : (
          <AnimatePresence>
            {comments.map((comment, idx) => (
              <motion.div
                key={comment.comment_id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group flex gap-3"
              >
                {/* AVATAR */}
                <img
                  src={comment.author_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author_id}`}
                  alt={comment.author_name}
                  className="w-7 h-7 rounded-full flex-shrink-0"
                />

                {/* COMMENT CONTENT */}
                <div className="flex-1 min-w-0">
                  {editingId === comment.comment_id ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleUpdateComment(comment.comment_id);
                      }}
                      className="space-y-2"
                    >
                      <textarea
                        ref={textareaRef}
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        placeholder="Chỉnh sửa bình luận..."
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                        rows={2}
                      />
                      <div className="flex items-center gap-2">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-medium rounded transition-colors"
                        >
                          Cập nhật
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium rounded transition-colors"
                        >
                          Hủy
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900">
                          {comment.author_name}
                        </span>
                        <span className="text-xs text-slate-500">
                          {new Date(comment.created_at).toLocaleString('vi-VN', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {comment.edited && (
                          <span className="text-xs text-slate-400">(đã chỉnh sửa)</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap break-words">
                        {comment.content}
                      </p>

                      {/* ACTIONS */}
                      <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => toggleLike(comment.comment_id)}
                          className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
                            likedComments.has(comment.comment_id)
                              ? 'text-red-600 bg-red-50'
                              : 'text-slate-500 hover:bg-slate-100'
                          }`}
                        >
                          <Heart
                            className={`w-3 h-3 ${
                              likedComments.has(comment.comment_id) ? 'fill-current' : ''
                            }`}
                          />
                          {likedComments.has(comment.comment_id) ? 'Liked' : 'Like'}
                        </button>

                        {/* EDIT/DELETE MENU */}
                        <div className="ml-auto flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditingId(comment.comment_id);
                              setEditContent(comment.content);
                            }}
                            className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment.comment_id)}
                            className="p-1 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Xóa"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* COMMENT INPUT */}
      <form onSubmit={handleSubmitComment} className="border-t border-slate-200 p-3 bg-white flex-shrink-0">
        <div className="flex gap-2">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-7 h-7 rounded-full flex-shrink-0"
          />
          <div className="flex-1 flex flex-col gap-2">
            <textarea
              ref={textareaRef}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Thêm bình luận..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none placeholder-slate-400"
              rows={1}
              disabled={isSubmitting}
            />
            <div className="flex items-center justify-end">
              <button
                type="submit"
                disabled={!newComment.trim() || isSubmitting}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-medium rounded-lg transition-all active:scale-95"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-3 h-3 animate-spin" />
                    Gửi...
                  </>
                ) : (
                  <>
                    <Send className="w-3 h-3" />
                    Gửi
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
