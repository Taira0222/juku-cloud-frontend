import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SignUpPage } from '@/pages/auth/SignUpPage';

describe('SignUp component unit tests', () => {
  test('renders SignUp component with logo and title', () => {
    render(
      <MemoryRouter>
        <SignUpPage />
      </MemoryRouter>
    );

    // Juku Cloud が表示されていることを確認
    const title = screen.getByText('Juku Cloud');
    expect(title).toBeInTheDocument();
  });
});
