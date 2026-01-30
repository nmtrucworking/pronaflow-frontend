/**
 * Form Components
 * Reusable form wrapper components
 */

import React, { forwardRef } from 'react';
import type { ReactNode, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
}

export const Form = forwardRef<HTMLFormElement, FormProps>(
  ({ className = '', children, ...props }, ref) => (
    <form ref={ref} className={`space-y-6 ${className}`} {...props}>
      {children}
    </form>
  )
);

Form.displayName = 'Form';

interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  ({ className = '', children, ...props }, ref) => (
    <div ref={ref} className={`space-y-2 ${className}`} {...props}>
      {children}
    </div>
  )
);

FormField.displayName = 'FormField';

interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const FormItem = forwardRef<HTMLDivElement, FormItemProps>(
  ({ className = '', children, ...props }, ref) => (
    <div ref={ref} className={`space-y-2 ${className}`} {...props}>
      {children}
    </div>
  )
);

FormItem.displayName = 'FormItem';

interface FormControlProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const FormControl = forwardRef<HTMLDivElement, FormControlProps>(
  ({ className = '', children, ...props }, ref) => (
    <div ref={ref} className={`${className}`} {...props}>
      {children}
    </div>
  )
);

FormControl.displayName = 'FormControl';

interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: ReactNode;
}

export const FormMessage = forwardRef<HTMLParagraphElement, FormMessageProps>(
  ({ className = '', children, ...props }, ref) => {
    if (!children) return null;
    return (
      <p ref={ref} className={`text-sm text-red-600 ${className}`} {...props}>
        {children}
      </p>
    );
  }
);

FormMessage.displayName = 'FormMessage';

interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
}

export const FormLabel = forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className = '', children, ...props }, ref) => (
    <label
      ref={ref}
      className={`block text-sm font-medium text-gray-900 ${className}`}
      {...props}
    >
      {children}
    </label>
  )
);

FormLabel.displayName = 'FormLabel';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ className = '', ...props }, ref) => (
    <input
      ref={ref}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 ${className}`}
      {...props}
    />
  )
);

FormInput.displayName = 'FormInput';

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ className = '', ...props }, ref) => (
    <textarea
      ref={ref}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 ${className}`}
      {...props}
    />
  )
);

FormTextarea.displayName = 'FormTextarea';

interface FormErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

export const FormError = forwardRef<HTMLParagraphElement, FormErrorProps>(
  ({ className = '', children, ...props }, ref) => (
    <p ref={ref} className={`text-sm text-red-600 ${className}`} {...props}>
      {children}
    </p>
  )
);

FormError.displayName = 'FormError';

interface FormDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

export const FormDescription = forwardRef<HTMLParagraphElement, FormDescriptionProps>(
  ({ className = '', children, ...props }, ref) => (
    <p ref={ref} className={`text-sm text-gray-500 ${className}`} {...props}>
      {children}
    </p>
  )
);

FormDescription.displayName = 'FormDescription';

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode;
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ className = '', children, ...props }, ref) => (
    <select
      ref={ref}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 ${className}`}
      {...props}
    >
      {children}
    </select>
  )
);

FormSelect.displayName = 'FormSelect';
