export interface ShortcutGroup {
  title: string;
  shortcuts: {
    keys: string[];
    description: string;
  }[];
}

const withModifier = (isMac: boolean) => (isMac ? 'Cmd' : 'Ctrl');

export const getActiveShortcutGroups = (isMac: boolean): ShortcutGroup[] => {
  const mod = withModifier(isMac);

  return [
    {
      title: 'Global',
      shortcuts: [
        { keys: [mod, 'K'], description: 'Open command palette' },
        { keys: ['?'], description: 'Show keyboard shortcuts' },
        { keys: [mod, 'B'], description: 'Toggle sidebar' },
        { keys: ['C'], description: 'Create task' },
      ],
    },
    {
      title: 'Command Palette',
      shortcuts: [
        { keys: ['Arrow Up', 'Arrow Down'], description: 'Move through commands' },
        { keys: ['Enter'], description: 'Run selected command' },
        { keys: ['Esc'], description: 'Close command palette' },
      ],
    },
  ];
};

export const isEditableTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable;
};