import React, {useEffect, useState} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  TextInput,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import Genres from '../MovieSelect/Components/Genres';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Colors from '../../Assets/Colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';

import {searchMovies} from '../../Api';

const {width, height} = Dimensions.get('window');
const ITEM_SIZE = height / 4;

function MovieSearch({navigation, route}: {navigation: any; route: any}) {
  const insets = useSafeAreaInsets();

  const {listId} = route.params;

  const [movies, setMovies] = useState<Array<any>>([]);
  const [search, setSearch] = useState<string>('');
  const [moviesLoading, setMoviesLoading] = useState<boolean>(false);
  const [searchWaiting, setSearchWaiting] = useState<any>(0);

  useEffect(() => {
    const fetchData = async () => {
      if (search != '') {
        setMoviesLoading(true);
        const movies = await searchMovies(search);
        setMovies(movies);
        setMoviesLoading(false);
      } else {
        setMovies([]);
      }
    };
    fetchData();
  }, [search]);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <View
          style={[
            styles.headerContainer,
            {marginTop: insets.top ? insets.top + 10 : 10},
          ]}>
          <TouchableOpacity
            style={styles.touchableStyle}
            activeOpacity={0.6}
            onPress={() => navigation.goBack()}>
            <Icon name="caret-left" size={30} color="white" />
            <Text style={styles.listTitle}>Recherche</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.iconContainer}>
            <Icon name="search" size={22} color="black" />
          </View>
          <TextInput
            style={styles.inputStyle}
            onChangeText={searchText => {
              if (searchWaiting) clearTimeout(searchWaiting);
              setSearchWaiting(
                setTimeout(() => {
                  setSearchWaiting(searchWaiting);
                  setSearch(searchText);
                }, 500),
              );
            }}
            placeholder="Rechercher un film"
            placeholderTextColor="#8b9cb5"
            autoCapitalize="none"
            returnKeyType="go"
            underlineColorAndroid="#f000"
            blurOnSubmit={false}
            secureTextEntry={false}
          />
        </View>
        {moviesLoading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size={'large'} color={Colors.mainColor} />
          </View>
        )}
        {!moviesLoading && (
          <FlatList
            data={movies}
            showsVerticalScrollIndicator={false}
            bounces={false}
            keyExtractor={item => item.key + '-backdrop'}
            removeClippedSubviews={false}
            contentContainerStyle={{padding: 20, paddingTop: 0}}
            renderItem={({item, index}) => {
              if (!item.poster) {
                return null;
              }
              return (
                <TouchableOpacity
                  style={styles.viewContainer}
                  onPress={() => {
                    const listsCollection = firestore().collection('Lists');
                    listsCollection
                      .doc(listId)
                      .update({
                        movies: firestore.FieldValue.arrayUnion(item.key),
                      })
                      .then(() => {});
                  }}>
                  <Image
                    source={{uri: item.poster}}
                    style={styles.posterImage}
                  />
                  <View style={styles.detailsContain}>
                    <Text style={styles.title} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Genres genres={item.genres} />
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark,
  },
  viewContainer: {
    marginVertical: 10,
    flexDirection: 'row',
  },
  posterImage: {
    width: ITEM_SIZE * 0.7,
    height: ITEM_SIZE,
    resizeMode: 'cover',
    borderRadius: 24,
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  detailsContain: {
    flex: 1,
    marginHorizontal: 10,
  },
  inputStyle: {
    height: 40,
    flex: 1,
    fontStyle: 'italic',
    fontWeight: '300',
    fontSize: 14,
    color: '#000000',
  },
  inputContainer: {
    height: 50,
    backgroundColor: Colors.mainColor,
    borderRadius: 10,
    alignItems: 'center',
    paddingRight: 10,
    overflow: 'hidden',
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    paddingHorizontal: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  touchableStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginLeft: 10,
    color: 'white',
  },
});

export default MovieSearch;
