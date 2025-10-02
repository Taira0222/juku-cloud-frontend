import { describe, expect, test } from "vitest";
import { getStudentDashboardData } from "../components/getStudentDashboardData";

describe("getStudentDashboardData", () => {
  test("navMain has 2 items for admin", () => {
    const result = getStudentDashboardData({
      role: "admin",
      user: { name: "admin user", email: "admin@example.com" },
      id: "123",
    });

    if (!result) {
      throw new Error("Failed to get student dashboard data");
    }
    const { navMain, user } = result;
    expect(user.name).toBe("admin user");
    expect(navMain).toHaveLength(2);
    expect(navMain.map((i) => i.url)).toEqual([
      "/dashboard/123",
      "/dashboard/123/student-traits",
    ]);
    // icon は存在していれば十分（関数/コンポーネント参照）
    navMain.forEach((item) => {
      expect(item.icon).toBeTruthy();
      expect(typeof item.title).toBe("string");
      expect(typeof item.url).toBe("string");
    });
  });

  test("navMain has 1 item for teacher", () => {
    const result = getStudentDashboardData({
      role: "teacher",
      user: { name: "teacher user", email: "teacher@example.com" },
      id: "123",
    });
    if (!result) {
      throw new Error("Failed to get student dashboard data");
    }
    const { navMain, user } = result;
    expect(user.name).toBe("teacher user");
    expect(navMain).toHaveLength(1);
    expect(navMain[0].url).toBe("/dashboard/123");
  });

  test("navMain has 1 item for empty", () => {
    const result = getStudentDashboardData({
      role: "",
      user: { name: "", email: "" },
      id: "123",
    });

    expect(result).toBeNull();
  });
});
