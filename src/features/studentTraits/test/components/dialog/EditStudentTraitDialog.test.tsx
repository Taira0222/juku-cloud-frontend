import { Toaster } from "@/components/ui/feedback/Sonner/sonner";
import { EditStudentTraitDialog } from "@/features/studentTraits/components/dialog/EditStudentTraitDialog";
import { useStudentTraitForm } from "@/features/studentTraits/hooks/useStudentTraitForm";
import { useUpdateStudentTraitMutation } from "@/features/studentTraits/mutations/useUpdateStudentTraitMutation";
import type { EditStudentTraitLocationState } from "@/features/studentTraits/types/studentTraitForm";
import type { StudentTraitEdit } from "@/features/studentTraits/types/studentTraits";
import {
  editStudentTraitFormMockValue,
  initialStudentTraitFormEditMockValue,
  mockStudentTraits,
} from "@/tests/fixtures/studentTraits/studentTraits";
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

const StudentTraitsPage = () => (
  <div data-testid="student-traits-page">Student Traits Page</div>
);
const NotFoundPage = () => (
  <div data-testid="notfound-page">Not Found Page</div>
);

const wrapper = (initialPath: string, state: EditStudentTraitLocationState) => {
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter
        initialEntries={[
          "/dashboard/:studentId/student-traits", // 戻り先（1件目）
          {
            pathname: initialPath,
            state: {
              background: state.background,
              studentTrait: state.studentTrait,
            },
          },
        ]}
        initialIndex={1} // ← 2件目（編集）から開始
      >
        <Toaster />
        <Routes>
          <Route
            path="/dashboard/:studentId/student-traits/:studentTraitId/edit"
            element={<EditStudentTraitDialog />}
          />
          <Route
            path="/dashboard/:studentId/student-traits"
            element={<StudentTraitsPage />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

const successfulRender = () => {
  const initialPath = "/dashboard/1/student-traits/1/edit";

  const state = {
    background: { pathname: "/dashboard/1/student-traits" } as Location,
    studentTrait: mockStudentTraits[0],
  };
  wrapper(initialPath, state);
};

vi.mock(
  "@/features/studentTraits/mutations/useUpdateStudentTraitMutation",
  () => ({
    useUpdateStudentTraitMutation: vi.fn(),
  })
);

vi.mock("@/features/studentTraits/hooks/useStudentTraitForm", () => ({
  useStudentTraitForm: vi.fn(),
}));
const setValueMock = vi.fn();
const resetMock = vi.fn();
const mutateMock = vi.fn();

describe("EditStudentTraitDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  test("should open and close the dialog correctly and reset the form", async () => {
    const user = userEvent.setup();
    const submitMock = vi.fn();

    vi.mocked(useStudentTraitForm).mockReturnValue({
      value: initialStudentTraitFormEditMockValue,
      setValue: setValueMock,
      submit: submitMock,
      reset: resetMock,
    });

    vi.mocked(useUpdateStudentTraitMutation).mockReturnValue({
      mutate: mutateMock,
      isPending: false,
    } as unknown as ReturnType<typeof useUpdateStudentTraitMutation>);

    successfulRender();

    expect(screen.getByText("特性を編集")).toBeInTheDocument();

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
        onValid: (data: StudentTraitEdit) => void,
        onInvalid?: (msgs: string[]) => void
      ) => {
        onValid(editStudentTraitFormMockValue);
        onInvalid?.([]);
        return true;
      }
    );

    vi.mocked(useStudentTraitForm).mockReturnValue({
      value: editStudentTraitFormMockValue,
      setValue: setValueMock,
      submit: submitMock,
      reset: resetMock,
    });

    vi.mocked(useUpdateStudentTraitMutation).mockReturnValue({
      mutate: mutateMock,
      isPending: false,
    } as unknown as ReturnType<typeof useUpdateStudentTraitMutation>);

    successfulRender();

    expect(screen.getByText("特性を編集")).toBeInTheDocument();

    const submitButton = screen.getByRole("button", { name: "更新" });
    expect(submitButton).toBeInTheDocument();

    await user.click(submitButton);
    expect(submitMock).toHaveBeenCalled();
    expect(mutateMock).toHaveBeenCalledWith({
      ...editStudentTraitFormMockValue,
      student_id: 1,
    });
  });

  test("should display error message when form is invalid", async () => {
    const user = userEvent.setup();

    const submitMock = vi.fn(
      (
        onValid: (data: StudentTraitEdit) => void,
        onInvalid?: (msgs: string[]) => void
      ) => {
        onValid(editStudentTraitFormMockValue);
        onInvalid?.(["タイトルは50文字以内で入力してください"]);
        return false;
      }
    );

    vi.mocked(useStudentTraitForm).mockReturnValue({
      value: { ...editStudentTraitFormMockValue, title: "A".repeat(51) },
      setValue: setValueMock,
      submit: submitMock,
      reset: resetMock,
    });

    vi.mocked(useUpdateStudentTraitMutation).mockReturnValue({
      mutate: mutateMock,
      isPending: false,
    } as unknown as ReturnType<typeof useUpdateStudentTraitMutation>);

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

    vi.mocked(useStudentTraitForm).mockReturnValue({
      value: initialStudentTraitFormEditMockValue,
      setValue: setValueMock,
      submit: submitMock,
      reset: resetMock,
    });

    vi.mocked(useUpdateStudentTraitMutation).mockReturnValue({
      mutate: mutateMock,
      isPending: true,
    } as unknown as ReturnType<typeof useUpdateStudentTraitMutation>);

    successfulRender();

    expect(screen.getByText("特性を更新中...")).toBeInTheDocument();
  });

  test("should navigate to /404 when studentTraitId or studentId is invalid", () => {
    const initialPath = "/dashboard/abc/student-traits/1/edit"; // studentId が不正

    const state = {
      background: { pathname: "/dashboard/1/student-traits" } as Location,
      studentTrait: mockStudentTraits[0],
    };
    wrapper(initialPath, state);
    expect(screen.getByTestId("notfound-page")).toBeInTheDocument();
  });

  test("should navigate to /dashboard/1/student-traits when state is invalid", () => {
    const initialPath = "/dashboard/1/student-traits/1/edit";
    const state = {
      background: undefined,
      studentTrait: undefined,
    } as unknown as EditStudentTraitLocationState;
    wrapper(initialPath, state);
    expect(screen.getByTestId("student-traits-page")).toBeInTheDocument();
  });
});
