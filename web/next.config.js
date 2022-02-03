module.exports = {
  async rewrites() {
    return [
      {
        source: '/user/:any',
        destination: '/user/:any',
      },
      {
        source: '/:any*',
        destination: '/routing',
      },
    ]
  },
  poweredByHeader: false,
}
