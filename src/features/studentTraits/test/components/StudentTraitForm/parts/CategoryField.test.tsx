import {
  CategoryField,
  type CategoryFieldProps,
} from "@/features/studentTraits/components/StudentTraitForm/parts/CategoryField";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

const wrapper = (props: CategoryFieldProps) => {
  render(<CategoryField {...props} />);
};

describe("CategoryField", () => {
  test("renders correctly", () => {
    const mockProps: CategoryFieldProps = {
      category: "good",
    };

    wrapper(mockProps);

    expect(screen.getByText("特性")).toBeInTheDocument();
    expect(screen.getByText("よい特性")).toBeInTheDocument();
  });

  test("renders '不明な特性' when category is not found", () => {
    const mockProps: CategoryFieldProps = {
      category: undefined,
    };

    wrapper(mockProps);

    expect(screen.getByText("不明な特性")).toBeInTheDocument();
  });
});
