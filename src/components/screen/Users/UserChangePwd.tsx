import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Button, Headline, IconButton, Colors, HelperText,
  Caption, Card, Title, Paragraph, TouchableRipple, Text, TextInput,
} from 'react-native-paper';
import * as db1 from '../../../firebase/firebase';
import { observer } from 'mobx-react';
import { inject } from 'mobx-react/native';
import { auth, db } from '../../../firebase';

interface IProps {
  navigation?: any;
  store?: any;
}

interface IState {
  // isLoggingIn: boolean;
  isLoaded;
  users;
  oldPassword;
  newPassword;
  errMess;
}

@inject('store') @observer
class Screen extends Component<IProps, IState> {
  public static navigationOptions = {
    title: 'Ubah Password',
  };

  private taskUser: any;

  constructor(props) {
    super(props);
    this.taskUser = db1.db.ref(`users/${this.props.store.user.uid}`);
    this.state = {
      isLoaded: false,
      oldPassword: '',
      newPassword: '',
      users: [],
      errMess: '',
    };
  }

  public componentDidMount() {
    this.getFirstData(this.taskUser);
  }

  public render() {
    return (
      <ScrollView>
        <View style={styles.container}>
            {/* <View style={{width:'100%'}}> */}
              { this.state.users.map( (el, key) =>
                <View style={[{ width: '100%' }]} key={key}>
                  <Text style={[{marginBottom: 5}]}>Nama Lengkap : { el.namaLengkap }</Text>
                  <View style={[{marginBottom: 5}]}>
                    <TextInput
                      mode='outlined'
                      label='Password Lama'
                      value={this.state.oldPassword}
                      onChangeText={(oldPassword) => this.setState({ oldPassword })}
                    />
                  </View>
                  <View style={[{marginBottom: 5}]}>
                    <TextInput
                      mode='outlined'
                      label='Password Baru'
                      value={this.state.newPassword}
                      onChangeText={(newPassword) => this.setState({ newPassword })}
                    />
                  </View>
                  { !!this.state.errMess &&
                    <HelperText type='info'
                      >{ this.state.errMess }</HelperText>}
                </View>,
              )}
            <View style={{marginTop: 10}}>
              <TouchableRipple>
                <Button mode='contained'
                  onPress={() => this._onChangePwd()}
                  disabled={(this.state.oldPassword === '' ||
                              this.state.newPassword === '' )
                              || this.state.isLoaded === true
                              ? true : false }
                >
                  Submit
                </Button>
              </TouchableRipple>
            </View>
            </View>
        {/* </View> */}
      </ScrollView>
    );
  }

  private async getFirstData( p ) {
    await p.on('value', (result) => {
      const r1 = [];
      r1.push(result.val());
      this.setState({
        users: r1,
        // isLoaded: false,
      });
    });
  }

  private _onChangePwd = async () => {
    this.setState({
      isLoaded: true,
      errMess: '',
    })
    auth.doChangePassword(
      this.state.users[0].email,
      this.state.oldPassword,
      this.state.newPassword,
    )
      .then(() => this.props.navigation.navigate('HomeUserScreen'))
      .catch((err) => {
        // console.log(err);
        this.setState({ errMess: err.message});
        this.setState({
          isLoaded: false,
        })
      })
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
