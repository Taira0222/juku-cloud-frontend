import { Toaster } from "@/components/ui/feedback/Sonner/sonner";
import { StudentsPage } from "@/pages/students/StudentsPage";
import type { ContextType } from "@/pages/students/type/students";
import { mockStudent1 } from "@/tests/fixtures/students/students";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

const deleteRender = (role: ContextType["role"] = "admin") => {
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/students"]}>
        <Toaster />
        <Routes>
          <Route element={<Layout context={{ role }} />}>
            <Route path="/students" element={<StudentsPage />} />
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

describe("Student Delete Page", () => {
  test("should display a list of students", async () => {
    const user = userEvent.setup();
    deleteRender();

    expect(await screen.findByText("mockStudent One")).toBeInTheDocument();

    const menuButton = getMenuButtonById(STUDENT1_ID);
    await user.click(menuButton);

    const deleteMenuButton = screen.getByRole("menuitem", { name: "削除" });
    await user.click(deleteMenuButton);

    expect(await screen.findByText("生徒を削除しますか？")).toBeInTheDocument();

    const nameInput = screen.getByLabelText("確認入力");
    await user.type(nameInput, "mockStudent One");
    expect(nameInput).toHaveValue("mockStudent One");

    const deleteButton = screen.getByLabelText(
      `生徒「${mockStudent1.name}」を削除する`
    );
    await user.click(deleteButton);

    expect(await screen.findByText("生徒を削除しました")).toBeInTheDocument();
  });
  test("should show a warning if the name does not match", async () => {
    const user = userEvent.setup();
    deleteRender();

    expect(await screen.findByText("mockStudent One")).toBeInTheDocument();

    const menuButton = getMenuButtonById(STUDENT1_ID);
    await user.click(menuButton);

    const deleteMenuButton = screen.getByRole("menuitem", { name: "削除" });
    await user.click(deleteMenuButton);

    expect(await screen.findByText("生徒を削除しますか？")).toBeInTheDocument();

    const nameInput = screen.getByLabelText("確認入力");
    await user.type(nameInput, "wrong name");
    expect(nameInput).toHaveValue("wrong name");

    const deleteButton = screen.getByLabelText(
      `生徒「${mockStudent1.name}」を削除する`
    );
    await user.click(deleteButton);

    expect(await screen.findByText("名前が一致しません。")).toBeInTheDocument();
  });

  test("should not display a form for deleting a student if the role is teacher", async () => {
    deleteRender("teacher");

    expect(await screen.findByText("mockStudent One")).toBeInTheDocument();

    const allMenuButtons = screen.queryAllByRole("button", {
      name: /open menu/i,
    });
    expect(allMenuButtons.length).toBe(0);
  });
});
