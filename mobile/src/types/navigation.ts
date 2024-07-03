import {NavigationProp} from '@react-navigation/native';

export type RootStackParamList = {
  Landing: undefined;
  Connect: undefined;
};

export type LandingScreenNavigationProp = NavigationProp<
  RootStackParamList,
  'Landing'
>;
export type ConnectScreenNavigationProp = NavigationProp<
  RootStackParamList,
  'Connect'
>;
