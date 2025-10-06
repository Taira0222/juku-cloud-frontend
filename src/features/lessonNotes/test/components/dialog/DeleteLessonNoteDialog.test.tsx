import { Toaster } from "@/components/ui/feedback/Sonner/sonner";
import {
  DeleteLessonNoteDialog,
  type DeleteLessonNoteDialogProps,
} from "@/features/lessonNotes/components/dialog/DeleteLessonNoteDialog";
import { useDeleteLessonNoteMutation } from "@/features/lessonNotes/mutations/useDeleteLessonNoteMutation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: { retry: false },
  },
});

const wrapper = (props: DeleteLessonNoteDialogProps) => {
  render(
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <DeleteLessonNoteDialog {...props} />
    </QueryClientProvider>
  );
};

vi.mock("@/features/lessonNotes/mutations/useDeleteLessonNoteMutation", () => ({
  useDeleteLessonNoteMutation: vi.fn(),
}));

describe("DeleteLessonNoteDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  const mutateMock = vi.fn();
  const onChangeMock = vi.fn();

  test("should open and close the dialog correctly and reset the form", async () => {
    const user = userEvent.setup();

    vi.mocked(useDeleteLessonNoteMutation).mockReturnValue({
      mutate: mutateMock,
      isPending: false,
    } as unknown as ReturnType<typeof useDeleteLessonNoteMutation>);

    const mockProps: DeleteLessonNoteDialogProps = {
      open: true,
      onOpenChange: onChangeMock,
      studentId: 1,
      lessonNoteId: 1,
    };

    wrapper(mockProps);

    expect(screen.getByText("授業引継ぎを削除")).toBeInTheDocument();
    const cancelButton = screen.getByRole("button", { name: "キャンセル" });
    expect(cancelButton).toBeInTheDocument();

    await user.click(cancelButton);
    expect(onChangeMock).toHaveBeenCalledWith(false);
  });

  test("should call mutate when delete button is clicked", async () => {
    const user = userEvent.setup();

    vi.mocked(useDeleteLessonNoteMutation).mockReturnValue({
      mutate: mutateMock,
      isPending: false,
    } as unknown as ReturnType<typeof useDeleteLessonNoteMutation>);

    const mockProps: DeleteLessonNoteDialogProps = {
      open: true,
      onOpenChange: onChangeMock,
      studentId: 1,
      lessonNoteId: 1,
    };

    wrapper(mockProps);
    expect(screen.getByText("授業引継ぎを削除")).toBeInTheDocument();

    const deleteButton = screen.getByRole("button", { name: "削除" });
    expect(deleteButton).toBeInTheDocument();

    await user.click(deleteButton);
    expect(mutateMock).toHaveBeenCalledWith({ studentId: 1, lessonNoteId: 1 });
    expect(onChangeMock).toHaveBeenCalled();
  });
  test("should show loading state when isPending is true", () => {
    vi.mocked(useDeleteLessonNoteMutation).mockReturnValue({
      mutate: mutateMock,
      isPending: true,
    } as unknown as ReturnType<typeof useDeleteLessonNoteMutation>);

    const mockProps: DeleteLessonNoteDialogProps = {
      open: true,
      onOpenChange: onChangeMock,
      studentId: 1,
      lessonNoteId: 1,
    };

    wrapper(mockProps);
    expect(screen.getByText("削除中...")).toBeInTheDocument();
  });
});
