import { useNavStore } from '@/stores/navStore';
import { act, render, screen } from '@testing-library/react';
import { MemoryRouter, Outlet, Route, Routes } from 'react-router-dom';
import { describe, expect, test, vi } from 'vitest';
import { Redirector } from '../Redirector';

const SignInPage = () => <div data-testid="sign-in">Sign In Page</div>;
const StudentsPage = () => <div data-testid="students">Students Page</div>;
const DummyLayout = () => (
  <>
    <Redirector />
    <Outlet />
  </>
);

describe('Redirector', () => {
  test('should redirect to the next path', () => {
    render(
      <MemoryRouter initialEntries={['/students']}>
        <Routes>
          <Route element={<DummyLayout />}>
            <Route path="/sign_in" element={<SignInPage />} />
            <Route path="/students" element={<StudentsPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    const clearNextPathSpy = vi.spyOn(useNavStore.getState(), 'clearNextPath');

    act(() => {
      useNavStore.setState({ nextPath: '/sign_in', replace: true });
    });

    expect(clearNextPathSpy).toHaveBeenCalled();
    expect(screen.getByTestId('sign-in')).toBeInTheDocument();
    expect(useNavStore.getState().nextPath).toBeNull();
  });
});
