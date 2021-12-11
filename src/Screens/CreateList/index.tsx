import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  FlatList,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {v4 as uuidv4} from 'uuid';
import Colors from '../../Assets/Colors';
import auth from '@react-native-firebase/auth';

const data = [
  {
    label: 'Action',
    icon: require('../../Assets/Images/action.png'),
    selected: false,
    id: 28,
  },
  {
    label: 'Animation',
    icon: require('../../Assets/Images/animation.png'),
    selected: false,
    id: 16,
  },
  {
    label: 'Aventure',
    icon: require('../../Assets/Images/aventure.png'),
    selected: false,
    id: 12,
  },
  {
    label: 'Comédie',
    icon: require('../../Assets/Images/comedie.png'),
    selected: false,
    id: 35,
  },
  {
    label: 'Crime',
    icon: require('../../Assets/Images/crime.png'),
    selected: false,
    id: 80,
  },
  {
    label: 'Documentaire',
    icon: require('../../Assets/Images/documentaire.png'),
    selected: false,
    id: 99,
  },
  {
    label: 'Drama',
    icon: require('../../Assets/Images/drama.png'),
    selected: false,
    id: 18,
  },
  {
    label: 'Familial',
    icon: require('../../Assets/Images/famille.png'),
    selected: false,
    id: 10751,
  },
  {
    label: 'Fantastique',
    icon: require('../../Assets/Images/fantastique.png'),
    selected: false,
    id: 14,
  },
  {
    label: 'Guerre',
    icon: require('../../Assets/Images/guerre.png'),
    selected: false,
    id: 10752,
  },
  {
    label: 'Histoire',
    icon: require('../../Assets/Images/histoire.png'),
    selected: false,
    id: 36,
  },
  {
    label: 'Horreur',
    icon: require('../../Assets/Images/horreur.png'),
    selected: false,
    id: 27,
  },
  {
    label: 'Musique',
    icon: require('../../Assets/Images/musique.png'),
    selected: false,
    id: 10402,
  },
  {
    label: 'Mystère',
    icon: require('../../Assets/Images/mystere.png'),
    selected: false,
    id: 9648,
  },
  {
    label: 'Romance',
    icon: require('../../Assets/Images/romance.png'),
    selected: false,
    id: 10749,
  },
  {
    label: 'Science-Fiction',
    icon: require('../../Assets/Images/sciencefiction.png'),
    selected: false,
    id: 878,
  },
  {
    label: 'Téléfilm',
    icon: require('../../Assets/Images/telefilm.png'),
    selected: false,
    id: 10770,
  },
  {
    label: 'Thriller',
    icon: require('../../Assets/Images/thriller.png'),
    selected: false,
    id: 53,
  },
  {
    label: 'Western',
    icon: require('../../Assets/Images/western.png'),
    selected: false,
    id: 37,
  },
];

const CreateList = ({navigation}: {navigation: any}) => {
  const insets = useSafeAreaInsets();

  const [interest, setInterest] = useState(data);
  const [listName, setListName] = useState('');
  const [listDescription, setListDescription] = useState('');

  const CreateList = () => {
    const filteredInterest = interest
      .filter(a => a.selected)
      .map(item => {
        return item.id;
      });

    const listsCollection = firestore().collection('Lists');
    const usersCollection = firestore().collection('Users');
    const listUuid = uuidv4();
    listsCollection
      .doc(listUuid)
      .set({
        id: listUuid,
        name: listName,
        description: listDescription,
        categories: filteredInterest,
        movies: [],
        creator: auth().currentUser?.uid,
      })
      .then(() => {
        console.warn('List added!');
        usersCollection
          .doc(auth().currentUser?.uid)
          .update({
            lists: firestore.FieldValue.arrayUnion(listUuid),
          })
          .then(() => {
            console.warn('User List added!');
          });
      });
  };

  const RenderItem = ({item, index}: {item: any; index: number}) => {
    return (
      <TouchableOpacity
        key={item.label}
        onPress={() => {
          const newInterest = interest;
          newInterest[index].selected = !newInterest[index].selected;
          setInterest([...newInterest]);
        }}>
        <View
          style={[
            styles.elipseContain,
            {
              borderColor: item.selected ? '#FFF3E1' : Colors.mainColor,
              backgroundColor: item.selected ? '#FFF3E1' : 'white',
              borderWidth: item.selected ? 0 : 1,
            },
          ]}>
          {item.selected && (
            <View style={styles.iconValid}>
              <Icon name="check-circle" size={22} color="black" />
            </View>
          )}
          <Image
            style={{
              height: 50,
              width: 50,
            }}
            source={item.icon}
          />
        </View>
        <Text
          style={[
            styles.textLabel,
            {
              color: item.selected ? Colors.mainColor : Colors.dark,
              fontWeight: item.selected ? '900' : '600',
            },
          ]}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.mainContainer, {paddingTop: insets.top}]}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.touchableStyle}
          activeOpacity={0.6}
          onPress={() => navigation.goBack()}>
          <Icon name="caret-left" size={30} color="black" />
          <Text style={styles.listTitle}>Créer une liste</Text>
        </TouchableOpacity>
      </View>
      <View>
        <View style={styles.inputRowContainer}>
          <Text style={styles.inputTitle}>Titre</Text>
          <View style={styles.textInputContainer}>
            <Icon name="file-signature" size={20} color="black" />
            <TextInput
              style={styles.textInputStyle}
              onChangeText={text => setListName(text)}
              placeholder="Titre de la liste"></TextInput>
          </View>
        </View>
        <View style={styles.inputRowContainer}>
          <Text style={styles.inputTitle}>Description</Text>
          <View style={styles.textInputContainer}>
            <Icon name="align-left" size={22} color="black" />
            <TextInput
              style={styles.textInputStyle}
              onChangeText={text => setListDescription(text)}
              placeholder="Description de la liste"></TextInput>
          </View>
        </View>
        <Text style={[styles.inputTitle, {marginLeft: 20, marginBottom: 10}]}>
          Catégorie(s)
        </Text>
        <View style={styles.categoryContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={RenderItem}
            data={interest}
            contentContainerStyle={{paddingHorizontal: 20}}
          />
        </View>
      </View>
      <TouchableOpacity
        style={styles.validateButton}
        onPress={() => {
          CreateList();
        }}>
        <Text style={styles.inputTitle}>Créer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginLeft: 10,
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
  inputRowContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  inputTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  textInputContainer: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: Colors.mainColor,
    borderRadius: 10,
  },
  textInputStyle: {
    flex: 1,
    height: 45,
    marginLeft: 7,
    fontSize: 17,
  },
  elipseContain: {
    height: 80,
    width: 80,
    borderColor: Colors.mainColor,
    margin: 10,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconValid: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: 'white',
    borderRadius: 20,
  },
  textLabel: {
    fontWeight: '600',
    fontSize: 14,
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    color: Colors.mainColor,
  },
  categoryContainer: {
    height: 130,
  },
  validateButton: {
    backgroundColor: Colors.mainColor,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    borderRadius: 20,
    marginTop: 20,
  },
});

export default CreateList;
