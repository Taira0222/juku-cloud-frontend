import { mockTeachers } from '@/tests/fixtures/students/students';
import { describe, expect, test } from 'vitest';
import { buildTeachersByTab } from '../../utils/studentFormDerived';

describe('buildTeachersByTab', () => {
  test('should return teachers grouped by tab', () => {
    const mockProps = {
      teachers: mockTeachers,
      selectedSubjectIds: [1], // 英語
      allDayIds: [1, 2, 3, 4, 5, 6, 7],
    };
    const { byDay } = buildTeachersByTab(
      mockProps.teachers,
      mockProps.selectedSubjectIds,
      mockProps.allDayIds
    );

    // 火曜日・木曜日タブでは、英語を教えられる講師が抽出される（teacher1, teacher2）
    [3, 5].forEach((dayId) => {
      expect(byDay[dayId].map((t) => t.id)).toEqual([2, 3]);
    });

    // 他の曜日は該当なし
    [1, 2, 4, 6, 7].forEach((dayId) => {
      expect(byDay[dayId]).toEqual([]);
    });
  });

  test('should return all teachers when no filters applied', () => {
    const mockProps = {
      teachers: mockTeachers,
      selectedSubjectIds: [],
      allDayIds: [1, 2, 3, 4, 5, 6, 7],
    };
    const { byDay } = buildTeachersByTab(
      mockProps.teachers,
      mockProps.selectedSubjectIds,
      mockProps.allDayIds
    );

    // 各曜日はすべて空
    mockProps.allDayIds.forEach((dayId) => {
      expect(byDay[dayId]).toEqual([]);
    });
  });
});
