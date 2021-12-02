import React, {useRef, useEffect} from 'react';
import {Image, StyleSheet} from 'react-native';
import * as Animatable from 'react-native-animatable';

const SelectedMovie = ({item}: {item: any}) => {
  const ref = useRef<any>();

  return (
    <Animatable.View animation="bounceInUp" ref={ref} style={styles.card}>
      <Image source={{uri: item.poster}} style={styles.cardImg} />
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 220,
    width: 140,
    marginHorizontal: 5,
    borderRadius: 15,
  },
  cardImg: {
    height: 220,
    width: 140,
    borderRadius: 15,
  },
});

export default SelectedMovie;
