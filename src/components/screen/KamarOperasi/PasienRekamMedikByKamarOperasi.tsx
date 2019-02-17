import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  View,
  ViewStyle,
  TextStyle,
  ScrollView,
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
  qeyAntrian;
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
      qeyUid: this.props.navigation.state.params.qey.p.uid,
      qeyAntrian: this.props.navigation.state.params.qey.p.idAntrian,
      items: [],
      itemsRekamMedik: [],
    };
  }

  public componentDidMount() {
    this.getFirstData(this.state.qeyUid);
  }

  public render() {
    const { qeyAntrian } = this.state;
    return (
        <View style={styles.container}>
          {this.state.items.map((el, key) =>
            <View key={key} style={{width: '100%'}}>
              <Card>
                <Card.Content>
                  <Subheading>{el.namaLengkap}</Subheading>
                  <Caption>{el.statusPasien}</Caption>
                </Card.Content>
                <Card.Actions>
                  <Button mode='outlined'
                    onPress={() => this.props.navigation.navigate('DiagnosisKamarOperasiScreen',
                      {qey : {el}, qey2: {qeyAntrian}})}
                  >Diagnosis + Resep/Obat</Button>
                </Card.Actions>
              </Card>
            </View>,
          )}
          <Headline>History Rekam Medik</Headline>
          <ScrollView style={{width: '100%'}}>
          {this.state.itemsRekamMedik.map((el2, key2) =>
            <View key={key2} style={{width: '100%'}}>
              {!!el2 ?
                <Card>
                  <Card.Content>
                    <Subheading>{el2.tanggalRekamMedik}</Subheading>
                    <Caption>{el2.namaDokter}</Caption>
                    <Caption>Diagnosa</Caption>
                    {JSON.parse(el2.itemDiag).map((item1, key) =>
                      <Caption key={key}>- {item1.namaDiagnosa}</Caption>,
                    )}
                    <Caption>Resep/obat</Caption>
                    {JSON.parse(el2.itemObat).map((item2, key) =>
                      <Caption key={key}>- {item2.namaObat} - [ {item2.jumlahObatKeluar} ]</Caption>,
                    )}
                  </Card.Content>
                </Card>
                : <Subheading>Tidak ada data</Subheading>
              }
            </View>,
            )}
            </ScrollView>

        </View>
      // </ScrollView>
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
    await db1.db.ref('rekamMedik' ).orderByChild('idUser').equalTo(p)
      .on('value', (snap2) => {
      const r2 = [];
      // r2.push(snap2.val());
      snap2.forEach((el2) => {
        r2.push({
          tanggalRekamMedik: el2.val().tanggalRekamMedik,
          namaDokter: el2.val().namaDokter,
          itemDiag: el2.val().itemDiag,
          itemObat: el2.val().itemObat,
        });
      });
      // console.log(snap2.val());
      this.setState({
        itemsRekamMedik: r2,
        isLoaded: false,
      });
    });
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
