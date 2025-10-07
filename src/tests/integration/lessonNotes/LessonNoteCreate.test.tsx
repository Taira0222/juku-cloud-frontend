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
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { format } from "date-fns";
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

const CreateRender = (studentId: string = "1") => {
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

const createOperation = async (
  inputTitle: string = "英語の授業引継ぎを追加した"
) => {
  const user = userEvent.setup();
  await screen.findByText("英語の宿題");
  await screen.findByText("英語の授業");

  const createButton = screen.getByRole("button", { name: "引継ぎ事項を追加" });
  await user.click(createButton);

  await screen.findByText("引継ぎ事項を新規作成");

  const subjectCombobox = screen.getByRole("combobox", { name: /科目を選択/ });
  await user.click(subjectCombobox);
  await user.click(screen.getByRole("option", { name: "英語" }));

  // タイトル入力
  const titleInput = screen.getByLabelText(/タイトル/);
  await user.type(titleInput, inputTitle);

  // タイプ
  const typeCombobox = await screen.findByRole("combobox", {
    name: /分類を選択/,
  });
  await user.click(typeCombobox);
  await user.click(await screen.findByRole("option", { name: "宿題" }));

  // 有効期限
  const dayButton = screen.getByRole("button", { name: /有効期限/ });
  await user.click(dayButton);
  const calendar = await screen.findByRole("dialog");

  const isoToday = format(new Date(), "yyyy-MM-dd");
  const dayCell = calendar.querySelector<HTMLTableCellElement>(
    `[data-day="${isoToday}"]`
  );
  if (!dayCell) throw new Error(`Calendar cell for ${isoToday} not found`);
  await user.click(within(dayCell).getByRole("button"));

  await user.click(await screen.findByRole("button", { name: "作成" }));
};

describe("LessonNote Create Test", () => {
  afterEach(() => {
    queryClient.clear();
  });

  test("should create a new lesson note", async () => {
    useUserStore.setState({
      user: currentAdminUser,
    });
    CreateRender();
    await createOperation();

    expect(
      await screen.findByText("授業引継ぎを作成しました")
    ).toBeInTheDocument();
  });
  test("should create a new lesson note when user is a teacher", async () => {
    useUserStore.setState({
      user: currentTeacherUser,
    });
    CreateRender();

    await createOperation();

    expect(
      await screen.findByText("授業引継ぎを作成しました")
    ).toBeInTheDocument();
  });

  test("should show zod error when title is over 50 characters", async () => {
    useUserStore.setState({
      user: currentAdminUser,
    });
    CreateRender();
    await createOperation("A".repeat(51));

    expect(
      await screen.findByText("タイトルは50文字以内で入力してください")
    ).toBeInTheDocument();
  });

  test("should show server error when server returns 500", async () => {
    useUserStore.setState({
      user: currentAdminUser,
    });
    server.use(
      http.post(`${VITE_API_BASE_URL}/api/v1/lesson_notes`, async () => {
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

    CreateRender();
    await createOperation();
    expect(
      await screen.findByText(
        "サーバーでエラーが発生しました。時間をおいて再度お試しください。"
      )
    ).toBeInTheDocument();
  });
});
