import {
  StudentSiteHoverCard,
  type HoverCardGenericProps,
} from "@/features/studentDashboard/components/dashboard/StudentSiteHoverCard";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

const wrapper = (props: HoverCardGenericProps) => {
  render(<StudentSiteHoverCard {...props} />);
};

describe("StudentSiteHoverCard", () => {
  test("renders correctly", async () => {
    const user = userEvent.setup();
    const mockProps: HoverCardGenericProps = {
      name: "mockStudent One",
      grade: "高校3年",
      desiredSchool: "Stanford university",
    };
    wrapper(mockProps);

    const trigger = screen.getByRole("button", {
      name: /氏名 mockStudent One/i,
    });
    await user.hover(trigger);

    expect(await screen.findByText(mockProps.grade)).toBeInTheDocument();
    expect(screen.getByText(mockProps.desiredSchool)).toBeInTheDocument();
  });
});
