import { StudentsPage } from "@/pages/students/StudentsPage";
import type { ContextType } from "@/pages/students/type/students";
import { server } from "@/tests/fixtures/server/server";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import { describe, expect, test } from "vitest";

const Layout = ({ context }: { context: ContextType }) => {
  return <Outlet context={context} />;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const indexRender = (role: ContextType["role"] = "admin") => {
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/students"]}>
        <Routes>
          <Route element={<Layout context={{ role }} />}>
            <Route path="/students" element={<StudentsPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

describe("Student Index Page", () => {
  test("should display a list of students", async () => {
    const user = userEvent.setup();
    indexRender();

    expect(await screen.findByText("mockStudent One")).toBeInTheDocument();
    expect(await screen.findByText("mockStudent Two")).toBeInTheDocument();

    const studentListButton = screen.getByRole("combobox", {
      name: "表示切替",
    });
    expect(studentListButton).toBeInTheDocument();
    await user.click(studentListButton);

    const listbox = await screen.findByRole("listbox");
    const highSchoolOption = within(listbox).getByRole("option", {
      name: "高校3年",
    });
    await user.click(highSchoolOption);

    expect(await screen.findByText("mockStudent One")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText("mockStudent Two")).not.toBeInTheDocument();
    });
  });

  test("should work with pagination selector", async () => {
    const user = userEvent.setup();
    indexRender();

    // ページネーションのセレクターを取得してクリック
    const paginationSelector = screen.getByRole("combobox", {
      name: "1ページに表示する行数",
    });
    expect(paginationSelector).toBeInTheDocument();
    await user.click(paginationSelector);

    await user.click(screen.getByRole("option", { name: "20" }));
    expect(paginationSelector).toHaveTextContent("20");
  });

  test("should render error message if api returns 500", async () => {
    server.use(
      http.get(`${VITE_API_BASE_URL}/api/v1/students`, async () => {
        return HttpResponse.json(
          { errors: ["予期せぬエラーが発生しました。"] },
          { status: 500 }
        );
      })
    );

    indexRender();

    await waitFor(() => {
      expect(
        screen.getByText("予期せぬエラーが発生しました。")
      ).toBeInTheDocument();
    });
  });
});
