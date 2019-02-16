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
// import { auth, db } from '../../../firebase';

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
            { !!this.state.users && this.state.users.map( (el, key) =>
              <View key={key}>
                { el.statusApotekBilling === 'ApotekBillingNOK' &&
                <Card style={[{margin: 10}]}>
                  <Card.Content>
                      <Subheading>Nama Pasien : { el.namaUser }</Subheading>
                      <Caption>Tanggal Periksa : { el.tanggalRekamMedik }</Caption>
                      <Caption>Nama Dokter Periksa : { el.namaDokter }</Caption>
                      <Caption>Diagnosa :</Caption>
                      { !!el.itemDiag && JSON.parse(el.itemDiag).map((el1, key1) =>
                        <View style={{marginLeft: 10}} key={key1}>
                          <Caption>{el1.namaDiagnosa}</Caption>
                          <Caption style={{marginLeft: 5}}>{el1.hargaDiagnosa}</Caption>
                        </View>,
                      ) }
                      <Caption>Obat :</Caption>
                      { !!el.itemObat && JSON.parse(el.itemObat).map((el1, key1) =>
                        <View style={{marginLeft: 10}} key={key1}>
                          <Caption>{el1.namaObat}</Caption>
                          <Caption style={{marginLeft: 5}}>{el1.jumlahObat} - {el1.hargaJualObat}</Caption>
                        </View>,
                      ) }
                  </Card.Content>
                  <Card.Actions>
                    <Button mode='text'
                      onPress={() => this._onProsesObatDanPembayaran(el)}>
                      Proses Obat dan Pembayaran
                    </Button>
                  </Card.Actions>
                </Card>}
              </View>,
            )}
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
      // r1.push(result.key());
      // console.log(result.key);
      result.forEach((el) => {
        // console.log(el.key);
        r1.push({
          idRekamMedikPasien: el.key,
          idUser: el.val().idUser,
          namaUser: el.val().namaUser,
          namaDokter: el.val().namaDokter,
          tanggalRekamMedik: el.val().tanggalRekamMedik,
          itemDiag: el.val().itemDiag,
          itemObat: el.val().itemObat,
          statusApotekBilling: el.val().statusApotekBilling,
        });
      });
      // console.log(r1);
      this.setState({
        users: r1,
        isLoaded: false,
      });
    });
  }

  private _onProsesObatDanPembayaran(p) {
    db1.db.ref('users/' + p.idUser )
      .update({
        flagActivity: 'userIdle',
      });
    db1.db.ref('rekamMedik/' + p.idRekamMedikPasien)
      .update({
        statusApotekBilling: 'ApotekBillingOK',
      });
    this.props.navigation.navigate('HomeUserScreen');
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
