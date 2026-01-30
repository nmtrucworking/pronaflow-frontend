import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useEffect } from 'react';

/**
 * Hàm cn (Class Name): Kết hợp clsx và tailwind-merge để xử lý class Tailwind
 * Giải quyết vấn đề ghi đè class (conflict) một cách an toàn.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Hook useClickOutside: Phát hiện click chuột bên ngoài vùng chỉ định
 * Thường dùng để đóng các cửa sổ Popover, Modal hoặc Dropdown.
 */
export function useClickOutside(ref: React.RefObject<HTMLElement>, handler: () => void) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      // Nếu click vào bên trong ref thì không làm gì cả
      if (!ref.current || ref.current.contains(event.target as Node)) return;
      handler();
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}