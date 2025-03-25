import React, {useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import DetailsScreen from './screens/DetailsScreen';
import AddTaskScreen from './screens/AddTaskScreen';
import LoginScreen from './screens/LoginScreen';
import AccountSettingsScreen from './screens/AccountSettingsScreen'; // Dodate račun za nastavitve
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import { Alert, TouchableOpacity } from 'react-native';
import * as Icon from "react-native-feather";
import messaging from '@react-native-firebase/messaging';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const LogoutButton = ({ navigation }) => {
  const handleLogout = () => {
    Alert.alert(
      "Odjava",
      "Ali se želiš odjaviti?",
      [
        { text: "Prekliči", style: "cancel" },
        {
          text: "Odjava",
          onPress: async () => {
            try {
              await auth().signOut();
              navigation.replace("Login");
            } catch (error) {
              console.error("🔥 Logout Error:", error);
            }
          },
        },
      ]
    );
  };
  return (
    <TouchableOpacity onPress={handleLogout} style={{ marginRight: 15 }}>
      <Icon.LogOut size={24} color="#fff" />
    </TouchableOpacity>
  );
};

// Navigacija za zavihek z opravili
const TasksStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#000' },
        headerTitle: "",
        headerTintColor: "#fff",
      }}
    >
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={({ navigation }) => ({
          headerRight: () => <LogoutButton navigation={navigation} />
        })}
      />
      <Stack.Screen name="Details" component={DetailsScreen} />
      <Stack.Screen name="AddTask" component={AddTaskScreen} />
    </Stack.Navigator>
  );
};

// Spodnja navigacija z zavihki
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { backgroundColor: '#fff' },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Tasks"
        component={TasksStackNavigator}
        options={{
          tabBarLabel: 'Opravila',
          tabBarIcon: ({ color, size }) => (
            <Icon.CheckSquare size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountSettingsScreen}
        options={{
          tabBarLabel: 'Nastavitve',
          tabBarIcon: ({ color, size }) => (
            <Icon.User size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Glavna navigacija aplikacije
const MainNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const App = () => {

  useEffect(() => {
    // Foreground Notification Handler
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert(remoteMessage.notification.title, remoteMessage.notification.body);
    });

    // Get Token for Debugging (Log It)
    messaging().getToken().then(token => console.log('FCM Token:', token));

    return unsubscribe; // Cleanup on unmount
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;