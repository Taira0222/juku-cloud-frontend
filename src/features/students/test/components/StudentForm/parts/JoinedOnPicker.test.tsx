import {
  JoinedOnPicker,
  type JoinedOnPickerProps,
} from '@/features/students/components/StudentForm/parts/JoinedOnPicker';
import { initialMockValue } from '@/tests/fixtures/students/students';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

describe('JoinedOnPicker', () => {
  const wrapper = (props: JoinedOnPickerProps) => {
    render(<JoinedOnPicker {...props} />);
  };

  test('should render correctly', async () => {
    const user = userEvent.setup();
    const mockProps: JoinedOnPickerProps = {
      value: initialMockValue,
      onChange: vi.fn(() => {}),
    };

    wrapper(mockProps);

    const dayButton = screen.getByRole('button', { name: /入塾日/ });
    expect(dayButton).toBeInTheDocument();
    expect(dayButton).toHaveTextContent('日付を選択');

    // カレンダー表示
    await user.click(dayButton);
    const calendar = screen.getByRole('dialog');
    expect(calendar).toBeInTheDocument();

    // 日付選択
    const dateButton = screen.getByRole('button', {
      name: 'Wednesday, September 3rd, 2025',
    });
    await user.click(dateButton);
    expect(mockProps.onChange).toHaveBeenCalledWith('2025-09-03'); // 2025-09-03が選択される
    expect(calendar).not.toBeInTheDocument(); // カレンダーが閉じる
  });
});
