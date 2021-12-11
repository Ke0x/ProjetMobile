import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import {getMovie} from '../../../Api';
import Colors from '../../../Assets/Colors';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Text} from 'react-native-animatable';

const MovieListComponent = ({movies, listId}: {movies: any; listId: any}) => {
  const navigation = useNavigation();
  const [movieList, setMovieList] = useState<any>([]);

  const getData = async () => {
    const data = Promise.all(movies.map(async (i: any) => await getMovie(i)));
    return data;
  };

  useEffect(() => {
    if (movies) {
      getData().then(data => {
        setMovieList(data);
      });
    }
  }, [movies]);

  const RenderItem = ({item, index}: {item: any; index: number}) => {
    return (
      <TouchableOpacity style={styles.card} activeOpacity={0.8}>
        <Image source={{uri: item.poster}} style={styles.cardImg} />
        {item.selected ? (
          <View style={styles.selectedIndicator}>
            <Image
              style={styles.validIcon}
              source={require('../../../Assets/Images/verifie.png')}
            />
          </View>
        ) : null}
      </TouchableOpacity>
    );
  };

  return (
    <View style={{justifyContent: 'center'}}>
      {movies && movies[0] ? (
        <FlatList
          style={styles.listStyle}
          renderItem={RenderItem}
          data={movieList}
          keyExtractor={item => item.key}
          horizontal
          contentContainerStyle={{paddingLeft: 10, paddingRight: 110}}
          showsHorizontalScrollIndicator={false}
        />
      ) : (
        <View style={{}}>
          <TouchableOpacity
            style={styles.emptyMovieContainer}
            onPress={() =>
              //@ts-ignore
              navigation.navigate('MovieSearch', {listId: listId})
            }>
            <Icon name="plus-square" size={45} color="black" />
            <Text style={styles.addMovies}>Ajouter des films</Text>
          </TouchableOpacity>
        </View>
      )}
      {movies && movies[0] ? (
        <TouchableOpacity
          style={styles.startButton}
          activeOpacity={0.96}
          //@ts-ignore
          onPress={() => navigation.navigate('MovieList', {list: movieList})}>
          <Image
            style={styles.playImage}
            source={require('../../../Assets/Images/play.png')}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 200,
    width: 130,
    marginHorizontal: 5,
    borderRadius: 15,
  },
  cardImg: {
    height: 200,
    width: 130,
    borderRadius: 15,
  },
  selectedIndicator: {
    position: 'absolute',
    height: 200,
    width: 130,
    borderRadius: 15,
    backgroundColor: 'rgba(227, 136, 79, 0.8)',
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  validIcon: {
    height: 50,
    width: 50,
  },
  listStyle: {
    paddingTop: 20,
    marginBottom: 20,
  },
  startButton: {
    position: 'absolute',
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.mainColor,
    height: 100,
    width: 100,
    borderBottomLeftRadius: 50,
    borderTopLeftRadius: 50,
    zIndex: 10,
  },
  playImage: {
    height: 50,
    width: 50,
    marginLeft: 8,
  },
  emptyMovieContainer: {
    height: 200,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addMovies: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 5,
  },
});

export default MovieListComponent;
