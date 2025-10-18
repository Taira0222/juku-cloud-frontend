import {
  DayCheckboxes,
  type DayCheckboxesProps,
} from "@/features/students/components/StudentForm/parts/DayCheckboxes";
import { initialMockValue } from "@/tests/fixtures/students/students";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

describe("DayCheckboxes", () => {
  const wrapper = (props: DayCheckboxesProps) => {
    render(<DayCheckboxes {...props} />);
  };

  test("should render correctly", async () => {
    const user = userEvent.setup();
    const mockProps: DayCheckboxesProps = {
      value: initialMockValue,
      toggle: vi.fn(() => {}),
      untoggleAssignments: vi.fn(() => {}),
    };

    wrapper(mockProps);
    const sundayCheckbox = screen.getByRole("checkbox", { name: "日曜日" });
    expect(sundayCheckbox).toBeInTheDocument();
    expect(sundayCheckbox).not.toBeChecked();

    const mondayCheckbox = screen.getByRole("checkbox", { name: "月曜日" });
    expect(mondayCheckbox).toBeInTheDocument();
    expect(mondayCheckbox).not.toBeChecked();

    // 月曜日を選択
    await user.click(mondayCheckbox);
    expect(mockProps.toggle).toHaveBeenCalledWith(2); // 月曜日のIDは2
  });

  test("should call untoggleAssignments when unchecking a day", async () => {
    const user = userEvent.setup();
    const untoggleAssignmentsMock = vi.fn(() => {});
    const mockProps: DayCheckboxesProps = {
      value: {
        ...initialMockValue,
        available_day_ids: [3], // 火曜日が選択されている状態
        assignments: [{ teacher_id: 2, subject_id: 1, day_id: 3 }],
      },
      toggle: vi.fn(() => {}),
      untoggleAssignments: untoggleAssignmentsMock,
    };

    const { rerender } = render(<DayCheckboxes {...mockProps} />);

    const tuesdayCheckbox = screen.getByRole("checkbox", { name: "火曜日" });
    expect(tuesdayCheckbox).toBeInTheDocument();
    expect(tuesdayCheckbox).toBeChecked();

    // 火曜日のチェックを外す（まずはトグルが呼ばれるだけ）
    await user.click(tuesdayCheckbox);
    expect(mockProps.toggle).toHaveBeenCalledWith(3); // 火曜日のIDは3

    const updatedProps: DayCheckboxesProps = {
      ...mockProps,
      value: {
        ...mockProps.value,
        available_day_ids: [], // 解除後の状態に更新
      },
    };
    rerender(<DayCheckboxes {...updatedProps} />);

    await waitFor(() => {
      expect(untoggleAssignmentsMock).toHaveBeenCalled();
    });

    // チェックが外れていることも確認（要素を取り直す）
    expect(screen.getByRole("checkbox", { name: "火曜日" })).not.toBeChecked();
  });
});
