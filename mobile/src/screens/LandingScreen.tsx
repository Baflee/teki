import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import NfcManager, {NfcTech, Ndef} from 'react-native-nfc-manager';
import {LandingScreenNavigationProp} from '../types/navigation';

type Props = {
  navigation: LandingScreenNavigationProp;
};

const LandingScreen: React.FC<Props> = ({navigation}) => {
  const [tagData, setTagData] = React.useState<string | null>(null);

  const readNfcTag = async () => {
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      if (tag && tag.ndefMessage) {
        const ndefRecord = tag.ndefMessage[0];
        if (ndefRecord && ndefRecord.payload) {
          const payload = new Uint8Array(ndefRecord.payload);
          const text = Ndef.text.decodePayload(payload);
          setTagData(text);
        } else {
          setTagData('No NDEF message payload found');
        }
      } else {
        setTagData('No NDEF message found');
      }
    } catch (ex) {
      console.warn(ex);
      setTagData('Error reading NFC tag');
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Landing Page</Text>
      <Button title="Scan NFC Tag" onPress={readNfcTag} />
      {tagData && <Text style={styles.text}>Tag Data: {tagData}</Text>}
      <Button
        title="Go to Connect Page"
        onPress={() => navigation.navigate('Connect')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  text: {
    marginTop: 20,
  },
});

export default LandingScreen;
