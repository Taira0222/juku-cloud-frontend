import { AVAILABLE_DAYS, SUBJECTS } from '../constants/teachers';
import type { teacherDetailDrawer } from '../types/teachers';

type Props = {
  formData: {
    name: string;
    employment_status: string;
    subjects: string[];
    available_days: string[];
    student_ids: number[];
  };
  detailDrawer: teacherDetailDrawer[];
};

type formatSubjects = {
  id: number;
  name: string;
}[];

type formatDays = {
  id: number;
  name: string;
}[];

type formatStudents = {
  id: number;
  student_code: string;
  name: string;
  status: string;
  school_stage: string;
  grade: number;
}[];

export const useFormatEditData = ({ formData, detailDrawer }: Props) => {
  const formatSubjectsData = (): formatSubjects => {
    const filteredSubjects = SUBJECTS.filter((subject) =>
      formData.subjects.includes(subject.name)
    );
    return filteredSubjects.map((subject) => ({
      id: subject.id,
      name: subject.name,
    }));
  };

  const formatDaysData = (): formatDays => {
    const filteredDays = AVAILABLE_DAYS.filter((day) =>
      formData.available_days.includes(day.name)
    );
    return filteredDays.map((day) => ({
      id: day.id,
      name: day.name,
    }));
  };

  const formatStudentsData = (): formatStudents => {
    // 1) id→student の辞書を作って重複排除
    const studentById = new Map<
      number,
      (typeof detailDrawer)[number]['students'][number]
    >();
    for (const teacher of detailDrawer) {
      for (const student of teacher.students) {
        studentById.set(student.id, student); // 同じidがあれば上書き
      }
    }

    // ユーザーが選んだIDの順に安全に整形して返す
    return formData.student_ids.flatMap((id) => {
      const s = studentById.get(id);
      return s
        ? [
            {
              id,
              student_code: s.student_code,
              name: s.name,
              status: s.status,
              school_stage: s.school_stage,
              grade: Number(s.grade),
            },
          ]
        : [];
    });
  };

  return { formatSubjectsData, formatDaysData, formatStudentsData };
};
