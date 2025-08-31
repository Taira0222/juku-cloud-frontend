import { render, screen } from '@testing-library/react';
import { beforeEach, expect, vi } from 'vitest';
import { describe, test } from 'vitest';
import { TeacherRawActions } from '@/features/teachers/components/table/TeachesrRawActions';
import userEvent from '@testing-library/user-event';
import { useTeachersStore } from '@/stores/teachersStore';
import { MemoryRouter } from 'react-router-dom';
import { teacher1 } from '../../../../tests/fixtures/teachers/teachers';

type Props = {
  teacherId: number;
};

describe('RawActions', () => {
  const renderComponent = (props: Props) => {
    return render(
      <MemoryRouter>
        <TeacherRawActions {...props} />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders correctly', async () => {
    const user = userEvent.setup();
    const getTeacherDataMock = vi.spyOn(
      useTeachersStore.getState(),
      'getTeacherData'
    );
    useTeachersStore.setState({
      detailDrawer: [teacher1],
    });
    const mockProps: Props = {
      teacherId: 2,
    };

    renderComponent(mockProps);

    expect(getTeacherDataMock).toHaveBeenCalledWith(mockProps.teacherId);

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
    expect(dialog).toHaveTextContent(teacher1.name);
  });
  test('does not show delete option for admin role', async () => {
    const getTeacherDataMock = vi.spyOn(
      useTeachersStore.getState(),
      'getTeacherData'
    );
    teacher1.role = 'admin'; // admin roleを設定
    useTeachersStore.setState({
      detailDrawer: [teacher1],
    });

    const user = userEvent.setup();
    const mockProps: Props = {
      teacherId: 2,
    };

    renderComponent(mockProps);

    expect(getTeacherDataMock).toHaveBeenCalledWith(mockProps.teacherId);

    // 3点メニューをクリック
    const menuButton = screen.getByRole('button', { name: /open menu/i });
    await user.click(menuButton);

    // 削除オプションが表示されないことを確認
    expect(screen.queryByText('削除')).not.toBeInTheDocument();
  });
});
