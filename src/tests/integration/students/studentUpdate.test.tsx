import { Toaster } from "@/components/ui/feedback/Sonner/sonner";
import { EditStudentDialog } from "@/features/students/components/dialog/EditStudentDialog";
import { ManagementDashboard } from "@/pages/managementDashboard/ManagementDashboard";
import { StudentsPage } from "@/pages/students/StudentsPage";
import { RoleRoute } from "@/Router/RoleRoute";
import { useUserStore } from "@/stores/userStore";
import {
  currentAdminUser,
  currentTeacherUser,
} from "@/tests/fixtures/user/user";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

const updateRender = () => {
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/students"]}>
        <Toaster />
        <Routes>
          <Route element={<RoleRoute allowedRoles={["admin", "teacher"]} />}>
            <Route element={<ManagementDashboard />}>
              <Route path="/students" element={<StudentsPage />} />
              <Route
                path="/students/:studentId/edit"
                element={<EditStudentDialog />}
              />
            </Route>
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
    (button) => button.id === `student-actions-${id}`
  );
  if (!menuButton) {
    throw new Error(`Menu button not found for student ${id}`);
  }
  return menuButton;
};

const STUDENT1_ID = "1";

describe("Student Update Page", () => {
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
  test("should display a form for updating a student", async () => {
    updateRender();

    expect(await screen.findByText("mockStudent One")).toBeInTheDocument();
    const studentMenuButton = getMenuButtonById(STUDENT1_ID);
    await user.click(studentMenuButton);

    // 編集をクリック
    const editMenuButton = screen.getByRole("menuitem", { name: "編集" });
    await user.click(editMenuButton);

    expect(await screen.findByText("生徒情報を編集")).toBeInTheDocument();
    const nameInput = screen.getByLabelText(/生徒の名前/);

    await user.clear(nameInput);
    await user.type(nameInput, "mockStudent One Updated");

    const updateButton = screen.getByRole("button", { name: "更新" });
    await user.click(updateButton);

    expect(await screen.findByText("生徒を更新しました")).toBeInTheDocument();
  }, 20000);

  test("should display a confirmation dialog when removing subjects", async () => {
    updateRender();

    expect(await screen.findByText("mockStudent One")).toBeInTheDocument();
    const studentMenuButton = getMenuButtonById(STUDENT1_ID);
    await user.click(studentMenuButton);

    // 編集をクリック
    const editMenuButton = screen.getByRole("menuitem", { name: "編集" });
    await user.click(editMenuButton);

    expect(await screen.findByText("生徒情報を編集")).toBeInTheDocument();

    // 科目の選択を外す (数学を外す)
    const mathCheckbox = screen.getByRole("checkbox", { name: "数学" });
    await user.click(mathCheckbox);
    expect(mathCheckbox).not.toBeChecked();

    const updateButton = screen.getByRole("button", { name: "更新" });
    await user.click(updateButton);

    // 確認ダイアログが表示される
    expect(await screen.findByText("本当に更新しますか？")).toBeInTheDocument();
    expect(
      screen.getByText(/選択を外した科目に関連する授業引継ぎメモは削除されます/)
    ).toBeInTheDocument();
  });

  test("should display validation errors when submitting an empty form", async () => {
    updateRender();

    expect(await screen.findByText("mockStudent One")).toBeInTheDocument();
    const studentMenuButton = getMenuButtonById(STUDENT1_ID);
    await user.click(studentMenuButton);

    // 編集をクリック
    const editMenuButton = screen.getByRole("menuitem", { name: "編集" });
    await user.click(editMenuButton);

    expect(await screen.findByText("生徒情報を編集")).toBeInTheDocument();
    const nameInput = screen.getByLabelText(/生徒の名前/);

    await user.clear(nameInput);
    await user.type(nameInput, "a".repeat(50 + 1)); // 51文字入力

    const updateButton = screen.getByRole("button", { name: "更新" });
    await user.click(updateButton);

    expect(
      await screen.findByText("生徒名は50文字以内で入力してください")
    ).toBeInTheDocument();
  });
  test("should not display a form for updating a student if the role is teacher", async () => {
    useUserStore.setState({
      user: currentTeacherUser,
    });
    updateRender();

    expect(await screen.findByText("mockStudent One")).toBeInTheDocument();

    const allMenuButtons = screen.queryAllByRole("button", {
      name: /open menu/i,
    });
    expect(allMenuButtons.length).toBe(0);
  });
});
