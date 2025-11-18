import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { CMSProvider } from '../contexts/CMSContext';

// Mock Supabase client for testing
export const mockSupabaseClient = {
  auth: {
    getSession: vi.fn(),
    onAuthStateChange: vi.fn(() => ({
      data: { subscription: { unsubscribe: vi.fn() } },
    })),
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
  },
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn(),
    maybeSingle: vi.fn(),
  })),
};

interface AllTheProvidersProps {
  children: React.ReactNode;
}

const AllTheProviders = ({ children }: AllTheProvidersProps) => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <CMSProvider>
            {children}
          </CMSProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

// Mock user data for testing
export const mockUser = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  email: 'test@example.com',
  role: 'user',
};

export const mockAdmin = {
  id: '123e4567-e89b-12d3-a456-426614174001',
  email: 'admin@example.com',
  role: 'admin',
};

export const mockProfile = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  first_name: 'Test',
  last_name: 'User',
  avatar_url: '',
  fitness_level: 'intermediate',
  fitness_goals: ['lose_weight', 'build_muscle'],
  bio: 'Test bio',
  height: 180,
  weight: 80,
  date_of_birth: '1990-01-01',
  gender: 'male',
  medical_conditions: [],
  dietary_restrictions: [],
  preferred_workout_times: ['morning'],
  preferred_training_style: ['strength'],
  measurement_unit: 'metric',
};

