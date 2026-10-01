module.exports = {
  ci: {
    collect: { startServerCommand: 'pnpm start', numberOfRuns: 1, url: ['http://localhost:3000/'] },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: { 'categories:performance': ['warn', { minScore: 0.9 }] },
    },
    upload: { target: 'temporary-public-storage' },
  },
};
