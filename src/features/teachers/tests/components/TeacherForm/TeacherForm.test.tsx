import { Toaster } from "@/components/ui/feedback/Sonner/sonner";
import { TeacherForm } from "@/features/teachers/components/TeacherForm/TeacherForm";
import type { TeacherFormProps } from "@/features/teachers/types/teacherForm";
import { formatEditDataMock } from "@/tests/fixtures/teachers/teachers";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";

const mockSubmit = vi.fn();
const mockSetFormData = vi.fn();
const mockHandleClose = vi.fn();

const wrapper = (props: TeacherFormProps) => {
  render(
    <>
      <Toaster position="top-right" />
      <TeacherForm {...props} />
    </>
  );
};
describe("TeacherForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  test("renders correctly", async () => {
    const user = userEvent.setup();
    const mockProps: TeacherFormProps = {
      formData: formatEditDataMock,
      setFormData: mockSetFormData,
      handleClose: mockHandleClose,
      onSubmit: mockSubmit,
    };
    wrapper(mockProps);
    const nameInput = screen.getByLabelText(/講師の名前/);
    await user.clear(nameInput);
    await user.type(nameInput, "Updated Name");
    expect(mockSetFormData).toHaveBeenCalled();

    const updateButton = screen.getByRole("button", { name: "更新" });
    await user.click(updateButton);
    expect(mockSubmit).toHaveBeenCalledTimes(1);
  });

  test("calls handleClose when cancel button is clicked", async () => {
    const user = userEvent.setup();
    const mockProps: TeacherFormProps = {
      formData: formatEditDataMock,
      setFormData: mockSetFormData,
      handleClose: mockHandleClose,
      onSubmit: mockSubmit,
    };
    wrapper(mockProps);
    const cancelButton = screen.getByRole("button", { name: "キャンセル" });
    await user.click(cancelButton);
    expect(mockHandleClose).toHaveBeenCalledTimes(1);
  });
});
