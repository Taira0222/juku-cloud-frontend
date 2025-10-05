import {
  DescriptionField,
  type DescriptionFieldProps,
} from "@/features/lessonNotes/components/LessonNoteForm/parts/DescriptionField";
import type { Mode } from "@/features/students/types/studentForm";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

describe("DescriptionField", () => {
  const wrapper = (props: DescriptionFieldProps<Mode>) => {
    render(<DescriptionField {...props} />);
  };

  test("should render correctly when mode is create", async () => {
    const user = userEvent.setup();
    const mockProps: DescriptionFieldProps<"create"> = {
      description: null,
      onChange: vi.fn(() => () => {}),
    };

    wrapper(mockProps);
    // 必須の星があるので正規表現で取得
    const descriptionInput = screen.getByLabelText(/詳細説明/);
    expect(descriptionInput).toBeInTheDocument();
    expect(descriptionInput).toHaveValue("");

    // 入力操作
    await user.type(descriptionInput, "新規作成");
    expect(mockProps.onChange).toHaveBeenCalledWith("description");
  });
  test("should render correctly when mode is edit", async () => {
    const user = userEvent.setup();
    const mockProps: DescriptionFieldProps<"edit"> = {
      description: "編集時の詳細説明の初期値",
      onChange: vi.fn(() => () => {}),
    };

    wrapper(mockProps);
    // 必須の星があるので正規表現で取得
    const descriptionInput = screen.getByLabelText(/詳細説明/);
    expect(descriptionInput).toBeInTheDocument();
    expect(descriptionInput).toHaveValue("編集時の詳細説明の初期値");

    // 入力操作
    await user.clear(descriptionInput);
    await user.type(descriptionInput, "更新");
    expect(mockProps.onChange).toHaveBeenCalledWith("description");
  });
});
