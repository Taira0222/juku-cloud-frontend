import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import { ManagementDashboard } from "../ManagementDashboard";
import { type User } from "@/stores/userStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const Layout = ({ context }: { context: User }) => {
  return <Outlet context={context} />;
};

const managementRender = (userInfo: User) => {
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route element={<Layout context={userInfo} />}>
            <Route index element={<ManagementDashboard />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe("ManagementDashboard component unit tests", () => {
  test("renders ManagementDashboard component for admin ", () => {
    const userInfo: User = {
      id: 1,
      name: "admin user",
      email: "admin@example.com",
      role: "admin",
      school: "First_school",
    };

    managementRender(userInfo);

    const studentsLink = screen.getByText("生徒一覧");
    const teachersLink = screen.getByText("講師一覧");

    expect(studentsLink).toBeInTheDocument();
    expect(teachersLink).toBeInTheDocument();
  });

  test("renders ManagementDashboard component for teacher", () => {
    const userInfo: User = {
      id: 2,
      name: "teacher user",
      email: "teacher@example.com",
      role: "teacher",
      school: "First_school",
    };

    managementRender(userInfo);

    const studentsLink = screen.getByText("生徒一覧");

    expect(studentsLink).toBeInTheDocument();
    expect(screen.queryByText("講師一覧")).not.toBeInTheDocument();
  });
});
