import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  View,
  ViewStyle,
  TextStyle,
  FlatList,
} from 'react-native';
import { ScrollView } from 'react-native';
import {
  List, Card, Title, Paragraph, Button,
  Caption, Subheading, Divider, Searchbar, Headline,
  Modal, Portal, Surface, TextInput, IconButton, Colors,
} from 'react-native-paper';
import { observer } from 'mobx-react';
import { inject } from 'mobx-react/native';
import * as db1 from '../../../firebase/firebase';
import Moment from 'moment';
import ListObat from './ListObat';
import { db } from 'src/firebase';

interface IProps {
  navigation?: any;
  store?: any;
  tabLabel?;
}

interface IState {
  isLoaded: boolean;
  itemsDiag;
  itemsObat;
  itemsDiagTerpilih;
  itemsObatTerpilih;
  // jumlahObatKeluar;
  itemsPasien;
  itemsRekamMedik;
  qeyUid;
  modDiagnosisVisible;
  modObatVisible;
  itemsPercentage;
  itemsPercentagePerUser;
  // dummState;
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
      itemsDiag: [],
      itemsObat: [],
      itemsDiagTerpilih: [],
      itemsObatTerpilih: [],
      // jumlahObatKeluar: '',
      qeyUid: this.props.navigation.state.params.qey.el.uid,
      itemsPasien: this.props.navigation.state.params.qey.el,
      itemsRekamMedik: [],
      modDiagnosisVisible: false,
      modObatVisible: false,
      itemsPercentage: [],
      itemsPercentagePerUser: [],
      // dummState: 1,
    };
  }

  public componentDidMount() {
    this.getFirstData(this.state.qeyUid);
  }

  public render() {
    return (
      <View style={styles.container}>
        <Portal>
          <Modal visible={this.state.modDiagnosisVisible} onDismiss={this._hideModalDiag}>
            <Surface style={styles.containerModal}>
              { this.state.itemsDiag.map((el, key) =>
                <View  style={styles.containerItems} key={key}>
                  <Subheading>{el.namaDiagnosa}</Subheading>
                  <Caption>Harga : {el.hargaDiagnosa}</Caption>
                  <Button mode='outlined'
                    onPress={() => this._onPilihDiag(el)}>
                    Pilih
                  </Button>
                </View>,
              )}
            </Surface>
            <Surface>
              <Button mode='outlined'
                onPress={this._hideModalDiag}>
                Tutup Window
              </Button>
            </Surface>
          </Modal>
        </Portal>
        <Portal>
          <Modal visible={this.state.modObatVisible} onDismiss={this._hideModalObat}>
            <Surface style={styles.containerModal}>
              { this.state.itemsObat.map((el, key) =>
                <View  style={styles.containerItems} key={key}>
                  <Subheading>{el.namaObat}</Subheading>
                  <Caption>Harga : {el.hargaJualObat}</Caption>
                  {/* <Caption>Jumlah : {el.jumlahObatKeluar}</Caption> */}
                  <Button mode='outlined'
                    onPress={() => this._onPilihObat(el)}>
                    Pilih
                  </Button>
                </View>,
              )}
            </Surface>
            <Surface>
              <Button mode='outlined'
                onPress={this._hideModalObat}>
                Tutup Window
              </Button>
            </Surface>
          </Modal>
        </Portal>
        <View style={{width: '100%'}}>
          <ScrollView>
            <View>
              <Card>
                <Card.Content>
                  <Subheading>{this.state.itemsPasien.namaLengkap}</Subheading>
                  <Caption>Pasien {this.state.itemsPasien.statusPasien}</Caption>
                </Card.Content>
                <Card.Actions>
                  <Button style={{marginRight: 5}} onPress={() => this._showModalDiag()}>
                    + Diagnosis
                  </Button>
                  <Button style={{marginRight: 5}} onPress={() => this._showModalObat()}>
                    + Resep/Obat
                  </Button>
                  <Button disabled={(this.state.itemsDiagTerpilih.length &&
                    !!this.state.itemsObatTerpilih.length) ? false : true }
                    mode='contained' onPress={() => this._simpanData()}>
                    Simpan Data
                  </Button>
                </Card.Actions>
              </Card>
              <View style={styles.containerModal}>
                <View style={{marginBottom: 10}}>
                  <Headline>Diagnosis</Headline>
                    { this.state.itemsDiagTerpilih.map((elx1, key) =>
                      <View style={styles.containerItems2} key={key}>
                        <IconButton
                          icon='clear'
                          color={Colors.red500}
                          size={20}
                          onPress={() => this._onDeleteDiag(elx1)}
                        />
                        <Subheading>{elx1.namaDiagnosa}</Subheading>
                      </View>,
                    )}
                </View>
                <View>
                  <Headline>Resep/Obat</Headline>
                  { this.state.itemsObatTerpilih.map((elx2, key) =>
                      <View style={styles.containerItems2} key={key}>
                        <IconButton
                          icon='clear'
                          color={Colors.red500}
                          size={20}
                          onPress={() => this._onDeleteObat(elx2)}
                        />
                        <Subheading>{elx2.namaObat} - [ {elx2.jumlahObatKeluar} ]</Subheading>
                      </View>,
                    )}
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }

  private _showModalDiag = () => this.setState({ modDiagnosisVisible: true });
  private _hideModalDiag = () => this.setState({ modDiagnosisVisible: false });
  private _showModalObat = () => this.setState({ modObatVisible: true });
  private _hideModalObat = () => this.setState({ modObatVisible: false });

  private async getFirstData( p ) {
    if (p !== null ) {
      await db1.db.ref('diagnosa' )
      .on('value', (snap) => {
        // console.log(snap.val());
        const r1 = [];
        snap.forEach((snap2) => {
          r1.push({
            idDiagnosa: snap2.val().idDiagnosa,
            namaDiagnosa: snap2.val().namaDiagnosa,
            hargaDiagnosa: snap2.val().hargaDiagnosa,
          });
        });
        // console.log(r1);
        this.setState({
          itemsDiag: r1,
        });
      });

      await db1.db.ref('obat' )
      .on('value', (snapX) => {
        const rX1 = [];
        snapX.forEach((snapX2) => {
          rX1.push({
            idObat: snapX2.val().idObat,
            namaObat: snapX2.val().namaObat,
            jumlahObat: snapX2.val().jumlahObat,
            hargaJualObat: snapX2.val().hargaJualObat,
            hargaBeliObat: snapX2.val().hargaBeliObat,
            jumlahObatKeluar: 1,
          });
        });
        // console.log(r1);
        this.setState({
          itemsObat: rX1,
        });
      });

      await db1.db.ref('manajemen/percentageOfShare' )
      .on('value', (snapX3) => {
        const rX1 = [];
        rX1.push(snapX3.val());
        // console.log(rX1);
        this.setState({
          itemsPercentage: rX1,
        });
      });

      await db1.db.ref('manajemen/percentageOfShare/' + this.props.store.user.uid + '/share' )
      .on('value', (snapX4) => {
        const rX1 = [];
        rX1.push(snapX4.val());
        // console.log(rX1);
        this.setState({
          itemsPercentagePerUser: rX1,
        });
      });
    }
  }

  private _onPilihDiag = (p) => {
    // this.state.itemsDiagTerpilih.push(p);
    // console.log(this.state.itemsDiagTerpilih.includes(p));
    // this.setState({ dummState: 2 });
    if (!this.state.itemsDiagTerpilih.includes(p)) {
      this.state.itemsDiagTerpilih.push(p);
    }

  }

  private _onPilihObat = (p) => {
    // console.log(p);
    // this.setState({ dummState: 2 });
    if (!this.state.itemsObatTerpilih.includes(p)) {
      this.state.itemsObatTerpilih.push(p);
    } else {
      this.state.itemsObatTerpilih.pop(p);
      // p.jumlahObatKeluar = 0;
      p.jumlahObatKeluar ++;
      this.state.itemsObatTerpilih.push(p);
      // console.log(p);
      // console.log(this.state.itemsObatTerpilih);
    }
  }

  private _onDeleteDiag = (p) => {
    const a = this.state.itemsDiagTerpilih;
    const b = a.filter((q) => q !== p);
    this.setState({
      itemsDiagTerpilih : b,
    });
    // this.setState({ dummState: 2 });
    // console.log(this.state.itemsDiagTerpilih);
  }

  private _onDeleteObat = (p) => {
    p.jumlahObatKeluar = 1;
    const a = this.state.itemsObatTerpilih;
    const b = a.filter((q) => q !== p);
    this.setState({
      itemsObatTerpilih : b,
    });
    // this.setState({ dummState: 2 });
  }

  private _simpanData = () => {
    db1.db.ref('rekamMedik').push({
      idUser : this.state.itemsPasien._id,
      namaUser : this.state.itemsPasien.namaLengkap,
      statusUser : this.state.itemsPasien.statusPasien,
      itemDiag : JSON.stringify(this.state.itemsDiagTerpilih),
      itemObat : JSON.stringify(this.state.itemsObatTerpilih),
      tanggalRekamMedik : Moment(Date.now()).format('YYYY-MM-DD'),
      idDokter : this.props.store.user.uid,
      namaDokter : this.props.store.user.userNamaLengkap,
    });
    this.state.itemsObatTerpilih.forEach((el) => {
      const a = db1.db.ref('historyBarangKeluar').push();
      db1.db.ref('historyBarangKeluar/' + a.key).update({
        idObat: el.idObat,
        namaObat: el.namaObat,
        jumlahObatStok: el.jumlahObat,
        jumlahObatKeluar: el.jumlahObatKeluar,
        hargaBeliObat: el.hargaBeliObat,
        hargaJualObat: el.hargaJualObat,
        tanggalBarangKeluar : Moment(Date.now()).format('YYYY-MM-DD'),
      });
      db1.db.ref('obat/' + el.idObat).update({
        jumlahObat : parseInt(el.jumlahObat, 10) - parseInt(el.jumlahObatKeluar, 10),
      });
      db1.db.ref('manajemen/user/' + this.props.store.user.uid + '/detail/' + a.key).update({
        idHistoryBarangKeluar: a.key,
        tanggalBarangKeluar: Moment(Date.now()).format('YYYY-MM-DD'),
        idDokter: this.props.store.user.uid,
        namaDokter: this.props.store.user.userNamaLengkap,
        shareBarangKeluar: parseInt(el.jumlahObatKeluar, 10) *
                              (parseInt(el.hargaJualObat, 10) - parseInt(el.hargaBeliObat, 10)) *
                              parseInt( this.state.itemsPercentage[0].belanjaModal, 10) / 100,
        shareJasaMedik: parseInt(el.jumlahObatKeluar, 10) *
                              (parseInt(el.hargaJualObat, 10) - parseInt(el.hargaBeliObat, 10)) *
                              parseInt( this.state.itemsPercentage[0].jasaMedik, 10) / 100,
        saham: parseInt(el.jumlahObatKeluar, 10) *
                              (parseInt(el.hargaJualObat, 10) - parseInt(el.hargaBeliObat, 10)) *
                              parseInt( this.state.itemsPercentage[0].saham, 10) / 100,
        sarana: parseInt(el.jumlahObatKeluar, 10) *
                              (parseInt(el.hargaJualObat, 10) - parseInt(el.hargaBeliObat, 10)) *
                              parseInt( this.state.itemsPercentage[0].sarana, 10) / 100,
      });
      
      // console.log((parseInt(el.jumlahObat, 10) - parseInt(el.jumlahObatKeluar, 10)) *
      //   (parseInt(el.hargaJualObat, 10)) * parseInt( this.state.itemsPercentage[0].belanjaModal, 10) / 100);
    });
    db1.db.ref('users/' + this.state.itemsPasien._id).update({
      flagActivity: 'antriApotekBilling',
    });
    // this.props.navigation.navigate('HomeUserScreen');
  }

}

export default Screen;

interface IStyle {
  container: ViewStyle;
  containerModal: ViewStyle;
  containerItems: ViewStyle;
  containerItems2: ViewStyle;
}

const styles = StyleSheet.create<IStyle>({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 5,
    width: '100%',
  },
  containerModal: {
    flex: 1,
    // backgroundColor: 'transparent',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 15,
  },
  containerItems: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginBottom: 10,
    marginLeft: 10,
  },
  containerItems2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    // marginBottom: 5,
    marginLeft: 10,
  },
});
