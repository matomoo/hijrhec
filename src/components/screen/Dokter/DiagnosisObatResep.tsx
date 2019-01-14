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
  Caption, Subheading, Divider, Searchbar, Headline,
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
  itemsRekamMedik;
  qeyUid;
}

@inject('store') @observer
class Screen extends Component<IProps, IState> {
  public static navigationOptions = {
    title: 'Diagnosis + Resep / Obat',
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoaded: true,
      qeyUid: this.props.navigation.state.params.qey.el.uid,
      items: [],
      itemsRekamMedik: [],
    };
  }

  public componentDidMount() {
    this.getFirstData(this.state.qeyUid);
  }

  public render() {
    return (
      <View style={styles.container}>
        <Headline>Diagnosis</Headline>
        <Headline>Resep/Obat</Headline>
      </View>
    );
  }

  private async getFirstData( p ) {
    if (p !== null ) {
      await db1.db.ref('users/' + p )
      .on('value', (snap) => {
        const r1 = [];
        r1.push(snap.val());
        this.setState({
          items: r1,
        });
      });
    }
  }

}

export default Screen;

interface IStyle {
  container: ViewStyle;
}

const styles = StyleSheet.create<IStyle>({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 5,
  },
});
