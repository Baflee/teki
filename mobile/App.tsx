import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import NfcManager from 'react-native-nfc-manager';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

function App() {
  const [hasNfc, setHasNfc] = React.useState(false);
  React.useEffect(() => {
    async function checkNfc() {
      const supported = await NfcManager.isSupported();
      if (supported) {
        await NfcManager.start();
      }
      setHasNfc(supported);
    }
    checkNfc();
  });

  if (hasNfc === null) {
    return (
      <View style={styles.wrapper}>
        <Text>Your device doesn't support NFC</Text>
      </View>
    );
  } else if (!hasNfc) {
    return (
      <View style={styles.wrapper}>
        <Text>Hello</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
