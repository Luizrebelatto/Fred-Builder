import { ProjectConfig, DependencyInfo } from "./types";

export function resolveDependencies(config: ProjectConfig): DependencyInfo {
  const packages: string[] = [];
  const devPackages: string[] = [];

  // Navegação
  if (config.navigation === "expo-router") {
    packages.push("expo-router", "expo-linking", "expo-constants", "expo-status-bar");
  } else if (config.navigation === "react-navigation") {
    packages.push(
      "@react-navigation/native",
      "@react-navigation/native-stack",
      "react-native-screens",
      "react-native-safe-area-context"
    );
  }

  // HTTP Client
  if (config.httpClient === "axios") {
    packages.push("axios");
  }

  // State Management
  if (config.stateManagement === "zustand") {
    packages.push("zustand");
  } else if (config.stateManagement === "redux") {
    packages.push("@reduxjs/toolkit", "react-redux");
    devPackages.push("@types/react-redux");
  } else if (config.stateManagement === "jotai") {
    packages.push("jotai");
  }

  // UI Library
  if (config.uiLibrary === "nativewind") {
    packages.push("nativewind");
    devPackages.push("tailwindcss");
  } else if (config.uiLibrary === "tamagui") {
    packages.push("tamagui", "@tamagui/config");
  } else if (config.uiLibrary === "gluestack") {
    packages.push("@gluestack-ui/themed", "@gluestack-style/react");
  }

  // Forms
  if (config.formLibrary === "react-hook-form") {
    packages.push("react-hook-form");
  }

  // Extras
  const extrasMap: Record<string, string[]> = {
    "react-query": ["@tanstack/react-query"],
    "async-storage": ["@react-native-async-storage/async-storage"],
    "expo-secure-store": ["expo-secure-store"],
    "expo-image": ["expo-image"],
    "react-native-svg": ["react-native-svg"],
    "expo-linear-gradient": ["expo-linear-gradient"],
    "expo-haptics": ["expo-haptics"],
    "expo-clipboard": ["expo-clipboard"],
  };

  for (const extra of config.extras) {
    if (extrasMap[extra]) {
      packages.push(...extrasMap[extra]);
    }
  }

  return { packages, devPackages };
}
