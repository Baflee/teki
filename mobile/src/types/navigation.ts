import {NavigationProp} from '@react-navigation/native';

export type RootStackParamList = {
  Scan: undefined;
  Connect: undefined;
};

export type LandingScreenNavigationProp = NavigationProp<
  RootStackParamList,
  'Scan'
>;
export type ConnectScreenNavigationProp = NavigationProp<
  RootStackParamList,
  'Connect'
>;
