import { beforeEach, describe, expect, test, vi } from "vitest";
import type { TeacherSubmitProps } from "../../types/teacherForm";
import { formatEditDataMock } from "@/tests/fixtures/teachers/teachers";
import { useTeacherSubmit } from "../../hooks/useTeacherSubmit";
import { render, renderHook, screen } from "@testing-library/react";
import { useTeacherUpdate } from "../../mutations/useTeacherUpdate";
import userEvent from "@testing-library/user-event";
import type { FormEvent } from "react";
import { Toaster } from "@/components/ui/feedback/Sonner/sonner";

vi.mock("@/features/teachers/mutations/useTeacherUpdate", () => {
  return {
    useTeacherUpdate: vi.fn(),
  };
});

const wrapper = ({
  onSubmit,
}: {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}) => {
  render(
    <>
      <Toaster position="top-center" richColors />
      <form onSubmit={onSubmit}>
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

describe("useTeacherSubmit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  test("should submit the form with the correct data", async () => {
    const user = userEvent.setup();
    const updateTeacherSpy = vi.fn().mockResolvedValue({
      ok: true,
      updatedId: 5,
    });
    vi.mocked(useTeacherUpdate).mockReturnValue({
      error: null,
      loading: false,
      updateTeacher: updateTeacherSpy,
    });

    const mockFormData: TeacherSubmitProps = {
      formData: formatEditDataMock,
      teacherId: 5,
      handleClose: () => {},
    };

    const { result } = renderHook(() => useTeacherSubmit(mockFormData));
    wrapper({ onSubmit: result.current.handleSubmit });

    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(updateTeacherSpy).toHaveBeenCalledWith(5, {
      name: "test name",
      employment_status: "active",
      subject_ids: [1, 4],
      available_day_ids: [2, 4],
    });
    expect(screen.getByText("更新に成功しました")).toBeInTheDocument();
  });

  test("should show error toast when update fails", async () => {
    const user = userEvent.setup();
    const updateTeacherSpy = vi.fn().mockResolvedValue({
      ok: false,
    });
    vi.mocked(useTeacherUpdate).mockReturnValue({
      error: null,
      loading: false,
      updateTeacher: updateTeacherSpy,
    });

    const mockFormData: TeacherSubmitProps = {
      formData: formatEditDataMock,
      teacherId: 5,
      handleClose: () => {},
    };

    const { result } = renderHook(() => useTeacherSubmit(mockFormData));
    wrapper({ onSubmit: result.current.handleSubmit });

    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(updateTeacherSpy).toHaveBeenCalled();
    expect(screen.getByText("更新に失敗しました")).toBeInTheDocument();
  });

  test("should show error toast when updatedId is missing", async () => {
    const user = userEvent.setup();
    const updateTeacherSpy = vi.fn().mockResolvedValue({
      ok: true,
      // updatedId is missing
    });
    vi.mocked(useTeacherUpdate).mockReturnValue({
      error: null,
      loading: false,
      updateTeacher: updateTeacherSpy,
    });

    const mockFormData: TeacherSubmitProps = {
      formData: formatEditDataMock,
      teacherId: 5,
      handleClose: () => {},
    };

    const { result } = renderHook(() => useTeacherSubmit(mockFormData));
    wrapper({ onSubmit: result.current.handleSubmit });

    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(updateTeacherSpy).toHaveBeenCalled();
    expect(
      screen.getByText("APIレスポンスに更新IDが含まれていません。")
    ).toBeInTheDocument();
  });
});
