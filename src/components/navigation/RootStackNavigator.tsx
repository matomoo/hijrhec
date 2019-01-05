import React from 'react';
import { createStackNavigator, createBottomTabNavigator, getActiveChildNavigationOptions, createAppContainer } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import { observer } from 'mobx-react/native';
import { colors } from '../../utils/Styles';
import appStore from '../../stores/appStore';
import HomeUserScreen from '../screen/HomeUser';
import IntroScreen from '../screen/Intro';
import NotFoundScreen from '../screen/NotFound';
import InfoScreen from '../screen/Info';
import AppLoaderScreen from '../screen/AppLoader';
import ProfileScreen from '../screen/Users/UserProfile';
import InputUserProfileScreen from '../screen/Users/InputUserProfile';
import UserChangePwdScreen from '../screen/Users/UserChangePwd';
import UserDaftarAntrianDetailScreen from '../screen/Users/UserDaftarAntrianDetail';

// Set here for tabNavigator content
const UserBottomTabNavigator = createBottomTabNavigator(
  {
    HomeUserScreen: { screen: HomeUserScreen,
      navigationOptions: {
        tabBarLabel: 'Home',
        tabBarIcon: (() => (<Icon name='home' size={30}/>) ),
        tabBarVisible: true,
        // title: 'Dzikr App', // setting header title on its screen
      },
    },
    Intro: { screen: InfoScreen,
      navigationOptions: () => ({
        tabBarLabel: 'Info',
        tabBarIcon: (() => (<Icon name='info-circle' size={30}/>) ),
        tabBarVisible: true,
      }),
    },
    ProfileScreen: { screen: ProfileScreen,
      navigationOptions: () => ({
        tabBarLabel: 'Profil',
        tabBarIcon: (() => (<Icon name='user-md' size={30}/>) ),
        tabBarVisible: true,
      }),
    },
  },
);

const routeConfig = {
  UserBottomTabNavigator: {
    screen: UserBottomTabNavigator,
    navigationOptions: ({ navigation, screenProps }) => {
      const childOptions = getActiveChildNavigationOptions(navigation, screenProps);
      return {
        title: childOptions.title,
      };
    },
  },
  InfoScreen: {
    screen: InfoScreen,
    path: 'InfoScreen',
  },
  AppLoaderScreen: {
    screen: AppLoaderScreen,
    path: 'AppLoaderScreen',
  },
  InputUserProfileScreen: {
    screen: InputUserProfileScreen,
    path: 'InputUserProfileScreen',
  },
  UserChangePwdScreen: {
    screen: UserChangePwdScreen,
    path: 'UserChangePwdScreen',
  },
  HomeUserScreen: {
    screen: HomeUserScreen,
    path: 'HomeUserScreen',
  },
  UserDaftarAntrianDetailScreen: {
    screen: UserDaftarAntrianDetailScreen,
    path: 'UserDaftarAntrianDetailScreen',
  },

};

const navigatorConfig = {
  initialRouteName: 'UserBottomTabNavigator',
  // header: null,
  // headerMode: 'none',
  gesturesEnabled: true,
  statusBarStyle: 'light-content',
  navigationOptions: {
    headerStyle: {
      headerBackTitle: null,
      backgroundColor: colors.dodgerBlue,
      borderBottomColor: 'transparent',
      borderBottomWidth: 0,
      elevation: 0,
    },
    headerTitleStyle: { color: 'white' },
    headerTintColor: 'white',
  },
};

const RootStackNavigator = createStackNavigator(routeConfig, navigatorConfig);

interface IProps {
  navigation: any;
}

@observer
class RootNavigator extends React.Component<IProps> {
  private static router = RootStackNavigator.router;

  public render() {
    return <RootStackNavigator navigation={this.props.navigation}/>;
  }
}

export default RootNavigator;
