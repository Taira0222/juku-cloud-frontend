import {
  DayCheckboxes,
  type DayCheckboxesProps,
} from '@/features/students/components/StudentForm/parts/DayCheckboxes';
import { initialMockValue } from '@/tests/fixtures/students/students';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

describe('DayCheckboxes', () => {
  const wrapper = (props: DayCheckboxesProps) => {
    render(<DayCheckboxes {...props} />);
  };

  test('should render correctly', async () => {
    const user = userEvent.setup();
    const mockProps: DayCheckboxesProps = {
      value: initialMockValue,
      toggle: vi.fn(() => {}),
    };

    wrapper(mockProps);
    const sundayCheckbox = screen.getByRole('checkbox', { name: '日曜日' });
    expect(sundayCheckbox).toBeInTheDocument();
    expect(sundayCheckbox).not.toBeChecked();

    const mondayCheckbox = screen.getByRole('checkbox', { name: '月曜日' });
    expect(mondayCheckbox).toBeInTheDocument();
    expect(mondayCheckbox).not.toBeChecked();

    // 月曜日を選択
    await user.click(mondayCheckbox);
    expect(mockProps.toggle).toHaveBeenCalledWith(2); // 月曜日のIDは2
  });
});
