import { beforeEach, describe, expect, test, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useStudentTraitForm } from "../../hooks/useStudentTraitForm";
import { StudentTraitInitialValues } from "../../constants/studentTraitForm";
import {
  initialStudentTraitFormEditMockValue,
  StudentTraitCreateFormMockValue,
} from "@/tests/fixtures/studentTraits/studentTraits";

describe("useStudentTraitForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should initialize form state correctly for create mode", () => {
    const { result } = renderHook(() => useStudentTraitForm("create"));

    const { value, setValue, submit, reset } = result.current;

    expect(value).toEqual(StudentTraitInitialValues);
    expect(typeof setValue).toBe("function");
    expect(typeof submit).toBe("function");
    expect(typeof reset).toBe("function");
  });
  test("should initialize form state correctly for edit mode with initial data", () => {
    const initialData = {
      ...initialStudentTraitFormEditMockValue,
    };

    const { result } = renderHook(() =>
      useStudentTraitForm("edit", initialData)
    );

    const { value } = result.current;
    expect(value).toEqual(initialData);
  });

  test("submit should validate and return correct payload for create mode", () => {
    const { result } = renderHook(() => useStudentTraitForm("create"));

    act(() => {
      result.current.setValue(StudentTraitCreateFormMockValue);
    });

    const onValidSpy = vi.fn();
    const onInvalidSpy = vi.fn();

    const submitResult = result.current.submit(onValidSpy, onInvalidSpy);
    expect(submitResult).toBe(true);
    expect(onValidSpy).toHaveBeenCalledWith(StudentTraitCreateFormMockValue);
    expect(onInvalidSpy).not.toHaveBeenCalled();
    act(() => {
      result.current.reset();
    });
    expect(result.current.value).toEqual(StudentTraitInitialValues);
  });

  test("submit should call onInvalid for invalid data for create mode", () => {
    const { result } = renderHook(() => useStudentTraitForm("create"));

    const overTitle = "a".repeat(51); // titleの最大長は50
    act(() => {
      result.current.setValue({
        ...StudentTraitCreateFormMockValue,
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
      ...initialStudentTraitFormEditMockValue,
    };
    const { result } = renderHook(() =>
      useStudentTraitForm("edit", initialData)
    );

    act(() => {
      result.current.setValue(initialStudentTraitFormEditMockValue);
    });

    const onValidSpy = vi.fn();
    const onInvalidSpy = vi.fn();

    const submitResult = result.current.submit(onValidSpy, onInvalidSpy);
    expect(submitResult).toBe(true);
    expect(onValidSpy).toHaveBeenCalledWith({
      ...initialStudentTraitFormEditMockValue,
    });
    expect(onInvalidSpy).not.toHaveBeenCalled();
    act(() => {
      result.current.reset();
    });
    expect(result.current.value).toEqual(initialData);
    expect(result.current.value.id).toBe(initialData.id);
  });
});
