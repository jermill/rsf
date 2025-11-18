# Testing Guide

## Overview

This project uses **Vitest** and **React Testing Library** for comprehensive testing.

## Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Test Structure

```
src/
├── test/
│   ├── setup.ts           # Test environment setup
│   ├── test-utils.tsx     # Custom render utilities
│   └── README.md          # This file
├── components/
│   └── ui/
│       └── __tests__/     # Component tests
├── hooks/
│   └── __tests__/         # Hook tests
└── utils/
    └── __tests__/         # Utility tests
```

## Writing Tests

### Component Tests

```typescript
import { render, screen } from '../../../test/test-utils';
import { MyComponent } from '../MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Hook Tests

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useMyHook } from '../useMyHook';

describe('useMyHook', () => {
  it('should return data', async () => {
    const { result } = renderHook(() => useMyHook());
    
    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });
  });
});
```

## Mock Data

Use the pre-defined mocks from `test-utils.tsx`:

- `mockUser` - Standard user
- `mockAdmin` - Admin user
- `mockProfile` - User profile data
- `mockSupabaseClient` - Mocked Supabase client

## Best Practices

1. **Arrange-Act-Assert**: Structure tests clearly
2. **Test user behavior**: Test what users see and do
3. **Avoid implementation details**: Test the interface, not the implementation
4. **Use semantic queries**: Prefer `getByRole`, `getByLabelText` over `getByTestId`
5. **Mock external dependencies**: Use vi.mock() for API calls

## Coverage Goals

- Components: > 80%
- Hooks: > 90%
- Utils: > 95%
- Overall: > 85%

