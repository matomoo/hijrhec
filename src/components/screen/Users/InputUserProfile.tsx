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
  email;
  namaLengkap;
  handphone;
  alamat;
  users;
}

@inject('store') @observer
class Screen extends Component<IProps, IState> {
  public static navigationOptions = {
    title: 'Ubah User Profile',
  };
  private taskUser: any;

  constructor(props) {
    super(props);
    this.taskUser = db1.db.ref(`users/${this.props.store.user.uid}`);
    this.state = {
      email : '',
      namaLengkap : '',
      handphone : '',
      alamat : '',
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
        <View style={{width:'100%'}}>
          <TextInput
              mode='outlined'
              label='Nama Lengkap'
              value={this.state.namaLengkap}
              onChangeText={(namaLengkap) => this.setState({namaLengkap})}/>
          <TextInput
              mode='outlined'
              label='Handphone'
              keyboardType='number-pad'
              value={this.state.handphone}
              onChangeText={(handphone) => this.setState({handphone})}/>
          <TextInput
              mode='outlined'
              label='Alamat'
              multiline={true}
              numberOfLines={4}
              value={this.state.alamat}
              onChangeText={(alamat) => this.setState({alamat})}/>
        </View>

        <View style={{marginTop: 10}}>
          <Button mode='contained'
            disabled={this.state.namaLengkap === '' ||
                        this.state.handphone === '' ||
                        this.state.alamat === ''
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
    this.taskUser.update({
      namaLengkap: this.state.namaLengkap,
      handphone: this.state.handphone,
      alamat: this.state.alamat,
    });
    this.props.navigation.navigate('Home');
  }

  private async getFirstData( p ) {
    await p.once('value', (result) => {
      // const r1 = [];
      // r1.push(result.val());
      // console.log(result.val());
      this.setState({
        namaLengkap : result.val().namaLengkap,
        handphone : result.val().handphone,
        alamat : result.val().alamat,
        // users: r1,
        // isLoaded: false,
      });
    });
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
