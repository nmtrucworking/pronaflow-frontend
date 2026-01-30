interface RelativeTimeProps {
  dateString: string;
}

export const RelativeTime: React.FC<RelativeTimeProps> = ({ dateString }) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let timeText = '';
  if (diffInSeconds < 60) timeText = 'Vừa xong';
  else if (diffInSeconds < 3600) timeText = `${Math.floor(diffInSeconds / 60)} phút trước`;
  else if (diffInSeconds < 86400) timeText = `${Math.floor(diffInSeconds / 3600)} giờ trước`;
  else timeText = `${Math.floor(diffInSeconds / 86400)} ngày trước`;

  return <span className="text-xs text-slate-400 whitespace-nowrap">{timeText}</span>;
};
