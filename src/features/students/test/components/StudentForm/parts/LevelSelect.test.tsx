import {
  LevelSelect,
  type LevelSelectProps,
} from '@/features/students/components/StudentForm/parts/LevelSelect';
import { initialMockValue } from '@/tests/fixtures/students/students';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

describe('LevelSelect', () => {
  const wrapper = (props: LevelSelectProps) => {
    render(<LevelSelect {...props} />);
  };

  test('should render correctly', async () => {
    const user = userEvent.setup();
    const mockProps: LevelSelectProps = {
      value: initialMockValue,
      onChange: vi.fn(() => {}),
    };

    wrapper(mockProps);
    // 必須の星があるので正規表現で取得
    const selectGrade = screen.getByLabelText(/学年を選択/);
    expect(selectGrade).toBeInTheDocument();
    expect(selectGrade).toHaveValue('');

    // 選択操作
    await user.click(selectGrade);
    const option = screen.getByRole('option', { name: '中学2年' });
    await user.click(option);
    expect(mockProps.onChange).toHaveBeenCalledWith('junior_high_school-2');
  });

  test('should render with initial value', () => {
    const mockProps: LevelSelectProps = {
      value: {
        ...initialMockValue,
        school_stage: 'junior_high_school',
        grade: 2,
      },
      onChange: vi.fn(() => {}),
    };
    wrapper(mockProps);
    const gradeText = screen.getByText('中学2年');
    expect(gradeText).toBeInTheDocument();
  });
});
