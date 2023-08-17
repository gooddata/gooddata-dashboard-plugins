// (C) 2022-2023 GoodData Corporation
module.exports = {
    parser: "@typescript-eslint/parser",
    plugins: ["react-hooks", "prettier"],
    extends: ["plugin:react/recommended", "plugin:import/errors", "plugin:import/typescript"],
    settings: {
        react: {
            version: "detect",
        },
    },
    parserOptions: { tsconfigRootDir: __dirname },
    rules: {
        "react/prop-types": "off",
    },
};
