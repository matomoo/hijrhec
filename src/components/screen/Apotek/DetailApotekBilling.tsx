import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  // Text,
  View,
  AsyncStorage,
  ScrollView,
  ViewStyle,
  TextStyle,
} from 'react-native';
import * as db1 from '../../../firebase/firebase';
import { Button, Headline, IconButton, Colors,
  Caption, Card, Title, Paragraph, TouchableRipple, Text, Subheading,
} from 'react-native-paper';

import { observer } from 'mobx-react';
import { inject } from 'mobx-react/native';
import { auth, db } from '../../../firebase';

interface IProps {
  navigation?: any;
  store?: any;
}

interface IState {
  isLoaded;
  users;
}

@inject('store') @observer
class Screen extends Component<IProps, IState> {
  public static navigationOptions = {
    title: 'Detail Apotek Billing',
  };

  private taskUser: any;

  constructor(props) {
    super(props);
    this.taskUser = db1.db.ref(`rekamMedik`);
    this.state = {
      isLoaded: false,
      users: [],
    };
  }

  public componentDidMount() {
    this.getFirstData(this.taskUser);
  }

  public render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={[{width: '100%'}, {marginTop: 10}]}>
            { this.state.users.map( (el, key) =>
              <View key={key}>
                <Card style={[{margin: 10}]}>
                  <Card.Content>
                      <Subheading>Nama Pasien : { el.namaUser }</Subheading>
                      <Caption>Tanggal Periksa : { el.tanggalRekamMedik }</Caption>
                      <Caption>Nama Dokter Periksa : { el.namaDokter }</Caption>
                      <Caption>Diag : { el.itemDiag }</Caption>
                      <Caption>Obat : { el.itemObat }</Caption>
                  </Card.Content>
                  <Card.Actions>
                    <Button mode='text'
                      onPress={() => this.props.navigation.navigate('HomeUserScreen')}>
                      Proses Obat dan Pembayaran
                    </Button>
                  </Card.Actions>
                </Card>
              </View>,
            )}
          </View>
          <View style={[{marginTop: 10}]}>
            <Button mode='outlined'
              onPress={() => this._onLogout()} >
              Logout
            </Button>
          </View>
        </View>
      </ScrollView>
    );
  }

  private async getFirstData( p ) {
    await p
      .orderByChild('idUser')
      .equalTo(this.props.navigation.state.params.el.p.idPasien)
      .on('value', (result) => {
      const r1 = [];
      // r1.push(result.val());
      result.forEach(el => {
        r1.push({
          namaUser: el.val().namaUser,
          namaDokter: el.val().namaDokter,
          tanggalRekamMedik: el.val().tanggalRekamMedik,
          itemDiag: el.val().itemDiag,
          itemObat: el.val().itemObat,
        });
      });
      // console.log(r1);
      this.setState({
        users: r1,
        isLoaded: false,
      });
    });
  }

  private _onLogout = async () => {
    await AsyncStorage.clear();
    auth.doSignOut();
    this.props.navigation.navigate('Auth');
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
