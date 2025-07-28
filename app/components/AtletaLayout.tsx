import React from 'react';
import { View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AtletaFooter from './AtletaFooter';
import Header from './Header';
import { styles } from './styles/AtletaLayout.styles';

interface Props {
  children: React.ReactNode;
}

export default function AtletaLayout({ children }: Props) {
  const insets = useSafeAreaInsets();

  return (

    <SafeAreaView style={styles.safeArea} edges={['left', 'right','top']}>
      <View style={{ paddingTop: insets.top }}>
        <Header />
      </View>
      <View style={styles.container}>
        <View style={styles.content}>{children}</View>
        <View style={[styles.footerContainer, { paddingBottom: insets.bottom }]}>
          <AtletaFooter />
        </View>
      </View>
    </SafeAreaView>
  );
}
