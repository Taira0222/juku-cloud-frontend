import { LessonNoteForm } from "@/features/lessonNotes/components/LessonNoteForm/LessonNoteForm";
import type { LessonNoteFormProps } from "@/features/lessonNotes/types/lessonNoteForm";
import type { Mode } from "@/features/students/types/studentForm";
import {
  initialLessonFormCreateMockValue,
  initialLessonFormEditMockValue,
  lessonNoteCreateFormMockValue,
  mockSubjects,
} from "@/tests/fixtures/lessonNotes/lessonNotes";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

describe("LessonNoteForm", () => {
  const wrapper = (props: LessonNoteFormProps<Mode>) => {
    render(<LessonNoteForm {...props} />);
  };

  test("should render correctly for create mode", () => {
    const mockProps: LessonNoteFormProps<"create"> = {
      mode: "create",
      value: initialLessonFormCreateMockValue,
      subjects: mockSubjects,
      onChange: vi.fn(() => {}),
      onSubmit: vi.fn(() => {}),
      loading: false,
    };

    wrapper(mockProps);

    expect(screen.getByLabelText(/科目を選択/)).toBeInTheDocument();
    expect(screen.getByLabelText(/タイトル/)).toBeInTheDocument();
    expect(screen.getByLabelText(/詳細説明/)).toBeInTheDocument();
    expect(screen.getByLabelText(/分類/)).toBeInTheDocument();
    expect(screen.getByLabelText(/有効期限/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "作成" })).toBeInTheDocument();
  });

  test("should render correctly for edit mode", () => {
    const mockProps: LessonNoteFormProps<"edit"> = {
      mode: "edit",
      value: initialLessonFormEditMockValue,
      subjects: mockSubjects,
      onChange: vi.fn(() => {}),
      onSubmit: vi.fn(() => {}),
      loading: false,
    };

    wrapper(mockProps);
    expect(screen.getByText(/科目/)).toBeInTheDocument();
    expect(screen.getByText("英語")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "更新" })).toBeInTheDocument();
  });

  test("should call onSubmit when submit button is clicked for create mode", async () => {
    const user = userEvent.setup();
    const mockProps: LessonNoteFormProps<"create"> = {
      mode: "create",
      value: lessonNoteCreateFormMockValue,
      subjects: mockSubjects,
      onChange: vi.fn(() => {}),
      onSubmit: vi.fn(() => {}),
      loading: false,
    };

    wrapper(mockProps);

    const createButton = screen.getByRole("button", { name: "作成" });
    expect(createButton).toBeInTheDocument();

    await user.click(createButton);
    expect(mockProps.onSubmit).toHaveBeenCalledWith(
      lessonNoteCreateFormMockValue
    );
  });

  test("should call onSubmit when submit button is clicked for edit mode", async () => {
    const user = userEvent.setup();
    const mockProps: LessonNoteFormProps<"edit"> = {
      mode: "edit",
      value: initialLessonFormEditMockValue,
      subjects: mockSubjects,
      onChange: vi.fn(() => {}),
      onSubmit: vi.fn(() => {}),
      loading: false,
    };

    wrapper(mockProps);

    const editButton = screen.getByRole("button", { name: "更新" });
    expect(editButton).toBeInTheDocument();

    await user.click(editButton);
    expect(mockProps.onSubmit).toHaveBeenCalledWith(
      initialLessonFormEditMockValue
    );
  });
});
