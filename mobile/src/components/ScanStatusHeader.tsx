import React from 'react';
import {ScanMode} from './ScanWithNFCButton';
import {StyleSheet, Text, View} from 'react-native';

interface ScanStatusHeaderProps {
  mode: ScanMode;
  cardHolder?: string;
}

export const ScanStatusHeader = ({mode, cardHolder}: ScanStatusHeaderProps) => {
  const headerTitle = () => {
    switch (mode) {
      case ScanMode.OFF:
        return 'Scan your card';
      case ScanMode.SCANNING:
        return 'Scanning ...';
      case ScanMode.SUCCESS:
        return cardHolder;
      case ScanMode.ERROR:
        return 'Unknown card';
    }
  };

  const headerSubtitle = () => {
    switch (mode) {
      case ScanMode.OFF:
        return 'Authenticate with your physical card';
      case ScanMode.SCANNING:
        return 'Keep your card close to your phone...';
      case ScanMode.SUCCESS:
        return 'Thanks, your card is valid';
      case ScanMode.ERROR:
        return 'Please try scanning again';
    }
  };

  return (
    <View>
      <Text
        style={
          mode === ScanMode.SCANNING ? styles.scanningTitle : styles.title
        }>
        {headerTitle()}
      </Text>
      <Text
        style={[
          styles.underText,
          [ScanMode.SUCCESS, ScanMode.ERROR].includes(mode)
            ? styles.scannedUnderText
            : null,
        ]}>
        {headerSubtitle()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    marginLeft: 20,
    fontSize: 30,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    color: '#fff',
  },
  scanningTitle: {
    fontSize: 30,
    marginLeft: 20,
    color: '#D5A419',
    fontWeight: 'bold',
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
});
