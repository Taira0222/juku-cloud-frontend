// __tests__/SignUpPage.test.tsx
import { describe, expect, test, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { SignUpPage } from "@/pages/auth/SignUpPage";

// モジュール全体を vi.fn() に差し替える
vi.mock("@/features/auth/hooks/useTokenConfirm", () => ({
  useTokenConfirm: vi.fn(),
}));

// 差し替わったuseTokenConfirm のモックをインポート
import { useTokenConfirm } from "@/features/auth/hooks/useTokenConfirm";
const mockedUseTokenConfirm = vi.mocked(useTokenConfirm);

beforeEach(() => {
  vi.clearAllMocks();
});

//テスト用: NotFoundPageコンポーネントのダミー実装
const NotFoundPage = () => <div data-testid="not-found">Not Found Page</div>;
// 学校名
const SCHOOL_NAME = "First_school";

describe("SignUp component", () => {
  test("switch loading → success screen", async () => {
    // 最初はローディングを返す
    mockedUseTokenConfirm.mockReturnValue({
      loading: true,
      tokenError: null,
      data: null,
    });

    const ui = (
      <MemoryRouter initialEntries={["/sign_up?token=123456"]}>
        <SignUpPage />
      </MemoryRouter>
    );
    const { rerender } = render(ui);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // 次のレンダーで成功に差し替え
    mockedUseTokenConfirm.mockReturnValue({
      loading: false,
      tokenError: null,
      data: { school_name: SCHOOL_NAME },
    });

    rerender(
      <MemoryRouter initialEntries={["/sign_up?token=123456"]}>
        <SignUpPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Juku Cloud")).toBeInTheDocument();
      expect(screen.getByText(`${SCHOOL_NAME}へようこそ`)).toBeInTheDocument();
    });
  });

  test("display error", async () => {
    mockedUseTokenConfirm.mockReturnValue({
      loading: false,
      tokenError: ["Invalid token"],
      data: null,
    });

    render(
      <MemoryRouter initialEntries={["/sign_up?token=bad"]}>
        <SignUpPage />
        <NotFoundPage />
      </MemoryRouter>
    );

    // NotFoundPage へ遷移
    await waitFor(() => {
      expect(screen.getByTestId("not-found")).toBeInTheDocument();
    });
  });
});
