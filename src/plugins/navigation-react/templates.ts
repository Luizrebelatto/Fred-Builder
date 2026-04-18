export function appTemplate(navigationTypes: string[]): string {
  const hasStack = navigationTypes.includes("stack");
  const hasTabs = navigationTypes.includes("tabs");
  const hasDrawer = navigationTypes.includes("drawer");

  let imports = `import React from 'react';
import { NavigationContainer } from '@react-navigation/native';`;

  if (hasStack) imports += `\nimport { createNativeStackNavigator } from '@react-navigation/native-stack';`;
  if (hasTabs) imports += `\nimport { createBottomTabNavigator } from '@react-navigation/bottom-tabs';`;
  if (hasDrawer) imports += `\nimport { createDrawerNavigator } from '@react-navigation/drawer';`;

  imports += `\n\nimport HomeScreen from './src/screens/HomeScreen';`;
  if (hasTabs) imports += `\nimport SettingsScreen from './src/screens/SettingsScreen';`;
  if (hasDrawer) imports += `\nimport ProfileScreen from './src/screens/ProfileScreen';`;

  let navigators = "";
  if (hasStack) navigators += `\nconst Stack = createNativeStackNavigator();`;
  if (hasTabs) navigators += `\nconst Tab = createBottomTabNavigator();`;
  if (hasDrawer) navigators += `\nconst Drawer = createDrawerNavigator();`;

  let screens = "";
  if (hasTabs) {
    screens += `\nfunction Tabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}`;
  }

  let rootNav = "";
  if (hasDrawer) {
    const inner = hasTabs ? "Tabs" : "HomeScreen";
    rootNav = `  <Drawer.Navigator>
        <Drawer.Screen name="Main" component={${inner}} />
        <Drawer.Screen name="Profile" component={ProfileScreen} />
      </Drawer.Navigator>`;
  } else if (hasStack) {
    const inner = hasTabs ? "Tabs" : "HomeScreen";
    rootNav = `  <Stack.Navigator>
        <Stack.Screen name="Home" component={${inner}} />
      </Stack.Navigator>`;
  } else if (hasTabs) {
    rootNav = `  <Tabs />`;
  }

  return `${imports}${navigators}${screens}

export default function App() {
  return (
    <NavigationContainer>
      {/* __PROVIDERS__ */}
      ${rootNav}
      {/* __PROVIDERS_END__ */}
    </NavigationContainer>
  );
}`;
}

export const homeScreenTemplate = `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome! 🚀</Text>
      <Text style={styles.subtitle}>Your app is ready to start.</Text>
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
});`;

export const settingsScreenTemplate = `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Configure your app here.</Text>
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
});`;

export const profileScreenTemplate = `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.subtitle}>Your profile goes here.</Text>
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
});`;
