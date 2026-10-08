import { describe, it, expect } from 'vitest';
import { calculateChartMovement, isSameChart } from '../../app/lib/services/snapshots';
import { createLastfmTrackMock } from '../factories/tracks';

const track = (name: string) => createLastfmTrackMock({ name });

describe('calculateChartMovement', () => {
  it('returns rank changes and identifies new entries', () => {
    const today = [track('A'), track('B'), track('C'), track('D')];
    const previous = [track('C'), track('B'), track('A')];

    expect(calculateChartMovement(today, previous)).toEqual([2, 0, -2, 'new']);
  });
});

describe('isSameChart', () => {
  it('detects changed order', () => {
    expect(isSameChart([track('A'), track('B')], [track('B'), track('A')])).toBe(false);
  });
});
