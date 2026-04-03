import { NavigationType } from "../types";

export function reactNavigationAppTemplate(navigationTypes: NavigationType[]): string {
  const hasStack = navigationTypes.includes("stack");
  const hasTabs = navigationTypes.includes("tabs");
  const hasDrawer = navigationTypes.includes("drawer");

  const imports = [
    `import React from 'react';`,
    `import { NavigationContainer } from '@react-navigation/native';`,
  ];

  const screenImport = `import HomeScreen from './src/screens/HomeScreen';`;

  if (hasStack) {
    imports.push(`import { createNativeStackNavigator } from '@react-navigation/native-stack';`);
  }
  if (hasTabs) {
    imports.push(`import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';`);
  }
  if (hasDrawer) {
    imports.push(`import { createDrawerNavigator } from '@react-navigation/drawer';`);
  }

  imports.push(screenImport);

  const navigatorDeclarations: string[] = [];
  if (hasStack) navigatorDeclarations.push(`const Stack = createNativeStackNavigator();`);
  if (hasTabs) navigatorDeclarations.push(`const Tab = createBottomTabNavigator();`);
  if (hasDrawer) navigatorDeclarations.push(`const Drawer = createDrawerNavigator();`);

  // Determine the primary navigator and build the JSX
  let navigatorJSX: string;

  if (hasDrawer && hasTabs && hasStack) {
    navigatorJSX = `      <Drawer.Navigator>
        <Drawer.Screen name="MainTabs" component={MainTabs} />
      </Drawer.Navigator>`;
  } else if (hasDrawer && hasTabs) {
    navigatorJSX = `      <Drawer.Navigator>
        <Drawer.Screen name="MainTabs" component={MainTabs} />
      </Drawer.Navigator>`;
  } else if (hasDrawer && hasStack) {
    navigatorJSX = `      <Drawer.Navigator>
        <Drawer.Screen name="HomeStack" component={HomeStack} />
      </Drawer.Navigator>`;
  } else if (hasTabs && hasStack) {
    navigatorJSX = `      <Tab.Navigator>
        <Tab.Screen name="HomeTab" component={HomeStack} />
      </Tab.Navigator>`;
  } else if (hasDrawer) {
    navigatorJSX = `      <Drawer.Navigator>
        <Drawer.Screen name="Home" component={HomeScreen} />
      </Drawer.Navigator>`;
  } else if (hasTabs) {
    navigatorJSX = `      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
      </Tab.Navigator>`;
  } else {
    // stack only (default)
    navigatorJSX = `      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>`;
  }

  // Build sub-navigator functions
  const subNavigators: string[] = [];

  if (hasStack && (hasTabs || hasDrawer)) {
    subNavigators.push(`function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}`);
  }

  if (hasTabs && hasDrawer) {
    const tabContent = hasStack
      ? `<Tab.Screen name="HomeTab" component={HomeStack} />`
      : `<Tab.Screen name="Home" component={HomeScreen} />`;

    subNavigators.push(`function MainTabs() {
  return (
    <Tab.Navigator>
      ${tabContent}
    </Tab.Navigator>
  );
}`);
  }

  return `${imports.join('\n')}

${navigatorDeclarations.join('\n')}

${subNavigators.length > 0 ? subNavigators.join('\n\n') + '\n\n' : ''}export default function App() {
  return (
    <NavigationContainer>
${navigatorJSX}
    </NavigationContainer>
  );
}
`;
}

export const homeScreenTemplate = `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome! 🚀</Text>
      <Text style={styles.subtitle}>Seu app está pronto para começar.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});
`;
