// (C) 2022-2024 GoodData Corporation
module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    plugins: ["react-hooks", "prettier"],
    extends: ["plugin:react/recommended", "plugin:import-esm/recommended"],
    parserOptions: { tsconfigRootDir: __dirname },
    ignorePatterns: ["webpack.config.cjs", "vite.config.js", "scripts/refresh-md.cjs"],
    settings: {
        react: {
            version: "detect",
        },
    },
};
