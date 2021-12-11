import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Image,
  Animated,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Genres from './Components/Genres';
import Colors from '../../Assets/Colors';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const {width, height} = Dimensions.get('window');
const SPACING = 6;
const ITEM_SIZE = width * 0.7;
const SPACER_ITEM_SIZE = (width - ITEM_SIZE) / 2;
const BACKDROP_HEIGHT = height * 0.6;

const Backdrop = ({movies, scrollX}: {movies: any; scrollX: any}) => {
  return (
    <View style={{height: BACKDROP_HEIGHT, width, position: 'absolute'}}>
      <FlatList
        data={movies}
        keyExtractor={item => item.key + '-backdrop'}
        removeClippedSubviews={false}
        contentContainerStyle={{width, height: BACKDROP_HEIGHT}}
        renderItem={({item, index}) => {
          if (!item.backdrop) {
            return null;
          }
          const inputRange = [(index - 2) * ITEM_SIZE, (index - 1) * ITEM_SIZE];
          const translateX = scrollX.interpolate({
            inputRange,
            outputRange: [-width, 0],
          });
          return (
            <Animated.View
              removeClippedSubviews={false}
              style={{
                position: 'absolute',
                height: BACKDROP_HEIGHT,
                width,
                overflow: 'hidden',
                zIndex: 1,
                transform: [{translateX}],
              }}>
              <Image
                source={{uri: item.backdrop}}
                style={{
                  width,
                  height: BACKDROP_HEIGHT,
                }}
              />
            </Animated.View>
          );
        }}
      />
      <LinearGradient
        colors={['rgba(0, 0, 0, 0)', Colors.dark]}
        style={{
          height: BACKDROP_HEIGHT,
          width,
          position: 'absolute',
          bottom: 0,
        }}
      />
    </View>
  );
};

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function MovieSelect({navigation, route}: {navigation: any; route: any}) {
  const insets = useSafeAreaInsets();
  const {list} = route.params;

  const scrollX = useRef(new Animated.Value(0)).current;
  const [movies, setMovies] = useState<Array<any>>([
    {key: 'left-spacer'},
    ...list,
    {key: 'right-spacer'},
  ]);
  const [winningMovie, setWinningMovie] = useState(false);
  const flatLRef = useRef<any>();

  if (movies?.length === 0) {
    return <ActivityIndicator />;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.backContainer, {top: insets.top}]}
        onPress={() => navigation.goBack()}>
        <Icon name="caret-left" size={30} color="white" />
        <Text style={styles.listTitle}>Choisir un film</Text>
      </TouchableOpacity>
      {winningMovie ? (
        <LottieView
          style={styles.animation}
          source={require('../../Assets/Images/animation.json')}
          autoPlay
          loop
        />
      ) : null}
      <TouchableOpacity
        style={styles.playContainer}
        activeOpacity={0.8}
        onPress={() => {
          flatLRef.current.scrollToOffset({
            offset: ITEM_SIZE * getRandomInt(movies.length),
            animated: true,
          });
          setTimeout(() => {
            setWinningMovie(true);
          }, 300);
        }}>
        <Image
          style={styles.playImage}
          source={require('../../Assets/Images/play.png')}
        />
      </TouchableOpacity>
      <Backdrop movies={movies} scrollX={scrollX} />
      <Animated.FlatList
        ref={flatLRef}
        showsHorizontalScrollIndicator={false}
        data={movies}
        keyExtractor={item => item.key}
        horizontal
        contentContainerStyle={{
          alignItems: 'center',
        }}
        snapToInterval={ITEM_SIZE}
        decelerationRate={0}
        bounces={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: true},
        )}
        scrollEventThrottle={16}
        renderItem={({item, index}) => {
          if (!item.poster) {
            return <View style={{width: SPACER_ITEM_SIZE}} />;
          }
          const inputRange = [
            (index - 2) * ITEM_SIZE,
            (index - 1) * ITEM_SIZE,
            index * ITEM_SIZE,
          ];
          const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [0, -50, 0],
          });
          return (
            <View style={{width: ITEM_SIZE}}>
              <Animated.View
                style={{
                  marginHorizontal: SPACING,
                  padding: SPACING * 2,
                  alignItems: 'center',
                  backgroundColor: 'white',
                  borderRadius: 34,
                  transform: [{translateY}],
                }}>
                <Image source={{uri: item.poster}} style={styles.posterImage} />
                <Text style={{fontSize: 24}} numberOfLines={1}>
                  {item.title}
                </Text>
                <Genres genres={item.genres} />
                <Text style={{fontSize: 12}} numberOfLines={3}>
                  {item.description}
                </Text>
              </Animated.View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.dark,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  posterImage: {
    width: '100%',
    height: ITEM_SIZE * 1.2,
    resizeMode: 'cover',
    borderRadius: 24,
    margin: 0,
    marginBottom: 10,
  },
  playContainer: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.mainColor,
    height: 100,
    width: 100,
    borderRadius: 50,
    zIndex: 10,
  },
  playImage: {
    height: 50,
    width: 50,
    marginLeft: 8,
  },
  animation: {
    position: 'absolute',
    zIndex: 10,
    height: '100%',
    width: '100%',
  },
  listTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginLeft: 10,
    color: 'white',
  },
  backContainer: {
    position: 'absolute',
    left: 10,
    zIndex: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default MovieSelect;
