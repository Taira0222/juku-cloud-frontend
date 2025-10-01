import {
  JoinedOnPicker,
  type JoinedOnPickerProps,
} from "@/features/students/components/StudentForm/parts/JoinedOnPicker";
import { initialMockValue } from "@/tests/fixtures/students/students";

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { format } from "date-fns";
import { describe, expect, test, vi } from "vitest";

describe("JoinedOnPicker", () => {
  const wrapper = (props: JoinedOnPickerProps) => {
    render(<JoinedOnPicker {...props} />);
  };

  test("should render correctly", async () => {
    const user = userEvent.setup();
    const mockProps: JoinedOnPickerProps = {
      value: initialMockValue,
      onChange: vi.fn(() => {}),
    };

    wrapper(mockProps);

    const dayButton = screen.getByRole("button", { name: /入塾日/ });
    expect(dayButton).toBeInTheDocument();
    expect(dayButton).toHaveTextContent("日付を選択");

    // カレンダー表示
    await user.click(dayButton);
    const calendar = screen.getByRole("dialog");
    expect(calendar).toBeInTheDocument();

    const isoToday = format(new Date(), "yyyy-MM-dd");
    const dayCell = calendar.querySelector<HTMLTableCellElement>(
      `[data-day="${isoToday}"]`
    );
    expect(dayCell).toBeTruthy();

    await user.click(within(dayCell!).getByRole("button"));

    expect(mockProps.onChange).toHaveBeenCalledWith(isoToday);
    expect(calendar).not.toBeInTheDocument();
  });
});
