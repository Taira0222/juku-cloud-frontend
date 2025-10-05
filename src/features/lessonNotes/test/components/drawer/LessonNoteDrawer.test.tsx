import {
  LessonNoteDrawer,
  type LessonNoteDrawerProps,
} from "@/features/lessonNotes/components/drawer/LessonNoteDrawer";
import { lessonNote1 } from "@/tests/fixtures/lessonNotes/lessonNotes";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { format, parseISO } from "date-fns";
import { expect } from "vitest";
import { describe, test } from "vitest";

describe("LessonNoteDrawer", () => {
  const wrapper = (props: LessonNoteDrawerProps) => {
    render(<LessonNoteDrawer {...props} />);
  };

  test("renders correctly", async () => {
    const user = userEvent.setup();
    const mockProps: LessonNoteDrawerProps = {
      lessonNote: {
        title: lessonNote1.title,
        description: lessonNote1.description,
        expire_date: lessonNote1.expire_date,
        created_by_name: lessonNote1.created_by_name,
        created_at: lessonNote1.created_at,
        last_updated_by_name: lessonNote1.last_updated_by_name,
        updated_at: lessonNote1.updated_at,
      },
    };

    const expireDate = format(parseISO(lessonNote1.expire_date), "yyyy/MM/dd");
    const createdAt = format(parseISO(lessonNote1.created_at), "yyyy/MM/dd");
    const updatedAt = format(parseISO(lessonNote1.updated_at), "yyyy/MM/dd");

    wrapper({ ...mockProps });
    const trigger = screen.getByRole("button", { name: lessonNote1.title });
    await user.click(trigger);

    expect(screen.getByText("引継ぎ事項の詳細情報")).toBeInTheDocument();
    expect(screen.getByText(lessonNote1.title)).toBeInTheDocument();
    expect(screen.getByText(lessonNote1.description!)).toBeInTheDocument();
    expect(screen.getByText(expireDate)).toBeInTheDocument();
    expect(screen.getByText(lessonNote1.created_by_name)).toBeInTheDocument();
    expect(screen.getByText(createdAt)).toBeInTheDocument();
    expect(
      screen.getByText(lessonNote1.last_updated_by_name!)
    ).toBeInTheDocument();
    expect(screen.getByText(updatedAt)).toBeInTheDocument();
  });

  test("does not render description and last updated info when they are null", async () => {
    const user = userEvent.setup();
    const mockProps: LessonNoteDrawerProps = {
      lessonNote: {
        title: lessonNote1.title,
        description: null,
        expire_date: lessonNote1.expire_date,
        created_by_name: lessonNote1.created_by_name,
        created_at: lessonNote1.created_at,
        last_updated_by_name: null,
        updated_at: lessonNote1.created_at, // 新規作成の場合、更新日と作成日が同じ
      },
    };
    wrapper({ ...mockProps });
    const trigger = screen.getByRole("button", { name: lessonNote1.title });
    await user.click(trigger);

    expect(
      screen.getByText("詳細の説明は特にありません。")
    ).toBeInTheDocument();
    // 最終更新者や更新日がないと--- と表示される
    const dashes = screen.getAllByText(/^---$/);
    expect(dashes).toHaveLength(2);
  });
});
