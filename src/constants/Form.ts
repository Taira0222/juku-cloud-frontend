import { STUDENT_STATUS_TRANSLATIONS } from "./studentStatusTranslations";
import { EMPLOYMENT_STATUS_TRANSLATIONS } from "./teacherEmploymentStatusTranslation";

export const NAME_FIELD_PROPS = {
  Draft: {
    htmlFor: "studentName",
    id: "studentName",
    label: "生徒の名前",
    placeholder: "生徒の名前を入力してください",
  },
  EditDraft: {
    htmlFor: "studentName",
    id: "studentName",
    label: "生徒の名前",
    placeholder: "生徒の名前を入力してください",
  },
  TeacherFormData: {
    htmlFor: "teacherName",
    id: "teacherName",
    label: "講師の名前",
    placeholder: "講師の名前を入力してください",
  },
};

export const STATUS_SELECT_PROPS = {
  Draft: {
    htmlFor: "status",
    id: "status",
    label: "通塾状況",
    TRANSLATIONS: STUDENT_STATUS_TRANSLATIONS,
  },
  EditDraft: {
    htmlFor: "status",
    id: "status",
    label: "通塾状況",
    TRANSLATIONS: STUDENT_STATUS_TRANSLATIONS,
  },
  TeacherFormData: {
    htmlFor: "employmentStatus",
    id: "employmentStatus",
    label: "出勤状況",
    TRANSLATIONS: EMPLOYMENT_STATUS_TRANSLATIONS,
  },
};
