import { Toaster } from "@/components/ui/feedback/Sonner/sonner";
import {
  DeleteStudentTraitDialog,
  type DeleteStudentTraitDialogProps,
} from "@/features/studentTraits/components/dialog/DeleteStudentTraitDialog";
import { useDeleteStudentTraitMutation } from "@/features/studentTraits/mutations/useDeleteStudentTraitMutation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: { retry: false },
  },
});

const wrapper = (props: DeleteStudentTraitDialogProps) => {
  render(
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <DeleteStudentTraitDialog {...props} />
    </QueryClientProvider>
  );
};

vi.mock(
  "@/features/studentTraits/mutations/useDeleteStudentTraitMutation",
  () => ({
    useDeleteStudentTraitMutation: vi.fn(),
  })
);

describe("DeleteStudentTraitDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  const mutateMock = vi.fn();
  const onChangeMock = vi.fn();

  test("should open and close the dialog correctly", async () => {
    const user = userEvent.setup();

    vi.mocked(useDeleteStudentTraitMutation).mockReturnValue({
      mutate: mutateMock,
      isPending: false,
    } as unknown as ReturnType<typeof useDeleteStudentTraitMutation>);

    const mockProps: DeleteStudentTraitDialogProps = {
      open: true,
      onOpenChange: onChangeMock,
      studentId: 1,
      studentTraitId: 1,
    };

    wrapper(mockProps);

    expect(screen.getByText("生徒の特性を削除")).toBeInTheDocument();
    const cancelButton = screen.getByRole("button", { name: "キャンセル" });
    expect(cancelButton).toBeInTheDocument();

    await user.click(cancelButton);
    expect(onChangeMock).toHaveBeenCalledWith(false);
  });

  test("should call mutate when delete button is clicked", async () => {
    const user = userEvent.setup();

    vi.mocked(useDeleteStudentTraitMutation).mockReturnValue({
      mutate: mutateMock,
      isPending: false,
    } as unknown as ReturnType<typeof useDeleteStudentTraitMutation>);

    const mockProps: DeleteStudentTraitDialogProps = {
      open: true,
      onOpenChange: onChangeMock,
      studentId: 1,
      studentTraitId: 1,
    };

    wrapper(mockProps);
    expect(screen.getByText("生徒の特性を削除")).toBeInTheDocument();

    const deleteButton = screen.getByRole("button", { name: "削除" });
    expect(deleteButton).toBeInTheDocument();

    await user.click(deleteButton);
    expect(mutateMock).toHaveBeenCalledWith({
      studentId: 1,
      studentTraitId: 1,
    });
    expect(onChangeMock).toHaveBeenCalled();
  });
  test("should show loading state when isPending is true", () => {
    vi.mocked(useDeleteStudentTraitMutation).mockReturnValue({
      mutate: mutateMock,
      isPending: true,
    } as unknown as ReturnType<typeof useDeleteStudentTraitMutation>);

    const mockProps: DeleteStudentTraitDialogProps = {
      open: true,
      onOpenChange: onChangeMock,
      studentId: 1,
      studentTraitId: 1,
    };

    wrapper(mockProps);
    expect(screen.getByText("削除中...")).toBeInTheDocument();
  });
});
