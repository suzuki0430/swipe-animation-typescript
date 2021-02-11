import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Deck } from './src/Deck';

import minami from './picture/minami.jpg';
import suzu from './picture/suzu.jpg';
import kanna from './picture/kanna.jpg';
import yamada from './picture/yamada.jpg';

const DATA = [
  {
    id: 1,
    name: '浜辺　美波',
    uri: minami,
    goal: '若手No.1女優',
  },
  {
    id: 2,
    name: '広瀬　すず',
    uri: suzu,
    goal: '若手No.1女優',
  },
  {
    id: 3,
    name: '橋本　環奈',
    uri: kanna,
    goal: '若手No.1女優',
  },
  {
    id: 4,
    name: '山田　勝己',
    uri: yamada,
    goal: 'SASUKE 1stステージクリア',
  },
];

export default function App() {
  return (
    <View style={styles.container}>
      <Deck data={DATA} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
