import { ConfirmDialog } from "@/components/common/status/ConfirmDialog";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

const onCancel = vi.fn();
const onConfirm = vi.fn();
const onOpenChange = vi.fn();

describe("ConfirmDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  test("renders correctly with jsx description", () => {
    const mockProps = {
      title: "Confirm Action",
      description: (
        <>
          <span>Are you sure you want to proceed?</span>
        </>
      ),
      confirmText: "Confirm",
      open: true,
      onCancel,
      onConfirm,
      onOpenChange,
    };
    render(<ConfirmDialog {...mockProps} />);
    expect(screen.getByText("Confirm Action")).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to proceed?")
    ).toBeInTheDocument();
    expect(screen.getByText("キャンセル")).toBeInTheDocument();
    expect(screen.getByText("Confirm")).toBeInTheDocument();
  });

  test("renders correctly with string description", () => {
    const mockProps = {
      title: "Confirm Action",
      description: "Are you sure you want to proceed?",
      confirmText: "Confirm",
      open: true,
      onCancel,
      onConfirm,
      onOpenChange,
    };
    render(<ConfirmDialog {...mockProps} />);
    expect(screen.getByText("Confirm Action")).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to proceed?")
    ).toBeInTheDocument();
    expect(screen.getByText("キャンセル")).toBeInTheDocument();
    expect(screen.getByText("Confirm")).toBeInTheDocument();
  });
});
