import type { Mode } from "@/features/students/types/studentForm";
import { StudentTraitForm } from "@/features/studentTraits/components/StudentTraitForm/StudentTraitForm";
import type { StudentTraitFormProps } from "@/features/studentTraits/types/studentTraitForm";
import {
  initialStudentTraitFormCreateMockValue,
  initialStudentTraitFormEditMockValue,
  StudentTraitCreateFormMockValue,
} from "@/tests/fixtures/studentTraits/studentTraits";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

describe("StudentTraitForm", () => {
  const wrapper = (props: StudentTraitFormProps<Mode>) => {
    render(<StudentTraitForm {...props} />);
  };

  test("should render correctly for create mode", () => {
    const mockProps: StudentTraitFormProps<"create"> = {
      mode: "create",
      value: initialStudentTraitFormCreateMockValue,
      onChange: vi.fn(() => {}),
      onSubmit: vi.fn(() => {}),
      loading: false,
    };

    wrapper(mockProps);

    expect(screen.getByLabelText(/特性の種類を選択/)).toBeInTheDocument();
    expect(screen.getByLabelText(/タイトル/)).toBeInTheDocument();
    expect(screen.getByLabelText(/詳細説明/)).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "作成" })).toBeInTheDocument();
  });

  test("should render correctly for edit mode", () => {
    const mockProps: StudentTraitFormProps<"edit"> = {
      mode: "edit",
      value: initialStudentTraitFormEditMockValue,
      onChange: vi.fn(() => {}),
      onSubmit: vi.fn(() => {}),
      loading: false,
    };

    wrapper(mockProps);
    expect(screen.getByText("特性")).toBeInTheDocument();
    expect(screen.getByText("よい特性")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "更新" })).toBeInTheDocument();
  });

  test("should call onSubmit when submit button is clicked for create mode", async () => {
    const user = userEvent.setup();
    const mockProps: StudentTraitFormProps<"create"> = {
      mode: "create",
      value: StudentTraitCreateFormMockValue,
      onChange: vi.fn(() => {}),
      onSubmit: vi.fn(() => {}),
      loading: false,
    };

    wrapper(mockProps);

    const createButton = screen.getByRole("button", { name: "作成" });
    expect(createButton).toBeInTheDocument();

    await user.click(createButton);
    expect(mockProps.onSubmit).toHaveBeenCalledWith(
      StudentTraitCreateFormMockValue
    );
  });

  test("should call onSubmit when submit button is clicked for edit mode", async () => {
    const user = userEvent.setup();
    const mockProps: StudentTraitFormProps<"edit"> = {
      mode: "edit",
      value: initialStudentTraitFormEditMockValue,
      onChange: vi.fn(() => {}),
      onSubmit: vi.fn(() => {}),
      loading: false,
    };

    wrapper(mockProps);

    const editButton = screen.getByRole("button", { name: "更新" });
    expect(editButton).toBeInTheDocument();

    await user.click(editButton);
    expect(mockProps.onSubmit).toHaveBeenCalledWith(
      initialStudentTraitFormEditMockValue
    );
  });
});
