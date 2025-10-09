import { Toaster } from "@/components/ui/feedback/Sonner/sonner";
import { EditStudentTraitDialog } from "@/features/studentTraits/components/dialog/EditStudentTraitDialog";
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
import { act, render, screen, waitFor } from "@testing-library/react";
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

const UpdateRender = (studentId: string = "1") => {
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
              <Route
                path="/dashboard/:studentId/student-traits/:studentTraitId/edit"
                element={<EditStudentTraitDialog />}
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

const updateOperation = async (inputTitle: string = "新しいタイトル") => {
  const user = userEvent.setup();

  await screen.findByText("明るい");

  const menuButton = getMenuButtonById(STUDENT_TRAIT_ID);
  await user.click(menuButton);

  const editMenuButton = screen.getByRole("menuitem", { name: "編集" });
  await user.click(editMenuButton);

  await screen.findByText("特性を編集");

  // タイトルだけ変更
  const titleInput = screen.getByLabelText(/タイトル/);
  await user.clear(titleInput);
  await user.type(titleInput, inputTitle);

  const submitButton = screen.getByRole("button", { name: "更新" });
  await user.click(submitButton);
};

describe("StudentTrait Update Test", () => {
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

  test("should update an existing student trait", async () => {
    UpdateRender();

    // ローディング完了を確実に待つ
    await waitFor(() => {
      expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
    });
    await updateOperation();

    expect(await screen.findByText("特性を更新しました")).toBeInTheDocument();
  }, 20000);
  test("should fail when user is a teacher", async () => {
    useUserStore.setState({
      user: currentTeacherUser,
    });
    UpdateRender();
    expect(await screen.findByTestId("forbidden")).toBeInTheDocument();
  });

  test("should show zod error when title is over 50 characters", async () => {
    UpdateRender();

    // ローディング完了を確実に待つ
    await waitFor(() => {
      expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
    });
    await updateOperation("A".repeat(51));

    expect(
      await screen.findByText("タイトルは50文字以内で入力してください")
    ).toBeInTheDocument();
  });

  test("should show server error when server returns 500", async () => {
    server.use(
      http.patch(`${VITE_API_BASE_URL}/api/v1/student_traits/:id`, async () => {
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
      })
    );

    UpdateRender();

    // ローディング完了を確実に待つ
    await waitFor(() => {
      expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
    });
    await updateOperation();
    expect(
      await screen.findByText(
        "サーバーでエラーが発生しました。時間をおいて再度お試しください。"
      )
    ).toBeInTheDocument();
  });
});
