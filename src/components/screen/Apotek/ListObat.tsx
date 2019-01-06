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

  private taskUser: any;
  arrayholder: any[];
  

  constructor(props) {
    super(props);
    this.taskUser = db1.db.ref(`obat`);
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
            <View style={{width:'100%'}}>
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

  searchFilterFunction = text => {    
    const newData = this.arrayholder.filter(item => {      
      const itemData = `${item.namaObat.toUpperCase()}`;
      const textData = text.toUpperCase();
        
       return itemData.indexOf(textData) > -1;    
    });    
  
    this.setState({ items: newData });  
  };

  renderHeader = () => {
    const { firstQuery } = this.state;
    return <Searchbar
      placeholder="Cari berdasarkan nama"
      onChangeText={text => this.searchFilterFunction(text)}
      // value={firstQuery}
      />;
  };


  _keyExtractor = (item, index) => item.idObat;

  _renderItems = ({item}) => (
    <Card>
      <Card.Content>
        <Title>{item.namaObat}</Title>
        <NumberFormat
          value={item.hargaObat}
          displayType={'text'} thousandSeparator={true} prefix={'Rp. '}
          renderText={(value) => <Paragraph>{value}</Paragraph>} />
        <NumberFormat
          value={item.jumlahObat}
          displayType={'text'} thousandSeparator={true}
          renderText={(value) => <Paragraph>Jumlah : {value}</Paragraph>} />
      </Card.Content>
      <Card.Actions>
        <Button mode="outlined" onPress={() => this.onUpdateData(item)}>
          Pilih
        </Button>
      </Card.Actions>
    </Card>
  );

  private async getFirstData( p ) {
    await p
      .on('value', (snap) => {
      const r1 = [];
      snap.forEach((el) => {
        r1.push({
          idObat: el.val().idObat,
          namaObat: el.val().namaObat,
          hargaObat: el.val().hargaObat,
          jumlahObat: el.val().jumlahObat,
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

  private onUpdateData (p) {
    // console.log( p );
    this.props.navigation.navigate('InputItemObatScreen', {qey:'updateData', el: {p}})
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
