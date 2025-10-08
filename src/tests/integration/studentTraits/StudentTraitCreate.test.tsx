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

const createOperation = async (inputTitle: string = "まじめな性格") => {
  const user = userEvent.setup();
  await screen.findByText("明るい");

  const createButton = await screen.findByRole("button", {
    name: "特性を追加",
  });
  await user.click(createButton);

  await screen.findByText("特性を新規作成");

  // カテゴリ選択
  const categoryCombobox = await screen.findByRole("combobox", {
    name: /特性の種類を選択/,
  });
  await user.click(categoryCombobox);
  await user.click(await screen.findByRole("option", { name: "よい特性" }));

  // タイトル入力
  const titleInput = await screen.findByLabelText(/タイトル/);
  await user.type(titleInput, inputTitle);

  // 詳細入力
  const descriptionInput = screen.getByLabelText(/詳細説明/);
  await user.type(descriptionInput, "毎日宿題を提出する");

  await user.click(await screen.findByRole("button", { name: "作成" }));
};

describe("StudentTrait Create Test", () => {
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

  test("should create a new student trait", async () => {
    CreateRender();
    await createOperation();

    expect(await screen.findByText("特性を作成しました")).toBeInTheDocument();
  }, 20000);
  test("should render forbidden page if user is teacher", async () => {
    useUserStore.setState({
      user: currentTeacherUser,
    });
    CreateRender();
    expect(await screen.findByTestId("forbidden")).toBeInTheDocument();
  });

  test("should show zod error when title is over 50 characters", async () => {
    CreateRender();
    await createOperation("A".repeat(51));

    expect(
      await screen.findByText("タイトルは50文字以内で入力してください")
    ).toBeInTheDocument();
  });

  test("should show server error when server returns 500", async () => {
    server.use(
      http.post(`${VITE_API_BASE_URL}/api/v1/student_traits`, async () => {
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
