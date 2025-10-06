import { describe, expect, test } from "vitest";
import { columnsUtils } from "../../utils/columnsUtils";
import { addDays, format } from "date-fns";
import { render, screen } from "@testing-library/react";

describe("columnsUtils", () => {
  test("formatExpireDate renders correctly", () => {
    const { formatExpireDate } = columnsUtils();
    const tomorrow = addDays(new Date(), 1);
    const isoString = format(tomorrow, "yyyy-MM-dd");
    const displayDate = format(tomorrow, "yyyy/MM/dd");
    render(<>{formatExpireDate(isoString)}</>);
    expect(screen.getByText(displayDate)).toBeInTheDocument();
  });
  test("formatExpireDate renders expired badge when the date is past", () => {
    const { formatExpireDate } = columnsUtils();
    const yesterday = addDays(new Date(), -1);
    const isoString = format(yesterday, "yyyy-MM-dd");
    render(<>{formatExpireDate(isoString)}</>);
    expect(screen.getByText("期限切れ")).toBeInTheDocument();
  });
  test("formatExpireDate does not render when iso string is empty", () => {
    const { formatExpireDate } = columnsUtils();
    render(<>{formatExpireDate("")}</>);
    expect(screen.getByText("無効な日付")).toBeInTheDocument();
  });

  test("formatNoteType renders correctly", () => {
    const { formatNoteType } = columnsUtils();
    render(<>{formatNoteType("lesson")}</>);
    expect(screen.getByText("授業")).toBeInTheDocument();
    expect(screen.getByTestId("lesson-note-icon-lesson")).toBeInTheDocument();
  });
});
