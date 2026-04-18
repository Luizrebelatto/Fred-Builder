import type { Plugin } from "../../core/plugin";
import { generate } from "./generator";

const plugin: Plugin = {
  id: "navigation-react",
  name: "React Navigation",
  category: "navigation",
  conflictsWith: ["navigation-expo-router"],
  isApplicable: (ctx) => ctx.selectedPlugins.has("navigation-react"),
  prompts: () => [
    {
      type: "checkbox",
      name: "types",
      message: "Which navigation types?",
      choices: [
        { name: "Stack", value: "stack", checked: true },
        { name: "Bottom Tabs", value: "tabs" },
        { name: "Drawer", value: "drawer" },
      ],
      validate: (input: string[]) => {
        if (input.length === 0) return "Select at least one";
        return true;
      },
    },
  ],
  dependencies: (ctx) => {
    const types: string[] = ctx.answers["navigation-react"]?.types ?? ["stack"];
    const expoPackages = [
      "@react-navigation/native",
      "react-native-screens",
      "react-native-safe-area-context",
    ];
    if (types.includes("stack")) {
      expoPackages.push("@react-navigation/native-stack");
    }
    if (types.includes("tabs")) {
      expoPackages.push("@react-navigation/bottom-tabs");
    }
    if (types.includes("drawer")) {
      expoPackages.push(
        "@react-navigation/drawer",
        "react-native-gesture-handler",
        "react-native-reanimated"
      );
    }
    return { expoPackages };
  },
  generate,
  postInstall: (ctx) => {
    const types: string[] = ctx.answers["navigation-react"]?.types ?? ["stack"];
    const msgs = ["📁 Screens are in src/screens/"];
    if (types.includes("drawer")) {
      msgs.push("⚠️  Add 'react-native-reanimated/plugin' to babel.config.js");
    }
    return msgs;
  },
};

export default plugin;
