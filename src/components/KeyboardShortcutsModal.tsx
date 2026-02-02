/**
 * Keyboard Shortcuts Cheatsheet Modal
 * Module 9: User Experience Personalization
 * Shows all available keyboard shortcuts
 */

import React from 'react';
import { X, Command, Keyboard } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShortcutGroup {
  title: string;
  shortcuts: {
    keys: string[];
    description: string;
  }[];
}

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modKey = isMac ? '⌘' : 'Ctrl';

  const shortcutGroups: ShortcutGroup[] = [
    {
      title: 'General',
      shortcuts: [
        { keys: [modKey, 'K'], description: 'Open command palette' },
        { keys: [modKey, '/'], description: 'Toggle sidebar' },
        { keys: ['?'], description: 'Show keyboard shortcuts' },
        { keys: [modKey, ','], description: 'Open settings' },
        { keys: ['Esc'], description: 'Close dialog/modal' },
      ],
    },
    {
      title: 'Navigation',
      shortcuts: [
        { keys: [modKey, 'D'], description: 'Go to Dashboard' },
        { keys: [modKey, 'T'], description: 'Go to Tasks' },
        { keys: [modKey, 'P'], description: 'Go to Projects' },
        { keys: [modKey, 'C'], description: 'Go to Calendar' },
        { keys: [modKey, 'I'], description: 'Go to Inbox' },
        { keys: ['G', 'H'], description: 'Go to Home' },
      ],
    },
    {
      title: 'Actions',
      shortcuts: [
        { keys: [modKey, 'N'], description: 'Create new task' },
        { keys: [modKey, 'Shift', 'N'], description: 'Create new project' },
        { keys: [modKey, 'S'], description: 'Save changes' },
        { keys: [modKey, 'Enter'], description: 'Submit form' },
        { keys: [modKey, 'Z'], description: 'Undo' },
        { keys: [modKey, 'Shift', 'Z'], description: 'Redo' },
      ],
    },
    {
      title: 'Task Management',
      shortcuts: [
        { keys: ['E'], description: 'Edit selected task' },
        { keys: ['D'], description: 'Delete selected task' },
        { keys: ['A'], description: 'Assign task' },
        { keys: ['L'], description: 'Add label' },
        { keys: ['M'], description: 'Move to project' },
        { keys: ['Space'], description: 'Mark as complete' },
      ],
    },
    {
      title: 'List Navigation',
      shortcuts: [
        { keys: ['↑', '↓'], description: 'Navigate items' },
        { keys: ['Enter'], description: 'Open item' },
        { keys: ['J', 'K'], description: 'Next/Previous (vim-style)' },
        { keys: [modKey, 'A'], description: 'Select all' },
        { keys: ['Shift', '↑/↓'], description: 'Multi-select' },
      ],
    },
    {
      title: 'Search & Filter',
      shortcuts: [
        { keys: [modKey, 'F'], description: 'Focus search' },
        { keys: [modKey, 'Shift', 'F'], description: 'Advanced filters' },
        { keys: ['Tab'], description: 'Switch filter tabs' },
        { keys: ['Esc'], description: 'Clear search' },
      ],
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
              <Keyboard className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Keyboard Shortcuts
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Master PronaFlow with these shortcuts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto custom-scrollbar p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {shortcutGroups.map((group) => (
              <div
                key={group.title}
                className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700"
              >
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 uppercase tracking-wide">
                  {group.title}
                </h3>
                <div className="space-y-2">
                  {group.shortcuts.map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-3 py-1.5"
                    >
                      <span className="text-sm text-slate-600 dark:text-slate-400 flex-1">
                        {shortcut.description}
                      </span>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, keyIndex) => (
                          <React.Fragment key={keyIndex}>
                            <kbd className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 text-xs font-mono bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-300 dark:border-slate-600 shadow-sm">
                              {key}
                            </kbd>
                            {keyIndex < shortcut.keys.length - 1 && (
                              <span className="text-slate-400 text-xs">+</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Customization Note */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl">
            <div className="flex items-start gap-3">
              <Command className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-1">
                  Customize Your Shortcuts
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Go to Settings → Keyboard Shortcuts to customize these shortcuts or create your own.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Press <kbd className="px-2 py-1 text-xs bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-600">?</kbd> to open this dialog anytime
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsModal;
