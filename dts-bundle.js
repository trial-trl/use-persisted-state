var dts = require('dts-bundle');
var app = require('./package.json');

dts.bundle({
  name: app.name,
  main: 'dist/index.d.ts',
  out: 'use-persisted-state.d.ts',
  removeSource: true,
});
