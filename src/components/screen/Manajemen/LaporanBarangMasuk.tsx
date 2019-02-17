import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
// import CpListPasien from './CpListPasien';
import { Card, Subheading, Button,
  Divider } from 'react-native-paper';

interface IProps {
  navigation?: any;
  store?: any;
}

interface IState {
  isLoaded: boolean;
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
    };
  }

  public render() {
    return (
      <View style={styles.container}>
        <View style={{width: '100%'}}>
          <Card>
            <Card.Content>
              <Subheading>Share Percentage</Subheading>
            </Card.Content>
            <Card.Actions>
              <Button mode='text'
                onPress={() => this.props.navigation.navigate('InputShareOfPercentageScreen')}
              >
                Lihat
              </Button>
            </Card.Actions>
          </Card>
          <Card>
            <Card.Content>
              <Subheading>Laporan Barang Masuk</Subheading>
            </Card.Content>
            <Card.Actions>
              <Button mode='text'
                onPress={() => this.props.navigation.navigate('LaporanBarangMasukScreen')}
              >
                Lihat
              </Button>
            </Card.Actions>
          </Card>
        </View>
      </View>
    );
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
