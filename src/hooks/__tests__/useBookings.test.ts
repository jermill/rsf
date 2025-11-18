import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useBookings } from '../useBookings';

// Mock Supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({
        data: [
          {
            id: '1',
            user_id: 'user-1',
            service_id: 'service-1',
            date: '2025-11-20',
            time: '10:00',
            status: 'confirmed',
            notes: 'Test booking',
          },
        ],
        error: null,
      }),
    })),
  },
}));

describe('useBookings Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch bookings on mount', async () => {
    const { result } = renderHook(() => useBookings());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.bookings).toHaveLength(1);
    expect(result.current.bookings[0].id).toBe('1');
  });

  it('should handle errors gracefully', async () => {
    // This is a basic structure - you'd mock the error case
    const { result } = renderHook(() => useBookings());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Add more specific error handling tests
  });
});

