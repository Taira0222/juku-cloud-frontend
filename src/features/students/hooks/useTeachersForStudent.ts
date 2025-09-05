import { useTeachersStore } from '@/stores/teachersStore';
import { useFetchTeachers } from '@/features/teachers/queries/useFetchTeachers';
import { useFormatTeachersData } from '@/features/teachers/hooks/useFormatTeachersData';

export const useTeachersForStudent = (enabled: boolean) => {
  const detailDrawer = useTeachersStore((s) => s.detailDrawer);
  const isStoreEmpty = (detailDrawer?.length ?? 0) === 0;
  const needFetch = enabled && isStoreEmpty;

  const { loading, error, currentUserData, teachersData } =
    useFetchTeachers(needFetch);
  useFormatTeachersData(
    currentUserData,
    teachersData,
    needFetch && !!teachersData
  );

  const teachers = (detailDrawer ?? []).map((t) => ({
    id: t.id,
    name: t.name,
    teachable_subjects: t.class_subjects,
    workable_days: t.available_days,
  }));

  return { loading, error, teachers };
};
