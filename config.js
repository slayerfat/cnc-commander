'use strict';

const path = require('path');

let config = {
  // Name of electron app
  // Will be used in production builds
  name: 'cnc-commander',

  // Use ESLint (extends `standard`)
  // Further changes can be made in `.eslintrc.js`
  eslint: true,

  // webpack-dev-server port
  port: 9080,

  // electron-packager options
  // Docs: https://simulatedgreg.gitbooks.io/electron-vue/content/en/building_your_app.html
  building: {
    arch: process.env.PLATFORM_ARCH || 'ia32',
    asar: true,
    dir: path.join(__dirname, 'app'),
    icon: path.join(__dirname, 'app/icons/icon'),
    ignore: /^\/(src|index\.ejs|icons)/,
    out: path.join(__dirname, 'builds'),
    overwrite: true,
    platform: process.env.PLATFORM_TARGET || 'all'
  }
};

config.building.name = config.name;

module.exports = config;
