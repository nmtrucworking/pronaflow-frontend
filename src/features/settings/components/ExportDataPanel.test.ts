import { describe, expect, it } from 'vitest';
import { isExportRequestDisabled, normalizeStatus } from './ExportDataPanel';

describe('normalizeStatus', () => {
  it('returns null when input is undefined', () => {
    expect(normalizeStatus(undefined, 0)).toBeNull();
  });

  it('maps queued status with minimum progress', () => {
    const result = normalizeStatus({ export_id: 'exp-1', status: 'queued' }, 0);
    expect(result?.status).toBe('queued');
    expect(result?.progress_percent).toBe(5);
  });

  it('increments processing progress and caps at 95', () => {
    const result = normalizeStatus({ export_id: 'exp-2', status: 'processing' }, 92);
    expect(result?.status).toBe('processing');
    expect(result?.progress_percent).toBe(95);
  });

  it('sets ready progress to 100', () => {
    const result = normalizeStatus({ export_id: 'exp-3', status: 'ready' }, 40);
    expect(result?.status).toBe('ready');
    expect(result?.progress_percent).toBe(100);
  });

  it('falls back unknown status to processing', () => {
    const result = normalizeStatus({ export_id: 'exp-4', status: 'unknown' }, 20);
    expect(result?.status).toBe('processing');
  });
});

describe('isExportRequestDisabled', () => {
  it('disables request when no resource selected', () => {
    expect(
      isExportRequestDisabled({
        selectedResourcesCount: 0,
        isRequesting: false,
        isPollingStatus: false,
      })
    ).toBe(true);
  });

  it('disables request when export is active', () => {
    expect(
      isExportRequestDisabled({
        selectedResourcesCount: 2,
        isRequesting: false,
        isPollingStatus: false,
        exportStatus: 'processing',
      })
    ).toBe(true);
  });

  it('allows request when idle and resources selected', () => {
    expect(
      isExportRequestDisabled({
        selectedResourcesCount: 2,
        isRequesting: false,
        isPollingStatus: false,
        exportStatus: 'ready',
      })
    ).toBe(false);
  });
});
