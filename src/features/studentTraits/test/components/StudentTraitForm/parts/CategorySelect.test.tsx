import {
  CategorySelect,
  type CategorySelectProps,
} from "@/features/studentTraits/components/StudentTraitForm/parts/CategorySelect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

describe("CategorySelect", () => {
  const wrapper = (props: CategorySelectProps) => {
    render(<CategorySelect {...props} />);
  };

  test("should render correctly when category is undefined", async () => {
    const user = userEvent.setup();
    const mockProps: CategorySelectProps = {
      category: undefined,
      onChange: vi.fn(() => {}),
    };

    wrapper(mockProps);

    const selectTrigger = screen.getByLabelText(/特性の種類を選択/);
    expect(selectTrigger).toBeInTheDocument();
    await user.click(selectTrigger);

    const option = screen.getByRole("option", { name: "よい特性" });
    await user.click(option);
    expect(mockProps.onChange).toHaveBeenCalledWith("good");
  });
});
