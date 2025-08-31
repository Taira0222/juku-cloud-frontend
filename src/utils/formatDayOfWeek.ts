import { DAY_OF_WEEK_TRANSLATIONS } from '@/constants/dayOfWeekTranslations';

export const formatDayOfWeek = (en: string) => {
  return DAY_OF_WEEK_TRANSLATIONS[en] ?? en;
};
