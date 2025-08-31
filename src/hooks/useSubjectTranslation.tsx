import { Badge } from '@/components/ui/display/Badge/badge';
import { SUBJECT_TRANSLATIONS } from '@/constants/subjectTranslations';

const resolveSubjectMeta = (en: string) => {
  const meta = SUBJECT_TRANSLATIONS[en];
  return {
    label: meta?.name ?? en,
    color: meta?.color ?? '',
    Icon: meta?.icon ?? null,
  };
};

export const useSubjectTranslation = () => {
  const createIconTranslationBadge = (en: string) => {
    const { label, color, Icon } = resolveSubjectMeta(en);
    return (
      <Badge
        variant="outline"
        className={`text-muted-foreground px-1.5 mx-1 ${color}`}
      >
        {Icon && <Icon aria-hidden="true" data-testid={`subject-icon-${en}`} />}
        {label}
      </Badge>
    );
  };
  return { createIconTranslationBadge };
};
