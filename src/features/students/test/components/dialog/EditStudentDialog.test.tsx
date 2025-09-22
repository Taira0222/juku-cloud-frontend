import { Toaster } from "@/components/ui/feedback/Sonner/sonner";
import { EditStudentDialog } from "@/features/students/components/dialog/EditStudentDialog";
import { useStudentForEdit } from "@/features/students/hooks/useStudentForEdit";
import { useTeachersForStudent } from "@/features/students/hooks/useTeachersForStudent";
import { useUpdateStudentMutation } from "@/features/students/mutations/useUpdateStudentMutation";
import type { editLocationState } from "@/features/students/types/students";
import {
  editStudentMockPayload,
  mockStudent3,
  mockTeachers,
} from "@/tests/fixtures/students/students";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, expect } from "vitest";
import { vi } from "vitest";
import { describe, test } from "vitest";

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: { retry: false },
  },
});

const StudentsPage = () => <div data-testid="students-page">Students Page</div>;
const NotFoundPage = () => (
  <div data-testid="notfound-page">Not Found Page</div>
);

const wrapper = (initialPath: string, state: editLocationState) => {
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter
        initialEntries={[
          "/students", // 戻り先（1件目）
          {
            pathname: initialPath,
            state: { background: state.background, student: state.student },
          },
        ]}
        initialIndex={1} // ← 2件目（編集）から開始
      >
        <Toaster />
        <Routes>
          <Route path="students/:id/edit" element={<EditStudentDialog />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

const successfulRender = () => {
  const initialPath = "/students/3/edit";

  const state = {
    background: { pathname: "/students" } as Location,
    student: mockStudent3,
  };
  wrapper(initialPath, state);
};

vi.mock("@/features/students/hooks/useTeachersForStudent", () => ({
  useTeachersForStudent: vi.fn(),
}));

vi.mock("@/features/students/mutations/useUpdateStudentMutation", () => ({
  useUpdateStudentMutation: vi.fn(),
}));

vi.mock("@/features/students/hooks/useStudentForEdit", () => ({
  useStudentForEdit: vi.fn(),
}));

describe("EditStudentDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  test("should render EditStudentDialog component", () => {
    vi.mocked(useTeachersForStudent).mockReturnValue({
      loading: false,
      error: null,
      teachers: [mockTeachers[0], mockTeachers[1]], // Teacher1, Teacher2
    });

    vi.mocked(useUpdateStudentMutation).mockReturnValue({
      isPending: false,
      mutate: vi.fn(),
    });

    vi.mocked(useStudentForEdit).mockReturnValue({
      student: mockStudent3,
      isNotFound: false,
      isLoading: false,
    });

    successfulRender();
    expect(screen.getByText("生徒情報を編集")).toBeInTheDocument();
  });

  test("submit button should be disabled when updating student", async () => {
    const user = userEvent.setup();
    const mockMutation = vi.fn();
    vi.mocked(useTeachersForStudent).mockReturnValue({
      loading: false,
      error: null,
      teachers: [mockTeachers[0], mockTeachers[1]], // Teacher1, Teacher2
    });

    vi.mocked(useUpdateStudentMutation).mockReturnValue({
      isPending: false,
      mutate: mockMutation,
    });

    vi.mocked(useStudentForEdit).mockReturnValue({
      student: mockStudent3,
      isNotFound: false,
      isLoading: false,
    });

    successfulRender();

    const submitButton = screen.getByRole("button", { name: "更新" });
    await user.click(submitButton);

    expect(mockMutation).toHaveBeenCalledWith(editStudentMockPayload);
    expect(screen.findByText("Students Page")).toBeDefined();
  });

  test("should navigate to /students when there is no background state", () => {
    const initialPath = "/students/3/edit";

    const state = {
      background: undefined,
      student: mockStudent3,
    };
    wrapper(initialPath, state);
    expect(screen.getByTestId("students-page")).toBeInTheDocument();
  });

  test("should render succuessfully even if student is undefined in state", async () => {
    const initialPath = "/students/3/edit";

    const state = {
      background: { pathname: "/students" } as Location,
      student: undefined,
    };
    vi.mocked(useTeachersForStudent).mockReturnValue({
      loading: false,
      error: null,
      teachers: [mockTeachers[0], mockTeachers[1]], // Teacher1, Teacher2
    });

    vi.mocked(useUpdateStudentMutation).mockReturnValue({
      isPending: false,
      mutate: vi.fn(),
    });

    vi.mocked(useStudentForEdit).mockReturnValue({
      student: mockStudent3,
      isNotFound: false,
      isLoading: false,
    });

    wrapper(initialPath, state);
    await waitFor(() => {
      expect(screen.getByText("生徒情報を編集")).toBeInTheDocument();
    });
  });

  test("should render loading state when student is loading", async () => {
    const initialPath = "/students/3/edit";

    const state = {
      background: { pathname: "/students" } as Location,
      student: undefined,
    };
    vi.mocked(useStudentForEdit).mockReturnValue({
      student: undefined,
      isNotFound: false,
      isLoading: true,
    });

    vi.mocked(useTeachersForStudent).mockReturnValue({
      loading: false,
      error: null,
      teachers: [mockTeachers[0], mockTeachers[1]], // Teacher1, Teacher2
    });

    vi.mocked(useUpdateStudentMutation).mockReturnValue({
      isPending: false,
      mutate: vi.fn(),
    });

    wrapper(initialPath, state);
    await waitFor(() => {
      expect(screen.getByText("生徒情報を読み込み中...")).toBeInTheDocument();
    });
  });

  test("should navigate to /404 when student is not found", async () => {
    const initialPath = "/students/999/edit";

    const state = {
      background: { pathname: "/students" } as Location,
      student: undefined,
    };
    vi.mocked(useStudentForEdit).mockReturnValue({
      student: undefined,
      isNotFound: true,
      isLoading: false,
    });

    vi.mocked(useTeachersForStudent).mockReturnValue({
      loading: false,
      error: null,
      teachers: [mockTeachers[0], mockTeachers[1]], // Teacher1, Teacher2
    });

    vi.mocked(useUpdateStudentMutation).mockReturnValue({
      isPending: false,
      mutate: vi.fn(),
    });
    wrapper(initialPath, state);

    await waitFor(() => {
      expect(screen.getByTestId("notfound-page")).toBeInTheDocument();
    });
  });

  test("should render loading state when teachers are loading", async () => {
    vi.mocked(useStudentForEdit).mockReturnValue({
      student: mockStudent3,
      isNotFound: false,
      isLoading: false,
    });

    vi.mocked(useTeachersForStudent).mockReturnValue({
      loading: true,
      error: null,
      teachers: [],
    });

    vi.mocked(useUpdateStudentMutation).mockReturnValue({
      isPending: false,
      mutate: vi.fn(),
    });

    successfulRender();
    await waitFor(() => {
      expect(screen.getByText("講師情報を読み込み中...")).toBeInTheDocument();
    });
  });

  test("should render error state when there is an error fetching teachers", async () => {
    vi.mocked(useStudentForEdit).mockReturnValue({
      student: mockStudent3,
      isNotFound: false,
      isLoading: false,
    });

    vi.mocked(useTeachersForStudent).mockReturnValue({
      loading: false,
      error: ["講師の情報の取得に失敗しました。"],
      teachers: [],
    });

    vi.mocked(useUpdateStudentMutation).mockReturnValue({
      isPending: false,
      mutate: vi.fn(),
    });

    successfulRender();
    await waitFor(() => {
      expect(
        screen.getByText("講師の情報の取得に失敗しました。")
      ).toBeInTheDocument();
    });
  });

  test("should render loading state when updating student", async () => {
    vi.mocked(useStudentForEdit).mockReturnValue({
      student: mockStudent3,
      isNotFound: false,
      isLoading: false,
    });

    vi.mocked(useTeachersForStudent).mockReturnValue({
      loading: false,
      error: null,
      teachers: [mockTeachers[0], mockTeachers[1]], // Teacher1, Teacher2
    });

    vi.mocked(useUpdateStudentMutation).mockReturnValue({
      isPending: true,
      mutate: vi.fn(),
    });

    successfulRender();
    await waitFor(() => {
      expect(screen.getByText("生徒情報を更新中...")).toBeInTheDocument();
    });
  });
});
