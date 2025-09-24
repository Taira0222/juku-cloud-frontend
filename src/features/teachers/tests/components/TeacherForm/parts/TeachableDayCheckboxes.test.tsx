import {
  TeachableDayCheckboxes,
  type TeachableDayCheckboxesProps,
} from "@/features/teachers/components/TeacherForm/parts/TeachableDayCheckboxes";
import { formatEditDataMock } from "@/tests/fixtures/teachers/teachers";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

describe("TeachableDayCheckboxes", () => {
  const wrapper = (props: TeachableDayCheckboxesProps) => {
    render(<TeachableDayCheckboxes {...props} />);
  };

  test("should render correctly", async () => {
    const user = userEvent.setup();
    const mockProps: TeachableDayCheckboxesProps = {
      formData: formatEditDataMock,
      onChange: vi.fn(() => {}),
    };

    wrapper(mockProps);
    const sundayCheckbox = screen.getByRole("checkbox", { name: "日曜日" });
    expect(sundayCheckbox).toBeInTheDocument();
    expect(sundayCheckbox).not.toBeChecked();

    const mondayCheckbox = screen.getByRole("checkbox", { name: "月曜日" });
    expect(mondayCheckbox).toBeInTheDocument();
    expect(mondayCheckbox).toBeChecked();

    // 月曜日を選択
    await user.click(mondayCheckbox);
    expect(mockProps.onChange).toHaveBeenCalledWith("available_days", "monday");
  });
});
