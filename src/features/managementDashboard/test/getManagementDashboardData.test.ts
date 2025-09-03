import { describe, expect, test } from 'vitest';
import { getManagementDashboardData } from '../components/getManagementDashboardData';

describe('getManagementDashboardData', () => {
  test('navMain has 2 items for admin', () => {
    const result = getManagementDashboardData({
      role: 'admin',
      user: { name: 'admin user', email: 'admin@example.com' },
    });

    if (!result) {
      throw new Error('Failed to get management dashboard data');
    }
    const { user, navMain } = result;
    expect(user.name).toBe('admin user');
    expect(navMain).toHaveLength(2);
    expect(navMain.map((i) => i.url)).toEqual(['/students', '/teachers']);
    // icon は存在していれば十分（関数/コンポーネント参照）
    navMain.forEach((item) => {
      expect(item.icon).toBeTruthy();
      expect(typeof item.title).toBe('string');
      expect(typeof item.url).toBe('string');
    });
  });

  test('navMain has 1 item for teacher', () => {
    const result = getManagementDashboardData({
      role: 'teacher',
      user: { name: 'teacher user', email: 'teacher@example.com' },
    });
    if (!result) {
      throw new Error('Failed to get management dashboard data');
    }
    const { user, navMain } = result;
    expect(user.name).toBe('teacher user');
    expect(navMain).toHaveLength(1);
    expect(navMain[0].url).toBe('/students');
  });

  test('navMain does not have anything for empty', () => {
    const result = getManagementDashboardData({
      role: '',
      user: { name: '', email: '' },
    });
    expect(result).toBeNull();
  });
});
