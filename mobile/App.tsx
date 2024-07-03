import 'react-native-gesture-handler';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import LandingScreen from './src/screens/LandingScreen';
import ConnectScreen from './src/screens/ConnectScreen';
import {RootStackParamList} from './src/types/navigation';

const Tab = createBottomTabNavigator<RootStackParamList>();

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{headerShown: false}}>
        <Tab.Screen name="Landing" component={LandingScreen} />
        <Tab.Screen name="Connect" component={ConnectScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
