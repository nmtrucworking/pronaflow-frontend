/**
 * Dropdown Menu Component
 * Reusable dropdown menu components
 */

import React, { forwardRef, createContext, useContext, useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';

// Context for dropdown state
interface DropdownContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const DropdownContext = createContext<DropdownContextType | undefined>(undefined);

const useDropdown = () => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('Dropdown components must be used within DropdownMenu');
  }
  return context;
};

// Main DropdownMenu wrapper
interface DropdownMenuProps {
  children: ReactNode;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="relative inline-block text-left">{children}</div>
    </DropdownContext.Provider>
  );
};

// Trigger button
interface DropdownMenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  asChild?: boolean;
}

export const DropdownMenuTrigger = forwardRef<HTMLButtonElement, DropdownMenuTriggerProps>(
  ({ children, asChild, ...props }, ref) => {
    const { isOpen, setIsOpen } = useDropdown();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      setIsOpen(!isOpen);
      props.onClick?.(e);
    };

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        onClick: handleClick,
        ref,
      });
    }

    return (
      <button
        ref={ref}
        type="button"
        onClick={handleClick}
        className="inline-flex items-center justify-center"
        {...props}
      >
        {children}
      </button>
    );
  }
);

DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';

// Content container
interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  align?: 'start' | 'center' | 'end';
}

export const DropdownMenuContent = forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  ({ children, align = 'end', className = '', ...props }, ref) => {
    const { isOpen, setIsOpen } = useDropdown();
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [isOpen, setIsOpen]);

    if (!isOpen) return null;

    const alignmentClasses = {
      start: 'left-0',
      center: 'left-1/2 -translate-x-1/2',
      end: 'right-0',
    };

    return (
      <div
        ref={contentRef}
        className={`absolute z-50 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 ${alignmentClasses[align]} ${className}`}
        {...props}
      >
        <div className="py-1" role="menu" aria-orientation="vertical">
          {children}
        </div>
      </div>
    );
  }
);

DropdownMenuContent.displayName = 'DropdownMenuContent';

// Menu item
interface DropdownMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  destructive?: boolean;
}

export const DropdownMenuItem = forwardRef<HTMLButtonElement, DropdownMenuItemProps>(
  ({ children, destructive, className = '', onClick, ...props }, ref) => {
    const { setIsOpen } = useDropdown();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      setIsOpen(false);
    };

    return (
      <button
        ref={ref}
        type="button"
        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 ${
          destructive ? 'text-red-600 hover:bg-red-50' : 'text-gray-700'
        } ${className}`}
        role="menuitem"
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);

DropdownMenuItem.displayName = 'DropdownMenuItem';

// Separator
interface DropdownMenuSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

export const DropdownMenuSeparator = forwardRef<HTMLDivElement, DropdownMenuSeparatorProps>(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`h-px my-1 bg-gray-200 ${className}`}
      role="separator"
      {...props}
    />
  )
);

DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';

// Label
interface DropdownMenuLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const DropdownMenuLabel = forwardRef<HTMLDivElement, DropdownMenuLabelProps>(
  ({ children, className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`px-4 py-2 text-xs font-semibold text-gray-500 uppercase ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);

DropdownMenuLabel.displayName = 'DropdownMenuLabel';
