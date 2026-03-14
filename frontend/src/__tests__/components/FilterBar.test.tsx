import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { FilterBar } from '../../components/sidebar/FilterBar';
import { RaceProvider } from '../../context/RaceContext';

// Mock API
vi.mock('../../api/client', () => ({
  api: {
    getRaces: vi.fn().mockResolvedValue([]),
    getSeries: vi.fn().mockResolvedValue([]),
  },
}));

afterEach(() => {
  cleanup();
});

describe('FilterBar', () => {
  it('renders All button and series buttons', () => {
    render(
      <RaceProvider>
        <FilterBar />
      </RaceProvider>
    );

    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('F1')).toBeInTheDocument();
    expect(screen.getByText('F2')).toBeInTheDocument();
    expect(screen.getByText('FE')).toBeInTheDocument();
    expect(screen.getByText('INDY')).toBeInTheDocument();
    expect(screen.getByText('WEC')).toBeInTheDocument();
    expect(screen.getByText('WRC')).toBeInTheDocument();
  });

  it('All button is active by default', () => {
    render(
      <RaceProvider>
        <FilterBar />
      </RaceProvider>
    );

    const allBtn = screen.getByText('All');
    expect(allBtn.className).toContain('active');
  });
});
