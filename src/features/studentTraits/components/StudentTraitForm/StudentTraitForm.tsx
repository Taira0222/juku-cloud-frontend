import type { Mode } from "@/features/students/types/studentForm";
import { Button } from "@/components/ui/form/Button/button";
import { CategorySelect } from "./parts/CategorySelect";
import { CategoryField } from "./parts/CategoryField";
import type { StudentTraitFormProps } from "../../types/studentTraitForm";
import { studentTraitFormHandlers } from "../../utils/studentTraitHandlers";
import { TitleField } from "@/components/common/form/TitleField";
import { DescriptionField } from "@/components/common/form/DescriptionField";

export const StudentTraitForm = <M extends Mode>({
  mode,
  value,
  onChange,
  onSubmit,
  loading,
}: StudentTraitFormProps<M>) => {
  const H = studentTraitFormHandlers(onChange);
  const variant = "studentTrait";
  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(value);
        }}
        className="px-4 sm:px-6 py-6 space-y-5"
      >
        {/* 分類 (編集モードなら科目の表示だけ)*/}
        {mode === "edit" ? (
          <CategoryField category={value.category} />
        ) : (
          <CategorySelect
            category={value.category}
            onChange={H.handleSelectChange("category")}
          />
        )}

        {/* タイトル */}
        <TitleField
          variant={variant}
          title={value.title}
          onChange={H.handleInputChange}
        />

        {/* 説明 */}
        <DescriptionField
          variant={variant}
          description={value.description}
          onChange={H.handleTextAreaChange}
        />

        <div className="mt-6 gap-2 sm:justify-between">
          <Button type="submit" disabled={loading}>
            {mode === "edit" ? "更新" : "作成"}
          </Button>
        </div>
      </form>
    </>
  );
};
