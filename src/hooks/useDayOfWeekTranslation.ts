import { DAY_OF_WEEK_TRANSLATIONS } from '@/constants/dayOfWeekTranslations';

export const useDayOfWeekTranslation = () => {
  const translateDayOfWeek = (en: string) => DAY_OF_WEEK_TRANSLATIONS[en] ?? en;

  return { translateDayOfWeek };
};
