import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {getNowPlayingMovies} from '../../Api';
import SelectedMovie from './Components/SelectedMovie';
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native';

const Home = ({navigation}: {navigation: any}) => {
  const [movies, setMovies] = useState<any>([]);
  const [selectedMovies, setSelectedMovies] = useState<any>([]);
  const [winningMovie, setWinningMovie] = useState<any>();

  useEffect(() => {
    const getMovies = async () => {
      const movies = await getNowPlayingMovies();

      setMovies(
        movies.map(item => {
          item.selected = false;
          return item;
        }),
      );
    };
    getMovies();
  }, []);

  const RenderItem = ({item, index}: {item: any; index: number}) => {
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => {
          const moviesStack = movies;
          const selectedStack = selectedMovies;
          if (!item.selected) {
            selectedStack.push(item);
            setSelectedMovies(selectedStack);
          } else {
            setSelectedMovies(
              selectedStack.filter((itemF: any) => itemF.key !== item.key),
            );
          }
          item.selected = !item.selected;
          moviesStack[index] = item;
          setMovies([...moviesStack]);
        }}>
        <Image source={{uri: item.poster}} style={styles.cardImg} />
        {item.selected ? (
          <View style={styles.selectedIndicator}>
            <Image
              style={styles.validIcon}
              source={require('../../Images/verifie.png')}
            />
          </View>
        ) : null}
      </TouchableOpacity>
    );
  };

  function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  const RenderSelectedItem = (item: any) => {
    console.log(item);
    return <SelectedMovie item={item} />;
  };

  return (
    <SafeAreaView>
      <Text style={styles.listTitle}>Now playing movies</Text>
      <FlatList
        style={styles.listStyle}
        renderItem={RenderItem}
        data={movies}
        keyExtractor={item => item.key}
        horizontal
        contentContainerStyle={{paddingHorizontal: 10}}
        showsHorizontalScrollIndicator={false}
      />
      <TouchableOpacity
        style={styles.selectButton}
        onPress={() => {
          const random = getRandomInt(selectedMovies.length);
          setWinningMovie(selectedMovies[random]);
          console.log(winningMovie);
        }}>
        <Text style={styles.selectText}>Select Movie !</Text>
      </TouchableOpacity>
      {winningMovie ? (
        <View style={styles.winningContainer}>
          {RenderSelectedItem(winningMovie)}
          <Animatable.Text
            style={styles.winningText}
            animation="fadeIn"
            duration={2000}>
            {winningMovie.title}
          </Animatable.Text>
          <LottieView
            source={require('../../Images/animation.json')}
            autoPlay
            loop
          />
        </View>
      ) : null}
    </SafeAreaView>
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
  listStyle: {
    paddingTop: 20,
    marginBottom: 20,
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
  listTitle: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  validIcon: {
    height: 50,
    width: 50,
  },
  selectButton: {
    height: 40,
    backgroundColor: 'rgb(227, 136, 79)',
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  selectText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '800',
  },
  winningContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  winningText: {
    marginTop: 5,
    fontSize: 18,
    fontWeight: '800',
  },
});

export default Home;
