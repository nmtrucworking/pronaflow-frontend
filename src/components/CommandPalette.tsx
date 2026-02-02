/**
 * Command Palette Component
 * Module 9: Keyboard Shortcuts & Power Usage
 * Global command search (Cmd/Ctrl + K)
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Search,
  X,
  Command,
  ArrowRight,
  Hash,
  Folder,
  CheckCircle2,
  Calendar,
  Settings,
  Users,
  Inbox,
  LayoutDashboard,
  Plus,
  Keyboard
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CommandItem {
  id: string;
  title: string;
  description?: string;
  icon: React.ElementType;
  action: () => void;
  shortcut?: string;
  category: 'navigation' | 'actions' | 'settings';
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Define available commands
  const commands: CommandItem[] = [
    // Navigation
    {
      id: 'nav-dashboard',
      title: 'Go to Dashboard',
      icon: LayoutDashboard,
      action: () => {
        window.location.href = '/dashboard';
        onClose();
      },
      shortcut: 'D',
      category: 'navigation',
    },
    {
      id: 'nav-tasks',
      title: 'Go to Tasks',
      icon: CheckCircle2,
      action: () => {
        window.location.href = '/tasks';
        onClose();
      },
      shortcut: 'T',
      category: 'navigation',
    },
    {
      id: 'nav-calendar',
      title: 'Go to Calendar',
      icon: Calendar,
      action: () => {
        window.location.href = '/calendar';
        onClose();
      },
      shortcut: 'C',
      category: 'navigation',
    },
    {
      id: 'nav-inbox',
      title: 'Go to Inbox',
      icon: Inbox,
      action: () => {
        window.location.href = '/inbox';
        onClose();
      },
      shortcut: 'I',
      category: 'navigation',
    },
    {
      id: 'nav-projects',
      title: 'Go to Projects',
      icon: Folder,
      action: () => {
        window.location.href = '/projects';
        onClose();
      },
      shortcut: 'P',
      category: 'navigation',
    },
    {
      id: 'nav-team',
      title: 'Go to Team',
      icon: Users,
      action: () => {
        window.location.href = '/members';
        onClose();
      },
      category: 'navigation',
    },
    {
      id: 'nav-settings',
      title: 'Go to Settings',
      icon: Settings,
      action: () => {
        window.location.href = '/settings';
        onClose();
      },
      shortcut: ',',
      category: 'navigation',
    },
    // Actions
    {
      id: 'action-new-task',
      title: 'Create New Task',
      icon: Plus,
      action: () => {
        // Open task creation modal
        onClose();
      },
      shortcut: 'N',
      category: 'actions',
    },
    {
      id: 'action-new-project',
      title: 'Create New Project',
      icon: Folder,
      action: () => {
        // Open project creation modal
        onClose();
      },
      category: 'actions',
    },
    {
      id: 'action-shortcuts',
      title: 'View Keyboard Shortcuts',
      icon: Keyboard,
      action: () => {
        // Show shortcuts modal
        onClose();
      },
      shortcut: '?',
      category: 'actions',
    },
  ];

  // Filter commands based on search
  const filteredCommands = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(search.toLowerCase())
  );

  // Group commands by category
  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) {
      acc[cmd.category] = [];
    }
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredCommands.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    },
    [isOpen, filteredCommands, selectedIndex, onClose]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setSearch('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const categoryLabels = {
    navigation: 'Navigation',
    actions: 'Actions',
    settings: 'Settings',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Command Palette */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-700">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder-slate-400"
          />
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Commands List */}
        <div className="max-h-96 overflow-y-auto custom-scrollbar">
          {Object.entries(groupedCommands).map(([category, items]) => (
            <div key={category} className="py-2">
              <div className="px-4 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                {categoryLabels[category as keyof typeof categoryLabels]}
              </div>
              {items.map((cmd, index) => {
                const globalIndex = filteredCommands.indexOf(cmd);
                const isSelected = globalIndex === selectedIndex;
                const Icon = cmd.icon;

                return (
                  <button
                    key={cmd.id}
                    onClick={cmd.action}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-900 dark:text-indigo-100'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    )}
                  >
                    <Icon className={cn(
                      'w-5 h-5',
                      isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'
                    )} />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{cmd.title}</div>
                      {cmd.description && (
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {cmd.description}
                        </div>
                      )}
                    </div>
                    {cmd.shortcut && (
                      <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-mono bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-600">
                        <Command className="w-3 h-3" />
                        {cmd.shortcut}
                      </kbd>
                    )}
                    {isSelected && (
                      <ArrowRight className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}

          {filteredCommands.length === 0 && (
            <div className="px-4 py-12 text-center">
              <Search className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400">No commands found</p>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                Try a different search term
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-600">↑↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-600">↵</kbd>
              Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-600">Esc</kbd>
              Close
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
