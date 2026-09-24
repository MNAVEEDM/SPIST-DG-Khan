import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

/**
 * Lint rules for the site's React source.
 *
 * The rule that earns its keep here is `no-undef`: a `headerRef` that was used
 * but never declared shipped to production and blanked every page, because a
 * Vite build happily bundles an identifier it cannot resolve and the
 * ReferenceError only surfaces in the browser. Run `npm run lint` before
 * pushing and that class of mistake never leaves the machine.
 */
export default [
  { ignores: ['dist', 'server/node_modules', 'node_modules'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      // JSX components are referenced by the compiler, not by name at runtime,
      // so the base rule reports every imported component as unused.
      // `ignoreRestSiblings` keeps the "pull these keys out of the payload"
      // destructuring in AdmissionWizard from reading as dead code.
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]', ignoreRestSiblings: true }],
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      // A performance advisory, not a defect: these effects run once on mount
      // to seed state from a media query or an observer, and they work. Left
      // as a warning so it does not mask a genuine error in CI.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
];
