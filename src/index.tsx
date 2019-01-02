import { getStatusBarHeight } from 'react-native-status-bar-height';
// import { observer } from 'mobx-react/native';
import React from 'react';
import { Provider } from 'mobx-react';
import { Provider as PaperProvider } from 'react-native-paper';

import { Platform, StatusBar, StyleSheet, View, Text } from 'react-native';

import appStore from './stores/appStore';
import SwitchNavigator from './components/navigation/SwitchNavigator';
import { ratio } from './utils/Styles';
import SplashScreen from 'react-native-splash-screen';

class App extends React.Component {

  public componentDidMount() {
    SplashScreen.hide();
  }

  public render() {
    return (
      <Provider store={ appStore }>
        <PaperProvider>
          <View style={styles.container}>
            <SwitchNavigator />
          </View>
        </PaperProvider>
      </Provider>
    );
  }
}

const styles: any = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',
  },
});

export default App;
