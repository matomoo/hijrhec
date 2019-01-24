import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  ViewStyle,
  TextStyle,
  DatePickerAndroid,
} from 'react-native';
import { Button, Headline, IconButton, Colors, HelperText,
  Caption, Card, Title, Paragraph, TouchableRipple, Text, TextInput, Subheading,
} from 'react-native-paper';
import * as db1 from '../../../firebase/firebase';
import { observer } from 'mobx-react';
import { inject } from 'mobx-react/native';
import { Dropdown } from 'react-native-material-dropdown';
import moment from 'moment';

interface IProps {
  navigation?: any;
  store?: any;
}

interface IState {
  // isLoggingIn: boolean;
  isLoaded;
  doks;
  PilihTanggal;
}

@inject('store') @observer
class Screen extends Component<IProps, IState> {
  public static navigationOptions = {
    title: 'Daftar Antrian',
  };

  private taskUser: any;

  constructor(props) {
    super(props);
    this.taskUser = db1.db.ref(`users`);
    this.state = {
      isLoaded: true,
      doks: [],
      PilihTanggal: moment(Date.now()).format('YYYY-MM-DD'),
    };
  }

  public componentDidMount() {
    this.getFirstData(this.taskUser);
  }

  public render() {
    return (
      // <ScrollView>
        <View style={styles.container}>
          <Subheading>Pilih Tanggal</Subheading>
          <Button
            mode='outlined'
            onPress={() => this._onDateTap()}
          >
            {this.state.PilihTanggal}
          </Button>
          {/* <View style={{ width: 200, marginTop: 5 }}>
            <Dropdown
              label='Pilih Dokter'
              data={this.state.users}
            />
          </View> */}
          <Button mode='contained'
            style={{marginTop: 5}}
            onPress={() => this._onSubmit()}
          >
            Submit
          </Button>
        </View>
      // </ScrollView>
    );
  }

  private async getFirstData( p ) {
    await p
      .orderByChild('role')
      .equalTo('dokter')
      .once('value', (result) => {
      const r1 = [];
      result.forEach((element) => {
        r1.push({
          value: element.val().namaLengkap,
          });
      });
      this.setState({
        doks: r1,
        // isLoaded: false,
      });
    });
  }

  private async _onDateTap() {
    try {
      const {action, year, month, day} = await DatePickerAndroid.open({
        // date: new Date(2020, 4, 25)
        date: new Date(),
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        this.setState({ PilihTanggal : moment(`${month + 1}/${day}/${year}`).format('YYYY-MM-DD') });
      }
    } catch ({code, message}) {
      console.warn('Cannot open date picker', message);
    }
  }

  private _onSubmit() {
    const p = this.props.store.user.uid;
    let latestNomorAntrianPasien = 0;
    db1.db.ref(`daftarTunggu/indexes/${moment(this.state.PilihTanggal).format('YYYY-MM-DD')}/nomorAntrianPasien`)
      .once('value', (result) => {
        // console.log(result.val());
        latestNomorAntrianPasien = result.val() === null ? 1 : result.val();
        // console.log(latestNomorAntrianPasien);
        db1.db.ref('users/' + p).update({
          flagActivity: 'antriPoliklinik',
          nomorAntrian: latestNomorAntrianPasien,
          tanggalBooking: this.state.PilihTanggal,
        });
        db1.db.ref(`daftarTunggu/indexes/${moment(this.state.PilihTanggal).format('YYYY-MM-DD')}`).update({
          nomorAntrianPasien: latestNomorAntrianPasien + 1,
        });
        const a = db1.db.ref('daftarTunggu/byDates/').push();
        db1.db.ref('daftarTunggu/byDates/' + a.key).update({
          idAntrian: a.key,
          uid: p,
          namaAntrian: this.props.store.user.userNamaLengkap,
          nomorAntrian: latestNomorAntrianPasien,
          poli: 'POLI1',
          tanggalBooking: moment(this.state.PilihTanggal).format('YYYY-MM-DD'),
        });
      });
    this.props.navigation.navigate('HomeUserScreen');
  }

  // private _onSubmitOldOk() {
  //   const p = this.props.store.user.uid;
  //   let latestNomorAntrianPasien = 0;
  //   db1.db.ref(`daftarTunggu/${moment(this.state.PilihTanggal).format('YYYY-MM-DD')}/nomorAntrianPasien`)
  //     .once('value', (result) => {
  //       // console.log(result.val());
  //       latestNomorAntrianPasien = result.val() === null ? 1 : result.val();
  //       // console.log(latestNomorAntrianPasien);
  //       db1.db.ref('users/' + p).update({
  //         flagActivity: 'antriPoliklinik',
  //         nomorAntrian: latestNomorAntrianPasien,
  //         tanggalBooking: this.state.PilihTanggal,
  //       });
  //       db1.db.ref(`daftarTunggu/${moment(this.state.PilihTanggal).format('YYYY-MM-DD')}`).update({
  //         nomorAntrianPasien: latestNomorAntrianPasien + 1,
  //       });
  //       db1.db.ref('daftarTunggu/' + moment(this.state.PilihTanggal).format('YYYY-MM-DD') +
  //         '/' + latestNomorAntrianPasien).update({
  //         uid: p,
  //         namaAntrian: this.props.store.user.userNamaLengkap,
  //         nomorAntrian: latestNomorAntrianPasien,
  //         poli: 'POLI1',
  //       });
  //     });
  //   this.props.navigation.navigate('HomeUserScreen');
  // }

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
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 10,
    // width: '100%',
  },
  text: {
    fontSize: 20,
    color: 'black',
  },
});
