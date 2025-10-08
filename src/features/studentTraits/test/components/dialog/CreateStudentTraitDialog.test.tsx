import { Toaster } from "@/components/ui/feedback/Sonner/sonner";
import {
  CreateStudentTraitDialog,
  type CreateStudentTraitDialogProps,
} from "@/features/studentTraits/components/dialog/CreateStudentTraitDialog";
import { useStudentTraitForm } from "@/features/studentTraits/hooks/useStudentTraitForm";
import { useCreateStudentTraitMutation } from "@/features/studentTraits/mutations/useCreateStudentTraitMutation";
import type { StudentTraitCreate } from "@/features/studentTraits/types/studentTraits";
import {
  initialStudentTraitFormCreateMockValue,
  StudentTraitCreateFormMockValue,
} from "@/tests/fixtures/studentTraits/studentTraits";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: { retry: false },
  },
});

const wrapper = (props: CreateStudentTraitDialogProps) => {
  render(
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <CreateStudentTraitDialog {...props} />
    </QueryClientProvider>
  );
};

vi.mock(
  "@/features/studentTraits/mutations/useCreateStudentTraitMutation",
  () => ({
    useCreateStudentTraitMutation: vi.fn(),
  })
);

vi.mock("@/features/studentTraits/hooks/useStudentTraitForm", () => ({
  useStudentTraitForm: vi.fn(),
}));
const setValueMock = vi.fn();
const resetMock = vi.fn();
const mutateMock = vi.fn();

describe("CreateStudentTraitDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  test("should open and close the dialog correctly and reset the form", async () => {
    const user = userEvent.setup();
    const submitMock = vi.fn();

    vi.mocked(useStudentTraitForm).mockReturnValue({
      value: initialStudentTraitFormCreateMockValue,
      setValue: setValueMock,
      submit: submitMock,
      reset: resetMock,
    });

    vi.mocked(useCreateStudentTraitMutation).mockReturnValue({
      mutate: mutateMock,
      isPending: false,
    } as unknown as ReturnType<typeof useCreateStudentTraitMutation>);

    const mockProps: CreateStudentTraitDialogProps = {
      studentId: 1,
    };

    wrapper(mockProps);

    const openButton = screen.getByRole("button", { name: /特性を追加/ });
    expect(openButton).toBeInTheDocument();

    await user.click(openButton);
    expect(screen.getByText("特性を新規作成")).toBeInTheDocument();

    const titleInput = screen.getByLabelText(/タイトル/);
    await user.type(titleInput, "新しい特性のタイトル");
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
        onValid: (data: StudentTraitCreate) => void,
        onInvalid?: (msgs: string[]) => void
      ) => {
        onValid(StudentTraitCreateFormMockValue);
        onInvalid?.([]);
        return true;
      }
    );

    vi.mocked(useStudentTraitForm).mockReturnValue({
      value: StudentTraitCreateFormMockValue,
      setValue: setValueMock,
      submit: submitMock,
      reset: resetMock,
    });

    vi.mocked(useCreateStudentTraitMutation).mockReturnValue({
      mutate: mutateMock,
      isPending: false,
    } as unknown as ReturnType<typeof useCreateStudentTraitMutation>);

    const mockProps: CreateStudentTraitDialogProps = {
      studentId: 1,
    };

    wrapper(mockProps);

    const openButton = screen.getByRole("button", { name: /特性を追加/ });
    expect(openButton).toBeInTheDocument();

    await user.click(openButton);
    expect(screen.getByText("特性を新規作成")).toBeInTheDocument();

    const submitButton = screen.getByRole("button", { name: "作成" });
    expect(submitButton).toBeInTheDocument();

    await user.click(submitButton);
    expect(submitMock).toHaveBeenCalled();
    expect(mutateMock).toHaveBeenCalledWith({
      ...StudentTraitCreateFormMockValue,
      student_id: 1,
    });
    expect(resetMock).toHaveBeenCalled();
  });

  test("should display error message when form is invalid", async () => {
    const user = userEvent.setup();

    const submitMock = vi.fn(
      (
        onValid: (data: StudentTraitCreate) => void,
        onInvalid?: (msgs: string[]) => void
      ) => {
        onValid(StudentTraitCreateFormMockValue);
        onInvalid?.(["タイトルは50文字以内で入力してください"]);
        return false;
      }
    );

    vi.mocked(useStudentTraitForm).mockReturnValue({
      value: { ...StudentTraitCreateFormMockValue, title: "A".repeat(51) },
      setValue: setValueMock,
      submit: submitMock,
      reset: resetMock,
    });

    vi.mocked(useCreateStudentTraitMutation).mockReturnValue({
      mutate: mutateMock,
      isPending: false,
    } as unknown as ReturnType<typeof useCreateStudentTraitMutation>);

    const mockProps: CreateStudentTraitDialogProps = {
      studentId: 1,
    };

    wrapper(mockProps);

    const openButton = screen.getByRole("button", { name: /特性を追加/ });
    expect(openButton).toBeInTheDocument();

    await user.click(openButton);
    expect(screen.getByText("特性を新規作成")).toBeInTheDocument();

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

    vi.mocked(useStudentTraitForm).mockReturnValue({
      value: initialStudentTraitFormCreateMockValue,
      setValue: setValueMock,
      submit: submitMock,
      reset: resetMock,
    });

    vi.mocked(useCreateStudentTraitMutation).mockReturnValue({
      mutate: mutateMock,
      isPending: true,
    } as unknown as ReturnType<typeof useCreateStudentTraitMutation>);

    const mockProps: CreateStudentTraitDialogProps = {
      studentId: 1,
    };

    wrapper(mockProps);

    const openButton = screen.getByRole("button", { name: /特性を追加/ });
    expect(openButton).toBeInTheDocument();

    await user.click(openButton);
    expect(screen.getByText("特性を新規作成")).toBeInTheDocument();

    expect(screen.getByText("特性を作成中...")).toBeInTheDocument();
  });
});
