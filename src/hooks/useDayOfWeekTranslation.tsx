import { DAY_OF_WEEK_TRANSLATIONS } from '@/constants/dayOfWeekTranslations';

export const useDayOfWeekTranslation = () => {
  const translate = (en: string) => DAY_OF_WEEK_TRANSLATIONS[en] ?? en;

  return { translate };
};
