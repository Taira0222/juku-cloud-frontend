import { describe, expect, test } from 'vitest';
import { getManagementDashboardData } from '../components/getManagementDashboardData';

describe('getManagementDashboardData', () => {
  test('navMain has 4 items for admin', () => {
    const { navMain, user } = getManagementDashboardData({
      role: 'admin',
      user: { name: 'admin user', email: 'admin@example.com' },
    });

    expect(user.name).toBe('admin user');
    expect(navMain).toHaveLength(4);
    expect(navMain.map((i) => i.url)).toEqual([
      '/students',
      '/teachers',
      '/subjects',
      '/learning_materials',
    ]);
    // icon は存在していれば十分（関数/コンポーネント参照）
    navMain.forEach((item) => {
      expect(item.icon).toBeTruthy();
      expect(typeof item.title).toBe('string');
      expect(typeof item.url).toBe('string');
    });
  });

  test('navMain has 1 item for teacher', () => {
    const { user, navMain } = getManagementDashboardData({
      role: 'teacher',
      user: { name: 'teacher user', email: 'teacher@example.com' },
    });
    expect(user.name).toBe('teacher user');
    expect(navMain).toHaveLength(1);
    expect(navMain[0].url).toBe('/students');
  });

  test('navMain has 1 item for null', () => {
    const { navMain } = getManagementDashboardData({
      role: null,
      user: { name: null, email: null },
    });
    expect(navMain).toHaveLength(1);
    expect(navMain[0].url).toBe('/students');
  });
});
