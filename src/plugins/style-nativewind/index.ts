import type { Plugin } from "../../core/plugin";
import { generate } from "./generator";

const plugin: Plugin = {
  id: "style-nativewind",
  name: "NativeWind (Tailwind)",
  category: "style",
  conflictsWith: ["style-styled-components"],
  isApplicable: (ctx) => ctx.selectedPlugins.has("style-nativewind"),
  dependencies: () => ({
    packages: ["nativewind"],
    devPackages: ["tailwindcss"],
  }),
  generate,
  postInstall: () => [
    "🎨 Tailwind CSS is configured in tailwind.config.js",
    "📝 Global styles in global.css",
    "💡 Import global.css in your App.tsx or _layout.tsx",
    "⚠️  Add nativewind/metro to metro.config.js if not auto-detected",
  ],
};

export default plugin;
