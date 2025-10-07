import { NameField, type NameProps } from "@/components/common/form/NameField";
import type { ValueKind, ValueType } from "@/components/common/form/type/form";
import { initialMockValue } from "@/tests/fixtures/students/students";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

describe("NameField", () => {
  const wrapper = (props: NameProps<ValueType, ValueKind>) => {
    render(<NameField {...props} />);
  };

  test("should render correctly when variant is Draft", async () => {
    const user = userEvent.setup();
    const mockProps: NameProps<ValueType, ValueKind> = {
      variant: "Draft",
      value: initialMockValue,
      onChange: vi.fn(() => () => {}),
    };

    wrapper(mockProps);
    // 必須の星があるので正規表現で取得
    const nameInput = screen.getByLabelText(/生徒の名前/);
    expect(nameInput).toBeInTheDocument();
    expect(nameInput).toHaveValue("");

    // 入力操作
    await user.type(nameInput, "山田太郎");
    expect(mockProps.onChange).toHaveBeenCalledWith("name");
  });
  test("should render correctly when variant is EditDraft", async () => {
    const user = userEvent.setup();
    const mockProps: NameProps<ValueType, ValueKind> = {
      variant: "EditDraft",
      value: initialMockValue,
      onChange: vi.fn(() => () => {}),
    };

    wrapper(mockProps);
    // 必須の星があるので正規表現で取得
    const nameInput = screen.getByLabelText(/生徒の名前/);
    expect(nameInput).toBeInTheDocument();
    expect(nameInput).toHaveValue("");

    // 入力操作
    await user.type(nameInput, "山田太郎");
    expect(mockProps.onChange).toHaveBeenCalledWith("name");
  });
  test("should render correctly when variant is TeacherFormData", async () => {
    const user = userEvent.setup();
    const mockProps: NameProps<ValueType, ValueKind> = {
      variant: "TeacherFormData",
      value: initialMockValue,
      onChange: vi.fn(() => () => {}),
    };

    wrapper(mockProps);
    // 必須の星があるので正規表現で取得
    const nameInput = screen.getByLabelText(/講師の名前/);
    expect(nameInput).toBeInTheDocument();
    expect(nameInput).toHaveValue("");

    // 入力操作
    await user.type(nameInput, "山田太郎");
    expect(mockProps.onChange).toHaveBeenCalledWith("name");
  });
});
