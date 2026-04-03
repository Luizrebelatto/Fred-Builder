export interface ProjectConfig {
  projectName: string;
  navigation: "expo-router" | "react-navigation" | "none";
  httpClient: "axios" | "fetch" | "none";
  stateManagement: "zustand" | "redux" | "jotai" | "none";
  uiLibrary: "nativewind" | "tamagui" | "gluestack" | "none";
  formLibrary: "react-hook-form" | "none";
  extras: string[];
}

export interface DependencyInfo {
  packages: string[];
  devPackages?: string[];
}
