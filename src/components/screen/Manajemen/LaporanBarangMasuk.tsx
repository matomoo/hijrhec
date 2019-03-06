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
// import CpListPasien from './CpListPasien';
import { Card, Subheading, Button, DataTable,
  Divider,
  Caption,
  Title} from 'react-native-paper';
import * as db1 from '../../../firebase/firebase';
import RNPickerSelect from 'react-native-picker-select';
import Moment from 'moment';
// import { Table, TableWrapper, Row } from 'react-native-table-component';

const bulans = [
  { label: 'Januari', value: 'Januari' },
  { label: 'Februari', value: 'Februari' },
  { label: 'Maret', value: 'Maret' },
  { label: 'April', value: 'April' },
  { label: 'Mei', value: 'Mei' },
  { label: 'Juni', value: 'Juni' },
  { label: 'Juli', value: 'Juli' },
  { label: 'Agustus', value: 'Agustus' },
  { label: 'September', value: 'September' },
  { label: 'Oktober', value: 'Oktober' },
  { label: 'November', value: 'November' },
  { label: 'Desember', value: 'Desember' },
];

interface IProps {
  navigation?: any;
  store?: any;
}

interface IState {
  isLoaded: boolean;
  bulan;
  items: any[];
}

// @inject('store') @observer
class Screen extends Component<IProps, IState> {
  public static navigationOptions = {
    title: 'Laporan Barang Masuk',
  };

  public taskItem: any;

  constructor(props) {
    super(props);
    this.taskItem = db1.db.ref(`historyBarangMasuk`);
    this.state = {
      isLoaded: true,
      bulan: '',
      items: [],
    };
  }

  public componentDidMount() {
    this.getFirstData(this.taskItem);
  }

  public componentWillUnmount() {
    this.taskItem.off();
  }

  public render() {
    const placeholder = {
      label: 'Pilih Bulan',
      value: null,
      color: '#9EA0A4',
    };

    return (
      <View style={styles.container}>
        <View style={{width: '100%'}}>
          <Card>
            <Card.Content>
              <Subheading>Laporan Barang Masuk</Subheading>
              <RNPickerSelect
                    placeholder={placeholder}
                    items={bulans}
                    onValueChange={(value) => {
                        this.setState({
                            bulan: value,
                        });
                    }}
                    value={this.state.bulan}
                />
            </Card.Content>
            <Card.Actions>
              <Button mode='text'
                onPress={() => this.rpt()}
              >
                GO
              </Button>
              <Button onPress={() => this.props.navigation.navigate('InfoScreen')}>
                Info
              </Button>
            </Card.Actions>
          </Card>
          <View>
            <Title>{this.state.bulan}</Title>
              {!!this.state.items && this.state.items.map((el, key) =>
                // <View key={key}>
                  <Card key={key} style={{marginTop: 5}}>
                    <Card.Content>
                      <Subheading>{el.tanggalBeli}</Subheading>
                      <Subheading>{Moment(el.tanggalBeli, 'YYYY-MM-DD').month()}</Subheading>
                      <Caption>Nama Obat : {el.namaObat}</Caption>
                      <Caption>Jumlah Obat : {el.jumlahObat}</Caption>
                      <Caption>Harga Beli : {el.hargaBeliObat}</Caption>
                      <Caption>Harga Jual : {el.hargaJualObat}</Caption>
                    </Card.Content>
                  </Card>,
                // </View>,
              )}
          </View>
        </View>
      </View>
    );
  }

  private async getFirstData( p ) {
    await p
      .orderByChild('tanggalBeli')
      .startAt('2019-01-15')
      .on('value', (snap) => {
      const r1 = [];
      snap.forEach((el) => {
        r1.push({
          tanggalBeli: el.val().tanggalBeli,
          namaObat: el.val().namaObat,
          jumlahObat: el.val().jumlahObat,
          hargaBeliObat: el.val().hargaBeliObat,
          hargaJualObat: el.val().hargaJualObat,
        });
      });
      this.setState({
        items: r1,
        isLoaded: false,
      });
    });
  }

  private rpt = () => {
    console.log();
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
    justifyContent: 'flex-start',
    width: '100%',
    padding: 10,
  },
  text: {
    fontSize: 20,
    color: 'black',
  },
});
