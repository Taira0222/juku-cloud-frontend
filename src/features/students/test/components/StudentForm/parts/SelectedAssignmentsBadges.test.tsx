import {
  SelectedAssignmentsBadges,
  type SelectedAssignmentsBadgesProps,
} from '@/features/students/components/StudentForm/parts/SelectedAssignmentsBadges';
import { mockTeachers } from '@/tests/fixtures/students/students';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

describe('SelectedAssignmentsBadges', () => {
  const wrapper = (props: SelectedAssignmentsBadgesProps) => {
    render(<SelectedAssignmentsBadges {...props} />);
  };

  test('should render correctly', async () => {
    const user = userEvent.setup();
    const mockProps: SelectedAssignmentsBadgesProps = {
      assignments: [
        {
          teacher_id: mockTeachers[0].id,
          subject_id: 1,
          day_id: 3,
        },
      ],
      teachers: [mockTeachers[0], mockTeachers[1]], // teacher1, teacher2
      untoggle: vi.fn(() => {}),
    };

    wrapper(mockProps);
    const teacher1Badge = screen.getByText(`${mockTeachers[0].name}(火,英語)`);
    expect(teacher1Badge).toBeInTheDocument();

    // badge をクリックするとuntoggle が呼ばれる
    await user.click(teacher1Badge);
    expect(mockProps.untoggle).toHaveBeenCalledWith({
      teacher_id: mockTeachers[0].id,
      subject_id: 1,
      day_id: 3,
    });
  });
  test('should not render when no assignments', () => {
    const mockProps: SelectedAssignmentsBadgesProps = {
      assignments: [],
      teachers: [mockTeachers[0], mockTeachers[1]], // teacher1, teacher2
      untoggle: vi.fn(() => {}),
    };

    wrapper(mockProps);
    // 画面に何も表示されていない
    expect(screen.queryByRole('section')).not.toBeInTheDocument();
  });
});
