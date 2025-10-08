import { Toaster } from "@/components/ui/feedback/Sonner/sonner";
import { StudentDashboard } from "@/pages/studentDashboard/StudentDashboard";
import { StudentTraitsPage } from "@/pages/studentTraits/StudentTraitsPage";
import { RoleRoute } from "@/Router/RoleRoute";
import { useUserStore } from "@/stores/userStore";
import { server } from "@/tests/fixtures/server/server";
import {
  currentAdminUser,
  currentTeacherUser,
} from "@/tests/fixtures/user/user";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

const NotFoundPage = () => <div data-testid="not-found">Not Found</div>;
const ForbiddenPage = () => <div data-testid="forbidden">Forbidden</div>;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const indexRender = (studentId: string = "1") => {
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/dashboard/${studentId}/student-traits`]}>
        <Toaster position="top-right" />
        <Routes>
          <Route element={<RoleRoute allowedRoles={["admin"]} />}>
            <Route element={<StudentDashboard />}>
              <Route
                path="/dashboard/:studentId/student-traits"
                element={<StudentTraitsPage />}
              />
            </Route>
          </Route>
          <Route path="/forbidden" element={<ForbiddenPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

describe("Student Traits Index Page", () => {
  beforeEach(() => {
    act(() => {
      useUserStore.setState({
        user: currentAdminUser,
      });
    });
  });
  afterEach(() => {
    queryClient.clear();
    act(() => {
      useUserStore.setState({
        user: null,
      });
    });
  });
  test("should render student traits", async () => {
    const user = userEvent.setup();
    indexRender();

    const goodTrait = await screen.findByText("明るい");
    expect(goodTrait).toBeInTheDocument();
    await user.hover(goodTrait);
    expect(
      await screen.findByText("いつもニコニコしている。")
    ).toBeInTheDocument();
  });

  test("should change the number of rows displayed per page", async () => {
    const user = userEvent.setup();
    indexRender();
    await screen.findByText("明るい");

    const select = screen.getByRole("combobox", {
      name: "1ページに表示する行数",
    });

    await user.click(select);

    const option = screen.getByRole("option", { name: "20" });
    await user.click(option);
    expect(select).toHaveTextContent("20");
  });

  test("should navigate to 404 page when the student id is invalid", async () => {
    indexRender("-1"); // 存在しない生徒ID
    expect(await screen.findByTestId("not-found")).toBeInTheDocument();
  });

  test("should render error message if student id is invalid", async () => {
    indexRender("9999"); // 存在しない生徒ID

    expect(
      await screen.findByText("生徒が見つかりませんでした。")
    ).toBeInTheDocument();
  });

  test("should render forbidden page if user is teacher", async () => {
    act(() => {
      useUserStore.setState({
        user: currentTeacherUser,
      });
    });
    indexRender();

    expect(await screen.findByTestId("forbidden")).toBeInTheDocument();
  });

  test("should render error message if api returns 404", async () => {
    server.use(
      http.get(`${VITE_API_BASE_URL}/api/v1/student_traits`, async () => {
        return HttpResponse.json(
          {
            errors: [
              {
                code: "NOT_FOUND",
                field: "base",
                message: "生徒の特性は見つかりませんでした。",
              },
            ],
          },
          { status: 404 }
        );
      })
    );
    indexRender();
    expect(
      await screen.findByText("生徒の特性は見つかりませんでした。")
    ).toBeInTheDocument();
  });
});
