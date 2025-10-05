import {
  ExpireDatePicker,
  type ExpireDatePickerProps,
} from "@/features/lessonNotes/components/LessonNoteForm/parts/ExpireDatePicker";

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { format } from "date-fns";
import { describe, expect, test, vi } from "vitest";

describe("ExpireDatePicker", () => {
  const wrapper = (props: ExpireDatePickerProps) => {
    render(<ExpireDatePicker {...props} />);
  };

  test("should render correctly when expireDate is undefined", async () => {
    const user = userEvent.setup();
    const mockProps: ExpireDatePickerProps = {
      expireDate: undefined,
      onChange: vi.fn(() => {}),
    };

    wrapper(mockProps);

    const dayButton = screen.getByRole("button", { name: /有効期限/ });
    expect(dayButton).toBeInTheDocument();

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

  test("should render correctly when expireDate is given", async () => {
    const user = userEvent.setup();
    const todayISOString = format(new Date(), "yyyy-MM-dd");
    const tomorrowISOString = format(
      new Date(Date.now() + 24 * 60 * 60 * 1000),
      "yyyy-MM-dd"
    );
    const mockProps: ExpireDatePickerProps = {
      expireDate: todayISOString,
      onChange: vi.fn(() => {}),
    };

    wrapper(mockProps);

    const dayButton = screen.getByRole("button", { name: /有効期限/ });
    expect(dayButton).toBeInTheDocument();

    // カレンダー表示
    await user.click(dayButton);
    const calendar = screen.getByRole("dialog");
    expect(calendar).toBeInTheDocument();

    const dayCell = calendar.querySelector<HTMLTableCellElement>(
      `[data-day="${tomorrowISOString}"]`
    );
    expect(dayCell).toBeTruthy();

    await user.click(within(dayCell!).getByRole("button"));

    expect(mockProps.onChange).toHaveBeenCalledWith(tomorrowISOString);
    expect(calendar).not.toBeInTheDocument();
  });
});
