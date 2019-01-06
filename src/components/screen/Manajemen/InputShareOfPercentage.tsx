import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  // Text,
  View,
  TouchableHighlight,
  // TextInput,
  ScrollView,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Button, Headline, IconButton, Colors,
  Caption, Card, Title, Paragraph, TouchableRipple, Text, TextInput,
} from 'react-native-paper';
import * as db1 from '../../../firebase/firebase';
import { observer } from 'mobx-react';
import { inject } from 'mobx-react/native';

interface IProps {
  navigation?: any;
  store?: any;
}

interface IState {
  belanjaModal;
  jasaMedik;
  saham;
  sarana;
  items;
}

@inject('store') @observer
class Screen extends Component<IProps, IState> {
  public static navigationOptions = {
    title: 'Share of Percentage',
  };
  private taskItems: any;

  constructor(props) {
    super(props);
    this.taskItems = db1.db.ref(`manajemen/percentageOfShare`);
    this.state = {
      belanjaModal: '',
      jasaMedik: '',
      saham: '',
      sarana: '',
      items: [],
    };
  }

  public componentDidMount() {
    this.getFirstData(this.taskItems);
  }

  public render() {
    return (
      <View style={styles.container}>
        {/* <ScrollView> */}
        <View style={{width:'100%'}}>
          <TextInput
              mode='outlined'
              label='Belanja Modal'
              keyboardType='number-pad'
              value={this.state.belanjaModal}
              onChangeText={(belanjaModal) => this.setState({belanjaModal})}/>
          <TextInput
              mode='outlined'
              label='Jasa Medik'
              keyboardType='number-pad'
              value={this.state.jasaMedik}
              onChangeText={(jasaMedik) => this.setState({jasaMedik})}/>
          <TextInput
              mode='outlined'
              label='Saham'
              value={this.state.saham}
              onChangeText={(saham) => this.setState({saham})}/>
          <TextInput
              mode='outlined'
              label='Sarana'
              value={this.state.sarana}
              onChangeText={(sarana) => this.setState({sarana})}/>
        </View>

        <View style={{marginTop: 10}}>
          <Button mode='contained'
            disabled={this.state.belanjaModal === '' ||
                        this.state.jasaMedik === '' ||
                        this.state.saham === '' ||
                        this.state.sarana === '' ||
                        (parseInt(this.state.belanjaModal, 10) +
                        parseInt(this.state.jasaMedik, 10) +
                        parseInt(this.state.saham, 10) +
                        parseInt(this.state.sarana, 10) ) !== 100
                        ? true : false }
            onPress={() => this._onSubmit()} >
            Submit
          </Button>
        </View>

      {/* </ScrollView> */}
      </View>
    );
  }

  public _onSubmit() {
    this.taskItems.update({
      belanjaModal: this.state.belanjaModal,
      jasaMedik: this.state.jasaMedik,
      saham: this.state.saham,
      sarana: this.state.sarana,
    });
    this.props.navigation.navigate('HomeUserScreen');
  }

  private async getFirstData( p ) {
    await p.on('value', (result) => {
      // const r1 = [];
      // r1.push(result.val());
      // console.log(result.val());
      if (result.val() !== null) {
        this.setState({
          belanjaModal : result.val().belanjaModal === null ? '' : result.val().belanjaModal,
          jasaMedik : result.val().jasaMedik === null ? '' : result.val().jasaMedik,
          saham : result.val().saham === null ? '' : result.val().saham,
          sarana : result.val().sarana === null ? '' : result.val().sarana,
          // items: r1,
          // isLoaded: false,
        });
      }
    });
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
    padding: 10,
    width: '100%',
  },
  text: {
    fontSize: 20,
    color: 'black',
  },
});
