import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';

import { SUBJECT_TRANSLATIONS } from '@/constants/subjectTranslations';
import { resolveSubjectMeta, subjectBadgeUtils } from '../subjectBadgeUtils';

describe('subjectBadgeUtils', () => {
  test('should return the correct translation for each subject', () => {
    Object.entries(SUBJECT_TRANSLATIONS).forEach(([en, object]) => {
      const { label, color, Icon } = resolveSubjectMeta(en);
      expect(label).toBe(object.name);
      expect(color).toBe(object.color);
      expect(Icon).toBe(object.icon);

      const result = subjectBadgeUtils();
      const element = result.createIconTranslationBadge(en);

      render(element);

      expect(screen.getByText(label)).toBeInTheDocument();
      expect(screen.getByText(label)).toHaveClass(color);
      expect(screen.getByTestId(`subject-icon-${en}`)).toBeInTheDocument();
    });
  });

  test('should return English without translation for unknown subject', () => {
    const unknownSubject = 'unknown subject';

    const { label, color, Icon } = resolveSubjectMeta(unknownSubject);
    expect(label).toBe(unknownSubject);
    expect(color).toBe('');
    expect(Icon).toBeNull();

    const result = subjectBadgeUtils();
    const element = result.createIconTranslationBadge(unknownSubject);
    render(element);

    expect(screen.getByText(unknownSubject)).toBeInTheDocument();
  });
});
