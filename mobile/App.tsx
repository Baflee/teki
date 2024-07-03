import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import LandingScreen from './src/screens/LandingScreen';
import ConnectScreen from './src/screens/ConnectScreen';

import {RootStackParamList} from './src/types/navigation';
import {Image, StyleSheet} from 'react-native';

const Tab = createBottomTabNavigator<RootStackParamList>();

function App() {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isScanned, setIsScanned] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [decoded, setDecoded] = useState<any>(null);
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({route}) => ({
            headerShown: false,
            tabBarIcon: ({focused}) => {
              let iconComponent;
              if (route.name === 'Scan') {
                iconComponent = focused ? (
                  <Image
                    source={require('./src/assets/scanIconYellow.png')}
                    style={styles.scanIcon}
                  />
                ) : (
                  <Image
                    source={require('./src/assets/scanIconWhite.png')}
                    style={styles.scanIcon}
                  />
                );
              } else if (route.name === 'Connect') {
                iconComponent = focused ? (
                  <Image
                    source={require('./src/assets/connectIconYellow.png')}
                    style={styles.connectIcon}
                  />
                ) : (
                  <Image
                    source={require('./src/assets/connectIconWhite.png')}
                    style={styles.connectIcon}
                  />
                );
              }
              return iconComponent;
            },
            tabBarActiveTintColor: '#D5A419',
            tabBarInactiveTintColor: '#858CA7',
            tabBarStyle: [
              styles.tabBar,
              isScanned && decoded
                ? styles.scannedTabBar
                : isError
                ? styles.errorTabBar
                : null,
            ],
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: 'bold',
              marginBottom: 10,
            },
          })}>
          <Tab.Screen name="Scan">
            {props => (
              <LandingScreen
                {...props}
                setIsScanning={setIsScanning}
                setIsScanned={setIsScanned}
                setDecoded={setDecoded}
                setIsError={setIsError}
                decoded={decoded}
                isError={isError}
                isScanned={isScanned}
                isScanning={isScanning}
              />
            )}
          </Tab.Screen>
          <Tab.Screen name="Connect">
            {props => (
              <ConnectScreen
                {...props}
                setIsScanning={setIsScanning}
                setIsError={setIsError}
                setIsScanned={setIsScanned}
                setDecoded={setDecoded}
              />
            )}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  connectIcon: {
    width: 50,
    height: 50,
  },
  scanIcon: {
    width: 21,
    height: 30,
  },
  tabBar: {
    backgroundColor: '#252C40',
    display: 'flex',
    height: 70,
    borderColor: '#252C40',
    elevation: 0,
    shadowOpacity: 0,
  },
  scannedTabBar: {
    backgroundColor: '#00C6BF',
    borderColor: '#00C6BF',
  },
  errorTabBar: {
    backgroundColor: '#E73A14',
    borderColor: '#E73A14',
  },
});

export default App;
