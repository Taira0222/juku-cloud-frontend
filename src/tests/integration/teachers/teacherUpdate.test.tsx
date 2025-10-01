import { Toaster } from "@/components/ui/feedback/Sonner/sonner";
import { EditTeacherDialog } from "@/features/teachers/components/dialogs/EditTeacherDialog";
import { TeachersPage } from "@/pages/teachers/TeachersPage";
import { server } from "@/tests/fixtures/server/server";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, test } from "vitest";

const routeWithRender = () => {
  return render(
    <MemoryRouter initialEntries={["/teachers"]}>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/teachers" element={<TeachersPage />} />
        <Route
          path="/teachers/:teacherId/edit"
          element={<EditTeacherDialog />}
        />
      </Routes>
    </MemoryRouter>
  );
};

const getMenuButtonById = (id: string) => {
  const allMenuButtons = screen.getAllByRole("button", {
    name: /open menu/i,
  });
  const menuButton = allMenuButtons.find(
    (button) => button.id === `teacher-actions-${id}`
  );
  if (!menuButton) {
    throw new Error(`Menu button not found for teacher ${id}`);
  }
  return menuButton;
};

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ADMIN_ID = "1";

describe("Teacher Update Integration Tests", () => {
  test("updates a teacher", async () => {
    const user = userEvent.setup();
    routeWithRender();

    // 講師一覧がでるまで待機

    expect(await screen.findByText("講師一覧")).toBeInTheDocument();

    const adminMenuButton = getMenuButtonById(ADMIN_ID);
    await user.click(adminMenuButton);

    // 編集をクリック
    const editMenuButton = screen.getByRole("menuitem", { name: "編集" });
    await user.click(editMenuButton);

    const section = screen.getByLabelText("選択中の担当科目");
    const englishBadge = within(section).getByText("英語");
    const mondayCheckbox = screen.getByRole("checkbox", { name: "月曜日" });
    const updateButton = screen.getByRole("button", { name: "更新" });

    // 変更前の情報を確認
    expect(englishBadge).toBeInTheDocument();
    expect(mondayCheckbox).toBeChecked();

    // 変更を加える
    await user.click(englishBadge);
    await user.click(mondayCheckbox);

    // 更新ボタンの前にクリックが反映されているか確認
    await waitFor(() => {
      expect(englishBadge).not.toBeInTheDocument();
      expect(mondayCheckbox).not.toBeChecked();
    });

    await user.click(updateButton);

    await waitFor(() => {
      expect(screen.getByText("更新に成功しました")).toBeInTheDocument();
      // 講師一覧に戻り、変更が反映されていることを確認
      expect(screen.getByText("講師一覧")).toBeInTheDocument();
    });
  });

  test("handles unexpected error during update", async () => {
    const user = userEvent.setup();
    server.use(
      http.patch(`${VITE_API_BASE_URL}/api/v1/teachers/:id`, async () => {
        return HttpResponse.json(
          { errors: ["予期せぬエラーが発生しました。"] },
          { status: 500 }
        );
      })
    );
    routeWithRender();

    // 講師一覧がでるまで待機
    await waitFor(() => {
      expect(screen.getByText("講師一覧")).toBeInTheDocument();
    });

    const adminMenuButton = getMenuButtonById(ADMIN_ID);
    await user.click(adminMenuButton);

    // 編集をクリック
    const editMenuButton = screen.getByRole("menuitem", { name: "編集" });
    await user.click(editMenuButton);

    const updateButton = screen.getByRole("button", { name: "更新" });
    await user.click(updateButton);

    await waitFor(() => {
      expect(screen.getByText("更新に失敗しました")).toBeInTheDocument();
      expect(
        screen.getByText("予期せぬエラーが発生しました。")
      ).toBeInTheDocument();
    });
  });
});
