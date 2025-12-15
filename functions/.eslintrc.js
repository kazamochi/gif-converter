module.exports = {
    root: true,
    env: {
        es6: true,
        node: true,
    },
    extends: [
        "eslint:recommended",
        "google",
    ],
    rules: {
        "quotes": ["error", "double"],
        "max-len": ["off"],
        "indent": ["off"],
        "object-curly-spacing": ["off"],
        "comma-dangle": ["off"],
        "require-jsdoc": ["off"],
        "valid-jsdoc": ["off"],
        "no-unused-vars": ["off"],
        "@typescript-eslint/no-unused-vars": ["off"]
    },
    parserOptions: {
        ecmaVersion: 2018,
    },
};
