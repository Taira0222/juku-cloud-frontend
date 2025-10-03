import type { subjectType } from "@/features/students/types/students";
import {
  IconAlphabetLatin,
  IconBook,
  IconMap,
  IconMathSymbols,
  IconMicroscope,
  type TablerIcon,
} from "@tabler/icons-react";

type SubjectTranslation = {
  id: number;
  name: string;
  icon: TablerIcon;
  color: string;
};

export const SUBJECT_TRANSLATIONS: Record<string, SubjectTranslation> = {
  english: {
    id: 1,
    name: "英語",
    icon: IconAlphabetLatin,
    color: "bg-purple-100",
  },
  japanese: {
    id: 2,
    name: "国語",
    icon: IconBook,
    color: "bg-red-100",
  },
  mathematics: {
    id: 3,
    name: "数学",
    icon: IconMathSymbols,
    color: "bg-blue-100",
  },
  science: {
    id: 4,
    name: "理科",
    icon: IconMicroscope,
    color: "bg-green-100",
  },
  social_studies: {
    id: 5,
    name: "社会",
    icon: IconMap,
    color: "bg-yellow-100",
  },
};

// 本来は上記の型を変更するべきだが、影響範囲が広い可能性があるため新たに定義
export const SUBJECT_JA_NAMES = {
  english: {
    name: "英語",
  },
  japanese: {
    name: "国語",
  },
  mathematics: {
    name: "数学",
  },
  science: {
    name: "理科",
  },
  social_studies: {
    name: "社会",
  },
} as const satisfies Record<subjectType, { name: string }>;
