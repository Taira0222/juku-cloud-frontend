import {
  SubjectField,
  type SubjectFieldProps,
} from "@/features/lessonNotes/components/LessonNoteForm/parts/SubjectField";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

const wrapper = (props: SubjectFieldProps) => {
  render(<SubjectField {...props} />);
};

describe("SubjectField", () => {
  test("renders correctly", () => {
    const mockProps: SubjectFieldProps = {
      subject_id: 1, // 英語
      subjects: [
        { id: 1, name: "english" },
        { id: 3, name: "mathematics" },
      ],
    };

    wrapper(mockProps);

    expect(screen.getByText("科目")).toBeInTheDocument();
    expect(screen.getByText("英語")).toBeInTheDocument();
  });

  test("renders '不明な科目' when subject is not found", () => {
    const mockProps: SubjectFieldProps = {
      subject_id: 999, // 存在しないID
      subjects: [
        { id: 1, name: "english" },
        { id: 3, name: "mathematics" },
      ],
    };

    wrapper(mockProps);

    expect(screen.getByText("不明な科目")).toBeInTheDocument();
  });
});
