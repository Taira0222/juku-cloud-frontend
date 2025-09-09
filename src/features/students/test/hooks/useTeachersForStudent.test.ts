import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { useTeachersForStudent } from '../../hooks/useTeachersForStudent';
import { useTeachersStore } from '@/stores/teachersStore';
import { detailDrawer } from '@/tests/fixtures/teachers/teachers';

describe('useTeachersForStudent', () => {
  test('should fetch teachers when enabled and store is empty', async () => {
    useTeachersStore.setState({ detailDrawer: [] }); // ストアを空にする
    const enabled = true;
    const { result } = renderHook(() => useTeachersForStudent(enabled));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.error).toBeNull();
    expect(result.current.teachers.length).toBe(13);
    result.current.teachers.forEach((t) => {
      expect(t).toHaveProperty('id');
      expect(t).toHaveProperty('name');
      expect(t).toHaveProperty('teachable_subjects');
      expect(t).toHaveProperty('workable_days');
    });
  });
  test('should not fetch teachers when disabled', async () => {
    useTeachersStore.setState({ detailDrawer: [] }); // ストアを空にする
    const enabled = false;
    const { result } = renderHook(() => useTeachersForStudent(enabled));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.error).toBeNull();
    expect(result.current.teachers.length).toBe(0); // ストアが空なのでteachersも空
  });

  test('should not fetch teachers and returns existing teachers when store is not empty', async () => {
    // ストアにダミーデータをセット
    useTeachersStore.setState({
      detailDrawer: [...detailDrawer],
    });
    const enabled = true;
    const { result } = renderHook(() => useTeachersForStudent(enabled));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.error).toBeNull();
    expect(result.current.teachers.length).toBe(2);
    expect(result.current.teachers[0].name).toBe('John Doe');
  });
});
