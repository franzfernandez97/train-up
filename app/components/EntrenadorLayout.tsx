import React from 'react';
import { View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import EntrenadorFooter from './EntrenadorFooter';
import Header from './Header';
import { styles } from './styles/EntrenadorLayout.styles';

interface Props {
  children: React.ReactNode;
}

export default function AthleteLayout({ children }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <>
      <Header />
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.container}>
          <Header />
          <View style={styles.content}>{children}</View>
          <View style={[styles.footerContainer, { paddingBottom: insets.bottom }]}>
            <EntrenadorFooter />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}