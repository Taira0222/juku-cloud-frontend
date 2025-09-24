import { describe, expect, test } from "vitest";
import type { TeacherFormData } from "../../types/teacherForm";
import { TeacherFormHandler } from "../../utils/TeacherFormHandler";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { formatEditDataMock } from "@/tests/fixtures/teachers/teachers";

const makeOnChangeHarness = (initial: TeacherFormData) => {
  // initial をクローンして state として保持(initial は変更されない)
  let state = structuredClone(initial);
  // update の関数があればそれを使用する
  const onChange = (
    updater: TeacherFormData | ((prev: TeacherFormData) => TeacherFormData)
  ) => {
    state = typeof updater === "function" ? updater(state) : updater;
  };
  return { onChange, get: () => state };
};

describe("TeacherFormHandler", () => {
  test("handleInputChange", async () => {
    const user = userEvent.setup();
    const h = makeOnChangeHarness(formatEditDataMock);
    const { handleInputChange } = TeacherFormHandler(h.onChange);
    render(
      <input onChange={handleInputChange("name")} data-testid="name-input" />
    );
    const input = screen.getByTestId("name-input");
    await user.clear(input);
    await user.type(input, "John Doe");

    expect(h.get().name).toBe("John Doe");
  });

  test("handleSelectEmployment", () => {
    const h = makeOnChangeHarness(formatEditDataMock);
    const { handleSelectEmployment } = TeacherFormHandler(h.onChange);
    handleSelectEmployment("inactive");

    expect(h.get().employment_status).toBe("inactive");
  });

  test("toggleInArray", () => {
    const h = makeOnChangeHarness(formatEditDataMock);
    const { toggleInArray } = TeacherFormHandler(h.onChange);

    // subjects に "mathmatics" を追加
    toggleInArray("subjects", "mathmatics");
    expect(h.get().subjects).toEqual(["english", "science", "mathmatics"]);

    // subjects から "science" を削除
    toggleInArray("subjects", "science");
    expect(h.get().subjects).toEqual(["english", "mathmatics"]);

    // available_days に "friday" を追加
    toggleInArray("available_days", "friday");
    expect(h.get().available_days).toEqual(["monday", "wednesday", "friday"]);

    // available_days から "monday" を削除
    toggleInArray("available_days", "monday");
    expect(h.get().available_days).toEqual(["wednesday", "friday"]);
  });
});
