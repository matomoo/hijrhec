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
import * as db1 from '../../firebase/firebase';

interface IStyle {
  container: ViewStyle;
  text: TextStyle;
}

interface IProps {
  navigation?: any;
  store: any;
}

interface IState {
  isLoaded: boolean;
  users: any[];
}

@inject('store') @observer
class Screen extends Component<IProps, IState> {
  static navigationOptions = {
    title: 'Info',
  };

  public taskUser: any;

  constructor(props) {
    super(props);
    this.taskUser = db1.db.ref(`users`);
    this.state = {
      isLoaded: false,
      users: [],
    };
  }

  public componentDidMount() {
    this.getFirstData(this.taskUser);
  }

  public render() {
    return (
      <View style={styles.container}>
        { this.state.isLoaded ?
            <ActivityIndicator /> :
            <View>
              { this.state.users.map( (el, key) =>
                <View key={key}>
                  <TouchableRipple
                    onPress={() => console.log('Pressed')}
                    rippleColor="rgba(0, 0, 0, .32)"
                  >
                    <Card>
                      <Card.Content>
                        <Title>{el.namaLengkap}</Title>
                        <Paragraph>{el.email}</Paragraph>
                      </Card.Content>
                      {/* <Card.Actions>
                        <Button mode="outlined" onPress={() => this.onChangeRole(el)}>
                          {el.userRole}
                        </Button>
                      </Card.Actions> */}
                    </Card>
                  </TouchableRipple>
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
      snap.forEach((el) => {
        r1.push({
          uid: el.val()._id,
          namaLengkap: el.val().namaLengkap,
          email: el.val().email,
          userRole: el.val().role,
        });
      });
      this.setState({
        users: r1,
        isLoaded: false,
      });
    });
  }

}

export default Screen;

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
