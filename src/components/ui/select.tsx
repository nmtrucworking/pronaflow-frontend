/**
 * Select Component
 * Reusable select dropdown components
 */

import React, { forwardRef, createContext, useContext, useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';

// Context for select state
interface SelectContextType {
  value: string;
  onValueChange: (value: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const SelectContext = createContext<SelectContextType | undefined>(undefined);

const useSelect = () => {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error('Select components must be used within Select');
  }
  return context;
};

// Main Select wrapper
interface SelectProps {
  children: ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
}

export const Select: React.FC<SelectProps> = ({ 
  children, 
  value: controlledValue, 
  onValueChange,
  defaultValue = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue);
  
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  
  const handleValueChange = (newValue: string) => {
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
    setIsOpen(false);
  };

  return (
    <SelectContext.Provider value={{ value, onValueChange: handleValueChange, isOpen, setIsOpen }}>
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  );
};

// Select Trigger
interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ children, className = '', ...props }, ref) => {
    const { isOpen, setIsOpen } = useSelect();

    return (
      <button
        ref={ref}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3 py-2 text-left border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between ${className}`}
        {...props}
      >
        {children}
        <svg
          className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    );
  }
);

SelectTrigger.displayName = 'SelectTrigger';

// Select Value (displays selected value)
interface SelectValueProps {
  placeholder?: string;
}

export const SelectValue: React.FC<SelectValueProps> = ({ placeholder = 'Select...' }) => {
  const { value } = useSelect();
  return <span className="text-gray-900">{value || placeholder}</span>;
};

// Select Content
interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const SelectContent = forwardRef<HTMLDivElement, SelectContentProps>(
  ({ children, className = '', ...props }, ref) => {
    const { isOpen, setIsOpen } = useSelect();
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

    return (
      <div
        ref={contentRef}
        className={`absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

SelectContent.displayName = 'SelectContent';

// Select Item
interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  value: string;
}

export const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  ({ children, value, className = '', ...props }, ref) => {
    const { value: selectedValue, onValueChange } = useSelect();
    const isSelected = selectedValue === value;

    return (
      <div
        ref={ref}
        className={`px-3 py-2 cursor-pointer hover:bg-blue-50 ${
          isSelected ? 'bg-blue-100 text-blue-900 font-medium' : 'text-gray-900'
        } ${className}`}
        onClick={() => onValueChange(value)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

SelectItem.displayName = 'SelectItem';
