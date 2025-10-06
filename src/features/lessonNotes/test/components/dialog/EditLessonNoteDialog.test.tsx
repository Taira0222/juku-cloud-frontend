import { Toaster } from "@/components/ui/feedback/Sonner/sonner";
import { EditLessonNoteDialog } from "@/features/lessonNotes/components/dialog/EditLessonNoteDialog";
import { useLessonNoteForm } from "@/features/lessonNotes/hooks/useLessonNoteForm";
import { useUpdateLessonNoteMutation } from "@/features/lessonNotes/mutations/useUpdateLessonNoteMutation";
import type { LessonNoteEdit } from "@/features/lessonNotes/types/lessonNote";
import type { EditLessonNoteLocationState } from "@/features/lessonNotes/types/lessonNoteForm";
import {
  editLessonNoteFormMockValue,
  initialLessonFormEditMockValue,
  lessonNote1,
  mockSubjects,
} from "@/tests/fixtures/lessonNotes/lessonNotes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: { retry: false },
  },
});

const DashboardPage = () => (
  <div data-testid="dashboard-page">Dashboard Page</div>
);
const NotFoundPage = () => (
  <div data-testid="notfound-page">Not Found Page</div>
);

const wrapper = (initialPath: string, state: EditLessonNoteLocationState) => {
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter
        initialEntries={[
          "/dashboard/:studentId", // 戻り先（1件目）
          {
            pathname: initialPath,
            state: {
              background: state.background,
              subjects: state.subjects,
              lessonNote: state.lessonNote,
            },
          },
        ]}
        initialIndex={1} // ← 2件目（編集）から開始
      >
        <Toaster />
        <Routes>
          <Route
            path="/dashboard/:studentId/lesson-notes/:lessonNoteId/edit"
            element={<EditLessonNoteDialog />}
          />
          <Route path="/dashboard/:studentId" element={<DashboardPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

const successfulRender = () => {
  const initialPath = "/dashboard/1/lesson-notes/1/edit";

  const state = {
    background: { pathname: "/dashboard/1" } as Location,
    subjects: mockSubjects,
    lessonNote: lessonNote1,
  };
  wrapper(initialPath, state);
};

vi.mock("@/features/lessonNotes/mutations/useUpdateLessonNoteMutation", () => ({
  useUpdateLessonNoteMutation: vi.fn(),
}));

vi.mock("@/features/lessonNotes/hooks/useLessonNoteForm", () => ({
  useLessonNoteForm: vi.fn(),
}));
const setValueMock = vi.fn();
const resetMock = vi.fn();
const mutateMock = vi.fn();

describe("EditLessonNoteDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  test("should open and close the dialog correctly and reset the form", async () => {
    const user = userEvent.setup();
    const submitMock = vi.fn();

    vi.mocked(useLessonNoteForm).mockReturnValue({
      value: initialLessonFormEditMockValue,
      setValue: setValueMock,
      submit: submitMock,
      reset: resetMock,
    });

    vi.mocked(useUpdateLessonNoteMutation).mockReturnValue({
      mutate: mutateMock,
      isPending: false,
    } as unknown as ReturnType<typeof useUpdateLessonNoteMutation>);

    successfulRender();

    expect(screen.getByText("引継ぎ事項を編集")).toBeInTheDocument();

    const titleInput = screen.getByLabelText(/タイトル/);
    await user.clear(titleInput);
    await user.type(titleInput, "タイトルを更新");
    expect(setValueMock).toHaveBeenCalled();

    // ダイアログを閉じる

    const closeButton = screen.getByRole("button", { name: "Close" });
    expect(closeButton).toBeInTheDocument();
    await user.click(closeButton);
  });

  test("should call mutate when form is submitted", async () => {
    const user = userEvent.setup();

    const submitMock = vi.fn(
      (
        onValid: (data: LessonNoteEdit) => void,
        onInvalid?: (msgs: string[]) => void
      ) => {
        onValid(editLessonNoteFormMockValue);
        onInvalid?.([]);
        return true;
      }
    );

    vi.mocked(useLessonNoteForm).mockReturnValue({
      value: editLessonNoteFormMockValue,
      setValue: setValueMock,
      submit: submitMock,
      reset: resetMock,
    });

    vi.mocked(useUpdateLessonNoteMutation).mockReturnValue({
      mutate: mutateMock,
      isPending: false,
    } as unknown as ReturnType<typeof useUpdateLessonNoteMutation>);

    successfulRender();

    expect(screen.getByText("引継ぎ事項を編集")).toBeInTheDocument();

    const submitButton = screen.getByRole("button", { name: "更新" });
    expect(submitButton).toBeInTheDocument();

    await user.click(submitButton);
    expect(submitMock).toHaveBeenCalled();
    expect(mutateMock).toHaveBeenCalledWith({
      ...editLessonNoteFormMockValue,
      student_id: 1,
    });
  });

  test("should display error message when form is invalid", async () => {
    const user = userEvent.setup();

    const submitMock = vi.fn(
      (
        onValid: (data: LessonNoteEdit) => void,
        onInvalid?: (msgs: string[]) => void
      ) => {
        onValid(editLessonNoteFormMockValue);
        onInvalid?.(["タイトルは50文字以内で入力してください"]);
        return false;
      }
    );

    vi.mocked(useLessonNoteForm).mockReturnValue({
      value: { ...editLessonNoteFormMockValue, title: "A".repeat(51) },
      setValue: setValueMock,
      submit: submitMock,
      reset: resetMock,
    });

    vi.mocked(useUpdateLessonNoteMutation).mockReturnValue({
      mutate: mutateMock,
      isPending: false,
    } as unknown as ReturnType<typeof useUpdateLessonNoteMutation>);

    successfulRender();

    const submitButton = screen.getByRole("button", { name: "更新" });
    expect(submitButton).toBeInTheDocument();

    await user.click(submitButton);
    expect(submitMock).toHaveBeenCalled();

    expect(
      await screen.findByText("タイトルは50文字以内で入力してください")
    ).toBeInTheDocument();
  });

  test("should show loading state when mutation is pending", () => {
    const submitMock = vi.fn();

    vi.mocked(useLessonNoteForm).mockReturnValue({
      value: initialLessonFormEditMockValue,
      setValue: setValueMock,
      submit: submitMock,
      reset: resetMock,
    });

    vi.mocked(useUpdateLessonNoteMutation).mockReturnValue({
      mutate: mutateMock,
      isPending: true,
    } as unknown as ReturnType<typeof useUpdateLessonNoteMutation>);

    successfulRender();

    expect(screen.getByText("引継ぎ事項を更新中...")).toBeInTheDocument();
  });

  test("should navigate to /404 when lessonNoteId or studentId is invalid", () => {
    const initialPath = "/dashboard/abc/lesson-notes/1/edit"; // studentId が不正

    const state = {
      background: { pathname: "/dashboard/1" } as Location,
      subjects: mockSubjects,
      lessonNote: lessonNote1,
    };
    wrapper(initialPath, state);
    expect(screen.getByTestId("notfound-page")).toBeInTheDocument();
  });
});
