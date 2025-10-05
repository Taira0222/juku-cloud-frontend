import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { lessonNoteFormHandlers } from "../../utils/lessonNoteFormHandlers";
import type { LessonNoteFormValuesByMode } from "../../types/lessonNoteForm";
import type { Mode } from "@/features/students/types/studentForm";
import {
  initialLessonFormCreateMockValue,
  initialLessonFormEditMockValue,
} from "@/tests/fixtures/lessonNotes/lessonNotes";

const makeOnChangeHarness = <M extends Mode>(
  initial: LessonNoteFormValuesByMode<M>
) => {
  // initial をクローンして state として保持(initial は変更されない)
  let state = structuredClone(initial);
  // update の関数があればそれを使用する
  const onChange = (
    updater:
      | LessonNoteFormValuesByMode<M>
      | ((prev: LessonNoteFormValuesByMode<M>) => LessonNoteFormValuesByMode<M>)
  ) => {
    state = typeof updater === "function" ? updater(state) : updater;
  };
  return { onChange, get: () => state };
};

describe("lessonNoteFormHandlers", () => {
  test("handleInputChange updates the input field value when mode is create", async () => {
    const h = makeOnChangeHarness<"create">(initialLessonFormCreateMockValue);
    const user = userEvent.setup();
    const { handleInputChange } = lessonNoteFormHandlers<"create">(h.onChange);

    render(
      <input onChange={handleInputChange("title")} data-testid="title-input" />
    );
    const input = screen.getByTestId("title-input");
    await user.type(input, "新しいタイトル");

    expect(h.get().title).toBe("新しいタイトル");
  });

  test("handleInputChange updates the input field value when mode is edit", async () => {
    const h = makeOnChangeHarness<"edit">(initialLessonFormEditMockValue);
    const user = userEvent.setup();
    const { handleInputChange } = lessonNoteFormHandlers<"edit">(h.onChange);

    render(
      <input onChange={handleInputChange("title")} data-testid="title-input" />
    );
    const input = screen.getByTestId("title-input");
    await user.clear(input);
    await user.type(input, "新しいタイトル");

    expect(h.get().title).toBe("新しいタイトル");
  });

  test("handleTextAreaChange updates the textarea field value when mode is create", async () => {
    const h = makeOnChangeHarness<"create">(initialLessonFormCreateMockValue);
    const user = userEvent.setup();
    const { handleTextAreaChange } = lessonNoteFormHandlers<"create">(
      h.onChange
    );

    render(
      <textarea
        onChange={handleTextAreaChange("description")}
        data-testid="description-textarea"
      />
    );
    const textarea = screen.getByTestId("description-textarea");
    await user.type(textarea, "新しい詳細説明");

    expect(h.get().description).toBe("新しい詳細説明");
  });

  test("handleTextAreaChange updates the textarea field value when mode is edit", async () => {
    const h = makeOnChangeHarness<"edit">(initialLessonFormEditMockValue);
    const user = userEvent.setup();
    const { handleTextAreaChange } = lessonNoteFormHandlers<"edit">(h.onChange);

    render(
      <textarea
        onChange={handleTextAreaChange("description")}
        data-testid="description-textarea"
      />
    );
    const textarea = screen.getByTestId("description-textarea");
    await user.clear(textarea);
    await user.type(textarea, "新しい詳細説明");

    expect(h.get().description).toBe("新しい詳細説明");
  });

  test("handleSelectChange updates the select field value when mode is create", () => {
    const h = makeOnChangeHarness<"create">(initialLessonFormCreateMockValue);
    const { handleSelectChange } = lessonNoteFormHandlers<"create">(h.onChange);

    handleSelectChange("note_type")("lesson");
    expect(h.get().note_type).toBe("lesson");
  });

  test("handleSelectChange updates the select field value when mode is edit", () => {
    const h = makeOnChangeHarness<"edit">(initialLessonFormEditMockValue);
    const { handleSelectChange } = lessonNoteFormHandlers<"edit">(h.onChange);

    handleSelectChange("subject_id")(2);
    expect(h.get().subject_id).toBe(2);
  });
});
