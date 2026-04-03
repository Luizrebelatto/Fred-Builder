import fs from "fs";
import path from "path";
import { ProjectConfig } from "./types";
import { axiosTemplate } from "./templates/axios";
import {
  reactNavigationAppTemplate,
  homeScreenTemplate,
} from "./templates/react-navigation";

import {
  expoRouterLayoutTemplate,
  expoRouterIndexTemplate,
} from "./templates/expo-router";
import { zustandTemplate } from "./templates/zustand";
import {
  reduxStoreTemplate,
  reduxSliceTemplate,
  reduxHooksTemplate,
} from "./templates/redux";
import { jotaiTemplate } from "./templates/jotai";
import { reactQueryProviderTemplate } from "./templates/react-query";
import {
  nativewindGlobalCss,
  tailwindConfigTemplate,
  nativewindEnvTemplate,
} from "./templates/nativewind";

function writeFile(filePath: string, content: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content, "utf-8");
}

export function scaffoldProject(projectPath: string, config: ProjectConfig) {
  const srcPath = path.join(projectPath, "src");

  // Axios
  if (config.httpClient === "axios") {
    writeFile(path.join(srcPath, "services", "api.ts"), axiosTemplate);
  }

  // Navigation
  if (config.navigation === "react-navigation") {
    writeFile(path.join(projectPath, "App.tsx"), reactNavigationAppTemplate(config.navigationTypes));
    writeFile(
      path.join(srcPath, "screens", "HomeScreen.tsx"),
      homeScreenTemplate
    );
  } else if (config.navigation === "expo-router") {
    writeFile(
      path.join(projectPath, "app", "_layout.tsx"),
      expoRouterLayoutTemplate
    );
    writeFile(
      path.join(projectPath, "app", "index.tsx"),
      expoRouterIndexTemplate
    );
  }

  // State Management
  if (config.stateManagement === "zustand") {
    writeFile(path.join(srcPath, "store", "useAppStore.ts"), zustandTemplate);
  } else if (config.stateManagement === "redux") {
    writeFile(path.join(srcPath, "store", "index.ts"), reduxStoreTemplate);
    writeFile(
      path.join(srcPath, "store", "slices", "counterSlice.ts"),
      reduxSliceTemplate
    );
    writeFile(path.join(srcPath, "store", "hooks.ts"), reduxHooksTemplate);
  } else if (config.stateManagement === "jotai") {
    writeFile(path.join(srcPath, "store", "atoms.ts"), jotaiTemplate);
  }

  // React Query
  if (config.extras.includes("react-query")) {
    writeFile(
      path.join(srcPath, "providers", "QueryProvider.tsx"),
      reactQueryProviderTemplate
    );
  }

  // NativeWind
  if (config.uiLibrary === "nativewind") {
    writeFile(
      path.join(projectPath, "global.css"),
      nativewindGlobalCss
    );
    writeFile(
      path.join(projectPath, "tailwind.config.js"),
      tailwindConfigTemplate
    );
    writeFile(
      path.join(srcPath, "nativewind-env.d.ts"),
      nativewindEnvTemplate
    );
  }
}
