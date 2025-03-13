import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import DetailsScreen from './screens/DetailsScreen'; 
import AddTaskScreen from './screens/AddTaskScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Task List' }} />
         <Stack.Screen name="Details" component={DetailsScreen} options={{ title: 'Task Details' }} />
         <Stack.Screen name="AddTask" component={AddTaskScreen} options={{ title: 'Add Task' }} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;