import {
  StudentTraitList,
  type StudentTraitListProps,
} from "@/features/studentTraits/components/list/StudentTraitList";
import { mockStudentTraits } from "@/tests/fixtures/studentTraits/studentTraits";
import { render, screen } from "@testing-library/react";

import { describe, expect, test } from "vitest";

describe("StudentTraitList", () => {
  test("renders correctly when there are good traits and is not mobile", async () => {
    const mockProps: StudentTraitListProps = {
      cardTitle: "よい特性",
      traits: mockStudentTraits.filter((t) => t.category === "good"),
      isMobile: false,
      category: "good",
    };
    render(<StudentTraitList {...mockProps} />);
    const element = await screen.findByText("よい特性");
    expect(element.parentElement).toHaveClass("border-l-emerald-200");
    const cardTitle = await screen.findByText("よい特性");
    expect(cardTitle).toHaveClass("text-sm");
    expect(screen.getByTestId("check-icon")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem").length).toBe(5);
    expect(screen.queryByText("特性が登録されていません")).toBeNull();
  });

  test("renders correctly when there are careful traits and is mobile", async () => {
    const mockProps: StudentTraitListProps = {
      cardTitle: "注意すべき特性",
      traits: mockStudentTraits.filter((t) => t.category === "careful"),
      isMobile: true,
      category: "careful",
    };
    render(<StudentTraitList {...mockProps} />);
    const element = await screen.findByText("注意すべき特性");
    expect(element.parentElement).toHaveClass("border-l-amber-200");
    const cardTitle = await screen.findByText("注意すべき特性");
    expect(cardTitle).toHaveClass("text-xs");
    expect(screen.getByTestId("alert-icon")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem").length).toBe(5);
    expect(screen.queryByText("特性が登録されていません")).toBeNull();
  });

  test("renders correctly when there are no traits", async () => {
    const mockProps: StudentTraitListProps = {
      cardTitle: "よい特性",
      traits: [],
      isMobile: false,
      category: "good",
    };
    render(<StudentTraitList {...mockProps} />);
    const element = await screen.findByText("よい特性");
    expect(element.parentElement).toHaveClass("border-l-emerald-200");
    const cardTitle = await screen.findByText("よい特性");
    expect(cardTitle).toHaveClass("text-sm");
    expect(screen.getByTestId("check-icon")).toBeInTheDocument();
    const noTraitsMessage = await screen.findByText("特性が登録されていません");
    expect(noTraitsMessage).toHaveClass("text-sm");
    expect(screen.queryAllByRole("listitem").length).toBe(0);
  });
});
