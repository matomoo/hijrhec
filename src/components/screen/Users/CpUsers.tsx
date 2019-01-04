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
  Button,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import {Caption, Headline, Paragraph, Title} from 'react-native-paper';
import { ratio, colors } from '../../../utils/Styles';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { inject } from 'mobx-react/native';
import * as db1 from '../../../firebase/firebase';
import NumberFormat from 'react-number-format';
// import ImagePicker from 'react-native-image-crop-picker';
import ImagePicker from 'react-native-image-picker';
import firebase from 'firebase';
import RNFetchBlob from 'rn-fetch-blob';
import Moment from 'moment';
import CpStatusPasien from '../Users/CpStatusPasien';
// import RNFS from 'react-native-fs';

interface IProps {
  navigation?: any;
  store?: any;
}

interface IState {
  isLoaded: boolean;
  users: any;
}

@inject('store') @observer
class Screen extends Component<IProps, IState> {

  private taskUser: any;

  constructor(props) {
    super(props);
    this.taskUser = db1.db.ref(`users/${this.props.store.user.uid}`);
    this.props.store.user.userPilihObatAktif = 'Tidak';
    this.state = {
      isLoaded: true,
      users: [],
    };
  }

  public componentDidMount() {
    this.getFirstData(this.taskUser);
    // console.log('cpUser', this.props.store.user.userAvatar1);
  }

  public render() {
    return (
      <View style={styles.topContainer}>
        <ScrollView>
        { this.state.isLoaded ?
            <ActivityIndicator /> :
            <View style={styles.container}>
              { this.state.users.map( (el, key) =>
                <View style={styles.header} key={key}>
                  <View style={styles.headerContent}>
                    <TouchableOpacity
                      onPress={() => this._onPressAva5()}
                      >
                      <Image style={styles.avatar}
                        source={{uri: el.userAvatar }}/>
                    </TouchableOpacity>
                    <Headline>Halo, {el.namaLengkap}</Headline>
                  </View>
                  <View style={styles.bodyContent}>
                    <CpStatusPasien store={this.props.store}/>
                  </View>
                </View>,
              )}
            </View>
        }
      </ScrollView>
      </View>
    );
  }

  private async getFirstData( p ) {
    await p.on('value', (result) => {
      const r1 = [];
      r1.push(result.val());
      this.setState({
        users: r1,
        isLoaded: false,
      });
    });
  }

  private _onRequest( p ) {
    this.props.navigation.navigate('LayananHomecare');
  }

  private _onPressAva5() {
    const options = {
      title: 'Select Avatar',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      const image = response.uri;
      const dbRef = firebase.storage().ref('users/' + this.props.store.user.uid + '/images/ava.jpg');

      const Blob = RNFetchBlob.polyfill.Blob;
      const fs = RNFetchBlob.fs;
      window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
      window.Blob = Blob;

      const uploadImage = (uri, fbRef, mime = 'image/jpg') => {
        return new Promise((resolve, reject) => {
          const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
          let uploadBlob = null;
          // const imageRef = firebase.storage().ref('posts').child(imageName);
          const imageRef = fbRef;
          fs.readFile(uploadUri, 'base64')
            .then((data) => {
              return Blob.build(data, { type: `${mime};BASE64` });
            })
            .then((blob) => {
              uploadBlob = blob;
              return imageRef.put(blob, { contentType: mime });
            })
            .then(() => {
              uploadBlob.close();
              return imageRef.getDownloadURL();
            })
            .then((url) => {
              resolve(url);
              // console.log(url);
            })
            .catch((error) => {
              reject(error);
            });
        });
      };

      uploadImage(image, dbRef)
        .then((res) => {
          console.log(res);
          db1.db.ref('users/' + this.props.store.user.uid).update({
            userAvatar: res,
          });
        })
        .catch((err) => {
          console.log(err);
        })
      ;
    });
  }

}

export default Screen;

const styles: any = StyleSheet.create({
  topContainer: {
    flex: 1,
    // flexGrow: 1,
    width: '100%',
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
    // marginTop : 10,
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
    // marginHorizontal: 0,
  },
  headerContent: {
    backgroundColor: '#66bb6a',
    padding: 20,
    // paddingHorizontal: 30,
    // marginVertical: 0,
    marginHorizontal: 0,
    alignItems: 'center',
    width: '100%',
    // flex: 1,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: 'white',
    marginBottom: 5,
  },
  name: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5,
  },
  textInfo: {
    fontSize: 18,
    marginTop: 10,
    color: '#fff59d',
  },
  smallTextInfo: {
    fontSize: 14,
    marginTop: 5,
    color: '#696969',
  },
  itemSpaceV10: {
    marginVertical: 3,
  },
  buttonContainer: {
    // height: 50,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    // width: 220,
    borderRadius: 30,
  },
  loginButton: {
    backgroundColor: '#1976d2',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    // marginBottom: 10,
    color: '#ffffff',
  },
  buttonContainerDisabled: {
    // height: 50,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    // width: 220,
    borderRadius: 30,
  },
  loginButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  buttonTextDisabled: {
    fontSize: 20,
    fontWeight: 'bold',
    // marginBottom: 10,
    color: '#aeaeae',
  },
});
