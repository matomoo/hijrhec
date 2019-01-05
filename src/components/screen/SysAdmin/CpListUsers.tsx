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
import { Item } from 'react-native-paper/typings/components/Drawer';

interface IProps {
  navigation?: any;
  store?: any;
  tabLabel?;
}

interface IState {
  isLoaded: boolean;
  users: any;
  firstQuery;
}

@inject('store') @observer
class Screen extends Component<IProps, IState> {

  private taskUser: any;
  arrayholder: any[];
  

  constructor(props) {
    super(props);
    this.taskUser = db1.db.ref(`users`);
    this.arrayholder = [];
    this.state = {
      isLoaded: true,
      users: [],
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
                data={this.state.users}
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
      const itemData = `${item.email.toUpperCase()}`;
      const textData = text.toUpperCase();
        
       return itemData.indexOf(textData) > -1;    
    });    
  
    this.setState({ users: newData });  
  };

  renderHeader = () => {
    const { firstQuery } = this.state;
    return <Searchbar
      placeholder="Cari berdasarkan email"
      onChangeText={text => this.searchFilterFunction(text)}
      // value={firstQuery}
      />;
  };


  _keyExtractor = (item, index) => item.uid;

  // _renderItem = ({item}) => (
  //   // <TouchableOpacity onPress={this._onPress}>
  //       <View>
  //         <Text style={{ color: 'gray' }}>
  //           {item.namaLengkap}
  //         </Text>
  //       </View>
  //     // </TouchableOpacity>
  // );

  _renderItems = ({item}) => (
    // <List.Item
    //   title={item.namaLengkap}
    //   description={item.email}
    //   onPress={() => this.onChangeRole(item)}
    //   // left={props => <List.Icon {...props} icon="folder" />}
    // />
    <Card>
      <Card.Content>
        <Title>{item.namaLengkap}</Title>
        <Paragraph>{item.email}</Paragraph>
        {/* <Caption>Caption</Caption> */}
        {/* <Divider /> */}
        {/* <Subheading>Role : {item.userRole}</Subheading> */}
      </Card.Content>
      <Card.Actions>
        <Button mode="outlined" onPress={() => this.onChangeRole(item)}>
          {item.userRole}
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
      this.arrayholder = r1;
      // this.notif.localNotif();
      // this.props.store.user.userBadge2 = r1.length;
    });
  }

  private onChangeRole (p) {
    // console.log( p );
    if (p.uid !== 'undefined'){ 
      if (p.userRole === 'user') {
        db1.db.ref('users/' + p.uid).update({
          role: 'resepsionis',
      }) } else if (p.userRole === 'resepsionis') {
        db1.db.ref('users/' + p.uid).update({
          role: 'dokter',
      }) } else if (p.userRole === 'dokter') {
        db1.db.ref('users/' + p.uid).update({
          role: 'apotek',
      }) } else if (p.userRole === 'apotek') {
        db1.db.ref('users/' + p.uid).update({
          role: 'oka',
      }) } else if (p.userRole === 'oka') {
        db1.db.ref('users/' + p.uid).update({
          role: 'user',
      }) }
    }
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
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    // marginVertical: 10,
    // marginHorizontal: 0,
    // height : 100,
    // marginBottom : 10,
    // flexGrow: 1,
  },
  // card1: {
  //   flex: 1,
  //   height: 50,
  // },
  header: {
    // marginHorizontal: 0,
    width: '100%',
    // flexGrow: 1,
    flex: 1,
    // paddingVertical: 30,
    marginBottom: 10,
  },
  headerContent: {
    backgroundColor: '#0277bd',
    padding: 10,
    borderRadius: 10,
    // paddingHorizontal: 30,
    // marginLeft: 15,
    // marginHorizontal: 0,
    alignItems: 'flex-start',
    width: '100%',
    // flex: 1,
  },
  headerContentAdmin: {
    backgroundColor: '#2e7d32',
    padding: 10,
    borderRadius: 10,
    // paddingHorizontal: 30,
    // marginLeft: 15,
    // marginHorizontal: 0,
    alignItems: 'flex-start',
    width: '100%',
    // flex: 1,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: 'white',
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    color: '#FFFFFF',
    // fontWeight: '600',
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding: 30,
  },
  textInfo: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 5,
    color: '#616161',
  },
  smallTextInfo: {
    fontSize: 12,
    // marginBottom: 10,
    color: '#FFFFFF',
  },
  itemSpaceV10: {
    marginVertical: 10,
  },
});
