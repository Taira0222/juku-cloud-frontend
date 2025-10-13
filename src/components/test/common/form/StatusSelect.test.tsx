import {
  StatusSelect,
  type StatusSelectProps,
} from "@/components/common/form/StatusSelect";
import type { ValueKind } from "@/components/common/form/type/form";
import { initialMockValue } from "@/tests/fixtures/students/students";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

describe("StatusSelect", () => {
  const wrapper = (props: StatusSelectProps<ValueKind>) => {
    render(<StatusSelect {...props} />);
  };

  test("should render correctly when variant is Draft", async () => {
    const user = userEvent.setup();
    const mockProps: StatusSelectProps<ValueKind> = {
      variant: "Draft",
      status: initialMockValue.status,
      onChange: vi.fn(() => {}),
    };

    wrapper(mockProps);
    // 必須の星があるので正規表現で取得
    const selectStatus = screen.getByLabelText(/通塾状況/);
    expect(selectStatus).toBeInTheDocument();
    expect(selectStatus).toHaveValue("");

    // 選択操作
    await user.click(selectStatus);
    const option = screen.getByRole("option", { name: "通塾中" });
    await user.click(option);
    expect(mockProps.onChange).toHaveBeenCalledWith("active");
  });

  test("should render correctly when variant is EditDraft", async () => {
    const user = userEvent.setup();
    const mockProps: StatusSelectProps<ValueKind> = {
      variant: "EditDraft",
      status: initialMockValue.status,
      onChange: vi.fn(() => {}),
    };

    wrapper(mockProps);
    // 必須の星があるので正規表現で取得
    const selectStatus = screen.getByLabelText(/通塾状況/);
    expect(selectStatus).toBeInTheDocument();
    expect(selectStatus).toHaveValue("");

    // 選択操作
    await user.click(selectStatus);
    const option = screen.getByRole("option", { name: "通塾中" });
    await user.click(option);
    expect(mockProps.onChange).toHaveBeenCalledWith("active");
  });

  test("should render correctly when variant is TeacherFormData", async () => {
    const user = userEvent.setup();
    const mockProps: StatusSelectProps<ValueKind> = {
      variant: "TeacherFormData",
      status: "inactive",
      onChange: vi.fn(() => {}),
    };

    wrapper(mockProps);
    // 必須の星があるので正規表現で取得
    const selectStatus = screen.getByLabelText(/出勤状況/);
    expect(selectStatus).toBeInTheDocument();
    expect(selectStatus).toHaveValue("");

    // 選択操作
    await user.click(selectStatus);
    const option = screen.getByRole("option", { name: "在籍" });
    await user.click(option);
    expect(mockProps.onChange).toHaveBeenCalledWith("active");
  });
});
