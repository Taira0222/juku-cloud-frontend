import {
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconUserPause,
  type TablerIcon,
} from '@tabler/icons-react';

type EmploymentStatusTranslation = {
  name: string;
  icon?: TablerIcon;
  color?: string;
};

export const EMPLOYMENT_STATUS_TRANSLATIONS: Record<
  string,
  EmploymentStatusTranslation
> = {
  active: {
    name: '在籍',
    icon: IconCircleCheckFilled,
    color: 'fill-green-500 dark:fill-green-400',
  },
  inactive: {
    name: '退職',
    icon: IconCircleXFilled,
    color: 'fill-gray-500 dark:fill-gray-400',
  },
  on_leave: {
    name: '休暇中',
    icon: IconUserPause,
    color: 'fill-blue-500 dark:fill-blue-400',
  },
};
