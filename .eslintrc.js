module.exports = {
    env: {
        commonjs: true,
        "node": true,
        es6: true,
    },
    extends: [
        'airbnb-base',
    ],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parserOptions: {
        ecmaVersion: 2020,
    },
    rules: {
        "indent": ["error", 4]
    },
};
