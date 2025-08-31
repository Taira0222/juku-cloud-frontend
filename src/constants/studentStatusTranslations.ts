import {
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconUserPause,
  type TablerIcon,
} from '@tabler/icons-react';

type StudentStatusTranslation = {
  name: string;
  icon?: TablerIcon;
  color?: string;
};

export const STUDENT_STATUS_TRANSLATIONS: Record<
  string,
  StudentStatusTranslation
> = {
  active: {
    name: '通塾中',
    icon: IconCircleCheckFilled,
    color: 'fill-green-500 dark:fill-green-400',
  },
  inactive: {
    name: '退塾',
    icon: IconCircleXFilled,
    color: 'fill-gray-500 dark:fill-gray-400',
  },
  on_leave: {
    name: '休暇中',
    icon: IconUserPause,
    color: 'fill-blue-500 dark:fill-blue-400',
  },
  graduated: {
    name: '卒業',
    icon: IconUserPause,
    color: 'fill-yellow-500 dark:fill-yellow-400',
  },
};
