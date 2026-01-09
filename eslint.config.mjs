import gtsConfig from 'gts/build/src/index.js';
import globals from 'globals';

export default [
  ...gtsConfig,
  {
    ignores: [
      'build/',
      'test/',
      'docs/',
      'dist/',
      'src/*.json.ts',
      'src/*.po.ts',
    ],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'n/no-missing-import': 'off',
      'n/no-unpublished-require': 'off',
    },
  },
];
