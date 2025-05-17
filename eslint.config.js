const {
    defineConfig,
} = require("eslint/config");

const tsParser = require("@typescript-eslint/parser");
const js = require("@eslint/js");

const {
    FlatCompat,
} = require("@eslint/eslintrc");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

module.exports = defineConfig([{
    languageOptions: {
        parser: tsParser,
        ecmaVersion: 2020,
        sourceType: "module",
        parserOptions: {},
    },
    ignores: ["node_modules", "dist", "build", "jest.config.js", "eslint.config.js"],
    files: ["**/*.ts", "**/*.tsx"],

    extends: compat.extends("plugin:@typescript-eslint/recommended"),

    rules: {
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-explicit-any": "warn",

        "@typescript-eslint/no-unused-vars": ["error", {
            "argsIgnorePattern": "^_",
        }],
    },
}]);