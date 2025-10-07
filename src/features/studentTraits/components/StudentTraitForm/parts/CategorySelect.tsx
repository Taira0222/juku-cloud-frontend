import { RequiredLabel } from "@/components/common/form/RequiredLabel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/form/Select/select";
import { TRAIT_CONFIG } from "@/features/studentTraits/constants/StudentTraitTable";
import type { CategoryType } from "@/features/studentTraits/types/studentTraits";

export type CategorySelectProps = {
  category?: CategoryType;
  onChange: (value?: CategoryType) => void;
};
// 型ガード
const isCategory = (value: string): value is CategoryType =>
  value in TRAIT_CONFIG;

export const CategorySelect = ({ category, onChange }: CategorySelectProps) => {
  const handleChange = (value: string) => {
    if (value === "") {
      onChange(undefined); // クリア
      return;
    }
    if (isCategory(value)) {
      onChange(value);
    }
  };

  return (
    <div className="space-y-1">
      <RequiredLabel htmlFor="noteType" required>
        分類を選択
      </RequiredLabel>
      <Select value={category ?? ""} onValueChange={handleChange}>
        <SelectTrigger id="category" aria-label="分類を選択">
          <SelectValue placeholder="分類を選択" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(TRAIT_CONFIG).map(([key, trait]) => (
            <SelectItem key={key} value={key}>
              {trait.text}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
