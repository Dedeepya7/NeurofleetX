module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
// PostCSS configuration (CommonJS)
// This file must be CommonJS because Node will load .cjs as CommonJS even if package.json uses "type": "module".

module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
// PostCSS configuration (CommonJS).
// We use .cjs so Node loads this as CommonJS even if package.json sets "type": "module".

module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ],
};
// // export default {
// //   plugins: {
// //     '@tailwindcss/postcss': {},
// //     autoprefixer: {},
  
// //   },
// // }
// // postcss.config.js
// module.exports = {
//   plugins: [
//     require('@tailwindcss/postcss'),
//     require('autoprefixer'),
//   ],
// };
// PostCSS configuration (CommonJS) - clean file
// Use .cjs so Node treats this as CommonJS even if package.json sets "type": "module".

module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ],
};
