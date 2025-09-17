import { TeachersPage } from "@/pages/teachers/TeachersPage";
import { server } from "@/tests/fixtures/server/server";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, vi } from "vitest";
import { describe, expect, test } from "vitest";

const routeWithRender = () => {
  return render(
    <MemoryRouter initialEntries={["/teachers"]}>
      <TeachersPage />
    </MemoryRouter>
  );
};

const FRONTEND_BASE_URL = import.meta.env.VITE_FRONTEND_BASE_URL;
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

describe("Teacher create integration tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("create invite link successfully", async () => {
    const user = userEvent.setup({ writeToClipboard: true });
    const mockInviteUrl = `${FRONTEND_BASE_URL}/sign_up?token=123456`;

    const writeTextSpy = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue(undefined);
    routeWithRender();

    await waitFor(() => {
      expect(screen.getByText("講師の追加")).toBeInTheDocument();
    });
    const addTeachersButton = screen.getByRole("button", {
      name: "講師の追加",
    });
    await user.click(addTeachersButton);

    // Dialog が表示される
    const input = await screen.findByLabelText("招待URL");

    expect(screen.getByText("招待リンクを共有")).toBeInTheDocument();
    expect(input).toHaveValue(mockInviteUrl);

    const copyButton = screen.getByRole("button", { name: "コピー" });
    expect(copyButton).toBeInTheDocument();

    // URLをコピーする
    await user.click(copyButton);

    const successMessage = await screen.findByText("コピーしました。");
    expect(successMessage).toBeInTheDocument();

    // クリップボードへの書き込みが呼び出されたことを確認
    expect(writeTextSpy).toHaveBeenCalledTimes(1);
    expect(writeTextSpy).toHaveBeenCalledWith(mockInviteUrl);

    // 閉じるボタンをクリック
    const closeButton = screen.getByRole("button", { name: "閉じる" });
    await user.click(closeButton);

    await screen.findByText("講師の追加");
  });

  test("create invite link failure", async () => {
    const user = userEvent.setup({ writeToClipboard: true });

    server.use(
      http.post(`${VITE_API_BASE_URL}/api/v1/invites`, async () => {
        return HttpResponse.json(
          {
            errors: [
              {
                code: "CREATE_TOKEN_FAILED",
                field: "base",
                message: "トークンの作成に失敗しました。",
              },
            ],
          },
          { status: 422 }
        );
      })
    );
    routeWithRender();

    await waitFor(() => {
      expect(screen.getByText("講師の追加")).toBeInTheDocument();
    });

    const addTeachersButton = screen.getByRole("button", {
      name: "講師の追加",
    });
    await user.click(addTeachersButton);

    await waitFor(() => {
      expect(
        screen.getByText("トークンの作成に失敗しました。")
      ).toBeInTheDocument();
    });
  });
});
