import {
  StudentSiteHoverCard,
  type HoverCardGenericProps,
} from "@/features/studentDashboard/components/dashboard/StudentSiteHoverCard";
import { useIsMobile } from "@/hooks/useMobile";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

const wrapper = (props: HoverCardGenericProps) => {
  render(<StudentSiteHoverCard {...props} />);
};

vi.mock("@/hooks/useMobile", () => {
  return {
    useIsMobile: vi.fn(),
  };
});

describe("StudentSiteHoverCard", () => {
  test("renders correctly", async () => {
    const user = userEvent.setup();
    const mockProps: HoverCardGenericProps = {
      name: "mockStudent One",
      grade: "高校3年",
      desiredSchool: "Stanford university",
    };
    vi.mocked(useIsMobile).mockReturnValue(false);
    wrapper(mockProps);

    const trigger = screen.getByRole("button", {
      name: /氏名 mockStudent One/i,
    });
    await user.hover(trigger);

    expect(await screen.findByText(mockProps.grade)).toBeInTheDocument();
    expect(screen.getByText(mockProps.desiredSchool)).toBeInTheDocument();
  });

  test("renders correctly on mobile", async () => {
    const user = userEvent.setup();
    const mockProps: HoverCardGenericProps = {
      name: "mockStudent One",
      grade: "高校3年",
      desiredSchool: "Stanford university",
    };
    vi.mocked(useIsMobile).mockReturnValue(true);
    wrapper(mockProps);

    const trigger = screen.getByRole("button", {
      name: /氏名 mockStudent One/i,
    });
    await user.click(trigger);

    expect(await screen.findByText(mockProps.grade)).toBeInTheDocument();
    expect(screen.getByText(mockProps.desiredSchool)).toBeInTheDocument();
  });
});
