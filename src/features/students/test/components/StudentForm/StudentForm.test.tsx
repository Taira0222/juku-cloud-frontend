import { StudentForm } from '@/features/students/components/StudentForm/StudentForm';
import type { StudentFormProps } from '@/features/students/types/studentForm';
import {
  createStudentMockPayload,
  initialMockValue,
  mockTeachers,
} from '@/tests/fixtures/students/students';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

describe('StudentForm', () => {
  const wrapper = (props: StudentFormProps) => {
    render(<StudentForm {...props} />);
  };

  test('should render correctly for create mode', () => {
    const mockProps: StudentFormProps = {
      mode: 'create',
      value: initialMockValue,
      onChange: vi.fn(() => {}),
      onSubmit: vi.fn(() => {}),
      loading: false,
      teachers: [mockTeachers[0], mockTeachers[1]], // Teacher1, Teacher2
    };

    wrapper(mockProps);

    expect(
      screen.getByText(
        '受講科目と受講可能曜日を選ぶと、担当できる講師が表示されます'
      )
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '作成' })).toBeInTheDocument();
  });

  test('should render correctly for edit mode', () => {
    const mockProps: StudentFormProps = {
      mode: 'edit',
      value: initialMockValue,
      onChange: vi.fn(() => {}),
      onSubmit: vi.fn(() => {}),
      loading: false,
      teachers: [mockTeachers[0], mockTeachers[1]], // Teacher1, Teacher2
    };

    wrapper(mockProps);
    expect(
      screen.getByText(
        '受講科目と受講可能曜日を選ぶと、担当できる講師が表示されます'
      )
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '更新' })).toBeInTheDocument();
  });

  test('should call onSubmit when submit button is clicked', async () => {
    const user = userEvent.setup();
    const mockProps: StudentFormProps = {
      mode: 'create',
      value: {
        ...createStudentMockPayload,
      },
      onChange: vi.fn(() => {}),
      onSubmit: vi.fn(() => {}),
      loading: false,
      teachers: [mockTeachers[0], mockTeachers[1]], // Teacher1, Teacher2
    };

    wrapper(mockProps);

    // 指定した値がすべて表示されているか確認する
    const nameInput = screen.getByLabelText(/生徒の名前/);
    expect(nameInput).toHaveValue('mockStudent Three');

    const selectGrade = screen.getByLabelText(/学年を選択/);
    expect(selectGrade).toHaveTextContent('小学6年');

    const desiredInput = screen.getByLabelText('志望校');
    expect(desiredInput).toHaveValue('');

    const dayButton = screen.getByRole('button', { name: /入塾日/ });
    expect(dayButton).toHaveTextContent('2025/9/1');

    const selectStatus = screen.getByLabelText(/通塾状況/);
    expect(selectStatus).toHaveTextContent('退塾');

    const englishCheckbox = screen.getByRole('checkbox', { name: '英語' });
    expect(englishCheckbox).toBeInTheDocument();
    expect(englishCheckbox).toBeChecked();

    const tuesdayCheckbox = screen.getByRole('checkbox', { name: '火曜日' });
    expect(tuesdayCheckbox).toBeInTheDocument();
    expect(tuesdayCheckbox).toBeChecked();

    const tuesdayTab = screen.getByRole('tab', { name: '火' });
    expect(tuesdayTab).toBeInTheDocument();

    const teacher1EnglishCheckbox = screen.getByLabelText(
      `${mockTeachers[0].name}のenglishの割り当て`
    );
    expect(teacher1EnglishCheckbox).toBeInTheDocument();
    expect(teacher1EnglishCheckbox).toBeChecked();

    const teacher1Badge = screen.getByText(`${mockTeachers[0].name}(火,英語)`);
    expect(teacher1Badge).toBeInTheDocument();

    const createButton = screen.getByRole('button', { name: '作成' });
    expect(createButton).toBeInTheDocument();

    await user.click(createButton);
    expect(mockProps.onSubmit).toHaveBeenCalledWith(createStudentMockPayload);
  });
});
