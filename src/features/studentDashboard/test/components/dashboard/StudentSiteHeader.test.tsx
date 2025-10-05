import { SidebarProvider } from "@/components/ui/layout/Sidebar/sidebar";
import {
  StudentSiteHeader,
  type SiteHeaderProps,
} from "@/features/studentDashboard/components/dashboard/StudentSiteHeader";

import { useIsMobile } from "@/hooks/useMobile";
import { studentDetailMock } from "@/tests/fixtures/students/students";
import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

const wrapper = (props: SiteHeaderProps) => {
  render(
    <SidebarProvider>
      <StudentSiteHeader {...props} />
    </SidebarProvider>
  );
};

vi.mock("@/hooks/useMobile", () => ({
  useIsMobile: vi.fn(),
}));

describe("StudentSiteHeader", () => {
  test("renders correctly", () => {
    const mockProps: SiteHeaderProps = {
      school: "Test School",
      data: studentDetailMock,
    };
    vi.mocked(useIsMobile).mockReturnValue(false);
    wrapper(mockProps);

    expect(screen.getByText("高校3年")).toBeInTheDocument();
    expect(screen.getByText("mockStudent One")).toBeInTheDocument();
    expect(screen.getByText("Stanford university")).toBeInTheDocument();
    expect(screen.getByText("Test School")).toBeInTheDocument();
  });

  test("renders correctly on mobile", () => {
    const mockProps: SiteHeaderProps = {
      school: "Test School",
      data: studentDetailMock,
    };
    vi.mocked(useIsMobile).mockReturnValue(true);
    wrapper(mockProps);

    expect(screen.getByText("mockStudent One")).toBeInTheDocument();
    expect(screen.queryByText("Test School")).toBeInTheDocument();
  });
});
