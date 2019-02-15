import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  View,
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  // Button,
  Alert,
  TouchableHighlight,
  ScrollView,
  // List,
  FlatList,
} from 'react-native';
import {
  List, Card, Title, Paragraph, Button,
  Caption, Subheading, Divider, Searchbar,
} from 'react-native-paper';
import { observer } from 'mobx-react';
import { inject } from 'mobx-react/native';
import * as db1 from '../../../firebase/firebase';
import NumberFormat from 'react-number-format';

interface IProps {
  navigation?: any;
  store?: any;
  tabLabel?;
}

interface IState {
  isLoaded: boolean;
  items: any;
  firstQuery;
}

@inject('store') @observer
class Screen extends Component<IProps, IState> {
  public static navigationOptions = {
    title: 'Daftar Pasien',
  };

  private arrayholder: any[];
  private taskUser: any;

  constructor(props) {
    super(props);
    this.taskUser = db1.db.ref(`users`);
    this.arrayholder = [];
    this.state = {
      isLoaded: true,
      items: [],
      firstQuery: '',
    };
  }

  public componentDidMount() {
    this.getFirstData(this.taskUser);
  }

  public render() {
    return (
      <View style={styles.topContainer}>
        {/* <Text style={styles.textInfo}>Daftar User Request Visit</Text> */}
        <ScrollView>
        { this.state.isLoaded ?
            <ActivityIndicator /> :
            <View style={{width: '100%'}}>
              <FlatList
                data={this.state.items}
                keyExtractor={this._keyExtractor}
                renderItem={this._renderItems}
                ListHeaderComponent={this.renderHeader}
              />
            </View>
        }
        </ScrollView>
      </View>
    );
  }

  public searchFilterFunction = (text) => {
    const newData = this.arrayholder.filter((item) => {
      const itemData = `${item.namaObat.toUpperCase()}`;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });

    this.setState({ items: newData });
  }

  public renderHeader = () => {
    const { firstQuery } = this.state;
    return <Searchbar
      placeholder='Cari berdasarkan nama'
      onChangeText={(text) => this.searchFilterFunction(text)}
      // value={firstQuery}
      />;
  }

  public _keyExtractor = (item, index) => item.idPasien;

  public _renderItems = ({item}) => (
    <Card>
      <Card.Content>
        <Title>{item.namaLengkap}</Title>
      </Card.Content>
      <Card.Actions>
        <Button mode='outlined' style={{marginRight: 5}} onPress={() => this.onDetail(item)}>
          Detail
        </Button>
      </Card.Actions>
    </Card>
  )

  private async getFirstData( p ) {
    await p
      .orderByChild('flagActivity')
      .equalTo('antriApotekBilling')
      .on('value', (snap) => {
      const r1 = [];
      // r1.push(snap.val());
      snap.forEach((el) => {
        r1.push({
          idPasien: el.val()._id,
          namaLengkap: el.val().namaLengkap,
        });
      });
      // console.log(r1, r1[0]);
      this.setState({
        items: r1,
        isLoaded: false,
      });
      this.arrayholder = r1;
    });
  }

  private onDetail(p) {
    this.props.navigation.navigate('DetailApotekBillingScreen', {qey: 'detailApotekBilling', el: {p}});
  }

}

export default Screen;

const styles: any = StyleSheet.create({
  topContainer: {
    flex: 1,
    // flexGrow: 1,
    width: '100%',
    padding: 10,
    // backgroundColor: 'yellow',
  },
  });
