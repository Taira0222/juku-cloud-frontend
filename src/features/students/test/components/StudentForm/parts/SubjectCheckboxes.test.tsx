import {
  SubjectCheckboxes,
  type SubjectCheckboxesProps,
} from '@/features/students/components/StudentForm/parts/SubjectCheckboxes';
import { initialMockValue } from '@/tests/fixtures/students/students';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

describe('SubjectCheckboxes', () => {
  const wrapper = (props: SubjectCheckboxesProps) => {
    render(<SubjectCheckboxes {...props} />);
  };

  test('should render correctly', async () => {
    const user = userEvent.setup();
    const mockProps: SubjectCheckboxesProps = {
      value: initialMockValue,
      toggle: vi.fn(() => {}),
    };

    wrapper(mockProps);

    const englishCheckbox = screen.getByRole('checkbox', { name: '英語' });
    expect(englishCheckbox).toBeInTheDocument();
    expect(englishCheckbox).not.toBeChecked();

    const mathCheckbox = screen.getByRole('checkbox', { name: '数学' });
    expect(mathCheckbox).toBeInTheDocument();
    expect(mathCheckbox).not.toBeChecked();

    // 英語を選択
    await user.click(englishCheckbox);
    expect(mockProps.toggle).toHaveBeenCalledWith(1); // 英語のIDは1
  });
  test('should show selected subjects as badges', async () => {
    const user = userEvent.setup();
    const mockProps: SubjectCheckboxesProps = {
      value: {
        ...initialMockValue,
        subject_ids: [1, 3], // 英語、数学が選択されている状態
      },
      toggle: vi.fn(() => {}),
    };

    wrapper(mockProps);
    const englishBadge = screen.getByLabelText(/英語 を削除/);
    expect(englishBadge).toBeInTheDocument();
    const mathBadge = screen.getByLabelText(/数学 を削除/);
    expect(mathBadge).toBeInTheDocument();

    // バッジをクリックして削除
    await user.click(englishBadge);
    expect(mockProps.toggle).toHaveBeenCalledWith(1); // 英語のIDは1
  });

  test('should not show badges when no subjects selected', () => {
    const mockProps: SubjectCheckboxesProps = {
      value: {
        ...initialMockValue,
        subject_ids: [99], // 存在しない科目ID
      },
      toggle: vi.fn(() => {}),
    };

    wrapper(mockProps);

    const unknownBadge = screen.getByLabelText(/不明な科目 を削除/);
    expect(unknownBadge).toBeInTheDocument();
  });
});
