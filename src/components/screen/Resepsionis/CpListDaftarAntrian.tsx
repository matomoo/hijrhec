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
    title: 'Item Diagnosis',
  };

  public arrayholder: any[];
  private taskUser: any;

  constructor(props) {
    super(props);
    this.taskUser = db1.db.ref(`diagnosa`);
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
        <View>
          <Button mode='contained'
            onPress={() => this.onNewData()}>
            Tambah
          </Button>
        </View>
      </View>
    );
  }

  public searchFilterFunction = (text) => {
    const newData = this.arrayholder.filter((item) => {
      const itemData = `${item.namaDiagnosa.toUpperCase()}`;
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

  public _keyExtractor = (item, index) => item.idDiagnosa;

  public _renderItems = ({item}) => (
    // <List.Item
    //   title={item.namaLengkap}
    //   description={item.email}
    //   onPress={() => this.onUpdateData(item)}
    //   // left={props => <List.Icon {...props} icon="folder" />}
    // />
    <Card>
      <Card.Content>
        <Title>{item.namaDiagnosa}</Title>
        <Paragraph>{item.hargaDiagnosa}</Paragraph>
        {/* <Caption>Caption</Caption> */}
        {/* <Divider /> */}
        {/* <Subheading>Role : {item.userRole}</Subheading> */}
      </Card.Content>
      <Card.Actions>
        <Button mode='outlined' onPress={() => this.onUpdateData(item)}>
          Ubah
        </Button>
        <Button mode='text' onPress={() => this.onDeleteData(item)}>
          Hapus
        </Button>
      </Card.Actions>
    </Card>
  )

  private async getFirstData( p ) {
    await p
      .on('value', (snap) => {
      const r1 = [];
      snap.forEach((el) => {
        r1.push({
          idDiagnosa: el.val().idDiagnosa,
          namaDiagnosa: el.val().namaDiagnosa,
          hargaDiagnosa: el.val().hargaDiagnosa,
        });
      });
      this.setState({
        items: r1,
        isLoaded: false,
      });
      this.arrayholder = r1;
      // this.notif.localNotif();
      // this.props.store.user.userBadge2 = r1.length;
    });
  }

  private onUpdateData(p) {
    // console.log( p );
    this.props.navigation.navigate('InputItemDiagnosisScreen', {qey: 'updateData', el: {p}});
  }

  private onNewData() {
    // console.log( p );
    this.props.navigation.navigate('InputItemDiagnosisScreen', {qey: 'newData'});
  }

  private onDeleteData(p) {
    db1.db.ref('diagnosa/' + p.idDiagnosa).remove();
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
