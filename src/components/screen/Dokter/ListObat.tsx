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
  Modal, Portal, Surface, TextInput, IconButton, Colors,
} from 'react-native-paper';

import { ratio, colors } from '../../../utils/Styles';

interface IProps {
  itemsEl;
}

interface IState {
  isLoading;
}

class Screen extends Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
  }

  public render() {
    return (
      <View key={this.props.itemsEl.idObat} style={styles.container}>
          <IconButton
            icon='clear'
            color={Colors.red500}
            size={20}
            // onPress={() => _onDeleteObat(el)}
          />
          <Subheading>{this.props.itemsEl.namaObat} - [ {this.props.itemsEl.jumlahObatKeluar} ]</Subheading>
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
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    color: 'black',
  },
});