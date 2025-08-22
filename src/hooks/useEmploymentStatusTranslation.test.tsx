import { describe, expect, test } from 'vitest';
import { render, renderHook, screen } from '@testing-library/react';
import {
  resolveEmploymentStatusMeta,
  useEmploymentStatusTranslation,
} from './useEmploymentStatusTranslation';
import { EMPLOYMENT_STATUS_TRANSLATIONS } from '@/constants/teacherEmploymentStatusTranslation';

describe('useEmploymentStatusTranslation', () => {
  test('should return the correct translation for each employment status', () => {
    Object.entries(EMPLOYMENT_STATUS_TRANSLATIONS).forEach(([en, object]) => {
      const { label, color, Icon } = resolveEmploymentStatusMeta(en);
      expect(label).toBe(object.name);
      expect(color).toBe(object.color);
      expect(Icon).toBe(object.icon);

      const { result } = renderHook(() => useEmploymentStatusTranslation());
      const element = result.current.createEmploymentStatusBadge(en);

      render(element);

      expect(screen.getByText(label)).toBeInTheDocument();
      const iconElement = screen.getByTestId(`employment-status-icon-${en}`);
      expect(iconElement).toBeInTheDocument();
      expect(iconElement).toHaveClass(color);
    });
  });

  test('should return English without translation for unknown employment status', () => {
    const unknownEmploymentStatus = 'unknown employment status';

    const { label, color, Icon } = resolveEmploymentStatusMeta(
      unknownEmploymentStatus
    );
    expect(label).toBe(unknownEmploymentStatus);
    expect(color).toBe('');
    expect(Icon).toBeNull();

    const { result } = renderHook(() => useEmploymentStatusTranslation());
    const element = result.current.createEmploymentStatusBadge(
      unknownEmploymentStatus
    );
    render(element);

    expect(screen.getByText(unknownEmploymentStatus)).toBeInTheDocument();
  });
});
