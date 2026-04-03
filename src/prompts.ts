import inquirer from "inquirer";
import { ProjectConfig } from "./types";

export async function askProjectConfig(): Promise<ProjectConfig> {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "📱 Nome do projeto:",
      validate: (input: string) => {
        if (!input.trim()) return "O nome do projeto é obrigatório";
        if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(input))
          return "Nome inválido. Use apenas letras, números, hífens e underscores";
        return true;
      },
    },
    {
      type: "list",
      name: "navigation",
      message: "🧭 Navegação:",
      choices: [
        { name: "Expo Router (file-based routing)", value: "expo-router" },
        { name: "React Navigation", value: "react-navigation" },
        { name: "Nenhuma", value: "none" },
      ],
    },
    {
      type: "checkbox",
      name: "navigationTypes",
      message: "🧭 Tipos de navegação (espaço para selecionar):",
      when: (answers: any) => answers.navigation === "react-navigation",
      choices: [
        { name: "Stack (navegação em pilha)", value: "stack", checked: true },
        { name: "Bottom Tabs (abas inferiores)", value: "tabs" },
        { name: "Drawer (menu lateral)", value: "drawer" },
      ],
      validate: (input: string[]) => {
        if (input.length === 0) return "Selecione pelo menos um tipo de navegação";
        return true;
      },
    },
    {
      type: "list",
      name: "httpClient",
      message: "🌐 Cliente HTTP:",
      choices: [
        { name: "Axios", value: "axios" },
        { name: "Fetch (nativo)", value: "fetch" },
        { name: "Nenhum", value: "none" },
      ],
    },
    {
      type: "list",
      name: "stateManagement",
      message: "🗃️  Gerenciamento de estado:",
      choices: [
        { name: "Zustand", value: "zustand" },
        { name: "Redux Toolkit", value: "redux" },
        { name: "Jotai", value: "jotai" },
        { name: "Nenhum", value: "none" },
      ],
    },
    {
      type: "list",
      name: "uiLibrary",
      message: "🎨 Biblioteca UI:",
      choices: [
        { name: "NativeWind (TailwindCSS)", value: "nativewind" },
        { name: "Tamagui", value: "tamagui" },
        { name: "Gluestack UI", value: "gluestack" },
        { name: "Nenhuma", value: "none" },
      ],
    },
    {
      type: "list",
      name: "formLibrary",
      message: "📝 Formulários:",
      choices: [
        { name: "React Hook Form", value: "react-hook-form" },
        { name: "Nenhuma", value: "none" },
      ],
    },
    {
      type: "checkbox",
      name: "extras",
      message: "📦 Extras (espaço para selecionar):",
      choices: [
        { name: "React Query (TanStack Query)", value: "react-query" },
        { name: "AsyncStorage", value: "async-storage" },
        { name: "Expo SecureStore", value: "expo-secure-store" },
        { name: "Expo Image", value: "expo-image" },
        { name: "React Native SVG", value: "react-native-svg" },
        { name: "Expo Linear Gradient", value: "expo-linear-gradient" },
        { name: "Expo Haptics", value: "expo-haptics" },
        { name: "Expo Clipboard", value: "expo-clipboard" },
      ],
    },
  ]);

  if (!answers.navigationTypes) {
    answers.navigationTypes = [];
  }

  return answers as ProjectConfig;
}
