import { render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { EditTeacherDialog } from '../../components/dialogs/EditTeacherDialog';
import { useTeachersStore } from '@/stores/teachersStore';
import {
  AVAILABLE_DAYS_MOCK,
  detailDrawer,
  SUBJECTS_MOCK,
} from '../../../../tests/fixtures/teachers/teachers';
import userEvent from '@testing-library/user-event';
import { useTeacherUpdate } from '../../hooks/useTeacherUpdate';
import { Toaster } from '@/components/ui/feedback/Sonner/sonner';

const ForbiddenPage = () => <div data-testid="forbidden">Forbidden</div>;
const TeachersPage = () => <div data-testid="teachers-page">Teachers Page</div>;

vi.mock('../../hooks/useTeacherUpdate', () => {
  return {
    useTeacherUpdate: vi.fn(),
  };
});

const renderWithRouter = (initialPath: string, background?: Location) => {
  return render(
    <MemoryRouter
      initialEntries={[
        '/teachers', // 戻り先（1件目）
        {
          pathname: initialPath,
          state: background ? { background } : undefined,
        },
      ]}
      initialIndex={1} // ← 2件目（編集）から開始
    >
      <Toaster position="top-right" />
      <Routes>
        <Route path="/teachers/:id/edit" element={<EditTeacherDialog />} />
        <Route path="/forbidden" element={<ForbiddenPage />} />
        <Route path="/teachers" element={<TeachersPage />} />
      </Routes>
    </MemoryRouter>
  );
};

const successfulRender = () => {
  useTeachersStore.setState({
    detailDrawer: detailDrawer,
  });
  const initialPath = '/teachers/1/edit';
  const background = { pathname: '/teachers' } as Location;
  renderWithRouter(initialPath, background);
};

describe('EditTeacherDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useTeacherUpdate).mockReturnValue({
      error: null,
      loading: false,
      updateTeacher: vi.fn(),
    });
  });

  test('redirects to forbidden page if background is undefined', () => {
    renderWithRouter('/teachers/1/edit', undefined);

    expect(screen.getByTestId('forbidden')).toBeInTheDocument();
  });

  test('redirects to teachers page if teacher does not find', () => {
    const background = { pathname: '/teachers' } as Location;
    renderWithRouter('/teachers/unknown/edit', background);

    expect(screen.getByTestId('teachers-page')).toBeInTheDocument();
  });

  test('renders successful edit dialog if teacher is found and background is set', () => {
    successfulRender();
    expect(screen.getByText('講師名')).toBeInTheDocument();
  });

  test('updates teacher info successfully', async () => {
    const user = userEvent.setup();
    const updateTeacherLocalSpy = vi.spyOn(
      useTeachersStore.getState(),
      'updateTeacherLocal'
    );
    const updateTeacherMock = vi
      .fn()
      .mockResolvedValue({ ok: true, updatedId: 1 });

    vi.mocked(useTeacherUpdate).mockReturnValue({
      error: null,
      loading: false,
      updateTeacher: updateTeacherMock,
    });
    successfulRender();

    const nameInput = screen.getByLabelText('講師名');
    const section = screen.getByLabelText('選択中の担当科目');
    const englishBadge = within(section).getByText('英語');
    const mondayCheckbox = screen.getByRole('checkbox', { name: '月曜日' });
    const updateButton = screen.getByRole('button', { name: '更新' });

    // 名前の変更、担当科目の変更、曜日の変更(生徒は変更しない)をして更新ボタンをクリック
    await user.clear(nameInput);
    await user.type(nameInput, 'New Name');
    await user.click(englishBadge);
    await user.click(mondayCheckbox);
    await user.click(updateButton);

    await waitFor(() => {
      // updateTeacher は api 呼び出し用の関数なので、IDの配列である必要がある
      expect(updateTeacherMock).toHaveBeenCalledWith(1, {
        name: 'New Name',
        employment_status: 'active',
        subject_ids: [SUBJECTS_MOCK[2].id], // Mathematics
        available_day_ids: [
          AVAILABLE_DAYS_MOCK[3].id, // Wednesday
          AVAILABLE_DAYS_MOCK[5].id, // Friday
        ],
      });

      // updateTeacherLocal はローカルの状態管理用の関数なので、表示用のデータ構造で呼び出される
      expect(updateTeacherLocalSpy).toHaveBeenCalledWith(1, {
        name: 'New Name',
        employment_status: 'active',
        subjects: [
          SUBJECTS_MOCK[2], // Mathematics
        ],
        available_days: [
          AVAILABLE_DAYS_MOCK[3], // Wednesday
          AVAILABLE_DAYS_MOCK[5], // Friday
        ],
      });
      expect(screen.getByText('更新に成功しました')).toBeInTheDocument();
    });

    // ダイアログが閉じて、背景の講師一覧画面が表示されていることを確認
    await waitFor(() => {
      expect(screen.getByTestId('teachers-page')).toBeInTheDocument();
    });
  });

  test('handles update error if api does not return teacherId', async () => {
    const user = userEvent.setup();
    const updateTeacherLocalSpy = vi.spyOn(
      useTeachersStore.getState(),
      'updateTeacherLocal'
    );
    const updateTeacherMock = vi
      .fn()
      .mockResolvedValue({ ok: true, updatedId: null });

    vi.mocked(useTeacherUpdate).mockReturnValue({
      error: null,
      loading: false,
      updateTeacher: updateTeacherMock,
    });
    successfulRender();

    const updateButton = screen.getByRole('button', { name: '更新' });
    await user.click(updateButton);

    await waitFor(() => {
      expect(updateTeacherMock).toHaveBeenCalled();
      expect(updateTeacherLocalSpy).not.toHaveBeenCalled();
      expect(
        screen.getByText('APIレスポンスに更新IDが含まれていません。')
      ).toBeInTheDocument();
    });
  });

  test('handles update failure gracefully', async () => {
    const user = userEvent.setup();
    const updateTeacherLocalSpy = vi.spyOn(
      useTeachersStore.getState(),
      'updateTeacherLocal'
    );
    const updateTeacherMock = vi
      .fn()
      .mockResolvedValue({ ok: false, updatedId: undefined });

    vi.mocked(useTeacherUpdate).mockReturnValue({
      error: 'Update failed',
      loading: false,
      updateTeacher: updateTeacherMock,
    });
    successfulRender();

    const updateButton = screen.getByRole('button', { name: '更新' });
    await user.click(updateButton);

    await waitFor(() => {
      expect(updateTeacherMock).toHaveBeenCalled();
      expect(updateTeacherLocalSpy).not.toHaveBeenCalled();
      expect(screen.getByText('更新に失敗しました')).toBeInTheDocument();
      expect(screen.queryByText('Update failed')).toBeInTheDocument();
    });
  });

  test('render loading state correctly', async () => {
    const updateTeacherMock = vi.fn();
    vi.mocked(useTeacherUpdate).mockReturnValue({
      error: null,
      loading: true,
      updateTeacher: updateTeacherMock,
    });
    successfulRender();

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('employment selector confirms presence and interaction', async () => {
    const user = userEvent.setup();
    successfulRender();
    expect(screen.getByLabelText('出勤状況')).toBeInTheDocument();
    // 在籍が最初に表示されていることを確認
    const employmentSelector = screen.getByRole('combobox', {
      name: '出勤状況',
    });
    expect(within(employmentSelector).getByText(/在籍/)).toBeInTheDocument();

    // 出勤状況のセレクターをクリックしてオプションを表示
    await user.click(employmentSelector);
    const retireOption = screen.getByRole('option', { name: /退職/ });

    // 退職オプションが表示されていることを確認し、クリックして選択
    expect(retireOption).toBeInTheDocument();
    await user.click(retireOption);

    // クリック後、セレクターの表示が更新され、選択したオプションが表示されていることを確認
    const trigger = screen.getByRole('combobox', {
      name: '出勤状況',
    });
    expect(within(trigger).getByText(/退職/)).toBeInTheDocument();
  });

  test('subjects checkbox confirms presence and interaction', async () => {
    const user = userEvent.setup();
    successfulRender();
    // 担当科目のバッジが表示されていることを確認
    const section = screen.getByLabelText('選択中の担当科目');
    const englishBadge = within(section).getByText('英語');
    const mathBadge = within(section).getByText('数学');
    expect(englishBadge).toBeInTheDocument();
    expect(mathBadge).toBeInTheDocument();

    // 英語と数学のチェックボックスが最初に選択されていることを確認
    const englishCheckbox = screen.getByRole('checkbox', { name: '英語' });
    const mathCheckbox = screen.getByRole('checkbox', { name: '数学' });
    const scienceCheckbox = screen.getByRole('checkbox', { name: '理科' });
    expect(englishCheckbox).toBeChecked();
    expect(mathCheckbox).toBeChecked();
    expect(scienceCheckbox).not.toBeChecked();

    // クリックして選択状態を切り替え
    await user.click(scienceCheckbox);
    await user.click(englishBadge);

    // 英語のチェックが外れ、理科のチェックが入っていることを確認
    expect(englishCheckbox).not.toBeChecked();
    expect(scienceCheckbox).toBeChecked();

    // 担当教科のバッジが更新されていることを確認
    expect(within(section).queryByText('英語')).not.toBeInTheDocument();
    expect(within(section).getByText('数学')).toBeInTheDocument();
    expect(within(section).getByText('理科')).toBeInTheDocument();
  });

  test('available days checkbox confirms presence and interaction', async () => {
    const user = userEvent.setup();
    successfulRender();
    // 月曜日、水曜日、金曜日のチェックボックスが最初に選択されていることを確認
    const mondayCheckbox = screen.getByRole('checkbox', { name: '月曜日' });
    const wednesdayCheckbox = screen.getByRole('checkbox', { name: '水曜日' });
    const fridayCheckbox = screen.getByRole('checkbox', { name: '金曜日' });
    const saturdayCheckbox = screen.getByRole('checkbox', { name: '土曜日' });
    expect(mondayCheckbox).toBeChecked();
    expect(wednesdayCheckbox).toBeChecked();
    expect(fridayCheckbox).toBeChecked();
    expect(saturdayCheckbox).not.toBeChecked();

    // クリックして選択状態を切り替え
    await user.click(mondayCheckbox);
    await user.click(saturdayCheckbox);

    // 月曜日のチェックが外れ、水曜日と金曜日のチェックが入っていることを確認
    expect(mondayCheckbox).not.toBeChecked();
    expect(wednesdayCheckbox).toBeChecked();
    expect(fridayCheckbox).toBeChecked();
    expect(saturdayCheckbox).toBeChecked();
  });
});
