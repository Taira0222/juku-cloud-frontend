import { Toaster } from "@/components/ui/feedback/Sonner/sonner";
import { DeleteStudentDialog } from "@/features/students/components/dialog/DeleteStudentDialog";
import { useDeleteStudentMutation } from "@/features/students/mutations/useDeleteStudentMutation";
import type { Student } from "@/features/students/types/students";
import { mockStudent3 } from "@/tests/fixtures/students/students";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student?: Student;
};

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: { retry: false },
  },
});

const mockRender = (props: Props) => {
  return render(
    <>
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-right" />
        <DeleteStudentDialog {...props} />
      </QueryClientProvider>
    </>
  );
};

vi.mock("@/features/students/mutations/useDeleteStudentMutation", () => ({
  useDeleteStudentMutation: vi.fn(),
}));

describe("DeleteStudentDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  test("renders correctly", async () => {
    const mockMutation = vi.fn();
    const props: Props = {
      open: true,
      onOpenChange: () => {},
      student: mockStudent3,
    };

    vi.mocked(useDeleteStudentMutation).mockReturnValue({
      isPending: false,
      mutate: mockMutation,
    });

    const user = userEvent.setup();

    mockRender(props);
    expect(screen.getByText("生徒を削除しますか？")).toBeInTheDocument();
    expect(
      screen.getByText(
        `削除する場合は「${mockStudent3.name}」と入力してください`
      )
    ).toBeInTheDocument();

    const input = screen.getByRole("textbox");
    await user.type(input, mockStudent3.name);
    expect(input).toHaveValue(mockStudent3.name);

    const deleteButton = screen.getByLabelText(
      `生徒「${mockStudent3.name}」を削除する`
    );
    await user.click(deleteButton);
    expect(deleteButton).toBeEnabled();
    expect(mockMutation).toHaveBeenCalledWith(mockStudent3.id);
  });

  test("closes dialog when student is undefined", async () => {
    const props: Props = {
      open: true,
      onOpenChange: vi.fn(),
      student: undefined,
    };

    vi.mocked(useDeleteStudentMutation).mockReturnValue({
      isPending: false,
      mutate: vi.fn(),
    });

    mockRender(props);
    expect(props.onOpenChange).toHaveBeenCalledWith(false);
  });

  test("shows loading state when deleting", () => {
    const mockMutation = vi.fn();
    const props: Props = {
      open: true,
      onOpenChange: () => {},
      student: mockStudent3,
    };

    vi.mocked(useDeleteStudentMutation).mockReturnValue({
      isPending: true,
      mutate: mockMutation,
    });
    mockRender(props);
    expect(screen.getByText("読み込み中")).toBeInTheDocument();
    expect(
      screen.getByText("削除確認ダイアログの読み込み中")
    ).toBeInTheDocument();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("shows warning when names do not match", async () => {
    const mockMutation = vi.fn();
    const props: Props = {
      open: true,
      onOpenChange: () => {},
      student: mockStudent3,
    };

    vi.mocked(useDeleteStudentMutation).mockReturnValue({
      isPending: false,
      mutate: mockMutation,
    });

    const user = userEvent.setup();

    mockRender(props);
    const input = screen.getByRole("textbox");
    await user.type(input, "Wrong Name");

    const deleteButton = screen.getByLabelText(
      `生徒「${mockStudent3.name}」を削除する`
    );
    await user.click(deleteButton);

    expect(screen.getByText("名前が一致しません。")).toBeInTheDocument();
    expect(mockMutation).not.toHaveBeenCalled();
  });
});
