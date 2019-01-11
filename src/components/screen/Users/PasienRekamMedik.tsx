import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {
  List, Card, Title, Paragraph, Button,
  Caption, Subheading, Divider, Searchbar,
} from 'react-native-paper';
import { observer } from 'mobx-react';
import { inject } from 'mobx-react/native';
import * as db1 from '../../../firebase/firebase';
import Moment from 'moment';

interface IProps {
  navigation?: any;
  store?: any;
  tabLabel?;
}

interface IState {
  isLoaded: boolean;
  items: any;
  // firstQuery;
}

@inject('store') @observer
class Screen extends Component<IProps, IState> {
  public static navigationOptions = {
    title: 'Pasien Rekam Medik',
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoaded: true,
      items: [],
    };
  }

  public render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Screen</Text>
      </View>
    );
  }
}

export default Screen;

interface IStyle {
  container: ViewStyle;
  text: TextStyle;
}

const styles = StyleSheet.create<IStyle>({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    color: 'black',
  },
});
