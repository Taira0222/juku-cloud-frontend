import { Toaster } from "@/components/ui/feedback/Sonner/sonner";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { StudentDashboard } from "@/pages/studentDashboard/StudentDashboard";
import { RoleRoute } from "@/Router/RoleRoute";
import { useUserStore } from "@/stores/userStore";
import { server } from "@/tests/fixtures/server/server";
import { currentAdminUser } from "@/tests/fixtures/user/user";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, test } from "vitest";

const NotFoundPage = () => <div data-testid="not-found">Not Found</div>;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const indexRender = (studentId: string = "1") => {
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

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

describe("Dashboard Index Page", () => {
  afterEach(() => {
    queryClient.clear();
  });
  test("should display a list of lesson notes", async () => {
    useUserStore.setState({
      user: currentAdminUser,
    });
    const user = userEvent.setup();
    indexRender();

    // 生徒情報
    expect(await screen.findByText("mockStudent One")).toBeInTheDocument();
    expect(screen.getByText("高校3年")).toBeInTheDocument();
    expect(screen.getByText("Stanford university")).toBeInTheDocument();

    // 生徒特性が表示されているか
    const goodTrait = await screen.findByText("明るい");
    expect(goodTrait).toBeInTheDocument();
    await user.hover(goodTrait);
    expect(
      await screen.findByText("いつもニコニコしている。")
    ).toBeInTheDocument();

    const carefulTrait = screen.getByText("宿題をやったふりをしてしまう");
    expect(carefulTrait).toBeInTheDocument();
    await user.hover(carefulTrait);
    expect(
      await screen.findByText(
        "実際にはやっていないのに、やったと言ってしまうことがある。"
      )
    ).toBeInTheDocument();

    expect(await screen.findByText("英語の宿題")).toBeInTheDocument();
    expect(await screen.findByText("英語の授業")).toBeInTheDocument();
  });

  test("should change the number of rows displayed per page", async () => {
    const user = userEvent.setup();
    useUserStore.setState({
      user: currentAdminUser,
    });
    indexRender();
    expect(await screen.findByText("英語の宿題")).toBeInTheDocument();
    expect(await screen.findByText("英語の授業")).toBeInTheDocument();

    const select = screen.getByRole("combobox", {
      name: "1ページに表示する行数",
    });

    await user.click(select);
    const option = screen.getByRole("option", { name: "10" });
    await user.click(option);
    expect(select).toHaveTextContent("10");
  });

  test("should navigate to 404 page when the student id is invalid", async () => {
    useUserStore.setState({
      user: currentAdminUser,
    });
    indexRender("-1"); // 存在しない生徒ID
    expect(await screen.findByTestId("not-found")).toBeInTheDocument();
  });

  test("should render error message if student id is invalid", async () => {
    useUserStore.setState({
      user: currentAdminUser,
    });
    indexRender("9999"); // 存在しない生徒ID

    expect(
      await screen.findByText("生徒が見つかりませんでした。")
    ).toBeInTheDocument();
  });

  test("should render error message if api returns 404", async () => {
    useUserStore.setState({
      user: currentAdminUser,
    });
    server.use(
      http.get(`${VITE_API_BASE_URL}/api/v1/lesson_notes`, async () => {
        return HttpResponse.json(
          {
            errors: [
              {
                code: "NOT_FOUND",
                field: "base",
                message: "この科目の授業引継ぎノートは見つかりませんでした。",
              },
            ],
          },
          { status: 404 }
        );
      })
    );
    indexRender();

    expect(await screen.findByText("mockStudent One")).toBeInTheDocument();
    expect(
      await screen.findByText(
        "この科目の授業引継ぎノートは見つかりませんでした。"
      )
    ).toBeInTheDocument();
  });

  test("should render error message if api returns 404", async () => {
    useUserStore.setState({
      user: currentAdminUser,
    });
    server.use(
      http.get(`${VITE_API_BASE_URL}/api/v1/student_traits`, async () => {
        return HttpResponse.json(
          {
            errors: [
              {
                code: "NOT_FOUND",
                field: "base",
                message: "生徒の特性は見つかりませんでした。",
              },
            ],
          },
          { status: 404 }
        );
      })
    );
    indexRender();

    expect(
      await screen.findByText("生徒の特性は見つかりませんでした。")
    ).toBeInTheDocument();
  });
});
