import { beforeEach, describe, expect, test, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useLessonNoteForm } from "../../hooks/useLessonNoteForm";
import { LessonNoteInitialValues } from "../../constants/lessonNoteForm";
import {
  initialLessonFormEditMockValue,
  lessonNoteCreateFormMockValue,
} from "@/tests/fixtures/lessonNotes/lessonNotes";

describe("useLessonNoteForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should initialize form state correctly for create mode", () => {
    const { result } = renderHook(() => useLessonNoteForm("create"));

    const { value, setValue, submit, reset } = result.current;

    expect(value).toEqual(LessonNoteInitialValues);
    expect(typeof setValue).toBe("function");
    expect(typeof submit).toBe("function");
    expect(typeof reset).toBe("function");
  });
  test("should initialize form state correctly for edit mode with initial data", () => {
    const initialData = {
      ...initialLessonFormEditMockValue,
    };

    const { result } = renderHook(() => useLessonNoteForm("edit", initialData));

    const { value } = result.current;
    expect(value).toEqual(initialData);
  });

  test("submit should validate and return correct payload for create mode", () => {
    const { result } = renderHook(() => useLessonNoteForm("create"));

    act(() => {
      result.current.setValue(lessonNoteCreateFormMockValue);
    });

    const onValidSpy = vi.fn();
    const onInvalidSpy = vi.fn();

    const submitResult = result.current.submit(onValidSpy, onInvalidSpy);
    expect(submitResult).toBe(true);
    expect(onValidSpy).toHaveBeenCalledWith(lessonNoteCreateFormMockValue);
    expect(onInvalidSpy).not.toHaveBeenCalled();
    act(() => {
      result.current.reset();
    });
    expect(result.current.value).toEqual(LessonNoteInitialValues);
  });

  test("submit should call onInvalid for invalid data for create mode", () => {
    const { result } = renderHook(() => useLessonNoteForm("create"));

    const overTitle = "a".repeat(51); // titleの最大長は50
    act(() => {
      result.current.setValue({
        ...lessonNoteCreateFormMockValue,
        title: overTitle,
      });
    });

    const onValidSpy = vi.fn();
    const onInvalidSpy = vi.fn();

    const submitResult = result.current.submit(onValidSpy, onInvalidSpy);
    expect(submitResult).toBe(false);
    expect(onValidSpy).not.toHaveBeenCalled();
    expect(onInvalidSpy).toHaveBeenCalledWith([
      "タイトルは50文字以内で入力してください",
    ]);
  });

  test("submit should validate and return correct payload for edit mode", () => {
    const initialData = {
      ...initialLessonFormEditMockValue,
    };
    const { result } = renderHook(() => useLessonNoteForm("edit", initialData));

    act(() => {
      result.current.setValue(initialLessonFormEditMockValue);
    });

    const onValidSpy = vi.fn();
    const onInvalidSpy = vi.fn();

    const submitResult = result.current.submit(onValidSpy, onInvalidSpy);
    expect(submitResult).toBe(true);
    expect(onValidSpy).toHaveBeenCalledWith({
      ...initialLessonFormEditMockValue,
    });
    expect(onInvalidSpy).not.toHaveBeenCalled();
    act(() => {
      result.current.reset();
    });
    expect(result.current.value).toEqual(initialData);
    expect(result.current.value.id).toBe(initialData.id);
  });
});
