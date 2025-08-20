import { beforeEach, describe, expect, test, vi } from 'vitest';
import type { currentUser } from '../../types/teachers';
import { useFormatTeachersData } from './useFomatTeachersData';
import { renderHook } from '@testing-library/react';
import { currentUserResponse, teacher1 } from '../../fixtures/teachers';
import { useTeachersStore } from '@/stores/teachersStore';

describe('useFormatTeachersData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useTeachersStore.setState({
      dataTable: [],
      detailDrawer: [],
    });
  });

  const setDataTableSpy = vi.spyOn(useTeachersStore.getState(), 'setDataTable');
  const setDetailDrawerSpy = vi.spyOn(
    useTeachersStore.getState(),
    'setDetailDrawer'
  );

  test('formats teachers data correctly', () => {
    // Zustand の関数をスパイして呼び出しを監視

    const teachersResponse = [teacher1] as unknown as currentUser[];
    renderHook(() =>
      useFormatTeachersData(currentUserResponse, teachersResponse)
    );

    const { dataTable, detailDrawer } = useTeachersStore.getState();
    // 並びと整形結果（DataTable用）を検証
    expect(dataTable).toHaveLength(2);

    // 先頭: currentUser
    expect(dataTable[0]).toEqual({
      id: 1,
      name: 'John Doe',
      role: 'admin',
      employment_status: 'active',
      classSubject: [
        { id: 1, name: 'Math' },
        { id: 2, name: 'English' },
      ],
      studentsCount: 1,
      current_sign_in_at: '2023-01-01T12:00:00Z',
    });

    // 次: teacher1
    expect(dataTable[1]).toEqual({
      id: 2,
      name: 'Jane Smith',
      role: 'teacher',
      employment_status: 'active',
      classSubject: [
        { id: 2, name: 'English' },
        { id: 3, name: 'Science' },
      ],
      studentsCount: 1,
      current_sign_in_at: '2024-01-01T12:00:00Z',
    });

    // 詳細データ検索の検証（teacher1）
    const detail2 = detailDrawer.find((detail) => detail.id === 2);
    expect(detail2).toEqual({
      id: 2,
      name: 'Jane Smith',
      role: 'teacher',
      email: 'jane.smith@example.com',
      created_at: '2024-01-01T12:00:00Z',
      employment_status: 'active',
      current_sign_in_at: '2024-01-01T12:00:00Z',
      students: [
        {
          id: 3,
          student_code: 'S4597',
          name: 'Student two',
          status: 'active',
          school_stage: 'junior high school',
          grade: 2,
        },
      ],
      teaching_assignments: [
        { id: 2, student_id: 3, user_id: 2, teaching_status: false },
      ],
      available_days: [
        { id: 2, name: 'Tuesday' },
        { id: 4, name: 'Thursday' },
      ],
      class_subjects: [
        { id: 2, name: 'English' },
        { id: 3, name: 'Science' },
      ],
    });

    expect(setDataTableSpy).toHaveBeenCalled();
    expect(setDetailDrawerSpy).toHaveBeenCalled();
  });

  test('should exclude null elements in teachersData (via filter(Boolean))', () => {
    const teachersResponse = [teacher1, null] as unknown as currentUser[];

    renderHook(() =>
      useFormatTeachersData(currentUserResponse, teachersResponse)
    );
    const { dataTable } = useTeachersStore.getState();

    // currentUser + teacher1 のみ（null は除外）
    expect(dataTable.map((r) => r.id)).toEqual([1, 2]);
  });

  test('should return only teachers when currentUser is missing', () => {
    const teachersResponse = [teacher1] as unknown as currentUser[];

    renderHook(() => useFormatTeachersData(null, teachersResponse));
    const { dataTable, detailDrawer } = useTeachersStore.getState();

    expect(dataTable).toHaveLength(1);
    expect(dataTable[0]).toEqual({
      id: 2,
      name: 'Jane Smith',
      role: 'teacher',
      employment_status: 'active',
      classSubject: [
        { id: 2, name: 'English' },
        { id: 3, name: 'Science' },
      ],
      studentsCount: 1,
      current_sign_in_at: '2024-01-01T12:00:00Z',
    });

    // currentUser はidが1, teacher はidが2
    const currentUser = detailDrawer.find((detail) => detail.id === 1);
    const teacher = detailDrawer.find((detail) => detail.id === 2);

    expect(currentUser).toBeUndefined();
    expect(teacher?.email).toBe('jane.smith@example.com');
  });

  test('should return an empty array and undefined for lookups when both currentUser and teachersData are missing', () => {
    renderHook(() => useFormatTeachersData(null, null));
    const { dataTable, detailDrawer } = useTeachersStore.getState();

    expect(dataTable).toEqual([]);
    const currentUser = detailDrawer.find((detail) => detail.id === 1);
    expect(currentUser).toBeUndefined();
  });
});
