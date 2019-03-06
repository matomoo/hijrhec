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
  Divider } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import { Table, TableWrapper, Row } from 'react-native-table-component';

const bulans = [
  { label: 'Januari', value: 'januari' },
  { label: 'Februari', value: 'februari' },
  { label: 'Maret', value: 'maret' },
  { label: 'April', value: 'april' },
  { label: 'Mei', value: 'mei' },
  { label: 'Juni', value: 'juni' },
  { label: 'Juli', value: 'juli' },
  { label: 'Agustus', value: 'agustus' },
  { label: 'September', value: 'september' },
  { label: 'Oktober', value: 'oktober' },
  { label: 'November', value: 'november' },
  { label: 'Desember', value: 'desember' },
];

interface IProps {
  navigation?: any;
  store?: any;
}

interface IState {
  isLoaded: boolean;
  bulan;
  tableHead;
  widthArr;
  // users: any[];
}

// @inject('store') @observer
class Screen extends Component<IProps, IState> {
  public static navigationOptions = {
    title: 'Laporan Barang Masuk',
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoaded: true,
      bulan: '',
      tableHead: ['Head', 'Head2', 'Head3', 'Head4', 'Head5', 'Head6', 'Head7', 'Head8', 'Head9'],
      widthArr: [40, 60, 80, 100, 120, 140, 160, 180, 200],
    };
  }

  public render() {
    const placeholder = {
      label: 'Pilih Bulan',
      value: null,
      color: '#9EA0A4',
    };
    const state = this.state;
    const tableData = [];
    for (let i = 0; i < 30; i += 1) {
      const rowData = [];
      for (let j = 0; j < 9; j += 1) {
        rowData.push(`${i}${j}`);
      }
      tableData.push(rowData);
    }

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
                {this.state.bulan}
              </Button>
            </Card.Actions>
          </Card>
          <View>
            <ScrollView horizontal={true}>
              <View>
                <Table borderStyle={{borderColor: '#C1C0B9'}}>
                  <Row data={state.tableHead} widthArr={state.widthArr} textStyle={styles.text}/>
                </Table>
                <ScrollView>
                  <Table borderStyle={{borderColor: '#C1C0B9'}}>
                    {
                      tableData.map((rowData, index) => (
                        <Row
                          key={index}
                          data={rowData}
                          widthArr={state.widthArr}
                          // style={[styles.row, index%2 && {backgroundColor: '#F7F6E7'}]}
                          textStyle={styles.text}
                        />
                      ))
                    }
                  </Table>
                </ScrollView>
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    );
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
    flexGrow: 1,
  },
  text: {
    fontSize: 20,
    color: 'black',
  },
});
