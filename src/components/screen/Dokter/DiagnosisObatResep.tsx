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
import { ScrollView } from 'react-native';
import {
  List, Card, Title, Paragraph, Button,
  Caption, Subheading, Divider, Searchbar, Headline,
  Modal, Portal, Surface, TextInput,
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
  itemsDiag;
  itemsObat;
  itemsDiagTerpilih;
  itemsObatTerpilih;
  jumlahObatKeluar;
  items: any;
  itemsRekamMedik;
  qeyUid;
  modDiagnosisVisible;
  modObatVisible;
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
      jumlahObatKeluar: '',
      qeyUid: this.props.navigation.state.params.qey.el.uid,
      items: [],
      itemsRekamMedik: [],
      modDiagnosisVisible: false,
      modObatVisible: false,
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
                  <View style={styles.containerItems} key={key}>
                    <Subheading>{elx1.namaDiagnosa}</Subheading>
                  </View>,
                )}
            </View>
            <View>
              <Headline>Resep/Obat</Headline>
                { this.state.itemsObatTerpilih.map((el, key) =>
                  <View  style={styles.containerItems} key={key}>
                    <Subheading>{el.namaObat}</Subheading>
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
    if (!this.state.itemsDiagTerpilih.includes(p)) {
      this.state.itemsDiagTerpilih.push(p);
    }

  }

  private _onPilihObat = (p) => {
    // console.log(p);
    if (!this.state.itemsObatTerpilih.includes(p)) {
      this.state.itemsObatTerpilih.push(p);
    }
  }

}

export default Screen;

interface IStyle {
  container: ViewStyle;
  containerModal: ViewStyle;
  containerItems: ViewStyle;
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
});
