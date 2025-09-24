import {
  TeachableSubjectCheckboxes,
  type TeachableSubjectCheckboxesProps,
} from "@/features/teachers/components/TeacherForm/parts/TeachableSubjectCheckboxes";
import { formatEditDataMock } from "@/tests/fixtures/teachers/teachers";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

describe("TeachableSubjectCheckboxes", () => {
  const wrapper = (props: TeachableSubjectCheckboxesProps) => {
    render(<TeachableSubjectCheckboxes {...props} />);
  };

  test("should render correctly", async () => {
    const user = userEvent.setup();
    const mockProps: TeachableSubjectCheckboxesProps = {
      formData: formatEditDataMock,
      onChange: vi.fn(() => {}),
    };

    wrapper(mockProps);

    const englishCheckbox = screen.getByRole("checkbox", { name: "英語" });
    expect(englishCheckbox).toBeInTheDocument();
    expect(englishCheckbox).toBeChecked();

    const mathCheckbox = screen.getByRole("checkbox", { name: "数学" });
    expect(mathCheckbox).toBeInTheDocument();
    expect(mathCheckbox).not.toBeChecked();

    // 英語を選択
    await user.click(englishCheckbox);
    expect(mockProps.onChange).toHaveBeenCalledWith("subjects", "english");
  });
  test("should show selected subjects as badges", async () => {
    const user = userEvent.setup();
    const mockProps: TeachableSubjectCheckboxesProps = {
      formData: {
        ...formatEditDataMock,
        subjects: ["english", "mathematics"], // 英語と数学を選択
      },
      onChange: vi.fn(() => {}),
    };

    wrapper(mockProps);
    const englishBadge = screen.getByLabelText(/英語 を削除/);
    expect(englishBadge).toBeInTheDocument();
    const mathBadge = screen.getByLabelText(/数学 を削除/);
    expect(mathBadge).toBeInTheDocument();

    // バッジをクリックして削除
    await user.click(englishBadge);
    expect(mockProps.onChange).toHaveBeenCalledWith("subjects", "english");
  });

  test("should not show badges when no subjects selected", () => {
    const mockProps: TeachableSubjectCheckboxesProps = {
      formData: {
        ...formatEditDataMock,
        subjects: ["unknown"], // 存在しない科目
      },
      onChange: vi.fn(() => {}),
    };

    wrapper(mockProps);

    const unknownBadge = screen.getByLabelText(/不明な科目 を削除/);
    expect(unknownBadge).toBeInTheDocument();
  });
});
