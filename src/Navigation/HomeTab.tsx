import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import Home from '../Screens/Home';
import List from '../Screens/List';

import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../Assets/Colors';

const Tab = createBottomTabNavigator();

function MyTabBar({
  state,
  descriptors,
  navigation,
}: {
  state: any;
  descriptors: any;
  navigation: any;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        flexDirection: 'row',
        height: 60,
        borderRadius: 50,
        justifyContent: 'space-around',
        alignItems: 'center',
        position: 'absolute',
        paddingLeft: 20,
        paddingRight: 20,
        bottom: 0,
        left: 0,
        right: 0,
        margin: 20,
        backgroundColor: Colors.mainColor,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 2,
      }}>
      {state.routes.map((route: any, index: number) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{flex: 1, alignItems: 'center'}}>
            {label === 'Home' && <Icon name="home" size={30} color="white" />}
            {label === 'List' && (
              <Icon name="list-ul" size={30} color="white" />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export const HomeTab = () => {
  return (
    <Tab.Navigator
      initialRouteName={'Home'}
      screenOptions={{headerShown: false}}
      tabBar={props => <MyTabBar {...props} />}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="List" component={List} />
    </Tab.Navigator>
  );
};

export default HomeTab;
