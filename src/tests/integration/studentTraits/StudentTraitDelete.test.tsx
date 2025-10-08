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

const ForbiddenPage = () => <div data-testid="forbidden">Forbidden</div>;
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const STUDENT_TRAIT_ID = "1";
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
    (button) => button.id === `student-trait-actions-${id}`
  );
  if (!menuButton) {
    throw new Error(`Menu button not found for student trait ${id}`);
  }
  return menuButton;
};

describe("StudentTrait Delete Test", () => {
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
      useUserStore.setState({ user: null });
    });
  });

  test("should delete a student trait", async () => {
    const user = userEvent.setup();
    DeleteRender();

    expect(await screen.findByText("明るい")).toBeInTheDocument();

    const menuButton = getMenuButtonById(STUDENT_TRAIT_ID);
    await user.click(menuButton);

    const deleteMenuButton = screen.getByRole("menuitem", { name: "削除" });
    await user.click(deleteMenuButton);

    await screen.findByText("生徒の特性を削除");

    const deleteButton = screen.getByRole("button", { name: "削除" });
    expect(deleteButton).toBeInTheDocument();
    await user.click(deleteButton);

    expect(await screen.findByText("特性を削除しました")).toBeInTheDocument();
  }, 20000);
  test("should fail when user is a teacher", async () => {
    useUserStore.setState({
      user: currentTeacherUser,
    });
    DeleteRender();
    expect(await screen.findByTestId("forbidden")).toBeInTheDocument();
  });

  test("should show server error when server returns 500", async () => {
    const user = userEvent.setup();
    server.use(
      http.delete(
        `${VITE_API_BASE_URL}/api/v1/student_traits/:id`,
        async () => {
          return HttpResponse.json(
            {
              errors: [
                {
                  code: "INTERNAL_SERVER_ERROR",
                  field: "base",
                  message:
                    "サーバーでエラーが発生しました。時間をおいて再度お試しください。",
                },
              ],
            },
            { status: 500 }
          );
        }
      )
    );

    DeleteRender();
    expect(await screen.findByText("明るい")).toBeInTheDocument();

    const menuButton = getMenuButtonById(STUDENT_TRAIT_ID);
    await user.click(menuButton);

    const deleteMenuButton = screen.getByRole("menuitem", { name: "削除" });
    await user.click(deleteMenuButton);

    await screen.findByText("生徒の特性を削除");

    const deleteButton = screen.getByRole("button", { name: "削除" });
    expect(deleteButton).toBeInTheDocument();
    await user.click(deleteButton);

    expect(
      await screen.findByText(
        "サーバーでエラーが発生しました。時間をおいて再度お試しください。"
      )
    ).toBeInTheDocument();
  });
});
