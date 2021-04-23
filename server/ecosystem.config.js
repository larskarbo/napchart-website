module.exports = {
  apps: [
    {
      name: 'napchart-server',
      script: './node_modules/.bin/ts-node',
      args: '--transpile-only server.ts',
    },
  ],
}
