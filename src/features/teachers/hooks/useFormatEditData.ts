import { AVAILABLE_DAYS, SUBJECTS } from '../constants/teachers';

type Props = {
  formData: {
    name: string;
    employment_status: string;
    subjects: string[];
    available_days: string[];
  };
};

type formatSubjects = {
  id: number;
  name: string;
}[];

type formatDays = {
  id: number;
  name: string;
}[];

export const useFormatEditData = ({ formData }: Props) => {
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

  return { formatSubjectsData, formatDaysData };
};
