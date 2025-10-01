import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { EditTeacherDialog } from "../../../components/dialogs/EditTeacherDialog";
import { useTeachersStore } from "@/stores/teachersStore";
import { detailDrawer } from "../../../../../tests/fixtures/teachers/teachers";
import { Toaster } from "@/components/ui/feedback/Sonner/sonner";
import { useTeacherSubmit } from "@/features/teachers/hooks/useTeacherSubmit";

const ForbiddenPage = () => <div data-testid="forbidden">Forbidden</div>;
const TeachersPage = () => <div data-testid="teachers-page">Teachers Page</div>;

const renderWithRouter = (initialPath: string, background?: Location) => {
  return render(
    <MemoryRouter
      initialEntries={[
        "/teachers", // 戻り先（1件目）
        {
          pathname: initialPath,
          state: background ? { background } : undefined,
        },
      ]}
      initialIndex={1} // ← 2件目（編集）から開始
    >
      <Toaster position="top-right" />
      <Routes>
        <Route
          path="/teachers/:teacherId/edit"
          element={<EditTeacherDialog />}
        />
        <Route path="/forbidden" element={<ForbiddenPage />} />
        <Route path="/teachers" element={<TeachersPage />} />
      </Routes>
    </MemoryRouter>
  );
};

const successfulRender = () => {
  useTeachersStore.setState({
    detailDrawer: detailDrawer,
  });
  const initialPath = "/teachers/1/edit";
  const background = { pathname: "/teachers" } as Location;
  renderWithRouter(initialPath, background);
};

vi.mock("@/features/teachers/hooks/useTeacherSubmit", () => {
  return {
    useTeacherSubmit: vi.fn(),
  };
});

describe("EditTeacherDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("redirects to forbidden page if background is undefined", () => {
    vi.mocked(useTeacherSubmit).mockReturnValue({
      handleSubmit: vi.fn(),
      loading: true,
      error: null,
    });
    renderWithRouter("/teachers/1/edit", undefined);

    expect(screen.getByTestId("forbidden")).toBeInTheDocument();
  });

  test("redirects to teachers page if teacher does not find", () => {
    vi.mocked(useTeacherSubmit).mockReturnValue({
      handleSubmit: vi.fn(),
      loading: true,
      error: null,
    });
    const background = { pathname: "/teachers" } as Location;
    renderWithRouter("/teachers/unknown/edit", background);

    expect(screen.getByTestId("teachers-page")).toBeInTheDocument();
  });

  test("renders successful edit dialog if teacher is found and background is set", () => {
    vi.mocked(useTeacherSubmit).mockReturnValue({
      handleSubmit: vi.fn(),
      loading: false,
      error: null,
    });
    successfulRender();
    expect(screen.getByLabelText(/講師の名前/)).toBeInTheDocument();
  });

  test("renders loading state when useTeacherSubmit is loading", () => {
    vi.mocked(useTeacherSubmit).mockReturnValue({
      handleSubmit: vi.fn(),
      loading: true,
      error: null,
    });

    successfulRender();

    expect(screen.getByText("読み込み中")).toBeInTheDocument();
  });

  test("renders error state when useTeacherSubmit has error", () => {
    vi.mocked(useTeacherSubmit).mockReturnValue({
      handleSubmit: vi.fn(),
      loading: false,
      error: ["Error occurred"],
    });
    successfulRender();

    expect(screen.getByText("Error occurred")).toBeInTheDocument();
  });
});
