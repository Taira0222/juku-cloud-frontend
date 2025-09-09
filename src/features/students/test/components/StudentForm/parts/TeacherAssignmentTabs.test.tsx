import {
  TeacherAssignmentTabs,
  type TeacherAssignmentTabsProps,
} from '@/features/students/components/StudentForm/parts/TeacherAssignmentTabs';
import { mockTeachers } from '@/tests/fixtures/students/students';
import { teacher1, teacher2 } from '@/tests/fixtures/teachers/teachers';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

describe('TeacherAssignmentTabs', () => {
  const wrapper = (props: TeacherAssignmentTabsProps) => {
    render(<TeacherAssignmentTabs {...props} />);
  };
  test('should render correctly', async () => {
    const user = userEvent.setup();
    const mockProps: TeacherAssignmentTabsProps = {
      dayId: 3, // 火曜日
      teachers: [mockTeachers[0], mockTeachers[1]], // teacher1, teacher2
      selectedSubjectIds: [1], // 英語
      assigned: [], // 未割当
      toggle: vi.fn(),
    };

    wrapper(mockProps);
    // 講師1, 2の名前が表示されている
    expect(screen.getByText(teacher1.name)).toBeInTheDocument();
    expect(screen.getByText(teacher2.name)).toBeInTheDocument();

    const teacher1EnglishCheckbox = screen.getByLabelText(
      `${teacher1.name}のenglishの割り当て`
    );
    expect(teacher1EnglishCheckbox).toBeInTheDocument();
    expect(teacher1EnglishCheckbox).not.toBeChecked();
    const teacher2EnglishCheckbox = screen.getByLabelText(
      `${teacher2.name}のenglishの割り当て`
    );
    expect(teacher2EnglishCheckbox).toBeInTheDocument();
    expect(teacher2EnglishCheckbox).not.toBeChecked();

    // teacher1のenglishを選択
    await user.click(teacher1EnglishCheckbox);
    expect(mockProps.toggle).toHaveBeenCalledWith({
      teacher_id: teacher1.id,
      subject_id: 1,
      day_id: 3,
    });
  });

  test('should show message when no teachers available', () => {
    const mockProps: TeacherAssignmentTabsProps = {
      dayId: 1, // 月曜日
      teachers: [], // 講師なし
      selectedSubjectIds: [1], // 英語
      assigned: [], // 未割当
      toggle: vi.fn(),
    };

    wrapper(mockProps);
    expect(
      screen.getByText('この曜日に選択された科目を指導可能な講師がいません。')
    ).toBeInTheDocument();
  });
});
