
# FredBuilder 🔨
<img width="565" height="685" alt="Screenshot 2026-04-19 at 15 59 35" src="https://github.com/user-attachments/assets/f1aa3db0-9144-45e1-9e4c-a2647ed5b313" />
An interactive CLI tool for scaffolding custom Expo/React Native projects with pre-configured plugins for navigation, state management, styling, and more.

## What is FredBuilder?

FredBuilder is a project generator that allows you to quickly bootstrap a React Native/Expo application with your choice of libraries and configurations. Instead of manually installing and configuring multiple dependencies and integrations, FredBuilder automates the entire process through an interactive command-line interface.

### Key Features

- **Interactive Configuration**: Answer guided prompts to select your project preferences
- **Plugin System**: Modular architecture for adding features like navigation, state management, and styling
- **Preset Support**: Start from predefined project templates (e.g., SaaS)
- **Automatic Dependency Management**: Installs npm packages and Expo-specific modules based on your selections
- **Code Generation**: Automatically generates boilerplate code, folder structures, and provider wrappers
- **Dry-Run Mode**: Preview what will be generated before creating files

## Installation

### Using npm

```bash
npm install -g fred-builder
```

### From Source

```bash
git clone <repository-url>
cd FredBuilder
npm install
npm run build
npm start
```

Or use the development mode:

```bash
npm run dev
```

## Usage

### Basic Usage

```bash
fred-builder
```

This launches the interactive prompts to configure your new project.

### Command-Line Options

```bash
fred-builder [options]

Options:
  --preset <preset>    Start from a preset template (saas, custom)
  --dry-run            Show what would be generated without creating files
  --yes                Skip all prompts and use default values
  --no-install         Skip automatic dependency installation
```

### Examples

**Start with custom configuration:**
```bash
fred-builder
```

**Start with SaaS preset:**
```bash
fred-builder --preset saas
```

**Preview changes without creating files:**
```bash
fred-builder --dry-run
```

**Skip prompts and use defaults:**
```bash
fred-builder --yes
```

**Skip dependency installation:**
```bash
fred-builder --no-install
```

## Configuration

During the interactive setup, you'll be prompted to choose:

### 1. Project Name
The name for your new React Native project

### 2. Navigation
- **expo-router**: File-based routing with Expo Router
- **react-navigation**: Traditional stack-based navigation
- **none**: No navigation library

### 3. Navigation Type(s)
- **stack**: Stack navigator for hierarchical navigation
- **tabs**: Tab-based navigation
- **drawer**: Drawer/sidebar navigation

### 4. State Management
- **zustand**: Lightweight state management
- **redux**: Full-featured state container
- **jotai**: Primitive and flexible state management
- **none**: No state management library

### 5. HTTP Client
- **axios**: Promise-based HTTP client
- **fetch**: Native browser fetch API
- **none**: No HTTP client

### 6. UI Library
- **nativewind**: Tailwind CSS for React Native
- **tamagui**: Modern component library
- **gluestack**: UI component system
- **none**: No UI library

### 7. Form Library
- **react-hook-form**: Performant form handling
- **none**: No form library

## Plugin System

FredBuilder uses a modular plugin architecture. Each plugin handles a specific feature and can:

- Define dependencies (npm packages, dev packages, Expo packages)
- Generate code and folder structures
- Inject providers into the app wrapper
- Run post-installation scripts

### Built-in Plugins

#### Navigation Plugins
- **navigation-react**: Configures React Navigation setup
- **navigation-expo-router**: Configures Expo Router with file-based routing

#### State Management
- **state-zustand**: Zustand store configuration

#### Styling
- **style-nativewind**: NativeWind CSS configuration

### Creating Custom Plugins

Plugins implement the `Plugin` interface:

```typescript
interface Plugin {
  id: string;                                    // Unique identifier
  name: string;                                  // Display name
  category: PluginCategory;                      // Category type
  dependsOn?: string[];                          // Required plugins
  conflictsWith?: string[];                      // Incompatible plugins
  isApplicable: (ctx: GenerationContext) => boolean;
  prompts?: (ctx: GenerationContext) => any;     // Inquirer questions
  dependencies: (ctx: GenerationContext) => PluginDependencies;
  generate: (ctx: GenerationContext) => Promise<void>;
  postInstall?: (ctx: GenerationContext) => string[];
}
```

## Project Structure

After generation, your project will have:

```
my-project/
├── app/                 # Expo Router or navigation screens
├── src/
│   ├── components/      # Reusable components
│   ├── screens/         # Screen components
│   ├── services/        # API and external services
│   ├── store/          # State management (if enabled)
│   └── styles/         # Style definitions
├── app.json            # Expo configuration
├── tsconfig.json       # TypeScript configuration
└── package.json        # Project dependencies
```

## Development

### Scripts

```bash
npm run build      # Compile TypeScript to JavaScript
npm run dev        # Run with ts-node for development
npm start          # Run compiled version
```

### Project Architecture

- **src/core/**: Core functionality (context, file system, plugins, runner)
- **src/plugins/**: Plugin implementations
- **src/prompts/**: User prompt configurations
- **src/templates/**: Code templates for libraries
- **src/presets/**: Preset configurations

## Dependencies

### Core Dependencies
- **chalk**: Colored terminal output
- **commander**: CLI argument parsing
- **inquirer**: Interactive command-line prompts
- **fs-extra**: Enhanced file system operations
- **ora**: Elegant terminal spinner

## Troubleshooting

### Installation Issues

If dependencies fail to install:
```bash
fred-builder --no-install
cd <your-project>
npm install
```

### Dry-Run Mode

To see what would be generated without making changes:
```bash
fred-builder --dry-run
```

### Missing Expo Packages

Some packages are installed as Expo modules. If you have issues, run:
```bash
expo install
```

## Contributing

Contributions are welcome! To add a new plugin:

1. Create a new file in `src/plugins/<category>-<name>/`
2. Implement the `Plugin` interface
3. Register it in `src/index.ts`
4. Test with `npm run dev`

## License

MIT

## Author

Luiz Gabriel Rebelatto

---

**Quick Start:**
```bash
fred-builder --preset saas
# or
fred-builder
```

Answer the interactive prompts and your new project will be ready in seconds! 🚀
