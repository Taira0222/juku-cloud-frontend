import type { Meta } from "@/features/students/types/students";
import type { StudentTraitType } from "./studentTraits";

export type StudentTraitsTableProps = {
  studentId: number;
  studentTraits: StudentTraitType[];
  meta: Meta;
  isMobile: boolean;
};

export type StudentTraitsColumnsProps = {
  studentId: number;
  isMobile: boolean;
};

export type StudentTraitsRawActionsProps = {
  studentId: number;
  studentTrait: StudentTraitType;
};
