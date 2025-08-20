import type {
  teacherDataTable,
  teacherDetailDrawer,
} from '@/features/teachers/types/teachers';
import { create } from 'zustand';

type Teachers = {
  dataTable: teacherDataTable[];
  detailDrawer: teacherDetailDrawer[];
  setDataTable: (data: teacherDataTable[]) => void;
  setDetailDrawer: (data: teacherDetailDrawer[]) => void;
  getTeacherData: (id: number) => teacherDetailDrawer | undefined;
  deleteTeacherLocal: (id: number) => void;
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
}));
