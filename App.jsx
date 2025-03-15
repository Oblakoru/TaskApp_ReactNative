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
import { useNavigation, useRoute } from '@react-navigation/native';


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
              navigation.replace("Login"); // Redirect to Login screen
            } catch (error) {
              console.error("🔥 Logout Error:", error);
            }
          },
        },
      ]
    );
  };

  return <Button title="Logout" onPress={handleLogout} />;
};

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={({ navigation }) => ({ 
              title: "Domov", 
              headerRight: () => <LogoutButton navigation={navigation} /> 
            })}
          />
          <Stack.Screen name="Details" component={DetailsScreen} options={{ title: "Podrobnosti" }} />
          <Stack.Screen name="AddTask" component={AddTaskScreen} options={{ title: "Dodaj opravilo" }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Prijava" }} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};
export default App;