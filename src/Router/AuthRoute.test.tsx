import { useAuthStore } from '@/stores/authStore';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, test, vi } from 'vitest';
import { AuthRoute } from './AuthRoute';

const Home = () => <div data-testid="home">Home Page</div>;
const StudentsPage = () => <div data-testid="students">Students Page</div>;

describe('AuthRoute', () => {
  test('should redirect authenticated users to /students', () => {
    vi.spyOn(useAuthStore.getState(), 'isAuthenticated').mockReturnValue(true);

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<AuthRoute />}>
            <Route path="/" element={<Home />} />
          </Route>
          <Route path="/students" element={<StudentsPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('students')).toBeInTheDocument();
  });

  test('should render home page for unauthenticated users', () => {
    vi.spyOn(useAuthStore.getState(), 'isAuthenticated').mockReturnValue(false);

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<AuthRoute />}>
            <Route path="/" element={<Home />} />
          </Route>
          <Route path="/students" element={<StudentsPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('home')).toBeInTheDocument();
  });
});
