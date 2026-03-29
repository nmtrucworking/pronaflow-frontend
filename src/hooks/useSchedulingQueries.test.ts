import { describe, expect, it } from 'vitest';
import { schedulingQueryKeys } from './useSchedulingQueries';

describe('schedulingQueryKeys', () => {
  it('builds stable gantt key with filters', () => {
    const key = schedulingQueryKeys.ganttChart({
      project_id: 'project-123',
      zoom_level: 'week',
      include_milestones: true,
    });

    expect(key[0]).toBe('scheduling');
    expect(key[1]).toBe('gantt');
    expect(key[2]).toMatchObject({ project_id: 'project-123', zoom_level: 'week' });
  });

  it('builds scoped keys for critical path, baseline, and plan', () => {
    expect(schedulingQueryKeys.criticalPathByProject('p1')).toEqual(['scheduling', 'criticalPath', 'p1']);
    expect(schedulingQueryKeys.baselineByTask('t1')).toEqual(['scheduling', 'baseline', 't1']);
    expect(schedulingQueryKeys.planByProject('p2')).toEqual(['scheduling', 'plan', 'p2']);
  });

  it('builds simulation key by id', () => {
    expect(schedulingQueryKeys.simulationById('sim-77')).toEqual(['scheduling', 'simulation', 'sim-77']);
  });
});
