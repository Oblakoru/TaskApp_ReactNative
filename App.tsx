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
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Domov' }} />
         <Stack.Screen name="Details" component={DetailsScreen} options={{ title: 'Podrobnosti' }} />
         <Stack.Screen name="AddTask" component={AddTaskScreen} options={{ title: 'Dodaj opravilo' }} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;