import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { resolveStatusMeta, statusBadgeUtils } from '../statusBadgeUtils';
import { EMPLOYMENT_STATUS_TRANSLATIONS } from '@/constants/teacherEmploymentStatusTranslation';
import { STUDENT_STATUS_TRANSLATIONS } from '@/constants/studentStatusTranslations';

describe('resolveStatusMeta', () => {
  test('should resolve status meta correctly for student', () => {
    Object.entries(STUDENT_STATUS_TRANSLATIONS).forEach(([key, value]) => {
      const result = resolveStatusMeta(key, 'student');

      const { label, color, Icon } = result;
      expect(label).toBe(value.name);
      expect(color).toBe(value.color);
      expect(Icon).toBeDefined();
    });
  });

  test('should resolve status meta correctly for others', () => {
    Object.entries(EMPLOYMENT_STATUS_TRANSLATIONS).forEach(([key, value]) => {
      const others = ['admin', 'teacher'];
      others.forEach((role) => {
        const result = resolveStatusMeta(key, role);

        const { label, color, Icon } = result;
        expect(label).toBe(value.name);
        expect(color).toBe(value.color);
        expect(Icon).toBeDefined();
      });
    });
  });

  test('should not resolve status meta for unknown', () => {
    const roles = ['admin', 'teacher', 'student'];
    roles.forEach((role) => {
      const result = resolveStatusMeta('unknown', role);

      const { label, color, Icon } = result;
      expect(label).toBe('unknown');
      expect(color).toBeFalsy();
      expect(Icon).toBeNull();
    });
  });
});

describe('statusBadgeUtils', () => {
  test('should translate students status correctly', () => {
    const result = statusBadgeUtils();
    Object.entries(STUDENT_STATUS_TRANSLATIONS).forEach(([key, value]) => {
      const element = result.createStatusBadge(key, 'student');
      render(element);

      expect(screen.getByText(value.name)).toBeInTheDocument();
      const icon = screen.getByTestId(`status-icon-${key}`);
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass(value.color!);
    });
  });

  test('should translate others status correctly', () => {
    const result = statusBadgeUtils();

    Object.entries(EMPLOYMENT_STATUS_TRANSLATIONS).forEach(([key, value]) => {
      const element = result.createStatusBadge(key, 'admin');
      render(element);

      expect(screen.getByText(value.name)).toBeInTheDocument();
      const icon = screen.getByTestId(`status-icon-${key}`);
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass(value.color!);
    });
  });
});
