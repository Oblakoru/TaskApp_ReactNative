import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import DetailsScreen from './screens/DetailsScreen';
import AddTaskScreen from './screens/AddTaskScreen';
import LoginScreen from './screens/LoginScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import { Alert, Button } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Icon from "react-native-feather";


const Stack = createNativeStackNavigator();

const LogoutButton = ({ navigation }) => {
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
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

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerStyle: { backgroundColor: '#000' }, 
            headerTitle: "", 
            headerTintColor: "#fff",
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={({ navigation }) => ({ 
              headerRight: () => <LogoutButton navigation={navigation} /> 
            })}
          />
          <Stack.Screen name="Details" component={DetailsScreen} />
          <Stack.Screen name="AddTask" component={AddTaskScreen} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;