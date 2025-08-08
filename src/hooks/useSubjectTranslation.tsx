// hooks/useSubjectTranslation.ts
import { Badge } from '@/components/ui/display/Badge/badge';
import { SUBJECT_TRANSLATIONS } from '@/constants/subjectTranslations';

export const useSubjectTranslation = () => {
  const translate = (en: string) => SUBJECT_TRANSLATIONS[en]?.name ?? en;

  const createIconTranslationBadge = (en: string) => {
    const meta = SUBJECT_TRANSLATIONS[en];
    const Icon = meta?.icon;
    return (
      <Badge
        variant="outline"
        className={`text-muted-foreground px-1.5 mx-1 ${meta.color}`}
      >
        {Icon ? <Icon /> : <span>{translate(en)}</span>}
        {translate(en)}
      </Badge>
    );
  };
  return { translate, createIconTranslationBadge };
};
