import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image, Animated} from 'react-native';
import NfcManager, {NfcTech, Ndef} from 'react-native-nfc-manager';
import {jwtDecode} from 'jwt-decode';
import {LandingScreenNavigationProp} from '../types/navigation.ts';
import {ScanMode, ScanWithNFCButton} from '../components/ScanWithNFCButton.tsx';
import {ScanStatusHeader} from '../components/ScanStatusHeader.tsx';

type Props = {
  navigation: LandingScreenNavigationProp;
  setIsScanning: (value: boolean) => void;
  setIsScanned: (value: boolean) => void;
  setIsError: (value: boolean) => void;
  setDecoded: (value: any) => void;
  isScanning: boolean;
  isScanned: boolean;
  isError: boolean;
  decoded: any;
};

const LandingScreen: React.FC<Props> = ({
  navigation,
  isScanning,
  isScanned,
  isError,
  decoded,
  setIsScanning,
  setIsError,
  setIsScanned,
  setDecoded,
}) => {
  const [animationOpacity] = useState(new Animated.Value(1));

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      cancelReadNfc();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (isScanning) {
      startAnimation();
    } else {
      animationOpacity.setValue(1);
      animationOpacity.stopAnimation();
    }
  }, [isScanning]);

  const cancelReadNfc = async () => {
    setIsScanning(false);
    setIsScanned(false);
    setDecoded(null);
  };

  const cancelError = async () => {
    setIsError(false);
  };

  const readNfcTag = async () => {
    if (!isError) {
      setIsScanning(true);
    }
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      if (tag && tag.ndefMessage) {
        const ndefRecord = tag.ndefMessage[0];
        if (ndefRecord && ndefRecord.payload) {
          const payload = new Uint8Array(ndefRecord.payload);
          const text = Ndef.text.decodePayload(payload);
          setIsError(false);
          setIsScanned(true);
          const decodedtext: any = jwtDecode(text);
          setDecoded(decodedtext);
        } else {
          cancelReadNfc();
          setIsError(true);
          readNfcTag();
        }
      } else {
        cancelReadNfc();
        setIsError(true);
        readNfcTag();
      }
    } catch (ex) {
      cancelReadNfc();
      setIsError(true);
      readNfcTag();
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  };

  const startAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animationOpacity, {
          toValue: 0.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(animationOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      {iterations: -1},
    ).start();
  };

  return (
    <View
      style={[
        styles.container,
        isScanned && decoded ? styles.scannedContainer : null,
        isError ? styles.errorContainer : null,
      ]}>
      <Image
        source={require('../assets/teki-logo.png')}
        style={styles.imageStyle}
      />
      {isScanning ? (
        isScanned && decoded ? (
          <ScanStatusHeader mode={ScanMode.SUCCESS} cardHolder={decoded.name} />
        ) : (
          !isError && <ScanStatusHeader mode={ScanMode.SCANNING} />
        )
      ) : !isError ? (
        <ScanStatusHeader mode={ScanMode.OFF} />
      ) : null}
      {isError ? <ScanStatusHeader mode={ScanMode.ERROR} /> : null}

      <View style={styles.centeredButtonContainer}>
        {isScanning ? (
          isScanned && decoded ? (
            <ScanWithNFCButton mode={ScanMode.SUCCESS} />
          ) : !isError ? (
            <Animated.View style={{opacity: animationOpacity}}>
              <ScanWithNFCButton
                mode={ScanMode.SCANNING}
                onClick={() => cancelReadNfc()}
              />
            </Animated.View>
          ) : (
            <ScanWithNFCButton
              mode={ScanMode.ERROR}
              onClick={() => cancelError()}
            />
          )
        ) : (
          <ScanWithNFCButton
            mode={!isError ? ScanMode.OFF : ScanMode.ERROR}
            onClick={() => (!isError ? readNfcTag() : cancelError())}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#252C40',
  },
  scannedContainer: {
    backgroundColor: '#00C6BF',
  },
  errorContainer: {
    backgroundColor: '#E73A14',
  },
  title: {
    marginLeft: 20,
    fontSize: 30,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    color: '#fff',
  },
  underText: {
    marginLeft: 20,
    fontSize: 16,
    marginBottom: 20,
    color: '#858CA7',
    fontWeight: '500',
  },
  scannedUnderText: {
    color: '#252C40',
  },
  scanningTitle: {
    fontSize: 30,
    marginLeft: 20,
    color: '#D5A419',
    fontWeight: 'bold',
  },
  text: {
    marginTop: 20,
    color: '#fff',
  },
  centeredButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    marginTop: 20,
    width: 150,
    height: 150,
  },
});

export default LandingScreen;
