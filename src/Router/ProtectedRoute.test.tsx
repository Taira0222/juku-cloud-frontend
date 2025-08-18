import { useFetchUser } from '@/features/managementDashboard/hooks/useFetchUser';
import { useUserStore } from '@/stores/userStore';
import { describe, expect, test, vi } from 'vitest';
import { ProtectedRoute, type Role } from './ProtectedRoute';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Outlet, Route, Routes } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useWarningStore } from '@/stores/warningStore';
import type { ReactElement } from 'react';

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
  isAuthenticated: boolean;
  error: string[] | null;
};

vi.mock('@/features/managementDashboard/hooks/useFetchUser', () => ({
  useFetchUser: vi.fn(),
}));

const StudentsPage = () => <div data-testid="students">Students Page</div>;
const ForbiddenPage = () => <div data-testid="forbidden">Forbidden Page</div>;
const TeachersPage = () => <div data-testid="teachers">Teachers Page</div>;
const SignInPage = () => <div data-testid="sign-in">Sign In Page</div>;
const NotFoundPage = () => <div data-testid="not-found">Not Found Page</div>;
const DummyLayout = () => <Outlet />;

describe('ProtectedRoute', () => {
  const genericRender = (renderData: MockRenderData) => {
    return render(
      <MemoryRouter initialEntries={renderData.initialEntries}>
        <Routes>
          <Route
            element={<ProtectedRoute allowedRoles={renderData.allowedRoles} />}
          >
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

    vi.spyOn(useAuthStore.getState(), 'isAuthenticated').mockReturnValue(
      testInfo.isAuthenticated
    );
    vi.mocked(useFetchUser).mockReturnValue({
      error: testInfo.error,
    });
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

  test('should render Outlet when user is authenticated and has the correct role', () => {
    const renderData: MockRenderData = {
      initialEntries: ['/students'],
      allowedRoles: ['admin', 'teacher'],
      path: '/students',
      testId: 'students',
      element: <StudentsPage />,
    };
    const testInfo: MockTestInfo = {
      role: 'admin',
      isAuthenticated: true,
      error: null,
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
      isAuthenticated: true,
      error: null,
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
      isAuthenticated: true,
      error: null,
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
    const testInfo: MockTestInfo = {
      role: null,
      isAuthenticated: true,
      error: null,
    };
    renderTest(renderData, testInfo);
  });
  test('should redirect to sign in page if not authenticated', () => {
    const renderData: MockRenderData = {
      initialEntries: ['/students'],
      allowedRoles: ['admin'],
      path: '/students',
      testId: 'students',
      element: <StudentsPage />,
      navPath: '/sign_in',
      navTestId: 'sign-in',
      navElement: <SignInPage />,
    };

    const setWarningSpy = vi.spyOn(
      useWarningStore.getState(),
      'setWarningMessage'
    );
    const testInfo: MockTestInfo = {
      role: 'teacher',
      isAuthenticated: false,
      error: null,
    };
    renderTest(renderData, testInfo);
    expect(setWarningSpy).toHaveBeenCalledWith('ログインが必要です');
  });

  test('should render 404 page if route is not found', () => {
    const renderData: MockRenderData = {
      initialEntries: ['/students'],
      allowedRoles: ['admin'],
      path: '/students',
      testId: 'students',
      element: <StudentsPage />,
      navPath: '/404',
      navTestId: 'not-found',
      navElement: <NotFoundPage />,
    };
    const testInfo: MockTestInfo = {
      role: 'teacher',
      isAuthenticated: true,
      error: ['Unexpected Error'],
    };

    renderTest(renderData, testInfo);
  });
});
