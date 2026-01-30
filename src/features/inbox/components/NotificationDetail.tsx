import * as ScrollArea from '@radix-ui/react-scroll-area';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Archive, MessageSquare, Eye, Briefcase, FileText, ImageIcon } from 'lucide-react';
import type { NotificationEntity, Attachment } from '../types/inbox-types';

interface NotificationDetailProps {
  notification: NotificationEntity | null;
  onPreview: (att: Attachment) => void;
}

export const NotificationDetail: React.FC<NotificationDetailProps> = ({
  notification,
  onPreview,
}) => {
  if (!notification) {
    return (
      <div className="hidden md:flex flex-1 items-center justify-center bg-slate-50 border-l border-slate-200">
        <div className="text-center text-slate-400">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p>Chọn một thông báo để xem chi tiết</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white h-full overflow-hidden animate-in slide-in-from-right-4 duration-300">
      {/* Detail Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {notification.metadata?.project_name && (
              <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                {notification.metadata.project_name}
              </span>
            )}
            {notification.metadata?.task_key && (
              <span className="text-xs font-mono text-slate-400">
                #{notification.metadata.task_key}
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-slate-900">{notification.title}</h2>
        </div>
        <div className="flex gap-2">
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                  <Archive className="w-5 h-5" />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Content className="px-2 py-1 bg-slate-800 text-white text-xs rounded">
                Lưu trữ
              </Tooltip.Content>
            </Tooltip.Root>
          </Tooltip.Provider>
        </div>
      </div>

      {/* Detail Content */}
      <ScrollArea.Root className="flex-1 w-full overflow-hidden bg-slate-50/30">
        <ScrollArea.Viewport className="w-full h-full p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Sender Info */}
            <div className="flex items-center gap-4">
              {notification.actor ? (
                <img
                  src={notification.actor.avatar_url}
                  alt="avatar"
                  className="w-10 h-10 rounded-full ring-2 ring-white shadow-sm"
                />
              ) : (
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                  P
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {notification.actor?.username || 'PronaFlow System'}
                </p>
                <p className="text-xs text-slate-500">
                  {new Date(notification.created_at).toLocaleString('vi-VN')}
                </p>
              </div>
            </div>

            {/* Main Body */}
            <div className="prose prose-sm prose-slate max-w-none bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-slate-700 leading-relaxed">{notification.content}</p>

              {/* Attachments Section */}
              {notification.attachments && notification.attachments.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5" /> Tệp đính kèm ({notification.attachments.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {notification.attachments.map((att) => (
                      <div
                        key={att.id}
                        className="group flex items-center p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 hover:shadow-sm transition-all bg-slate-50"
                      >
                        <div className="w-10 h-10 rounded bg-white border border-slate-200 flex items-center justify-center shrink-0 text-slate-500">
                          {att.type === 'IMAGE' ? (
                            <ImageIcon className="w-5 h-5 text-purple-500" />
                          ) : (
                            <FileText className="w-5 h-5 text-blue-500" />
                          )}
                        </div>
                        <div className="ml-3 flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">{att.name}</p>
                          <p className="text-xs text-slate-500">{att.size}</p>
                        </div>
                        <button
                          onClick={() => onPreview(att)}
                          className="p-2 bg-white rounded-full text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 shadow-sm opacity-0 group-hover:opacity-100 transition-all border border-slate-100"
                          title="Xem trước"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contextual Action */}
              {notification.type === 'TASK_ASSIGNED' && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">Task mới cần thực hiện</p>
                      <p className="text-xs text-blue-600">Được gán bởi {notification.actor?.username}</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm active:scale-95">
                    Xem công việc
                  </button>
                </div>
              )}

              {notification.type === 'MENTION' && (
                <div className="mt-4">
                  <textarea
                    className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="Viết phản hồi nhanh..."
                    rows={3}
                  />
                  <div className="flex justify-end mt-2">
                    <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                      Gửi phản hồi
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          orientation="vertical"
          className="flex select-none touch-none p-0.5 bg-slate-100 transition-colors duration-[160ms] ease-out hover:bg-slate-200 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
        >
          <ScrollArea.Thumb className="flex-1 bg-slate-300 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </div>
  );
};
