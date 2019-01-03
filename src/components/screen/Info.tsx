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
import { Button, Headline, IconButton, Colors,
  Caption,
} from 'react-native-paper';
import { ratio, colors } from '../../utils/Styles';

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

class Screen extends Component<any, any> {
  static navigationOptions = {
    title: 'Info',
  };

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  public render() {
    return (
      <View style={styles.container}>
        <Headline>Headline</Headline>
        <Caption>Caption</Caption>
        <Text>Text</Text>
        <Text style={styles.text}>Text with style</Text>
        <IconButton
          icon="add-a-photo"
          color={Colors.red500}
          size={20}
          onPress={() => console.log('Pressed')}
        />
      </View>
    );
  }
}

export default Screen;
