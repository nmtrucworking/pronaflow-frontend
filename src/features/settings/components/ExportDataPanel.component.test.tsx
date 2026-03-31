import React from 'react';
import { renderToString } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ExportDataPanel from './ExportDataPanel';

let mockUseQueryResult: { data?: { data: { export_id: string; status: string; download_url?: string } }; isFetching: boolean } = {
  data: undefined,
  isFetching: false,
};

let mockMutationPending = false;
const mockMutate = vi.fn();

vi.mock('@tanstack/react-query', () => ({
  useMutation: () => ({
    mutate: mockMutate,
    isPending: mockMutationPending,
  }),
  useQuery: () => mockUseQueryResult,
}));

vi.mock('@/services/archiveService', () => ({
  default: {
    requestDataExport: vi.fn(),
    getExportStatus: vi.fn(),
    downloadExport: vi.fn(),
  },
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('ExportDataPanel rendering', () => {
  beforeEach(() => {
    mockUseQueryResult = { data: undefined, isFetching: false };
    mockMutationPending = false;
    mockMutate.mockReset();
  });

  it('renders export request button', () => {
    const html = renderToString(<ExportDataPanel workspaceId="ws-1" />);
    expect(html).toContain('Yeu cau xuat du lieu');
  });

  it('shows reset button when export is ready', () => {
    mockUseQueryResult = {
      data: {
        data: {
          export_id: 'exp-ready',
          status: 'ready',
        },
      },
      isFetching: false,
    };

    const html = renderToString(<ExportDataPanel workspaceId="ws-1" />);
    expect(html).toContain('Tao phien xuat moi');
    expect(html).toContain('Ma phien xuat:');
    expect(html).toContain('exp-ready');
  });

  it('disables request button when export is processing', () => {
    mockUseQueryResult = {
      data: {
        data: {
          export_id: 'exp-processing',
          status: 'processing',
        },
      },
      isFetching: false,
    };

    const html = renderToString(<ExportDataPanel workspaceId="ws-1" />);
    expect(html).toContain('disabled');
    expect(html).toContain('Trang thai xuat:');
    expect(html).toContain('processing');
  });
});
