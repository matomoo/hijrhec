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
import {
  List, Card, Title, Paragraph, Button,
  Caption, Subheading, Divider, Searchbar, Headline,
} from 'react-native-paper';
import { observer } from 'mobx-react';
import { inject } from 'mobx-react/native';
import * as db1 from '../../../firebase/firebase';
import Moment from 'moment';

interface IProps {
  navigation?: any;
  store?: any;
  tabLabel?;
}

interface IState {
  isLoaded: boolean;
  items: any;
  itemsRekamMedik;
  qeyUid;
}

@inject('store') @observer
class Screen extends Component<IProps, IState> {
  public static navigationOptions = {
    title: 'Pasien Rekam Medik',
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoaded: true,
      qeyUid: this.props.navigation.state.params.qey.p.uid,
      items: [],
      itemsRekamMedik: [],
    };
  }

  public componentDidMount() {
    this.getFirstData(this.state.qeyUid);
  }

  public render() {
    return (
      <View style={styles.container}>
        {this.state.items.map((el, key) =>
          <View key={key} style={{width: '100%'}}>
            <Card>
              <Card.Content>
                <Title>{el.namaLengkap}</Title>
                <Subheading>{el.handphone}</Subheading>
              </Card.Content>
              <Card.Actions>
                <Button mode='outlined'
                  onPress={() => this.props.navigation.navigate('DiagnosisResepObatScreen' , {qey : {el}})}
                >Diagnosis + Resep/Obat</Button>
              </Card.Actions>
            </Card>
          </View>,
        )}
        <Headline>History Rekam Medik</Headline>
        {this.state.itemsRekamMedik.map((el2, key2) =>
          <View key={key2} style={{width: '100%'}}>
            {!!el2 ?
              <Card>
                <Card.Content>
                  <Subheading>{el2.tanggalPeriksa}</Subheading>
                </Card.Content>
              </Card>
              : <Subheading>Tidak ada data</Subheading>
            }
          </View>,
          )}

      </View>
    );
  }

  private async getFirstData( p ) {
    if (p !== null ) {
      await db1.db.ref('users/' + p )
      .on('value', (snap) => {
        const r1 = [];
        r1.push(snap.val());
        this.setState({
          items: r1,
        });
      });
    }
    await db1.db.ref('historyRekamMedik/' + p )
      .on('value', (snap2) => {
      const r2 = [];
      r2.push(snap2.val());
      this.setState({
        itemsRekamMedik: r2,
        isLoaded: false,
      });
    });
  }

}

export default Screen;

interface IStyle {
  container: ViewStyle;
}

const styles = StyleSheet.create<IStyle>({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 5,
  },
});
