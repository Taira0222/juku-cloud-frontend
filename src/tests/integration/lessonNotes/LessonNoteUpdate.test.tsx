import { Toaster } from "@/components/ui/feedback/Sonner/sonner";
import { EditLessonNoteDialog } from "@/features/lessonNotes/components/dialog/EditLessonNoteDialog";
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
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { addDays, format } from "date-fns";
import { http, HttpResponse } from "msw";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, test } from "vitest";

const NotFoundPage = () => <div data-testid="not-found">Not Found</div>;
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
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
      <MemoryRouter initialEntries={[`/dashboard/${studentId}`]}>
        <Toaster position="top-right" />
        <Routes>
          <Route element={<RoleRoute allowedRoles={["admin", "teacher"]} />}>
            <Route element={<StudentDashboard />}>
              <Route path="/dashboard/:studentId" element={<DashboardPage />} />
              <Route
                path="/dashboard/:studentId/lesson-notes/:lessonNoteId/edit"
                element={<EditLessonNoteDialog />}
              />
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

describe("LessonNote Update Test", () => {
  afterEach(() => {
    queryClient.clear();
  });
  const user = userEvent.setup();

  test("should update a lesson note", async () => {
    useUserStore.setState({
      user: currentAdminUser,
    });
    UpdateRender();

    expect(await screen.findByText("英語の宿題")).toBeInTheDocument();

    const menuButton = getMenuButtonById("1");
    await user.click(menuButton);

    const editMenuButton = screen.getByRole("menuitem", { name: "編集" });
    await user.click(editMenuButton);

    await screen.findByText("引継ぎ事項を編集");

    const titleInput = screen.getByLabelText(/タイトル/);
    await user.clear(titleInput);
    await user.type(titleInput, "英語の宿題（更新）");

    const updateButton = screen.getByRole("button", { name: "更新" });
    expect(updateButton).toBeInTheDocument();
    await user.click(updateButton);

    expect(
      await screen.findByText("引継ぎ事項を更新しました")
    ).toBeInTheDocument();
  });

  test("should update a lesson note as a teacher", async () => {
    useUserStore.setState({
      user: currentTeacherUser,
    });
    UpdateRender();

    expect(await screen.findByText("英語の宿題")).toBeInTheDocument();

    const menuButton = getMenuButtonById("1");
    await user.click(menuButton);

    const editMenuButton = screen.getByRole("menuitem", { name: "編集" });
    await user.click(editMenuButton);

    await screen.findByText("引継ぎ事項を編集");

    const titleInput = screen.getByLabelText(/タイトル/);
    await user.clear(titleInput);
    await user.type(titleInput, "英語の宿題（更新）");

    const updateButton = screen.getByRole("button", { name: "更新" });
    expect(updateButton).toBeInTheDocument();
    await user.click(updateButton);

    expect(
      await screen.findByText("引継ぎ事項を更新しました")
    ).toBeInTheDocument();
  });

  test("should show zod error when expire date is past", async () => {
    useUserStore.setState({
      user: currentAdminUser,
    });

    UpdateRender();

    expect(await screen.findByText("英語の宿題")).toBeInTheDocument();

    const menuButton = getMenuButtonById("1");
    await user.click(menuButton);

    const editMenuButton = screen.getByRole("menuitem", { name: "編集" });
    await user.click(editMenuButton);

    await screen.findByText("引継ぎ事項を編集");

    // 有効期限
    const dayButton = screen.getByRole("button", { name: /有効期限/ });
    await user.click(dayButton);
    const calendar = await screen.findByRole("dialog");

    const isoYesterday = format(addDays(new Date(), -1), "yyyy-MM-dd");
    const dayCell = calendar.querySelector<HTMLTableCellElement>(
      `[data-day="${isoYesterday}"]`
    );
    if (!dayCell)
      throw new Error(`Calendar cell for ${isoYesterday} not found`);
    await user.click(within(dayCell).getByRole("button"));

    const updateButton = screen.getByRole("button", { name: "更新" });
    expect(updateButton).toBeInTheDocument();
    await user.click(updateButton);

    expect(
      await screen.findByText("有効期限は今日以降の日付を入力してください")
    ).toBeInTheDocument();
  });

  test("should show server error when update a lesson note fails", async () => {
    useUserStore.setState({
      user: currentAdminUser,
    });

    server.use(
      http.patch(`${VITE_API_BASE_URL}/api/v1/lesson_notes/:id`, async () => {
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

    expect(await screen.findByText("英語の宿題")).toBeInTheDocument();

    const menuButton = getMenuButtonById("1");
    await user.click(menuButton);

    const editMenuButton = screen.getByRole("menuitem", { name: "編集" });
    await user.click(editMenuButton);

    await screen.findByText("引継ぎ事項を編集");

    const titleInput = screen.getByLabelText(/タイトル/);
    await user.clear(titleInput);
    await user.type(titleInput, "英語の宿題（更新）");

    const updateButton = screen.getByRole("button", { name: "更新" });
    expect(updateButton).toBeInTheDocument();
    await user.click(updateButton);

    expect(
      await screen.findByText(
        "サーバーでエラーが発生しました。時間をおいて再度お試しください。"
      )
    ).toBeInTheDocument();
  });
});
