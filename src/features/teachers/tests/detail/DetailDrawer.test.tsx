import { useIsMobile } from '@/hooks/useMobile';
import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import userEvent from '@testing-library/user-event';
import { DetailDrawer } from '../../components/detail/DetailDrawer';
import { getDetailDrawerDataMock } from '../../../../tests/fixtures/teachers/teachers';

vi.mock('@/hooks/useSubjectTranslation', () => ({
  useSubjectTranslation: () => ({
    createIconTranslationBadge: (subject: string) => <span>{subject}</span>,
  }),
}));

vi.mock('@/utils/formatDayOfWeek', () => ({
  formatDayOfWeek: (day: string) => day,
}));

vi.mock('@/hooks/useSchoolStageTranslations', () => ({
  useSchoolStageTranslation: () => ({
    translateSchoolStage: (stage: string) => stage,
  }),
}));

vi.mock('@/hooks/useSignInStatus', () => ({
  useSignInStatus: () => ({
    label: 'Online',
    colorClass: 'text-green-500',
    Icon: () => <span>Online Icon</span>,
  }),
}));

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

    const expectedDays = getDetailDrawerDataMock(1)
      .available_days.map((day) => day.name)
      .join(', ');

    await waitFor(() => {
      expect(screen.getByText('講師の詳細情報')).toBeInTheDocument();
      expect(screen.getByText('admin')).toBeInTheDocument();
      expect(screen.getByText('在籍')).toBeInTheDocument();
      expect(screen.getByText('mathematics')).toBeInTheDocument();
      expect(screen.getByText('english')).toBeInTheDocument();
      expect(screen.getByText(expectedDays)).toBeInTheDocument();
      expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
      expect(screen.getByText('Online Icon')).toBeInTheDocument();
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

    const expectedDays = getDetailDrawerDataMock(1)
      .available_days.map((day) => day.name)
      .join(', ');

    await waitFor(() => {
      expect(screen.getByText('講師の詳細情報')).toBeInTheDocument();
      expect(screen.getByText('admin')).toBeInTheDocument();
      expect(screen.getByText('在籍')).toBeInTheDocument();
      expect(screen.getByText('mathematics')).toBeInTheDocument();
      expect(screen.getByText('english')).toBeInTheDocument();
      expect(screen.getByText(expectedDays)).toBeInTheDocument();
      expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
      expect(screen.getByText('Online Icon')).toBeInTheDocument();
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

    const expectedDays = getDetailDrawerDataMock(2)
      .available_days.map((day) => day.name)
      .join(', ');

    await waitFor(() => {
      expect(screen.getByText('講師の詳細情報')).toBeInTheDocument();
      expect(screen.getByText('teacher')).toBeInTheDocument();
      expect(screen.getByText('在籍')).toBeInTheDocument();
      expect(screen.getByText('science')).toBeInTheDocument();
      expect(screen.getByText('english')).toBeInTheDocument();
      expect(screen.getByText(expectedDays)).toBeInTheDocument();
      expect(screen.getByText('jane.smith@example.com')).toBeInTheDocument();
      expect(screen.getByText('Online Icon')).toBeInTheDocument();
    });
  });
});
