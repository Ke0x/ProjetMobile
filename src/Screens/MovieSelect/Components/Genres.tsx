import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

function Genres({genres}: {genres: any}) {
  return (
    <View style={styles.genres}>
      {genres.map((genre: any, i: number) => {
        return (
          <View key={genre} style={styles.genre}>
            <Text style={styles.genreText}>{genre}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  genres: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginVertical: 4,
  },
  genre: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 14,
    marginRight: 4,
    marginBottom: 4,
    backgroundColor: '#262A35',
  },
  genreText: {
    color: 'white',
    fontSize: 13,
  },
});

export default Genres;
