import {
  StatusSelect,
  type StatusSelectProps,
} from '@/features/students/components/StudentForm/parts/StatusSelect';
import { initialMockValue } from '@/tests/fixtures/students/students';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

describe('StatusSelect', () => {
  const wrapper = (props: StatusSelectProps) => {
    render(<StatusSelect {...props} />);
  };

  test('should render correctly', async () => {
    const user = userEvent.setup();
    const mockProps: StatusSelectProps = {
      value: initialMockValue,
      onChange: vi.fn(() => {}),
    };

    wrapper(mockProps);
    // 必須の星があるので正規表現で取得
    const selectStatus = screen.getByLabelText(/通塾状況/);
    expect(selectStatus).toBeInTheDocument();
    expect(selectStatus).toHaveValue('');

    // 選択操作
    await user.click(selectStatus);
    const option = screen.getByRole('option', { name: '通塾中' });
    await user.click(option);
    expect(mockProps.onChange).toHaveBeenCalledWith('active');
  });
});
