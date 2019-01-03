import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { observer } from 'mobx-react/native';

import { colors } from '../../utils/Styles';
import appStore from '../../stores/appStore';
import NotFoundScreen from '../screen/NotFound';
import Login from '../screen/authe/Login';
import Register from '../screen/authe/Register';
import AutheLoading from '../screen/authe/AutheLoading';

const routeConfig = {
  AutheLoading: {
    screen: AutheLoading,
    path: 'AutheLoading',
  },
  Login: {
    screen: Login,
    path: 'Login',
    navigationOptions: {
      header: null,
      headerMode: 'none',
    },
  },
  Register: {
    screen: Register,
    path: 'Register',
    navigationOptions: {
      header: null,
      headerMode: 'none',
    },
  },
};

const navigatorConfig = {
  initialRouteName: 'Login',
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
    return (
      <RootStackNavigator
        navigation={this.props.navigation}
      />
    );
  }
}

export default RootNavigator;
