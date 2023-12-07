// (C) 2020 GoodData Corporation
module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    plugins: ["react-hooks", "prettier", "import"],
    extends: ["plugin:react/recommended", "plugin:import-esm/recommended"],
    rules: {
        "react/prop-types": 0,
        "no-console": [2, { allow: ["warn", "error"] }],
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
        "import/order": [
            1,
            {
                groups: ["builtin", "external", "parent", "sibling", "index"],
                "newlines-between": "always",
            },
        ],
    },
    parserOptions: { tsconfigRootDir: __dirname },
    ignorePatterns: ["webpack.config.cjs", "./scripts/refresh-md.js"],
    settings: {
        react: {
            version: "detect",
        },
    },
};
