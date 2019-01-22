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
  items: any;
  itemsRekamMedik;
  qeyUid;
  modDiagnosisVisible;
  modObatVisible;
  dummState;
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
      items: [],
      itemsRekamMedik: [],
      modDiagnosisVisible: false,
      modObatVisible: false,
      dummState: 1,
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
        <Button onPress={() => this._showModalDiag()}>
          + Diagnosis
        </Button>
        <Button onPress={() => this._showModalObat()}>
          + Resep/Obat
        </Button>
        <ScrollView>
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
        </ScrollView>
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

  private _keyExtractor = (item) => item.idObat;

  private _renderItems = ({item}) => (
    <Subheading>{item.namaObat} - [ {item.jumlahObatKeluar} ]</Subheading>
  )

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
