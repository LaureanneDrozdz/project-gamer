module.exports = {
  ci: {
    collect: {
      url: [process.env.NEXT_PUBLIC_URL || 'http://localhost:5173'],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', {minScore: 0.75}],
        'categories:accessibility': ['error', {minScore: 0.90}],
        'categories:seo': ['error', {minScore: 0.90}],
      },
    },
  },
};