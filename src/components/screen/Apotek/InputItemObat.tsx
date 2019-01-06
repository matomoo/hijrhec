import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  // Text,
  View,
  TouchableHighlight,
  // TextInput,
  ScrollView,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Button, Headline, IconButton, Colors,
  Caption, Card, Title, Paragraph, TouchableRipple, Text, TextInput,
} from 'react-native-paper';
import * as db1 from '../../../firebase/firebase';
import { observer } from 'mobx-react';
import { inject } from 'mobx-react/native';

interface IProps {
  navigation?: any;
  store?: any;
}

interface IState {
  idObat;
  namaObat;
  hargaObat;
  jumlahObatPrev;
  jumlahObatNext;
  navQey;
}

@inject('store') @observer
class Screen extends Component<IProps, IState> {
  public static navigationOptions = {
    title: 'Input Item Obat/Resep',
  };
  // private taskDiagnosa: any;

  constructor(props) {
    super(props);
    // this.taskDiagnosa = db1.db.ref(`diagnosa`);
    this.state = {
      idObat : this.props.navigation.state.params.qey === 'updateData' ? this.props.navigation.state.params.el.p.idObat : '',
      namaObat : this.props.navigation.state.params.qey === 'updateData' ? this.props.navigation.state.params.el.p.namaObat : '',
      hargaObat : this.props.navigation.state.params.qey === 'updateData' ? this.props.navigation.state.params.el.p.hargaObat : '',
      jumlahObatPrev : this.props.navigation.state.params.qey === 'updateData' ? this.props.navigation.state.params.el.p.jumlahObatPrev : '',
      jumlahObatNext : this.props.navigation.state.params.qey === 'updateData' ? this.props.navigation.state.params.el.p.jumlahObatNext : '',
      navQey: this.props.navigation.state.params.qey === null ? 'newData' : this.props.navigation.state.params.qey,
    };
  }

  public componentDidMount() {
    // this.getFirstData(this.taskDiagnosa);
    // this.getFirstData(this.props.navigation.state.params.el);
    // console.log(this.props.navigation.state.params.el);
    // console.log(this.state.navQey);
  }

  public render() {
    return (
      <ScrollView>
      <View style={styles.container}>
        <View style={{width:'100%'}}>
          <TextInput
            mode='outlined'
            label='Nama Obat/Resep'
            value={this.state.namaObat}
            onChangeText={(namaObat) => this.setState({namaObat})}/>
          <TextInput
            mode='outlined'
            label='Harga Obat/Resep'
            keyboardType='number-pad'
            value={this.state.hargaObat}
            onChangeText={(hargaObat) => this.setState({hargaObat})}/>
          <TextInput
            mode='outlined'
            label='Jumlah Obat/Resep'
            keyboardType='number-pad'
            value={this.state.jumlahObatNext}
            disabled={this.state.navQey === 'updateData' ? true : false }
            onChangeText={(jumlahObatNext) => this.setState({jumlahObatNext})}/>
        </View>

        <View style={{marginTop: 10}}>
          <Button mode='contained'
            disabled={this.state.namaObat === '' ||
                        this.state.hargaObat === '' ||
                        this.state.jumlahObatNext === ''
                        ? true : false }
            onPress={() => this._onSubmit()} >
            Submit
          </Button>
        </View>

      </View>
      </ScrollView>
    );
  }

  public _onSubmit() {
    if (this.state.navQey === 'newData'){
      const q = db1.db.ref(`obat`).push();
      db1.db.ref('obat/' + q.key).update({
        idObat: q.key,
        namaObat: this.state.namaObat,
        hargaObat: this.state.hargaObat,
        jumlahObat: parseInt(this.state.jumlahObatPrev, 10) + parseInt(this.state.jumlahObatNext, 10),
      });
    } else if (this.state.navQey === 'updateData') {
      db1.db.ref('obat/' + this.state.idObat).update({
        idObat: this.state.idObat,
        namaObat: this.state.namaObat,
        hargaObat: this.state.hargaObat,
        // jumlahObat: this.state.jumlahObat,
      });
    }
    this.props.navigation.navigate('HomeUserScreen');
    // console.log(this.props.navigation.state.params.qey);
  }

  private getFirstData( p ) {
    // p.once('value', (result) => {
      // const r1 = [];
      // r1.push(result.val());
      if (this.state.navQey === 'updateData') {
        console.log(p);
        // const p = this.props.navigation.state.params.el;
        this.setState({
          namaObat : p.namaObat,
          hargaObat : p.hargaObat,
        });
      }
    // });
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
    justifyContent: 'center',
    padding: 10,
  },
});
