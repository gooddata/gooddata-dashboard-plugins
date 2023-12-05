// (C) 2023 GoodData Corporation
module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    plugins: ["react-hooks", "prettier"],
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:import/errors",
        "plugin:import/typescript",
        "plugin:import-esm/recommended",
        "plugin:@typescript-eslint/recommended",
    ],
    rules: {
        "react/prop-types": 0,
        "import/order": [
            1,
            {
                groups: ["builtin", "external", "parent", "sibling", "index"],
                "newlines-between": "always",
            },
        ],

        "@typescript-eslint/no-unused-vars": [
            "warn",
            {
                argsIgnorePattern: "^_",
                caughtErrorsIgnorePattern: "^_",
            },
        ],

        "no-console": [2, { allow: ["warn", "error"] }],
    },
    env: {
        browser: true,
        node: true,
    },
    parserOptions: { tsconfigRootDir: __dirname },
    ignorePatterns: ["webpack.config.cjs", "vite.config.js", "scripts/refresh-md.cjs"],
    settings: {
        react: {
            version: "detect",
        },
        "import/resolver": {
            typescript: {}
        },
    },
};
