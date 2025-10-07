import {
  DescriptionField,
  type DescriptionFieldProps,
} from "@/components/common/form/DescriptionField";
import type { Variant } from "@/components/common/form/type/form";
import type { Mode } from "@/features/students/types/studentForm";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

describe("DescriptionField", () => {
  const wrapper = (props: DescriptionFieldProps<Mode, Variant>) => {
    render(<DescriptionField {...props} />);
  };

  test("should render correctly when variant is lessonNote and mode is create", async () => {
    const user = userEvent.setup();
    const mockProps: DescriptionFieldProps<"create", "lessonNote"> = {
      variant: "lessonNote",
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
  test("should render correctly when variant is lessonNote and mode is edit", async () => {
    const user = userEvent.setup();
    const mockProps: DescriptionFieldProps<"edit", "lessonNote"> = {
      variant: "lessonNote",
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
  test("should render correctly when variant is studentTrait and mode is create", async () => {
    const user = userEvent.setup();
    const mockProps: DescriptionFieldProps<"create", "studentTrait"> = {
      variant: "studentTrait",
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
  test("should render correctly when variant is studentTrait and mode is edit", async () => {
    const user = userEvent.setup();
    const mockProps: DescriptionFieldProps<"edit", "studentTrait"> = {
      variant: "studentTrait",
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
