import { beforeEach, describe, expect, test, vi } from 'vitest';
import type { currentUser } from '../../types/teachers';
import { useFormatTeachersData } from '../../hooks/useFomatTeachersData';
import { renderHook } from '@testing-library/react';

import { useTeachersStore } from '@/stores/teachersStore';
import { currentUserResponse, teacher1 } from '../fixtures/teachers';

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
    const teachersResponse = [teacher1] as unknown as currentUser[];
    const loading = false;
    renderHook(() =>
      useFormatTeachersData(currentUserResponse, teachersResponse, !loading)
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
      class_subjects: [
        { id: 1, name: 'english' },
        { id: 3, name: 'mathematics' },
      ],
      studentsCount: 2,
      current_sign_in_at: '2023-01-01T12:00:00Z',
    });

    // 次: teacher1
    expect(dataTable[1]).toEqual({
      id: 2,
      name: 'Jane Smith',
      role: 'teacher',
      employment_status: 'active',
      class_subjects: [
        { id: 1, name: 'english' },
        { id: 4, name: 'science' },
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
          school_stage: 'junior_high_school',
          grade: 2,
        },
      ],
      available_days: [
        { id: 3, name: 'tuesday' },
        { id: 5, name: 'thursday' },
      ],
      class_subjects: [
        { id: 1, name: 'english' },
        { id: 4, name: 'science' },
      ],
    });

    expect(setDataTableSpy).toHaveBeenCalled();
    expect(setDetailDrawerSpy).toHaveBeenCalled();
  });

  test('should exclude null elements in teachersData (via filter(Boolean))', () => {
    const teachersResponse = [teacher1, null] as unknown as currentUser[];
    const loading = false;
    renderHook(() =>
      useFormatTeachersData(currentUserResponse, teachersResponse, !loading)
    );
    const { dataTable } = useTeachersStore.getState();

    // currentUser + teacher1 のみ（null は除外）
    expect(dataTable.map((r) => r.id)).toEqual([1, 2]);
  });

  test('should return only teachers when currentUser is missing', () => {
    const teachersResponse = [teacher1] as unknown as currentUser[];
    const loading = false;

    renderHook(() => useFormatTeachersData(null, teachersResponse, !loading));
    const { dataTable, detailDrawer } = useTeachersStore.getState();

    expect(dataTable).toHaveLength(1);
    expect(dataTable[0]).toEqual({
      id: 2,
      name: 'Jane Smith',
      role: 'teacher',
      employment_status: 'active',
      class_subjects: [
        { id: 1, name: 'english' },
        { id: 4, name: 'science' },
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
    const loading = false;
    renderHook(() => useFormatTeachersData(null, null, !loading));
    const { dataTable, detailDrawer } = useTeachersStore.getState();

    expect(dataTable).toEqual([]);
    const currentUser = detailDrawer.find((detail) => detail.id === 1);
    expect(currentUser).toBeUndefined();
  });

  test('does not update store when loading is true', () => {
    const teachersResponse = [teacher1] as unknown as currentUser[];
    const loading = true;
    renderHook(() =>
      useFormatTeachersData(currentUserResponse, teachersResponse, !loading)
    );
    const { dataTable, detailDrawer } = useTeachersStore.getState();

    // Expect no data to be set when loading is true
    expect(dataTable).toEqual([]);
    expect(detailDrawer).toEqual([]);
    expect(setDataTableSpy).not.toHaveBeenCalled();
    expect(setDetailDrawerSpy).not.toHaveBeenCalled();
  });

  test('does not update store when prev is equal to same', () => {
    const teachersResponse = [teacher1] as unknown as currentUser[];
    const loading = false;

    // First render to set the initial state
    renderHook(() =>
      useFormatTeachersData(currentUserResponse, teachersResponse, !loading)
    );
    const initialDataTable = useTeachersStore.getState().dataTable;
    const initialDetailDrawer = useTeachersStore.getState().detailDrawer;

    // Render again with the same data to test if the store updates
    renderHook(() =>
      useFormatTeachersData(currentUserResponse, teachersResponse, !loading)
    );
    const { dataTable, detailDrawer } = useTeachersStore.getState();

    // Expect the store not to update if the data is the same
    expect(dataTable).toBe(initialDataTable);
    expect(detailDrawer).toBe(initialDetailDrawer);
    expect(setDataTableSpy).toHaveBeenCalledTimes(1);
    expect(setDetailDrawerSpy).toHaveBeenCalledTimes(1);
  });
});
