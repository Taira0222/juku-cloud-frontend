import type {
  teacherDataTable,
  teacherDetailDrawer,
  updateTeacherData,
} from '@/features/teachers/types/teachers';
import { create } from 'zustand';

type Teachers = {
  dataTable: teacherDataTable[];
  detailDrawer: teacherDetailDrawer[];
  setDataTable: (data: teacherDataTable[]) => void;
  setDetailDrawer: (data: teacherDetailDrawer[]) => void;
  getTeacherData: (id: number) => teacherDetailDrawer | undefined;
  deleteTeacherLocal: (id: number) => void;
  updateTeacherLocal: (id: number, updatedData: updateTeacherData) => void;
};

export const useTeachersStore = create<Teachers>((set, get) => ({
  dataTable: [],
  detailDrawer: [],
  setDataTable: (data) => {
    set({ dataTable: data });
  },
  setDetailDrawer: (data) => {
    set({ detailDrawer: data });
  },
  getTeacherData: (id: number) => {
    return get().detailDrawer.find((teacher) => teacher.id === id);
  },
  deleteTeacherLocal: (id: number) => {
    set((state) => ({
      detailDrawer: state.detailDrawer.filter((teacher) => teacher.id !== id),
      dataTable: state.dataTable.filter((teacher) => teacher.id !== id),
    }));
  },
  updateTeacherLocal: (id: number, updatedData: updateTeacherData) => {
    set((state) => ({
      dataTable: state.dataTable.map((teacher) =>
        teacher.id === id
          ? {
              ...teacher, // 既存の教師データを保持しつつ、更新されたフィールドのみ上書き
              name: updatedData.name,
              employment_status: updatedData.employment_status,
              class_subjects: updatedData.subjects ?? [],
            }
          : teacher
      ),
      detailDrawer: state.detailDrawer.map((teacher) =>
        teacher.id === id
          ? {
              ...teacher,
              name: updatedData.name,
              employment_status: updatedData.employment_status,
              available_days: updatedData.available_days ?? [],
              class_subjects: updatedData.subjects ?? [],
            }
          : teacher
      ),
    }));
  },
}));
