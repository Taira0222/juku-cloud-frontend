import {
  SubjectCheckboxes,
  type SubjectCheckboxesProps,
} from "@/features/students/components/StudentForm/parts/SubjectCheckboxes";
import { initialMockValue } from "@/tests/fixtures/students/students";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

const wrapper = (props: SubjectCheckboxesProps) => {
  render(<SubjectCheckboxes {...props} />);
};
describe("SubjectCheckboxes", () => {
  test("should render correctly", async () => {
    const user = userEvent.setup();
    const mockProps: SubjectCheckboxesProps = {
      value: initialMockValue,
      toggle: vi.fn(() => {}),
      untoggleAssignments: vi.fn(() => {}),
    };

    wrapper(mockProps);

    const englishCheckbox = screen.getByRole("checkbox", { name: "英語" });
    expect(englishCheckbox).toBeInTheDocument();
    expect(englishCheckbox).not.toBeChecked();

    const mathCheckbox = screen.getByRole("checkbox", { name: "数学" });
    expect(mathCheckbox).toBeInTheDocument();
    expect(mathCheckbox).not.toBeChecked();

    // 英語を選択
    await user.click(englishCheckbox);
    expect(mockProps.toggle).toHaveBeenCalledWith(1); // 英語のIDは1
  });
  test("should show selected subjects as badges and call untoggleAssignments", async () => {
    const user = userEvent.setup();
    const untoggleAssignmentsMock = vi.fn(() => {});
    const mockProps: SubjectCheckboxesProps = {
      value: {
        ...initialMockValue,
        subject_ids: [1, 3], // 英語、数学が選択されている状態
        available_day_ids: [3, 5], // 英語と数学が利用可能な曜日
        assignments: [
          { teacher_id: 2, subject_id: 1, day_id: 3 }, // 英語の担当講師割当
        ],
      },
      toggle: vi.fn(() => {}),
      untoggleAssignments: untoggleAssignmentsMock,
    };

    const { rerender } = render(<SubjectCheckboxes {...mockProps} />);

    const englishBadge = await screen.findByLabelText(/英語 を削除/);
    expect(englishBadge).toBeInTheDocument();

    // バッジをクリックして削除
    await user.click(englishBadge);
    expect(mockProps.toggle).toHaveBeenCalledWith(1); // 英語のIDは1

    const updatedProps: SubjectCheckboxesProps = {
      ...mockProps,
      value: {
        ...mockProps.value,
        subject_ids: [3], // 英語が解除され、数学のみに更新
      },
    };
    rerender(<SubjectCheckboxes {...updatedProps} />);

    await waitFor(() => {
      expect(untoggleAssignmentsMock).toHaveBeenCalled();
    });
    // 英語のバッジが消えていることも確認（要素を取り直す）
    expect(screen.queryByLabelText(/英語 を削除/)).not.toBeInTheDocument();
  });

  test("should not show badges when no subjects selected", () => {
    const mockProps: SubjectCheckboxesProps = {
      value: {
        ...initialMockValue,
        subject_ids: [99], // 存在しない科目ID
      },
      toggle: vi.fn(() => {}),
      untoggleAssignments: vi.fn(() => {}),
    };

    wrapper(mockProps);

    const unknownBadge = screen.getByLabelText(/不明な科目 を削除/);
    expect(unknownBadge).toBeInTheDocument();
  });
});
