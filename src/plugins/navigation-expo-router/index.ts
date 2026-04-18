import type { Plugin } from "../../core/plugin";
import { generate } from "./generator";

const plugin: Plugin = {
  id: "navigation-expo-router",
  name: "Expo Router",
  category: "navigation",
  conflictsWith: ["navigation-react"],
  isApplicable: (ctx) => ctx.selectedPlugins.has("navigation-expo-router"),
  prompts: () => [
    {
      type: "list",
      name: "strategy",
      message: "Routing strategy?",
      choices: [
        { name: "Simple (single stack)", value: "simple" },
        { name: "Advanced (tabs + groups)", value: "advanced" },
      ],
      default: "simple",
    },
  ],
  dependencies: () => ({
    expoPackages: [
      "expo-router",
      "expo-linking",
      "expo-constants",
      "react-native-screens",
      "react-native-safe-area-context",
    ],
  }),
  generate,
  postInstall: () => [
    "📁 Routes are in app/ directory (file-based routing)",
    "💡 Use (tabs) or other groups for route organization",
  ],
};

export default plugin;
