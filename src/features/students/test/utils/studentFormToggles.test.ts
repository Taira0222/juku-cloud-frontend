import { describe, expect, test } from 'vitest';
import {
  toggleAssignment,
  toggleValueById,
} from '../../utils/studentFormToggles';

describe('toggleValueById', () => {
  test('toggles value for existing id', () => {
    const mockProps = {
      list: [1, 2, 3],
      v: 2,
    };
    const result = toggleValueById(mockProps.list, mockProps.v);
    expect(result).toEqual([1, 3]);
  });
  test('toggles value for non-existing id', () => {
    const mockProps = {
      list: [1, 2, 3],
      v: 4,
    };
    const result = toggleValueById(mockProps.list, mockProps.v);
    expect(result).toEqual([1, 2, 3, 4]);
  });

  describe('toggleAssignment', () => {
    test('toggles value for existing assignment', () => {
      const mockProps = {
        list: [{ teacher_id: 1, subject_id: 2, day_id: 3 }],
        v: { teacher_id: 1, subject_id: 2, day_id: 3 },
      };
      const result = toggleAssignment(mockProps.list, mockProps.v);
      expect(result).toEqual([]);
    });
    test('adds value if not present', () => {
      const mockProps = {
        list: [],
        v: { teacher_id: 1, subject_id: 2, day_id: 3 },
      };
      const result = toggleAssignment(mockProps.list, mockProps.v);
      expect(result).toEqual([mockProps.v]);
    });
  });
});
