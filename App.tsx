import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, View } from "react-native";

// Screens
import WelcomeScreen from "./screens/WelcomeScreen";
import OnboardingScreen from "./screens/OnboardingScreen";
import CheckInScreen from "./screens/CheckInScreen";
import ProfileScreen from "./screens/ProfileScreen";
import MWIScreen from "./screens/MWIScreen";
import WeeklySummaryScreen from "./screens/WeeklySummaryScreen";
import ChatScreen from "./screens/ChatScreen";
import CreateTeamScreen from "./screens/CreateTeamScreen";
import JoinTeamScreen from "./screens/JoinTeamScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Home: "👋",
    "Check-In": "📝",
    Profile: "👤",
    Coach: "🤖",
  };
  return (
    <View style={{ alignItems: "center" }}>
      <Text style={{ fontSize: 22 }}>{icons[label] || "●"}</Text>
      <Text style={{ fontSize: 10, color: focused ? "#6366f1" : "#999" }}>
        {label}
      </Text>
    </View>
  );
}

// Bottom Tab Navigator — Home is the default tab
function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <TabIcon label={route.name} focused={focused} />
        ),
        tabBarStyle: { height: 70, paddingBottom: 8, paddingTop: 8 },
        tabBarActiveTintColor: "#6366f1",
        tabBarInactiveTintColor: "#999",
      })}
    >
      <Tab.Screen name="Home" component={WelcomeScreen} />
      <Tab.Screen name="Check-In" component={CheckInScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Coach" component={ChatScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator
        initialRouteName="HomeTabs"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="HomeTabs" component={HomeTabs} />
        <Stack.Screen
          name="MWI"
          component={MWIScreen}
          options={{
            headerShown: true,
            headerTintColor: "#0D3B3B",
            headerTitle: "My MWI",
            headerStyle: { backgroundColor: "#f8fafc" },
          }}
        />
        <Stack.Screen
          name="WeeklySummary"
          component={WeeklySummaryScreen}
          options={{
            headerShown: true,
            headerTintColor: "#0D3B3B",
            headerTitle: "Weekly Summary",
            headerStyle: { backgroundColor: "#f8fafc" },
          }}
        />
        <Stack.Screen
          name="CreateTeam"
          component={CreateTeamScreen}
          options={{
            headerShown: true,
            headerTintColor: "#0D3B3B",
            headerTitle: "Create Team",
            headerStyle: { backgroundColor: "#f8fafc" },
          }}
        />
        <Stack.Screen
          name="JoinTeam"
          component={JoinTeamScreen}
          options={{
            headerShown: true,
            headerTintColor: "#0D3B3B",
            headerTitle: "Join Team",
            headerStyle: { backgroundColor: "#f8fafc" },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
