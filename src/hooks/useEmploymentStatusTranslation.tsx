import { Badge } from '@/components/ui/display/Badge/badge';

import { EMPLOYMENT_STATUS_TRANSLATIONS } from '@/constants/teacherEmploymentStatusTranslation';

export const resolveEmploymentStatusMeta = (en: string) => {
  const meta = EMPLOYMENT_STATUS_TRANSLATIONS[en];
  return {
    label: meta?.name ?? en,
    color: meta?.color ?? '',
    Icon: meta?.icon ?? null,
  };
};

export const useEmploymentStatusTranslation = () => {
  const createEmploymentStatusBadge = (en: string) => {
    const { label, color, Icon } = resolveEmploymentStatusMeta(en);
    return (
      <Badge variant="outline" className={'text-muted-foreground px-1.5 mx-1 '}>
        {Icon && (
          <Icon
            aria-hidden="true"
            data-testid={`employment-status-icon-${en}`}
            className={`${color}`}
          />
        )}
        {label}
      </Badge>
    );
  };
  return { createEmploymentStatusBadge };
};
