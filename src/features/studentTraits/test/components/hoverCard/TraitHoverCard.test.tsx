import {
  TraitHoverCard,
  type TraitHoverCardProps,
} from "@/features/studentTraits/components/hoverCard/TraitHoverCard";
import { mockStudentTraits } from "@/tests/fixtures/studentTraits/studentTraits";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

describe("TraitHoverCard", () => {
  const user = userEvent.setup();
  test("renders correctly when trait has description and isMobile is false", async () => {
    const mockProps: TraitHoverCardProps = {
      trait: mockStudentTraits[0],
      isMobile: false,
      className: "whitespace-nowrap",
    };

    render(<TraitHoverCard {...mockProps} />);

    const hoverCardButton = screen.getByRole("button", {
      name: mockProps.trait.title,
    });
    expect(hoverCardButton).toHaveClass("text-sm whitespace-nowrap");
    await user.hover(hoverCardButton);

    expect(await screen.findByText(mockProps.trait.title)).toBeInTheDocument();
    if (!mockProps.trait.description) {
      throw new Error("詳細説明がありません。");
    }
    expect(
      await screen.findByText(mockProps.trait.description)
    ).toBeInTheDocument();
  });

  test("renders correctly when trait has no description and isMobile is true", async () => {
    const mockProps: TraitHoverCardProps = {
      trait: { ...mockStudentTraits[0], description: null },
      isMobile: true,
    };
    render(<TraitHoverCard {...mockProps} />);
    const hoverCardButton = screen.getByRole("button", {
      name: mockProps.trait.title,
    });
    expect(hoverCardButton).toHaveClass("text-xs h-8");
    await user.hover(hoverCardButton);

    expect(await screen.findByText(mockProps.trait.title)).toBeInTheDocument();
    expect(
      await screen.findByText("詳細説明はありません。")
    ).toBeInTheDocument();
  });
});
