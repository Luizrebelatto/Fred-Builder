export const nativewindGlobalCss = `@tailwind base;
@tailwind components;
@tailwind utilities;
`;

export const tailwindConfigTemplate = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
`;

export const nativewindEnvTemplate = `/// <reference types="nativewind/types" />
`;
