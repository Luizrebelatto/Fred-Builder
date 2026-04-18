import type { Plugin } from "../../core/plugin";
import { generate } from "./generator";

const plugin: Plugin = {
  id: "state-zustand",
  name: "Zustand",
  category: "state",
  conflictsWith: ["state-redux", "state-jotai"],
  isApplicable: (ctx) => ctx.selectedPlugins.has("state-zustand"),
  dependencies: () => ({
    packages: ["zustand"],
  }),
  generate,
  postInstall: () => [
    "📁 Store is in src/store/useAppStore.ts",
    "💡 Import useAppStore hook in your components",
  ],
};

export default plugin;
