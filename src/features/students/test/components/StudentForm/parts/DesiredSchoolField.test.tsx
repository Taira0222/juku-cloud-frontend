import {
  DesiredSchoolField,
  type DesiredSchoolFieldProps,
} from '@/features/students/components/StudentForm/parts/DesiredSchoolField';
import { initialMockValue } from '@/tests/fixtures/students/students';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

describe('DesiredSchoolField', () => {
  const wrapper = (props: DesiredSchoolFieldProps) => {
    render(<DesiredSchoolField {...props} />);
  };

  test('should render correctly', async () => {
    const user = userEvent.setup();
    const mockProps: DesiredSchoolFieldProps = {
      value: initialMockValue,
      onChange: vi.fn(() => () => {}),
    };

    wrapper(mockProps);

    const desiredInput = screen.getByLabelText('志望校');
    expect(desiredInput).toBeInTheDocument();
    expect(desiredInput).toHaveValue('');

    // 入力操作
    await user.type(desiredInput, 'Tokyo University');
    expect(mockProps.onChange).toHaveBeenCalledWith('desired_school');
  });
});
