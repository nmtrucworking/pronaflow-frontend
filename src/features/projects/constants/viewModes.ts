export const VIEW_MODES = {
  GRID: 'GRID',
  LIST: 'LIST',
  KANBAN: 'KANBAN',
} as const;

export type ViewMode = keyof typeof VIEW_MODES;

export const SORT_OPTIONS = {
  NAME_ASC: 'NAME_ASC',
  PRIORITY_DESC: 'PRIORITY_DESC',
} as const;

export type SortOption = keyof typeof SORT_OPTIONS;
