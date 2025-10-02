import type {
  ClassSubjectType,
  Meta,
} from "@/features/students/types/students";
import type { StudentTraitType } from "./studentTraits";

export type StudentTraitsTableProps = {
  subjects: ClassSubjectType[];
  studentId: number;
  studentTraits: StudentTraitType[];
  meta: Meta;
  isMobile: boolean;
};

export type StudentTraitsColumnsProps = {
  studentId: number;
  subjects: ClassSubjectType[];
  isMobile: boolean;
};

export type StudentTraitsRawActionsProps = {
  studentId: number;
  subjects: ClassSubjectType[];
  studentTrait: StudentTraitType;
};
