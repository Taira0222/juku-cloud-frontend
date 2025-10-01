import type { NoteType } from "@/features/studentDashboard/type/studentDashboard";
import type { subjectType } from "@/features/students/types/students";
import {
  IconBook2,
  IconDotsCircleHorizontal,
  type TablerIcon,
} from "@tabler/icons-react";
import { School, type LucideIcon } from "lucide-react";

type NoteTypeAttr = {
  name: string;
  Icon: LucideIcon | TablerIcon;
  color: string;
};

export const NOTE_TYPE: Record<NoteType, NoteTypeAttr> = {
  homework: {
    name: "宿題",
    Icon: IconBook2,
    color: "fill-blue-200 ",
  },
  lesson: {
    name: "授業",
    Icon: School,
    color: "fill-orange-200 ",
  },
  other: {
    name: "その他",
    Icon: IconDotsCircleHorizontal,
    color: "fill-gray-100 ",
  },
};

export const HEADER_COLOR_BY_SUBJECT = {
  english: "bg-purple-100",
  japanese: "bg-rose-100",
  mathematics: "bg-blue-100",
  science: "bg-green-100",
  social_studies: "bg-yellow-100",
} satisfies Record<subjectType, string>;
