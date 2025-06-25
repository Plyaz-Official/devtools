/* eslint-disable no-undef */
import { beforeAll, afterEach, afterAll, vi } from 'vitest';
import process from 'process';

// Setup before all tests
beforeAll(() => {
  // Set NODE_ENV if not already set
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'test';
  }

  // Mock window.matchMedia for browser-like environments
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // Mock IntersectionObserver
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    disconnect: vi.fn(),
    observe: vi.fn(),
    unobserve: vi.fn(),
  }));

  // Mock ResizeObserver
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    disconnect: vi.fn(),
    observe: vi.fn(),
    unobserve: vi.fn(),
  }));

  // Mock window.scrollTo
  Object.defineProperty(window, 'scrollTo', {
    writable: true,
    value: vi.fn(),
  });

  // Mock localStorage
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };
  Object.defineProperty(window, 'localStorage', {
    writable: true,
    value: localStorageMock,
  });

  // Mock sessionStorage
  Object.defineProperty(window, 'sessionStorage', {
    writable: true,
    value: localStorageMock,
  });

  // Mock fetch for Node.js 22 (even though it has native fetch)
  if (!global.fetch) {
    global.fetch = vi.fn();
  }

  // Mock crypto for Web3 packages if needed
  if (!global.crypto) {
    global.crypto = {
      getRandomValues: vi.fn(),
      randomUUID: vi.fn(() => 'test-uuid'),
    };
  }

  // Mock next/server
  vi.mock('next/server', () => ({
    NextResponse: {
      next: () => ({}),
      rewrite: () => ({}),
      redirect: () => ({}),
    },
  }));

  // Mock glob
  vi.mock('glob', () => ({
    sync: vi.fn(),
  }));
});

// Cleanup after each test
afterEach(() => {
  vi.clearAllMocks();
});

// Cleanup after all tests
afterAll(() => {
  vi.clearAllTimers();
  vi.restoreAllMocks();
});
