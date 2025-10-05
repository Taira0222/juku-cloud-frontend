import {
  TitleField,
  type TitleFieldProps,
} from "@/features/lessonNotes/components/LessonNoteForm/parts/TitleField";
import type { Mode } from "@/features/students/types/studentForm";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

describe("TitleField", () => {
  const wrapper = (props: TitleFieldProps<Mode>) => {
    render(<TitleField {...props} />);
  };

  test("should render correctly when mode is create", async () => {
    const user = userEvent.setup();
    const mockProps: TitleFieldProps<"create"> = {
      title: "",
      onChange: vi.fn(() => () => {}),
    };

    wrapper(mockProps);
    // 必須の星があるので正規表現で取得
    const titleInput = screen.getByLabelText(/タイトル/);
    expect(titleInput).toBeInTheDocument();
    expect(titleInput).toHaveValue("");

    // 入力操作
    await user.type(titleInput, "新規作成");
    expect(mockProps.onChange).toHaveBeenCalledWith("title");
  });
  test("should render correctly when mode is edit", async () => {
    const user = userEvent.setup();
    const mockProps: TitleFieldProps<"edit"> = {
      title: "英語の宿題",
      onChange: vi.fn(() => () => {}),
    };

    wrapper(mockProps);
    // 必須の星があるので正規表現で取得
    const titleInput = screen.getByLabelText(/タイトル/);
    expect(titleInput).toBeInTheDocument();
    expect(titleInput).toHaveValue("英語の宿題");

    // 入力操作
    await user.clear(titleInput);
    await user.type(titleInput, "更新");
    expect(mockProps.onChange).toHaveBeenCalledWith("title");
  });
});
