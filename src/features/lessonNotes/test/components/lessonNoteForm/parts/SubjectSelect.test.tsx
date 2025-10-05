import {
  SubjectSelect,
  type SubjectSelectProps,
} from "@/features/lessonNotes/components/LessonNoteForm/parts/SubjectSelect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

describe("SubjectSelect", () => {
  const wrapper = (props: SubjectSelectProps) => {
    render(<SubjectSelect {...props} />);
  };

  test("should render correctly when subjectId is provided", async () => {
    const user = userEvent.setup();
    const mockProps: SubjectSelectProps = {
      subjects: [
        { id: 1, name: "english" },
        { id: 2, name: "mathematics" },
      ],
      onChange: vi.fn(() => {}),
    };

    wrapper(mockProps);

    const selectTrigger = screen.getByLabelText(/科目を選択/);
    expect(selectTrigger).toBeInTheDocument();
    await user.click(selectTrigger);

    const englishOption = screen.getByRole("option", { name: "英語" });
    await user.click(englishOption);
    expect(mockProps.onChange).toHaveBeenCalledWith(1);
  });
});
