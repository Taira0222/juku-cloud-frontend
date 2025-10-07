import { Toaster } from "@/components/ui/feedback/Sonner/sonner";
import { ManagementDashboard } from "@/pages/managementDashboard/ManagementDashboard";
import { StudentsPage } from "@/pages/students/StudentsPage";
import { RoleRoute } from "@/Router/RoleRoute";
import { useUserStore } from "@/stores/userStore";
import {
  currentAdminUser,
  currentTeacherUser,
} from "@/tests/fixtures/user/user";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { format } from "date-fns";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

const createRender = () => {
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/students"]}>
        <Toaster />
        <Routes>
          <Route element={<RoleRoute allowedRoles={["admin", "teacher"]} />}>
            <Route element={<ManagementDashboard />}>
              <Route path="/students" element={<StudentsPage />} />
            </Route>
          </Route>
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe("Student Create Page", () => {
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
  const user = userEvent.setup();

  test("should display a form for creating a student when the user is an admin", async () => {
    createRender();

    expect(await screen.findByText("mockStudent One")).toBeInTheDocument();

    const createButton = screen.getByRole("button", { name: "生徒の追加" });
    expect(createButton).toBeInTheDocument();
    await user.click(createButton);

    expect(await screen.findByText("生徒を新規作成")).toBeInTheDocument();

    // 名前を入力
    const nameInput = screen.getByLabelText(/生徒の名前/);
    await user.type(nameInput, "mockStudent Four");

    // 学年を選択
    const selectGrade = screen.getByLabelText(/学年を選択/);
    await user.click(selectGrade);
    const option = screen.getByRole("option", { name: "中学2年" });
    await user.click(option);

    // カレンダーを表示させる
    const dayButton = screen.getByRole("button", { name: /入塾日/ });
    await user.click(dayButton);
    const calendar = screen.getByRole("dialog");
    // 日付選択
    const isoToday = format(new Date(), "yyyy-MM-dd");
    const dayCell = calendar.querySelector<HTMLTableCellElement>(
      `[data-day="${isoToday}"]`
    );
    expect(dayCell).toBeTruthy();

    await user.click(within(dayCell!).getByRole("button"));

    // ステータスを選択
    const selectStatus = screen.getByLabelText(/通塾状況/);
    await user.click(selectStatus);
    const statusOption = screen.getByRole("option", { name: "通塾中" });
    await user.click(statusOption);

    // 英語を選択
    const englishCheckbox = screen.getByRole("checkbox", { name: "英語" });
    expect(englishCheckbox).toBeInTheDocument();
    await user.click(englishCheckbox);

    // 月曜日を選択
    const mondayCheckbox = screen.getByRole("checkbox", { name: "月曜日" });
    await user.click(mondayCheckbox);

    const teacher1EnglishCheckbox = await screen.findByLabelText(
      `John Doeのenglishの割り当て`
    );
    expect(teacher1EnglishCheckbox).toBeInTheDocument();
    await user.click(teacher1EnglishCheckbox);

    // 作成ボタンをクリック
    const submitButton = screen.getByRole("button", { name: "作成" });
    expect(submitButton).toBeInTheDocument();
    await user.click(submitButton);

    expect(await screen.findByText("生徒を作成しました")).toBeInTheDocument();
  });

  test("should not display a form for creating a student if the role is teacher", async () => {
    useUserStore.setState({
      user: currentTeacherUser,
    });
    createRender();

    expect(await screen.findByText("mockStudent One")).toBeInTheDocument();

    const createButton = screen.queryByRole("button", { name: "生徒の追加" });
    expect(createButton).not.toBeInTheDocument();
  });

  test("should display validation errors when submitting an empty form", async () => {
    createRender();
    expect(await screen.findByText("mockStudent One")).toBeInTheDocument();

    const createButton = screen.getByRole("button", { name: "生徒の追加" });
    expect(createButton).toBeInTheDocument();
    await user.click(createButton);

    expect(await screen.findByText("生徒を新規作成")).toBeInTheDocument();

    // 名前を入力
    const nameInput = screen.getByLabelText(/生徒の名前/);

    await user.type(nameInput, "a".repeat(50 + 1)); // 51文字入力

    // 作成ボタンをクリック
    const submitButton = screen.getByRole("button", { name: "作成" });
    expect(submitButton).toBeInTheDocument();
    await user.click(submitButton);

    expect(
      await screen.findByText("生徒名は50文字以内で入力してください")
    ).toBeInTheDocument();

    expect(
      await screen.findByText("受講科目を1つ以上選択してください")
    ).toBeInTheDocument();
    expect(
      await screen.findByText("希望曜日を1つ以上選択してください")
    ).toBeInTheDocument();
    expect(
      await screen.findByText("担当講師を1人以上割り当ててください")
    ).toBeInTheDocument();
  });
});
