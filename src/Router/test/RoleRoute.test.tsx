import { useUserStore } from '@/stores/userStore';
import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Outlet, Route, Routes } from 'react-router-dom';

import type { ReactElement } from 'react';
import { RoleRoute, type Role } from '../RoleRoute';

type MockRenderData = {
  initialEntries: string[];
  allowedRoles: Role[];
  path: string;
  testId: string;
  element: ReactElement;
  navPath?: string;
  navTestId?: string;
  navElement?: ReactElement;
};

type MockTestInfo = {
  role: string | null;
};

vi.mock('@/features/managementDashboard/hooks/useFetchUser', () => ({
  useFetchUser: vi.fn(),
}));

const StudentsPage = () => <div data-testid="students">Students Page</div>;
const ForbiddenPage = () => <div data-testid="forbidden">Forbidden Page</div>;
const TeachersPage = () => <div data-testid="teachers">Teachers Page</div>;
const DummyLayout = () => <Outlet />;

describe('RoleRoute', () => {
  const genericRender = (renderData: MockRenderData) => {
    return render(
      <MemoryRouter initialEntries={renderData.initialEntries}>
        <Routes>
          <Route element={<RoleRoute allowedRoles={renderData.allowedRoles} />}>
            <Route element={<DummyLayout />}>
              <Route path={renderData.path} element={renderData.element} />
            </Route>
          </Route>
          <Route path={renderData.navPath} element={renderData.navElement} />
        </Routes>
      </MemoryRouter>
    );
  };

  const renderTest = (renderData: MockRenderData, testInfo: MockTestInfo) => {
    // role がnull ならuser 全体をnullにする
    if (testInfo.role === null) {
      useUserStore.setState({
        user: null,
      });
    } else {
      useUserStore.setState({
        user: {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
          role: testInfo.role,
          school: 'First_school',
        },
      });
    }

    genericRender(renderData);

    // user が null の場合は 他のページへリダイレクトしない
    if (testInfo.role === null) {
      expect(screen.getByText('Loading ...')).toBeInTheDocument();
      return;
    }

    if (renderData.navTestId) {
      expect(screen.queryByTestId(renderData.testId)).toBeNull();
      expect(screen.getByTestId(renderData.navTestId)).toBeInTheDocument();
      return;
    }
    expect(screen.getByTestId(renderData.testId)).toBeInTheDocument();
  };

  test('should render Outlet when user has the correct role', () => {
    const renderData: MockRenderData = {
      initialEntries: ['/students'],
      allowedRoles: ['admin', 'teacher'],
      path: '/students',
      testId: 'students',
      element: <StudentsPage />,
    };
    const testInfo: MockTestInfo = {
      role: 'admin',
    };
    renderTest(renderData, testInfo);
  });

  test('should render teachers page for admin role', () => {
    const renderData: MockRenderData = {
      initialEntries: ['/teachers'],
      allowedRoles: ['admin'],
      path: '/teachers',
      testId: 'teachers',
      element: <TeachersPage />,
    };
    const testInfo: MockTestInfo = {
      role: 'admin',
    };
    renderTest(renderData, testInfo);
  });

  test('should not render teachers page for non-admin role', () => {
    const renderData: MockRenderData = {
      initialEntries: ['/teachers'],
      allowedRoles: ['admin'],
      path: '/teachers',
      testId: 'teachers',
      element: <TeachersPage />,
      navPath: '/forbidden',
      navTestId: 'forbidden',
      navElement: <ForbiddenPage />,
    };

    const testInfo: MockTestInfo = {
      role: 'teacher',
    };

    renderTest(renderData, testInfo);
  });

  test('should render loading message', () => {
    const renderData: MockRenderData = {
      initialEntries: ['/students'],
      allowedRoles: ['admin'],
      path: '/students',
      testId: 'students',
      element: <StudentsPage />,
    };
    // role がnull ならuser をnull にする
    const testInfo: MockTestInfo = {
      role: null,
    };
    renderTest(renderData, testInfo);
  });
});
