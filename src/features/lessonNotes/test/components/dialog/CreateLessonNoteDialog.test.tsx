import { Toaster } from "@/components/ui/feedback/Sonner/sonner";
import {
  CreateLessonNoteDialog,
  type CreateLessonNoteDialogProps,
} from "@/features/lessonNotes/components/dialog/CreateLessonNoteDialog";
import { useLessonNoteForm } from "@/features/lessonNotes/hooks/useLessonNoteForm";
import { useCreateLessonNoteMutation } from "@/features/lessonNotes/mutations/useCreateLessonNoteMutation";
import type { LessonNoteCreate } from "@/features/lessonNotes/types/lessonNote";
import {
  initialLessonFormCreateMockValue,
  lessonNoteCreateFormMockValue,
  mockSubjects,
} from "@/tests/fixtures/lessonNotes/lessonNotes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: { retry: false },
  },
});

const wrapper = (props: CreateLessonNoteDialogProps) => {
  render(
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <CreateLessonNoteDialog {...props} />
    </QueryClientProvider>
  );
};

vi.mock("@/features/lessonNotes/mutations/useCreateLessonNoteMutation", () => ({
  useCreateLessonNoteMutation: vi.fn(),
}));

vi.mock("@/features/lessonNotes/hooks/useLessonNoteForm", () => ({
  useLessonNoteForm: vi.fn(),
}));
const setValueMock = vi.fn();
const resetMock = vi.fn();
const mutateMock = vi.fn();

describe("CreateLessonNoteDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  test("should open and close the dialog correctly and reset the form", async () => {
    const user = userEvent.setup();
    const submitMock = vi.fn();

    vi.mocked(useLessonNoteForm).mockReturnValue({
      value: initialLessonFormCreateMockValue,
      setValue: setValueMock,
      submit: submitMock,
      reset: resetMock,
    });

    vi.mocked(useCreateLessonNoteMutation).mockReturnValue({
      mutate: mutateMock,
      isPending: false,
    } as unknown as ReturnType<typeof useCreateLessonNoteMutation>);

    const mockProps: CreateLessonNoteDialogProps = {
      studentId: 1,
      subjects: mockSubjects,
    };

    wrapper(mockProps);

    const openButton = screen.getByRole("button", { name: /引継ぎ事項を追加/ });
    expect(openButton).toBeInTheDocument();

    await user.click(openButton);
    expect(screen.getByText("引継ぎ事項を新規作成")).toBeInTheDocument();

    const titleInput = screen.getByLabelText(/タイトル/);
    await user.type(titleInput, "新しい引継ぎ事項のタイトル");
    expect(setValueMock).toHaveBeenCalled();

    // ダイアログを閉じる

    const closeButton = screen.getByRole("button", { name: "Close" });
    expect(closeButton).toBeInTheDocument();
    await user.click(closeButton);

    expect(resetMock).toHaveBeenCalled();
  });

  test("should call mutate when form is submitted", async () => {
    const user = userEvent.setup();

    const submitMock = vi.fn(
      (
        onValid: (data: LessonNoteCreate) => void,
        onInvalid?: (msgs: string[]) => void
      ) => {
        onValid(lessonNoteCreateFormMockValue);
        onInvalid?.([]);
        return true;
      }
    );

    vi.mocked(useLessonNoteForm).mockReturnValue({
      value: lessonNoteCreateFormMockValue,
      setValue: setValueMock,
      submit: submitMock,
      reset: resetMock,
    });

    vi.mocked(useCreateLessonNoteMutation).mockReturnValue({
      mutate: mutateMock,
      isPending: false,
    } as unknown as ReturnType<typeof useCreateLessonNoteMutation>);

    const mockProps: CreateLessonNoteDialogProps = {
      studentId: 1,
      subjects: mockSubjects,
    };

    wrapper(mockProps);

    const openButton = screen.getByRole("button", { name: /引継ぎ事項を追加/ });
    expect(openButton).toBeInTheDocument();

    await user.click(openButton);
    expect(screen.getByText("引継ぎ事項を新規作成")).toBeInTheDocument();

    const submitButton = screen.getByRole("button", { name: "作成" });
    expect(submitButton).toBeInTheDocument();

    await user.click(submitButton);
    expect(submitMock).toHaveBeenCalled();
    expect(mutateMock).toHaveBeenCalledWith({
      ...lessonNoteCreateFormMockValue,
      student_id: 1,
    });
    expect(resetMock).toHaveBeenCalled();
  });

  test("should display error message when form is invalid", async () => {
    const user = userEvent.setup();

    const submitMock = vi.fn(
      (
        onValid: (data: LessonNoteCreate) => void,
        onInvalid?: (msgs: string[]) => void
      ) => {
        onValid(lessonNoteCreateFormMockValue);
        onInvalid?.(["タイトルは50文字以内で入力してください"]);
        return false;
      }
    );

    vi.mocked(useLessonNoteForm).mockReturnValue({
      value: { ...lessonNoteCreateFormMockValue, title: "A".repeat(51) },
      setValue: setValueMock,
      submit: submitMock,
      reset: resetMock,
    });

    vi.mocked(useCreateLessonNoteMutation).mockReturnValue({
      mutate: mutateMock,
      isPending: false,
    } as unknown as ReturnType<typeof useCreateLessonNoteMutation>);

    const mockProps: CreateLessonNoteDialogProps = {
      studentId: 1,
      subjects: mockSubjects,
    };

    wrapper(mockProps);

    const openButton = screen.getByRole("button", { name: /引継ぎ事項を追加/ });
    expect(openButton).toBeInTheDocument();

    await user.click(openButton);
    expect(screen.getByText("引継ぎ事項を新規作成")).toBeInTheDocument();

    const submitButton = screen.getByRole("button", { name: "作成" });
    expect(submitButton).toBeInTheDocument();

    await user.click(submitButton);
    expect(submitMock).toHaveBeenCalled();

    expect(
      await screen.findByText("タイトルは50文字以内で入力してください")
    ).toBeInTheDocument();
  });

  test("should show loading state when mutation is pending", async () => {
    const user = userEvent.setup();
    const submitMock = vi.fn();

    vi.mocked(useLessonNoteForm).mockReturnValue({
      value: initialLessonFormCreateMockValue,
      setValue: setValueMock,
      submit: submitMock,
      reset: resetMock,
    });

    vi.mocked(useCreateLessonNoteMutation).mockReturnValue({
      mutate: mutateMock,
      isPending: true,
    } as unknown as ReturnType<typeof useCreateLessonNoteMutation>);

    const mockProps: CreateLessonNoteDialogProps = {
      studentId: 1,
      subjects: mockSubjects,
    };

    wrapper(mockProps);

    const openButton = screen.getByRole("button", { name: /引継ぎ事項を追加/ });
    expect(openButton).toBeInTheDocument();

    await user.click(openButton);
    expect(screen.getByText("引継ぎ事項を新規作成")).toBeInTheDocument();

    expect(screen.getByText("引継ぎ事項を作成中...")).toBeInTheDocument();
  });
});
