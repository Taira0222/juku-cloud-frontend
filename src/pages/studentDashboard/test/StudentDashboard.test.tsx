import { RoleRoute } from "@/Router/RoleRoute";
import { render } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, test } from "vitest";
import { StudentDashboard } from "../StudentDashboard";

const NotFoundPage = () => <div data-testid="not-found">Not Found</div>;
const DashboardPage = () => <div data-testid="dashboard">Dashboard</div>;

const wrapper = (studentId: string = "1") => {
  render(
    <MemoryRouter initialEntries={[`/students/${studentId}/dashboard`]}>
      <Routes>
        <Route element={<RoleRoute allowedRoles={["admin", "teacher"]} />}>
          <Route element={<StudentDashboard />}>
            <Route
              path="/students/:studentId/dashboard"
              element={<DashboardPage />}
            />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </MemoryRouter>
  );
};

describe("StudentDashboard", () => {
  test("renders correctly", () => {
    // テスト内容をここに記述
  });
});
