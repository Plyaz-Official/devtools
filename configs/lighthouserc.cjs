/* eslint-disable no-undef */

module.exports = {
  ci: {
    collect: {
      url: [process.env.LHCI_URL || 'http://localhost:3000'],
      startServerCommand: process.env.LHCI_START || undefined,
      numberOfRuns: 2,
      settings: {
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        chromeFlags: '--no-sandbox',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
