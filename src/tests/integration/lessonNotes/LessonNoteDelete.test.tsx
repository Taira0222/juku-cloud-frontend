import { Toaster } from "@/components/ui/feedback/Sonner/sonner";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { StudentDashboard } from "@/pages/studentDashboard/StudentDashboard";
import { RoleRoute } from "@/Router/RoleRoute";
import { useUserStore } from "@/stores/userStore";
import { server } from "@/tests/fixtures/server/server";
import {
  currentAdminUser,
  currentTeacherUser,
} from "@/tests/fixtures/user/user";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

const NotFoundPage = () => <div data-testid="not-found">Not Found</div>;
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const DeleteRender = (studentId: string = "1") => {
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/dashboard/${studentId}`]}>
        <Toaster position="top-right" />
        <Routes>
          <Route element={<RoleRoute allowedRoles={["admin", "teacher"]} />}>
            <Route element={<StudentDashboard />}>
              <Route path="/dashboard/:studentId" element={<DashboardPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

const getMenuButtonById = (id: string) => {
  const allMenuButtons = screen.getAllByRole("button", {
    name: /open menu/i,
  });
  const menuButton = allMenuButtons.find(
    (button) => button.id === `lesson-note-actions-${id}`
  );
  if (!menuButton) {
    throw new Error(`Menu button not found for lesson note ${id}`);
  }
  return menuButton;
};

describe("LessonNote Delete Test", () => {
  beforeEach(() => {
    useUserStore.setState({
      user: currentAdminUser,
    });
  });
  afterEach(() => {
    queryClient.clear();
    useUserStore.setState({ user: null });
  });
  const user = userEvent.setup();
  test("should delete a lesson note", async () => {
    DeleteRender();

    expect(await screen.findByText("英語の宿題")).toBeInTheDocument();

    const menuButton = getMenuButtonById("1");
    await user.click(menuButton);

    const deleteMenuButton = screen.getByRole("menuitem", { name: "削除" });
    await user.click(deleteMenuButton);

    await screen.findByText("授業引継ぎを削除");

    const deleteButton = screen.getByRole("button", { name: "削除" });
    expect(deleteButton).toBeInTheDocument();
    await user.click(deleteButton);

    expect(
      await screen.findByText("授業引継ぎを削除しました")
    ).toBeInTheDocument();
  });
  test("should not render delete menu item for teacher user", async () => {
    useUserStore.setState({
      user: currentTeacherUser,
    });

    DeleteRender();

    expect(await screen.findByText("英語の宿題")).toBeInTheDocument();
    const menuButton = getMenuButtonById("1");
    await user.click(menuButton);

    expect(
      screen.queryByRole("menuitem", { name: "削除" })
    ).not.toBeInTheDocument();
  });

  test("should show error toast if delete lesson note fails", async () => {
    server.use(
      http.delete(`${VITE_API_BASE_URL}/api/v1/lesson_notes/:id`, async () => {
        return HttpResponse.json(
          {
            errors: [
              {
                code: "INTERNAL_SERVER_ERROR",
                field: "base",
                message:
                  "予期せぬエラーが発生しました。時間をおいて再度お試しください。",
              },
            ],
          },
          { status: 500 }
        );
      })
    );
    DeleteRender();
    expect(await screen.findByText("英語の宿題")).toBeInTheDocument();

    const menuButton = getMenuButtonById("1");
    await user.click(menuButton);

    const deleteMenuButton = screen.getByRole("menuitem", { name: "削除" });
    await user.click(deleteMenuButton);

    await screen.findByText("授業引継ぎを削除");

    const deleteButton = screen.getByRole("button", { name: "削除" });
    expect(deleteButton).toBeInTheDocument();
    await user.click(deleteButton);
  });
});
