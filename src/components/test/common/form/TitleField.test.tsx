import {
  TitleField,
  type TitleFieldProps,
} from "@/components/common/form/TitleField";
import type { Variant } from "@/components/common/form/type/form";
import type { Mode } from "@/features/students/types/studentForm";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

describe("TitleField", () => {
  const wrapper = (props: TitleFieldProps<Mode, Variant>) => {
    render(<TitleField {...props} />);
  };

  test("should render correctly when variant is lessonNote and mode is create", async () => {
    const user = userEvent.setup();
    const mockProps: TitleFieldProps<"create", "lessonNote"> = {
      variant: "lessonNote",
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
  test("should render correctly when variant is lessonNote and mode is edit", async () => {
    const user = userEvent.setup();
    const mockProps: TitleFieldProps<"edit", "lessonNote"> = {
      variant: "lessonNote",
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
  test("should render correctly when variant is studentTrait and mode is create", async () => {
    const user = userEvent.setup();
    const mockProps: TitleFieldProps<"create", "studentTrait"> = {
      variant: "studentTrait",
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
  test("should render correctly when variant is studentTrait and mode is edit", async () => {
    const user = userEvent.setup();
    const mockProps: TitleFieldProps<"edit", "studentTrait"> = {
      variant: "studentTrait",
      title: "集中力がある",
      onChange: vi.fn(() => () => {}),
    };

    wrapper(mockProps);
    // 必須の星があるので正規表現で取得
    const titleInput = screen.getByLabelText(/タイトル/);
    expect(titleInput).toBeInTheDocument();
    expect(titleInput).toHaveValue("集中力がある");

    // 入力操作
    await user.clear(titleInput);
    await user.type(titleInput, "更新");
    expect(mockProps.onChange).toHaveBeenCalledWith("title");
  });
});
