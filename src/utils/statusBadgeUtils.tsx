import { Badge } from '@/components/ui/display/Badge/badge';
import { STUDENT_STATUS_TRANSLATIONS } from '@/constants/studentStatusTranslations';
import { EMPLOYMENT_STATUS_TRANSLATIONS } from '@/constants/teacherEmploymentStatusTranslation';

export const resolveStatusMeta = (en: string, role: string) => {
  const translations =
    role === 'student'
      ? STUDENT_STATUS_TRANSLATIONS
      : EMPLOYMENT_STATUS_TRANSLATIONS;
  const meta = translations[en];
  return {
    label: meta?.name ?? en,
    color: meta?.color ?? '',
    Icon: meta?.icon ?? null,
  };
};

export const statusBadgeUtils = () => {
  const createStatusBadge = (en: string, role: string) => {
    const { label, color, Icon } = resolveStatusMeta(en, role);
    return (
      <Badge variant="outline" className={'text-muted-foreground px-1.5 mx-1 '}>
        {Icon && (
          <Icon
            aria-hidden="true"
            data-testid={`status-icon-${en}`}
            className={`${color}`}
          />
        )}
        {label}
      </Badge>
    );
  };
  return { createStatusBadge };
};
