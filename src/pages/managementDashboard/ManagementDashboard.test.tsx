import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ManagementDashboard } from './ManagementDashboard';
import { getManagementDashboardData } from '@/features/managementDashboard/components/getManagementDashboardData';
import {
  IconBook2,
  IconBooks,
  IconUser,
  IconUserStar,
} from '@tabler/icons-react';
import { useUserStore } from '@/stores/userStore';

describe('ManagementDashboard component unit tests', () => {
  vi.mock(
    '@/features/managementDashboard/components/getManagementDashboardData',
    () => ({
      getManagementDashboardData: vi.fn(),
    })
  );
  vi.mock('@/stores/userStore', () => ({
    useUserStore: vi.fn(),
  }));

  test('renders ManagementDashboard component for admin ', () => {
    const userInfo = {
      name: 'admin user',
      email: 'admin@example.com',
      role: 'admin',
      school: 'First_school',
    };

    vi.mocked(useUserStore).mockImplementation(() => ({
      user: userInfo,
    }));

    vi.mocked(getManagementDashboardData).mockReturnValue({
      user: {
        name: userInfo.name,
        email: userInfo.email,
      },
      navMain: [
        { title: '生徒一覧', url: '/students', icon: IconUser },
        { title: '講師一覧', url: '/teachers', icon: IconUserStar },
        { title: '指導科目', url: '/subjects', icon: IconBook2 },
        {
          title: '使用教材',
          url: '/learning_materials',
          icon: IconBooks,
        },
      ],
    });

    render(
      <MemoryRouter>
        <ManagementDashboard />
      </MemoryRouter>
    );

    const studentsLink = screen.getByText('生徒一覧');
    const teachersLink = screen.getByText('講師一覧');
    const subjectsLink = screen.getByText('指導科目');
    const learningMaterialsLink = screen.getByText('使用教材');

    expect(studentsLink).toBeInTheDocument();
    expect(teachersLink).toBeInTheDocument();
    expect(subjectsLink).toBeInTheDocument();
    expect(learningMaterialsLink).toBeInTheDocument();
  });

  test('renders ManagementDashboard component for teacher', () => {
    const userInfo = {
      name: 'teacher user',
      email: 'teacher@example.com',
      role: 'teacher',
      school: 'First_school',
    };

    vi.mocked(useUserStore).mockImplementation(() => ({
      user: userInfo,
    }));

    vi.mocked(getManagementDashboardData).mockReturnValue({
      user: {
        name: userInfo.name,
        email: userInfo.email,
      },
      navMain: [{ title: '生徒一覧', url: '/students', icon: IconUser }],
    });

    render(
      <MemoryRouter>
        <ManagementDashboard />
      </MemoryRouter>
    );

    const studentsLink = screen.getByText('生徒一覧');

    expect(studentsLink).toBeInTheDocument();
    expect(screen.queryByText('講師一覧')).not.toBeInTheDocument();
    expect(screen.queryByText('指導科目')).not.toBeInTheDocument();
    expect(screen.queryByText('使用教材')).not.toBeInTheDocument();
  });
});
