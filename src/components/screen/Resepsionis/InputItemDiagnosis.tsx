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
  idDiagnosa;
  namaDiagnosa;
  hargaDiagnosa;
  navQey;
}

@inject('store') @observer
class Screen extends Component<IProps, IState> {
  public static navigationOptions = {
    title: 'Input Item Diagnosis',
  };
  // private taskDiagnosa: any;

  constructor(props) {
    super(props);
    // this.taskDiagnosa = db1.db.ref(`diagnosa`);
    this.state = {
      idDiagnosa : this.props.navigation.state.params.qey === 'updateData' ?
       this.props.navigation.state.params.el.p.idDiagnosa : '',
      namaDiagnosa : this.props.navigation.state.params.qey === 'updateData' ?
       this.props.navigation.state.params.el.p.namaDiagnosa : '',
      hargaDiagnosa : this.props.navigation.state.params.qey === 'updateData' ?
       this.props.navigation.state.params.el.p.hargaDiagnosa : '',
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
        <View style={{width: '100%'}}>
          <TextInput
              mode='outlined'
              label='Nama Diagnosis'
              value={this.state.namaDiagnosa}
              onChangeText={(namaDiagnosa) => this.setState({namaDiagnosa})}/>
          <TextInput
              mode='outlined'
              label='Harga Diagnosis'
              keyboardType='number-pad'
              value={this.state.hargaDiagnosa}
              onChangeText={(hargaDiagnosa) => this.setState({hargaDiagnosa})}/>
        </View>

        <View style={{marginTop: 10}}>
          <Button mode='contained'
            disabled={this.state.namaDiagnosa === '' ||
                        this.state.hargaDiagnosa === ''
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
    if (this.state.navQey === 'newData') {
      const q = db1.db.ref(`diagnosa`).push();
      db1.db.ref('diagnosa/' + q.key).update({
        idDiagnosa: q.key,
        namaDiagnosa: this.state.namaDiagnosa,
        hargaDiagnosa: this.state.hargaDiagnosa,
      });
    } else if (this.state.navQey === 'updateData') {
      db1.db.ref('diagnosa/' + this.state.idDiagnosa).update({
        idDiagnosa: this.state.idDiagnosa,
        namaDiagnosa: this.state.namaDiagnosa,
        hargaDiagnosa: this.state.hargaDiagnosa,
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
        // console.log(p);
        // const p = this.props.navigation.state.params.el;
        this.setState({
          namaDiagnosa : p.namaDiagnosa,
          hargaDiagnosa : p.hargaDiagnosa,
        });
      }
    // });
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
    padding: 10,
  },
  text: {
    fontSize: 20,
    color: 'black',
  },
});
