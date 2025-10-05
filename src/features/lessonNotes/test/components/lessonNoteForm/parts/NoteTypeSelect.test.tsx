import {
  NoteTypeSelect,
  type NoteTypeSelectProps,
} from "@/features/lessonNotes/components/LessonNoteForm/parts/NoteTypeSelect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

describe("NoteTypeSelect", () => {
  const wrapper = (props: NoteTypeSelectProps) => {
    render(<NoteTypeSelect {...props} />);
  };

  test("should render correctly when noteType is undefined", async () => {
    const user = userEvent.setup();
    const mockProps: NoteTypeSelectProps = {
      noteType: undefined,
      onChange: vi.fn(() => {}),
    };

    wrapper(mockProps);

    const selectTrigger = screen.getByLabelText(/分類を選択/);
    expect(selectTrigger).toBeInTheDocument();
    await user.click(selectTrigger);

    const option = screen.getByRole("option", { name: "宿題" });
    await user.click(option);
    expect(mockProps.onChange).toHaveBeenCalledWith("homework");
  });

  test("should render correctly when noteType is defined", async () => {
    const user = userEvent.setup();
    const mockProps: NoteTypeSelectProps = {
      noteType: "lesson",
      onChange: vi.fn(() => {}),
    };

    wrapper(mockProps);

    const selectTrigger = screen.getByLabelText(/分類を選択/);
    expect(selectTrigger).toBeInTheDocument();
    expect(screen.getByText("授業")).toBeInTheDocument();
    await user.click(selectTrigger);

    const option = screen.getByRole("option", { name: "宿題" });
    await user.click(option);
    expect(mockProps.onChange).toHaveBeenCalledWith("homework");
  });
});
