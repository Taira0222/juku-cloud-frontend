import { describe, expect, test, vi } from "vitest";

import { render, screen } from "@testing-library/react";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useWarningStore } from "@/stores/warningStore";
import type { ReactElement } from "react";
import { ProtectedRoute } from "../ProtectedRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUserQuery } from "@/queries/useUserQuery";
import { currentAdminUser } from "@/tests/fixtures/user/user";

type MockRenderData = {
  initialEntries: string[];
  path: string;
  testId: string;
  element: ReactElement;
  navPath?: string;
  navTestId?: string;
  navElement?: ReactElement;
};

type MockTestInfo = {
  isAuthenticated: boolean;
  isError: boolean;
};

vi.mock("@/queries/useUserQuery", () => ({
  useUserQuery: vi.fn(),
}));

const StudentsPage = () => <div data-testid="students">Students Page</div>;
const SignInPage = () => <div data-testid="sign-in">Sign In Page</div>;
const NotFoundPage = () => <div data-testid="not-found">Not Found Page</div>;
const DummyLayout = () => <Outlet />;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const genericRender = (renderData: MockRenderData) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={renderData.initialEntries}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route element={<DummyLayout />}>
              <Route path={renderData.path} element={renderData.element} />
            </Route>
          </Route>
          <Route path={renderData.navPath} element={renderData.navElement} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

const renderTest = (renderData: MockRenderData, testInfo: MockTestInfo) => {
  vi.spyOn(useAuthStore.getState(), "isAuthenticated").mockReturnValue(
    testInfo.isAuthenticated
  );
  vi.mocked(useUserQuery).mockReturnValue({
    isError: testInfo.isError,
    isSuccess: testInfo.isError ? false : true,
    data: testInfo.isError ? null : currentAdminUser,
  } as unknown as ReturnType<typeof useUserQuery>);

  genericRender(renderData);

  if (renderData.navTestId) {
    expect(screen.queryByTestId(renderData.testId)).toBeNull();
    expect(screen.getByTestId(renderData.navTestId)).toBeInTheDocument();
    return;
  }
  expect(screen.getByTestId(renderData.testId)).toBeInTheDocument();
};

describe("ProtectedRoute", () => {
  test("should render Outlet when user is authenticated", () => {
    const renderData: MockRenderData = {
      initialEntries: ["/students"],
      path: "/students",
      testId: "students",
      element: <StudentsPage />,
    };
    const testInfo: MockTestInfo = {
      isAuthenticated: true,
      isError: false,
    };
    renderTest(renderData, testInfo);
  });

  test("should render loading message", () => {
    const renderData: MockRenderData = {
      initialEntries: ["/students"],
      path: "/students",
      testId: "students",
      element: <StudentsPage />,
    };
    const testInfo: MockTestInfo = {
      isAuthenticated: true,
      isError: false,
    };
    renderTest(renderData, testInfo);
  });
  test("should redirect to sign in page if not authenticated", () => {
    const renderData: MockRenderData = {
      initialEntries: ["/students"],
      path: "/students",
      testId: "students",
      element: <StudentsPage />,
      navPath: "/sign_in",
      navTestId: "sign-in",
      navElement: <SignInPage />,
    };

    const setWarningSpy = vi.spyOn(
      useWarningStore.getState(),
      "setWarningMessage"
    );
    const testInfo: MockTestInfo = {
      isAuthenticated: false,
      isError: false,
    };
    renderTest(renderData, testInfo);
    expect(setWarningSpy).toHaveBeenCalledWith("ログインが必要です");
  });

  test("should render 404 page if route is not found", () => {
    const renderData: MockRenderData = {
      initialEntries: ["/students"],
      path: "/students",
      testId: "students",
      element: <StudentsPage />,
      navPath: "/404",
      navTestId: "not-found",
      navElement: <NotFoundPage />,
    };
    const testInfo: MockTestInfo = {
      isAuthenticated: true,
      isError: true,
    };

    renderTest(renderData, testInfo);
  });
});
