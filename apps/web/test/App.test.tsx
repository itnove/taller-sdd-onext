import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { App } from '../src/App.tsx';
import { mockFetch } from './helpers/fetch.ts';

describe('App', () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('muestra el título y el selector de socios', async () => {
    mockFetch({
      'GET /api/members': { status: 200, json: { members: [{ id: 1, name: 'Lucía Ferrer' }] } },
    });

    render(<App />);

    expect(screen.getByRole('heading', { name: 'GymApp' })).toBeDefined();
    expect(await screen.findByLabelText('Socio')).toBeDefined();
  });
});
