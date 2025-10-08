import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Mode } from "@/features/students/types/studentForm";
import type { StudentTraitFormValuesByMode } from "../../types/studentTraitForm";
import { studentTraitFormHandlers } from "../../utils/studentTraitHandlers";
import {
  initialStudentTraitFormCreateMockValue,
  initialStudentTraitFormEditMockValue,
} from "@/tests/fixtures/studentTraits/studentTraits";

const makeOnChangeHarness = <M extends Mode>(
  initial: StudentTraitFormValuesByMode<M>
) => {
  // initial をクローンして state として保持(initial は変更されない)
  let state = structuredClone(initial);
  // update の関数があればそれを使用する
  const onChange = (
    updater:
      | StudentTraitFormValuesByMode<M>
      | ((
          prev: StudentTraitFormValuesByMode<M>
        ) => StudentTraitFormValuesByMode<M>)
  ) => {
    state = typeof updater === "function" ? updater(state) : updater;
  };
  return { onChange, get: () => state };
};

describe("studentTraitFormHandlers", () => {
  test("handleInputChange updates the input field value when mode is create", async () => {
    const h = makeOnChangeHarness<"create">(
      initialStudentTraitFormCreateMockValue
    );
    const user = userEvent.setup();
    const { handleInputChange } = studentTraitFormHandlers<"create">(
      h.onChange
    );

    render(
      <input onChange={handleInputChange("title")} data-testid="title-input" />
    );
    const input = screen.getByTestId("title-input");
    await user.type(input, "新しいタイトル");

    expect(h.get().title).toBe("新しいタイトル");
  });

  test("handleInputChange updates the input field value when mode is edit", async () => {
    const h = makeOnChangeHarness<"edit">(initialStudentTraitFormEditMockValue);
    const user = userEvent.setup();
    const { handleInputChange } = studentTraitFormHandlers<"edit">(h.onChange);

    render(
      <input onChange={handleInputChange("title")} data-testid="title-input" />
    );
    const input = screen.getByTestId("title-input");
    await user.clear(input);
    await user.type(input, "新しいタイトル");

    expect(h.get().title).toBe("新しいタイトル");
  });

  test("handleTextAreaChange updates the textarea field value when mode is create", async () => {
    const h = makeOnChangeHarness<"create">(
      initialStudentTraitFormCreateMockValue
    );
    const user = userEvent.setup();
    const { handleTextAreaChange } = studentTraitFormHandlers<"create">(
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
    const h = makeOnChangeHarness<"edit">(initialStudentTraitFormEditMockValue);
    const user = userEvent.setup();
    const { handleTextAreaChange } = studentTraitFormHandlers<"edit">(
      h.onChange
    );

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
    const h = makeOnChangeHarness<"create">(
      initialStudentTraitFormCreateMockValue
    );
    const { handleSelectChange } = studentTraitFormHandlers<"create">(
      h.onChange
    );

    handleSelectChange("category")("good");
    expect(h.get().category).toBe("good");
  });

  test("handleSelectChange updates the select field value when mode is edit", () => {
    const h = makeOnChangeHarness<"edit">(initialStudentTraitFormEditMockValue);
    const { handleSelectChange } = studentTraitFormHandlers<"edit">(h.onChange);

    handleSelectChange("category")("good");
    expect(h.get().category).toBe("good");
  });
});
