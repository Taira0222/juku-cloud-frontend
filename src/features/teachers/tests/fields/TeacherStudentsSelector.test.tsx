import { describe, expect, test } from 'vitest';
import { TeacherStudentsSelector } from '../../components/fields/TeacherStudentsSelector';
import { student1, student2, student3 } from '../fixtures/teachers';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';

const allStudents = [student1, student2, student3];

const renderComponent = (initialSelectedIds = [student1.id, student2.id]) => {
  const Wrapper = () => {
    const [selectedIds, setSelectedIds] =
      useState<number[]>(initialSelectedIds);
    return (
      <TeacherStudentsSelector
        allStudents={allStudents}
        selectedIds={selectedIds}
        onChangeSelected={setSelectedIds}
      />
    );
  };
  return render(<Wrapper />);
};

describe('TeacherStudentsSelector', () => {
  test('renders without crashing', () => {
    renderComponent();
    expect(screen.getByLabelText(/担当生徒/)).toBeInTheDocument();
    expect(screen.getByText(/該当：3名 \/ 選択：2名/)).toBeInTheDocument();
  });

  test('displays the correct number of filtered and selected students', async () => {
    const user = userEvent.setup();

    renderComponent();

    const section = screen.getByLabelText('選択された生徒の一覧');
    const student1Badge = within(section).getByText(new RegExp(student1.name));
    const student2Badge = within(section).getByText(new RegExp(student2.name));

    const student1CheckBox = screen.getByRole('checkbox', {
      name: new RegExp(student1.name),
    });
    const student2CheckBox = screen.getByRole('checkbox', {
      name: new RegExp(student2.name),
    });
    const student3CheckBox = screen.getByRole('checkbox', {
      name: new RegExp(student3.name),
    });
    const levelSelect = screen.getByRole('combobox', { name: /担当生徒/ });

    expect(student1CheckBox).toBeChecked();
    expect(student2CheckBox).toBeChecked();
    expect(student3CheckBox).not.toBeChecked();

    expect(student1Badge).toBeInTheDocument();
    expect(student2Badge).toBeInTheDocument();

    await user.click(levelSelect);
    const juniorHigh2Option = screen.getByRole('option', {
      name: '中学2年',
    });
    expect(juniorHigh2Option).toBeInTheDocument();

    // 中学2年を選択
    await user.click(juniorHigh2Option);

    // セレクトボックスが更新されていることを確認
    const trigger = screen.getByRole('combobox', { name: /担当生徒/ });
    expect(within(trigger).getByText('中学2年')).toBeInTheDocument();
    expect(student1CheckBox).not.toBeInTheDocument();
    expect(student3CheckBox).toBeInTheDocument();

    // student3 を選択
    await user.click(student3CheckBox);

    // student3 が選択されていることを確認
    const student3Badge = within(section).getByText(new RegExp(student3.name));
    expect(student3CheckBox).toBeChecked();
    expect(student3Badge).toBeInTheDocument();

    // student3 バッジをクリックして選択解除
    await user.click(student3Badge);

    // student3 が選択解除されていることを確認
    expect(student3CheckBox).not.toBeChecked();
  });
});
