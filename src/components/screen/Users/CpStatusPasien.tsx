import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  View,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { observer } from 'mobx-react';
import { inject } from 'mobx-react/native';
import { Button, Headline, IconButton, Colors,
  Caption, Card, Title, Paragraph, TouchableRipple
} from 'react-native-paper';
import * as db1 from '../../../firebase/firebase';

interface IProps {
  navigation?: any;
  store?: any;
}

interface IState {
  isLoaded: boolean;
  users: any[];
}

@inject('store') @observer
class Screen extends Component<IProps, IState> {
  static navigationOptions = {
    title: 'Status Pasien',
  };

  public taskUser: any;

  constructor(props) {
    super(props);
    this.taskUser = db1.db.ref(`users/${this.props.store.user.uid}`);
    this.state = {
      isLoaded: false,
      users: [],
    };
  }

  public componentDidMount() {
    this.getFirstData(this.taskUser);
    // console.log(this.state.users);
  }

  public render() {
    return (
      <View style={styles.container}>
        { this.state.isLoaded ?
            <ActivityIndicator /> :
            <View>
              { this.state.users.map( (el, key) =>
                <View key={key}>
                  {/* <TouchableRipple
                    onPress={() => console.log('Pressed')}
                    rippleColor="rgba(0, 0, 0, .32)"
                  > */}
                    <Card>
                      <Card.Content>
                        <Title>Status Pasien : {(el.statusPasien)}</Title>
                        <Paragraph>
                          Klik untuk merubah status pasien.
                          Perubahan hanya dapat di lakukan 1x24 jam. 
                          Untuk pasien BPJS mohon membawa surat keterangan untuk verifikasi.
                        </Paragraph>
                      </Card.Content>
                      <Card.Actions>
                        <Button mode="outlined" onPress={() => this.onChangeRole(el)}>
                          Ubah Status Pasien
                        </Button>
                      </Card.Actions>
                    </Card>
                  {/* </TouchableRipple> */}
                </View>,
              )}
            </View> 
        }
      </View>
    );
  }

  private async getFirstData( p ) {
    await p
      .on('value', (snap) => {
      const r1 = [];
      // snap.forEach((el) => {
        r1.push({
          uid: snap.val()._id,
          namaLengkap: snap.val().namaLengkap,
          email: snap.val().email,
          userRole: snap.val().role,
          statusPasien: snap.val().statusPasien,
        });
      // });
      this.setState({
        users: r1,
        isLoaded: false,
      });
    });
  }

  private onChangeRole(p) {
    // console.log( p );
    if (p.uid !== 'undefined'){ 
      if (p.statusPasien === 'BPJS') {
        db1.db.ref('users/' + p.uid).update({
          statusPasien: 'UMUM',
      }) } else if (p.statusPasien === 'UMUM') {
        db1.db.ref('users/' + p.uid).update({
          statusPasien: 'BPJS',
      })
      }
    }
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
  },
  text: {
    fontSize: 20,
    color: 'black',
  },
});
