import { render, screen } from '@testing-library/react';
import { expect, vi } from 'vitest';
import { describe, test } from 'vitest';
import { RawActions } from './RawActions';
import userEvent from '@testing-library/user-event';

type Props = {
  teacherId: number;
  teacherName: string;
  teacherRole: string;
  refetch: () => Promise<void>;
};

describe('RawActions', () => {
  const renderComponent = (props: Props) => {
    return render(<RawActions {...props} />);
  };

  test('renders correctly', async () => {
    const user = userEvent.setup();
    const mockProps: Props = {
      teacherId: 1,
      teacherName: 'John Doe',
      teacherRole: 'teacher',
      refetch: vi.fn(),
    };

    renderComponent(mockProps);

    // 3点メニューをクリック
    const menuButton = screen.getByRole('button', { name: /open menu/i });
    await user.click(menuButton);

    expect(screen.getByText('削除')).toBeInTheDocument();
    // 削除ボタンをクリック
    const deleteButton = screen.getByRole('menuitem', { name: '削除' });
    await user.click(deleteButton);

    // ダイアログが開いていることを確認
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent('John Doe');
  });
  test('does not show delete option for admin role', async () => {
    const user = userEvent.setup();
    const mockProps: Props = {
      teacherId: 1,
      teacherName: 'Jane Doe',
      teacherRole: 'admin',
      refetch: vi.fn(),
    };

    renderComponent(mockProps);

    // 3点メニューをクリック
    const menuButton = screen.getByRole('button', { name: /open menu/i });
    await user.click(menuButton);

    // 削除オプションが表示されないことを確認
    expect(screen.queryByText('削除')).not.toBeInTheDocument();
  });
});
