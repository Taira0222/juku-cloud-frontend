import { describe, expect, test } from 'vitest';
import { render, renderHook, screen } from '@testing-library/react';
import {
  resolveSubjectMeta,
  useSubjectTranslation,
} from './useSubjectTranslation';
import { SUBJECT_TRANSLATIONS } from '@/constants/subjectTranslations';

describe('useSubjectTranslation', () => {
  test('should return the correct translation for each subject', () => {
    Object.entries(SUBJECT_TRANSLATIONS).forEach(([en, object]) => {
      const { label, color, Icon } = resolveSubjectMeta(en);
      expect(label).toBe(object.name);
      expect(color).toBe(object.color);
      expect(Icon).toBe(object.icon);

      const { result } = renderHook(() => useSubjectTranslation());
      const element = result.current.createIconTranslationBadge(en);

      render(element);

      expect(screen.getByText(label)).toBeInTheDocument();
      expect(screen.getByText(label)).toHaveClass(color);
      expect(screen.getByTestId(`subject-icon-${en}`)).toBeInTheDocument();
    });
  });

  test('should return english without translation for unknown subject', () => {
    const UNKNOWN_SUBJECT_TRANSLATION = {
      physical_education: {
        name: '体育',
        icon: null,
        color: 'bg-blue-100',
      },
    };
    Object.keys(UNKNOWN_SUBJECT_TRANSLATION).forEach((en) => {
      const { label, color, Icon } = resolveSubjectMeta(en);
      expect(label).toBe(en);
      expect(color).toBe('');
      expect(Icon).toBeNull();

      const { result } = renderHook(() => useSubjectTranslation());
      const element = result.current.createIconTranslationBadge(en);

      render(element);

      expect(screen.getByText(en)).toBeInTheDocument();
    });
  });
});
