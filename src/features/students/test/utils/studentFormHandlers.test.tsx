import { describe, expect, test } from 'vitest';
import { createStudentFormHandlers } from '../../utils/studentFormHandlers';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { initialMockValue } from '@/tests/fixtures/students/students';
import type { Draft } from '../../types/studentForm';

describe('createStudentFormHandlers', () => {
  const makeOnChangeHarness = (initial: Draft) => {
    // initial をクローンして state として保持(initial は変更されない)
    let state = structuredClone(initial);
    // update の関数があればそれを使用する
    const onChange = (updater: Draft | ((prev: Draft) => Draft)) => {
      state = typeof updater === 'function' ? updater(state) : updater;
    };
    return { onChange, get: () => state };
  };

  test('handleInputChange should update the form state', async () => {
    const h = makeOnChangeHarness(initialMockValue);
    const user = userEvent.setup();
    const { handleInputChange } = createStudentFormHandlers(h.onChange);
    render(
      <input onChange={handleInputChange('name')} data-testid="name-input" />
    );
    const input = screen.getByTestId('name-input');
    await user.type(input, 'John Doe');

    expect(h.get().name).toBe('John Doe');
  });

  test('handleSelectChange should update the form state for status', () => {
    const h = makeOnChangeHarness(initialMockValue);
    const { handleSelectChange } = createStudentFormHandlers(h.onChange);
    handleSelectChange<string>('status')('active');

    expect(h.get().status).toBe('active');
  });

  test('handleSelectChange should update the form state for joined_on', () => {
    const h = makeOnChangeHarness(initialMockValue);
    const { handleSelectChange } = createStudentFormHandlers(h.onChange);
    handleSelectChange<Date | null>('joined_on')(new Date('2023-01-01'));

    expect(h.get().joined_on).toEqual(new Date('2023-01-01'));
  });

  test('handleStudentOptionChange should update school_stage and grade', () => {
    const h = makeOnChangeHarness(initialMockValue);
    const { handleStudentOptionChange } = createStudentFormHandlers(h.onChange);
    handleStudentOptionChange('junior_high_school-3');

    expect(h.get().school_stage).toBe('junior_high_school');
    expect(h.get().grade).toBe(3);
  });

  test('handleStudentOptionChange should reset school_stage and grade when empty', () => {
    const h = makeOnChangeHarness(initialMockValue);
    const { handleStudentOptionChange } = createStudentFormHandlers(h.onChange);
    handleStudentOptionChange('');

    expect(h.get().school_stage).toBe('');
    expect(h.get().grade).toBeNull();
  });

  test('toggleInArray should add and remove subject_ids', () => {
    const h = makeOnChangeHarness(initialMockValue);
    const { toggleInArray } = createStudentFormHandlers(h.onChange);
    // id 1 を追加
    toggleInArray('subject_ids', 1);
    expect(h.get().subject_ids).toContain(1);

    // id 2 を追加
    toggleInArray('subject_ids', 2);
    expect(h.get().subject_ids).toContain(2);

    // id 1 を削除
    toggleInArray('subject_ids', 1);
    expect(h.get().subject_ids).not.toContain(1);
    expect(h.get().subject_ids).toContain(2);
  });

  test('toggleInArray should add and remove available_day_ids', () => {
    const h = makeOnChangeHarness(initialMockValue);
    const { toggleInArray } = createStudentFormHandlers(h.onChange);
    // id 1 を追加
    toggleInArray('available_day_ids', 1);
    expect(h.get().available_day_ids).toContain(1);

    // id 2 を追加
    toggleInArray('available_day_ids', 2);
    expect(h.get().available_day_ids).toContain(2);

    // id 1 を削除
    toggleInArray('available_day_ids', 1);
    expect(h.get().available_day_ids).not.toContain(1);
    expect(h.get().available_day_ids).toContain(2);
  });

  test('toggleAssignmentInForm should add and remove assignments', () => {
    const h = makeOnChangeHarness(initialMockValue);
    const { toggleAssignmentInForm } = createStudentFormHandlers(h.onChange);
    const assignment = { teacher_id: 1, subject_id: 2, day_id: 3 };

    // 追加
    toggleAssignmentInForm(assignment);
    expect(h.get().assignments).toContainEqual(assignment);

    // 削除
    toggleAssignmentInForm(assignment);
    expect(h.get().assignments).not.toContainEqual(assignment);
  });
});
