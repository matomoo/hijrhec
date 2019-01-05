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
  Caption, Card, Title, Paragraph, TouchableRipple, Subheading
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
    title: 'Daftar Antrian',
  };

  public taskUser: any;

  constructor(props) {
    super(props);
    this.taskUser = db1.db.ref(`users/${this.props.store.user.uid}`);
    this.state = {
      isLoaded: true,
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
            <View style={[{width: '100%'}, {padding:10}]}>
              { this.state.users.map( (el, key) =>
                  <Card key={key}>
                    <Card.Content>
                      <Title>Nomor Daftar Antrian : {(el.nomorAntrian)}</Title>
                      <Subheading>Tanggal Booking : {(el.tanggalBooking)}</Subheading>
                    </Card.Content>
                    <Card.Actions>
                      <Button mode="text" 
                        onPress={() => this.onDaftarAndrian(el)}
                        disabled={el.flagActivity === 'userIdle' ? false : true }
                      >
                        Daftar Antrian
                      </Button>
                    </Card.Actions>
                  </Card>
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
          nomorAntrian: snap.val().nomorAntrian,
          tanggalBooking: snap.val().tanggalBooking,
          flagActivity: snap.val().flagActivity,
        });
      // });
      this.setState({
        users: r1,
        isLoaded: false,
      });
    });
  }

  private onDaftarAndrian(p) {
    this.props.navigation.navigate('UserDaftarAntrianDetailScreen');
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
    width:'100%',
  },
  text: {
    fontSize: 20,
    color: 'black',
  },
});
