import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import Genres from '../MovieSelect/Components/Genres';
import MovieListComponent from './Components/MovieListComponent';
import auth from '@react-native-firebase/auth';

const genresCollection = {
  12: 'Aventure',
  14: 'Fantastique',
  16: 'Animation',
  18: 'Drama',
  27: 'Horreur',
  28: 'Action',
  35: 'Comédie',
  36: 'Histoire',
  37: 'Western',
  53: 'Thriller',
  80: 'Crime',
  99: 'Documentaire',
  878: 'Science-Fiction',
  9648: 'Mystère',
  10402: 'Musique',
  10749: 'Romance',
  10751: 'Familial',
  10752: 'Guerre',
  10770: 'Téléfilm',
};

const List = ({navigation}: {navigation: any}) => {
  const insets = useSafeAreaInsets();

  const [listData, setListData] = useState<any>([]);

  useEffect(() => {
    firestore()
      .collection('Lists')
      .where('creator', '==', auth().currentUser?.uid)
      .onSnapshot(querySnapshot => {
        const ListArray: any = [];

        querySnapshot.forEach(documentSnapshot => {
          ListArray.push(documentSnapshot.data());
        });

        setListData(ListArray);
      });
  }, []);

  const RenderList = ({item, index}: {item: any; index: number}) => {
    const mapCategories = item.categories.map(
      (genre: number) => (genresCollection as any)[genre],
    );

    return (
      <View style={styles.listContainer}>
        <View style={styles.listHeader}>
          <View>
            <Text style={styles.listTitle}>{item.name}</Text>
            <Text style={styles.listDescription}>{item.description}</Text>
          </View>
          <View style={styles.rightIconContainer}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('MovieSearch', {listId: item.id})
              }>
              <Icon name="search-plus" size={30} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  item.name,
                  'Êtes vous sûrs de vouloir supprimer cette liste ?',
                  [
                    {
                      text: 'Annuler',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                    },
                    {
                      text: 'Oui',
                      onPress: () => {
                        const listsCollection = firestore().collection('Lists');
                        listsCollection.doc(item.id).delete();
                      },
                    },
                  ],
                );
              }}>
              <Icon
                style={styles.rightIcon}
                name="trash"
                size={30}
                color="red"
              />
            </TouchableOpacity>
          </View>
        </View>
        <MovieListComponent movies={item.movies} listId={item.id} />
        <View style={styles.genreContainer}>
          <Genres genres={mapCategories} />
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.mainContainer, {paddingTop: insets.top}]}>
      <View style={styles.headerContainer}>
        <Text style={styles.listPageTitle}>Mes listes</Text>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => navigation.navigate('CreateList')}>
          <Icon name="plus-circle" size={30} color="black" />
        </TouchableOpacity>
      </View>
      <FlatList
        renderItem={RenderList}
        data={listData}
        contentContainerStyle={{paddingBottom: 100}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  listPageTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  listContainer: {
    paddingVertical: 10,
    borderBottomWidth: 0.18,
    borderBottomColor: 'grey',
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  listDescription: {
    fontSize: 13,
  },
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
  genreContainer: {
    marginHorizontal: 20,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  rightIconContainer: {
    flexDirection: 'row',
  },
  rightIcon: {
    marginLeft: 10,
  },
});

export default List;
