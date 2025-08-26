import { Toaster } from '@/components/ui/feedback/Sonner/sonner';
import { ForbiddenPage } from '@/pages/error/ForbiddenPage';
import { NotFoundPage } from '@/pages/error/NotFoundPage';
import { TeachersPage } from '@/pages/teachers/TeachersPage';
import { server } from '@/tests/fixtures/server/server';

import { teacher1 } from '@/tests/fixtures/teachers/teachers';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';

import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test } from 'vitest';

const routeWithRender = () => {
  return render(
    <MemoryRouter initialEntries={['/teachers']}>
      <Toaster position="top-right" />
      <TeachersPage />
      <NotFoundPage />
      <ForbiddenPage />
    </MemoryRouter>
  );
};

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

describe('Teacher Delete Integration Tests', () => {
  test('deletes a teacher', async () => {
    const user = userEvent.setup();
    routeWithRender();

    // 講師一覧がでるまで待機
    await waitFor(() => {
      expect(screen.getByText('講師一覧')).toBeInTheDocument();
    });

    const teacher1Name = screen.getByText('Jane Smith');

    const allMenuButtons = screen.getAllByRole('button', {
      name: /open menu/i,
    });
    const teacher1MenuButton = allMenuButtons.find(
      (button) => button.id === 'teacher-actions-2'
    );
    // undefined でないことを確認し、!で非nullアサーション
    expect(teacher1MenuButton).not.toBeUndefined();
    await user.click(teacher1MenuButton!);

    expect(screen.getByText('削除')).toBeInTheDocument();
    // 削除ボタンをクリック
    const deleteMenuButton = screen.getByRole('menuitem', { name: '削除' });
    await user.click(deleteMenuButton);

    const inputTeacherName = screen.getByLabelText('確認入力');
    const teacherDeleteButton = screen.getByRole('button', {
      name: `講師「${teacher1.name}」を削除する`,
    });

    // 講師の名前を入力し削除
    await user.type(inputTeacherName, teacher1.name);
    await user.click(teacherDeleteButton);
    await waitFor(() => {
      expect(screen.getByText('講師を削除しました。')).toBeInTheDocument();
    });
    // teacher1 が削除されていることを確認
    expect(teacher1Name).not.toBeInTheDocument();
  });
  test('does not delete for admin', async () => {
    const user = userEvent.setup();
    routeWithRender();

    // 講師一覧がでるまで待機
    await waitFor(() => {
      expect(screen.getByText('講師一覧')).toBeInTheDocument();
    });

    const allMenuButtons = screen.getAllByRole('button', {
      name: /open menu/i,
    });
    const adminMenuButton = allMenuButtons.find(
      (button) => button.id === 'teacher-actions-1'
    );
    // undefined でないことを確認し、!で非nullアサーション
    expect(adminMenuButton).not.toBeUndefined();
    await user.click(adminMenuButton!);

    await waitFor(() => {
      expect(screen.getByText('アクセス権限がありません')).toBeInTheDocument();
    });
  });

  test('does not delete for unknown user', async () => {
    const user = userEvent.setup();
    routeWithRender();

    // 講師一覧がでるまで待機
    await waitFor(() => {
      expect(screen.getByText('講師一覧')).toBeInTheDocument();
    });

    const allMenuButtons = screen.getAllByRole('button', {
      name: /open menu/i,
    });
    // teacher2 をdb で保存されていないuser として扱う
    const unknownMenuButton = allMenuButtons.find(
      (button) => button.id === 'teacher-actions-3'
    );
    // undefined でないことを確認し、!で非nullアサーション
    expect(unknownMenuButton).toBeDefined();
    await user.click(unknownMenuButton!);

    await waitFor(() => {
      expect(screen.getByText('ページが見つかりません')).toBeInTheDocument();
    });
  });

  test('handles unexpected error during deletion', async () => {
    const user = userEvent.setup();
    server.use(
      http.delete(`${VITE_API_BASE_URL}/api/v1/teachers/:id`, async () => {
        return HttpResponse.json(
          { error: '予期せぬエラーが発生しました。' },
          { status: 500 }
        );
      })
    );
    routeWithRender();

    // 講師一覧がでるまで待機
    await waitFor(() => {
      expect(screen.getByText('講師一覧')).toBeInTheDocument();
    });

    const allMenuButtons = screen.getAllByRole('button', {
      name: /open menu/i,
    });
    const teacher1MenuButton = allMenuButtons.find(
      (button) => button.id === 'teacher-actions-2'
    );
    // undefined でないことを確認し、!で非nullアサーション
    expect(teacher1MenuButton).not.toBeUndefined();
    await user.click(teacher1MenuButton!);

    expect(screen.getByText('削除')).toBeInTheDocument();
    // 削除ボタンをクリック
    const deleteMenuButton = screen.getByRole('menuitem', { name: '削除' });
    await user.click(deleteMenuButton);

    const inputTeacherName = screen.getByLabelText('確認入力');
    const teacherDeleteButton = screen.getByRole('button', {
      name: `講師「${teacher1.name}」を削除する`,
    });

    // 講師の名前を入力し削除
    await user.type(inputTeacherName, teacher1.name);
    await user.click(teacherDeleteButton);

    await waitFor(() => {
      expect(
        screen.getByText('予期せぬエラーが発生しました。')
      ).toBeInTheDocument();
    });
  });
});
