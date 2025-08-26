import { TeachersPage } from '@/pages/teachers/TeachersPage';
import { server } from '@/tests/fixtures/server/server';
import { render, screen, waitFor } from '@testing-library/react';
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
