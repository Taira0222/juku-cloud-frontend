import { Toaster } from "@/components/ui/feedback/Sonner/sonner";
import { TeacherForm } from "@/features/teachers/components/TeacherForm/TeacherForm";
import type { TeacherFormProps } from "@/features/teachers/types/teacherForm";
import {
  detailRowsMap,
  formatEditDataMock,
} from "@/tests/fixtures/teachers/teachers";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";

const mockSubmit = vi.fn();
const mockSetFormData = vi.fn();
const mockHandleClose = vi.fn();

const TeacherPage = () => <div data-testid="teacher-page">Teacher Page</div>;
const StudentPage = () => <div data-testid="student-page">Student Page</div>;

const wrapper = (props: TeacherFormProps) => {
  render(
    <>
      <Toaster position="top-right" />
      <MemoryRouter initialEntries={["/teachers/1"]}>
        <Routes>
          <Route path="/teachers" element={<TeacherPage />} />
          <Route path="/teachers/:id" element={<TeacherForm {...props} />} />
          <Route path="/students" element={<StudentPage />} />
        </Routes>
      </MemoryRouter>
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
      teacher: { ...detailRowsMap[0], students: [] }, // teacher1
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
      teacher: { ...detailRowsMap[0], students: [] }, // teacher1
      setFormData: mockSetFormData,
      handleClose: mockHandleClose,
      onSubmit: mockSubmit,
    };
    wrapper(mockProps);
    const cancelButton = screen.getByRole("button", { name: "キャンセル" });
    await user.click(cancelButton);
    expect(mockHandleClose).toHaveBeenCalledTimes(1);
  });

  test("disables submit button when there are associated students", async () => {
    const user = userEvent.setup();
    const mockProps: TeacherFormProps = {
      formData: formatEditDataMock,
      teacher: { ...detailRowsMap[0] },
      setFormData: mockSetFormData,
      handleClose: mockHandleClose,
      onSubmit: mockSubmit,
    };
    wrapper(mockProps);
    expect(
      await screen.findByText(
        "この講師は以下の生徒を指導しています。講師情報を編集する前に、各生徒の編集画面で講師との連携を解除してください。"
      )
    ).toBeInTheDocument();

    const studentLink = screen.getByRole("link", { name: "生徒一覧へ" });
    await user.click(studentLink);
    expect(screen.getByTestId("student-page")).toBeInTheDocument();
  });
});
