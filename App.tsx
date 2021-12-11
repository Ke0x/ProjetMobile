import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import MovieSelect from './src/Screens/MovieSelect';
import HomeTab from './src/Navigation/HomeTab';
import CreateList from './src/Screens/CreateList';
import MovieSearch from './src/Screens/MovieSearch';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="HomeTab" component={HomeTab} />
          <Stack.Screen name="MovieList" component={MovieSelect} />
          <Stack.Screen name="CreateList" component={CreateList} />
          <Stack.Screen name="MovieSearch" component={MovieSearch} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
