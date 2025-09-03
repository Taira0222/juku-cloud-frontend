import { useIsMobile } from '@/hooks/useMobile';
import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import userEvent from '@testing-library/user-event';
import { DetailDrawer } from '../../components/detail/DetailDrawer';
import { getDetailDrawerDataMock } from '../../../../tests/fixtures/teachers/teachers';

vi.mock('@/hooks/useMobile', () => ({
  useIsMobile: vi.fn(),
}));

describe('DetailDrawer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  test('renders correctly for admin', async () => {
    vi.mocked(useIsMobile).mockReturnValue(false);
    const user = userEvent.setup();
    // currentUser を表示
    render(<DetailDrawer item={getDetailDrawerDataMock(1)} />);

    const drawerTrigger = screen.getByRole('button', { name: 'John Doe' });
    expect(drawerTrigger).toBeInTheDocument();

    user.click(drawerTrigger);

    await waitFor(() => {
      expect(screen.getByText('講師の詳細情報')).toBeInTheDocument();
      expect(screen.getByText('admin')).toBeInTheDocument();
      expect(screen.getByText('在籍')).toBeInTheDocument();
      expect(screen.getByText('数学')).toBeInTheDocument();
      expect(screen.getByText('英語')).toBeInTheDocument();
      expect(screen.getByText(/月曜日/)).toBeInTheDocument();
      expect(screen.getByText(/水曜日/)).toBeInTheDocument();
      expect(screen.getByText(/金曜日/)).toBeInTheDocument();
      expect(screen.getByText(/Student One/)).toBeInTheDocument();
      expect(screen.getByText(/Student Two/)).toBeInTheDocument();
      expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
      expect(screen.getByText('1か月以上前')).toBeInTheDocument();
    });
  });

  test('renders correctly for admin in mobile', async () => {
    vi.mocked(useIsMobile).mockReturnValue(true);
    const user = userEvent.setup();
    // currentUser を表示
    render(<DetailDrawer item={getDetailDrawerDataMock(1)} />);

    const drawerTrigger = screen.getByRole('button', { name: 'John Doe' });
    expect(drawerTrigger).toBeInTheDocument();

    user.click(drawerTrigger);

    await waitFor(() => {
      expect(screen.getByText('講師の詳細情報')).toBeInTheDocument();
      expect(screen.getByText('admin')).toBeInTheDocument();
      expect(screen.getByText('在籍')).toBeInTheDocument();
      expect(screen.getByText('数学')).toBeInTheDocument();
      expect(screen.getByText('英語')).toBeInTheDocument();
      expect(screen.getByText(/月曜日/)).toBeInTheDocument();
      expect(screen.getByText(/水曜日/)).toBeInTheDocument();
      expect(screen.getByText(/金曜日/)).toBeInTheDocument();
      expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
      expect(screen.getByText('1か月以上前')).toBeInTheDocument();
    });
  });

  test('renders correctly for teacher', async () => {
    vi.mocked(useIsMobile).mockReturnValue(false);
    const user = userEvent.setup();
    // teacher を表示
    render(<DetailDrawer item={getDetailDrawerDataMock(2)} />);

    const drawerTrigger = screen.getByRole('button', { name: 'Jane Smith' });
    expect(drawerTrigger).toBeInTheDocument();

    user.click(drawerTrigger);

    await waitFor(() => {
      expect(screen.getByText('講師の詳細情報')).toBeInTheDocument();
      expect(screen.getByText('teacher')).toBeInTheDocument();
      expect(screen.getByText('在籍')).toBeInTheDocument();
      expect(screen.getByText('英語')).toBeInTheDocument();
      expect(screen.getByText('理科')).toBeInTheDocument();
      expect(screen.getByText(/火曜日/)).toBeInTheDocument();
      expect(screen.getByText(/木曜日/)).toBeInTheDocument();
      expect(screen.getByText('jane.smith@example.com')).toBeInTheDocument();
      expect(screen.getByText('1か月以上前')).toBeInTheDocument();
    });
  });
});
