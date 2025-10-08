import { describe, expect, test } from "vitest";
import {
  TraitHoverBadge,
  type TraitHoverBadgeProps,
} from "../../utils/traitHoverBadge";
import { render, screen } from "@testing-library/react";

describe("traitHoverBadge utils", () => {
  test("should render TraitIcon when category is good and isMobile is false", () => {
    const mockProps: TraitHoverBadgeProps = {
      category: "good",
      isMobile: false,
    };
    const { TraitIcon } = TraitHoverBadge(mockProps);
    render(<div>{TraitIcon}</div>);
    expect(screen.getByTestId("check-icon")).toHaveClass(
      "text-emerald-300 size-4"
    );
  });

  test("should render TraitIcon when category is good and isMobile is true", () => {
    const mockProps: TraitHoverBadgeProps = {
      category: "good",
      isMobile: true,
    };
    const { TraitIcon } = TraitHoverBadge(mockProps);
    render(<div>{TraitIcon}</div>);
    expect(screen.getByTestId("check-icon")).toHaveClass(
      "text-emerald-300 size-3"
    );
  });

  test("should render TraitIcon when category is careful and isMobile is false", () => {
    const mockProps: TraitHoverBadgeProps = {
      category: "careful",
      isMobile: false,
    };
    const { TraitIcon } = TraitHoverBadge(mockProps);
    render(<div>{TraitIcon}</div>);
    expect(screen.getByTestId("alert-icon")).toHaveClass(
      "text-amber-300 size-4"
    );
  });

  test("should render TraitIcon when category is careful and isMobile is true", () => {
    const mockProps: TraitHoverBadgeProps = {
      category: "careful",
      isMobile: true,
    };
    const { TraitIcon } = TraitHoverBadge(mockProps);
    render(<div>{TraitIcon}</div>);
    expect(screen.getByTestId("alert-icon")).toHaveClass(
      "text-amber-300 size-3"
    );
  });

  test("should render TraitBadge with correct styles when category is good and isMobile is false", () => {
    const mockProps: TraitHoverBadgeProps = {
      category: "good",
      isMobile: false,
    };
    const { TraitBadge } = TraitHoverBadge(mockProps);
    render(<div>{TraitBadge()}</div>);
    expect(screen.getByText("よい特性")).toBeInTheDocument();

    const badge = screen.getByTestId("trait-badge");
    const icon = screen.getByTestId("check-icon");
    expect(badge).toContainElement(icon);
    expect(badge).toHaveClass("text-muted-foreground px-1.5 mx-1 text-sm h-7");
  });

  test("should render TraitBadge with correct styles when category is good and isMobile is true", () => {
    const mockProps: TraitHoverBadgeProps = {
      category: "good",
      isMobile: true,
    };
    const { TraitBadge } = TraitHoverBadge(mockProps);
    render(<div>{TraitBadge()}</div>);
    expect(screen.getByText("よい特性")).toBeInTheDocument();

    const badge = screen.getByTestId("trait-badge");
    const icon = screen.getByTestId("check-icon");
    expect(badge).toContainElement(icon);
    expect(badge).toHaveClass("text-muted-foreground px-1.5 mx-1 text-xs h-6");
  });

  test("should render TraitBadge with correct styles when category is careful and isMobile is false", () => {
    const mockProps: TraitHoverBadgeProps = {
      category: "careful",
      isMobile: false,
    };
    const { TraitBadge } = TraitHoverBadge(mockProps);
    render(<div>{TraitBadge()}</div>);
    expect(screen.getByText("注意が必要な特性")).toBeInTheDocument();
    const badge = screen.getByTestId("trait-badge");
    const icon = screen.getByTestId("alert-icon");
    expect(badge).toContainElement(icon);
    expect(badge).toHaveClass("text-muted-foreground px-1.5 mx-1 text-sm h-7");
  });

  test("should render TraitBadge with correct styles when category is careful and isMobile is true", () => {
    const mockProps: TraitHoverBadgeProps = {
      category: "careful",
      isMobile: true,
    };
    const { TraitBadge } = TraitHoverBadge(mockProps);
    render(<div>{TraitBadge()}</div>);
    expect(screen.getByText("注意が必要な特性")).toBeInTheDocument();
    const badge = screen.getByTestId("trait-badge");
    const icon = screen.getByTestId("alert-icon");
    expect(badge).toContainElement(icon);
    expect(badge).toHaveClass("text-muted-foreground px-1.5 mx-1 text-xs h-6");
  });
});
