import { TeachersPage } from '@/pages/teachers/TeachersPage';
import { server } from '@/tests/fixtures/server/server';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';

import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test } from 'vitest';

const routeWithRender = () => {
  return render(
    <MemoryRouter initialEntries={['/teachers']}>
      <TeachersPage />
    </MemoryRouter>
  );
};

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

describe('Teacher Index Integration Tests', () => {
  test('renders teacher index page', async () => {
    routeWithRender();

    // 講師一覧がでるまで待機
    await waitFor(() => {
      expect(screen.getByText('講師一覧')).toBeInTheDocument();
    });

    const admin = screen.getByText('John Doe');
    const teacher1 = screen.getByText('Jane Smith');
    const teacher2 = screen.getByText('Alice Johnson');

    expect(admin).toBeInTheDocument();
    expect(teacher1).toBeInTheDocument();
    expect(teacher2).toBeInTheDocument();
  });

  test('should work with custom columns', async () => {
    const user = userEvent.setup();
    routeWithRender();

    await waitFor(() => {
      expect(screen.getByText('講師一覧')).toBeInTheDocument();
    });
    // 最初はadmin が表示されていることを確認
    const adminRole = screen.getByText('admin');
    expect(adminRole).toBeInTheDocument();

    const customColumnsButton = screen.getByRole('button', {
      name: 'カラム表示のカスタマイズ',
    });
    // カラム表示のカスタマイズボタンをクリック
    await user.click(customColumnsButton);
    const roleMenuitemCheckbox = screen.getByRole('menuitemcheckbox', {
      name: '役割',
    });
    await user.click(roleMenuitemCheckbox);
    // カラムの表示カスタマイズで admin が非表示になることを確認
    expect(adminRole).not.toBeInTheDocument();
    // 元に戻す
    await user.click(customColumnsButton);
    await user.click(
      screen.getByRole('menuitemcheckbox', {
        name: '役割',
      })
    );
    expect(screen.getByText('admin')).toBeInTheDocument();
  });

  test('should work with pagination selector', async () => {
    const user = userEvent.setup();
    routeWithRender();

    await waitFor(() => {
      expect(screen.getByText('講師一覧')).toBeInTheDocument();
    });

    const select = screen.getByRole('combobox', {
      name: '1ページに表示する行数',
    });
    await user.click(select);
    await user.click(screen.getByRole('option', { name: '20' }));
    expect(select).toHaveTextContent('20');
  });

  test('should work with next page button', async () => {
    const user = userEvent.setup();
    routeWithRender();

    await waitFor(() => {
      expect(screen.getByText('講師一覧')).toBeInTheDocument();
    });

    // 次のページボタン
    const nextPageButton = screen.getByRole('button', { name: '次のページへ' });
    await user.click(nextPageButton);
    expect(screen.getByText(/Page 2 of 2/)).toBeInTheDocument();

    // 前のページボタン
    const backPageButton = screen.getByRole('button', { name: '前のページへ' });
    await user.click(backPageButton);
    expect(screen.getByText(/Page 1 of 2/)).toBeInTheDocument();

    // 最終ページボタン
    const lastPageButton = screen.getByRole('button', { name: '最終ページへ' });
    await user.click(lastPageButton);
    expect(screen.getByText(/Page 2 of 2/)).toBeInTheDocument();

    // 最初のページボタン
    const firstPageButton = screen.getByRole('button', {
      name: '最初のページへ',
    });
    await user.click(firstPageButton);
    expect(screen.getByText(/Page 1 of 2/)).toBeInTheDocument();
  });

  test('should render error message if api returns 500', async () => {
    server.use(
      http.get(`${VITE_API_BASE_URL}/api/v1/teachers`, async () => {
        return HttpResponse.json(
          { error: '予期せぬエラーが発生しました。' },
          { status: 500 }
        );
      })
    );

    routeWithRender();

    await waitFor(() => {
      expect(
        screen.getByText('予期せぬエラーが発生しました。')
      ).toBeInTheDocument();
    });
  });
});
