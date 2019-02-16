import React, { Component } from 'react';
import {
  // TouchableOpacity,
  // Image,
  // Text,
  StyleSheet,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { observer } from 'mobx-react';
import { inject } from 'mobx-react/native';
// import { ratio, colors } from '../../utils/Styles';

import CpListUsers from '../screen/SysAdmin/CpListUsers';
import CpUsers from '../screen/Users/CpUsers';
import IndexResepsionis from '../screen/Resepsionis/IndexResepsionis';
import IndexApotek from '../screen/Apotek/IndexApotek';
import InputShareOfPercentage from '../screen/Manajemen/InputShareOfPercentage';
import IndexDokter from '../screen/Dokter/IndexDokter';
import IndexKamarOperasi from '../screen/KamarOperasi/IndexKamarOperasi';

interface IProps {
  navigation?: any;
  store: any;
}

interface IState {
  isLoaded: boolean;
  users: any[];
}

@inject('store') @observer
class Screen extends Component<IProps, IState> {
  public static navigationOptions = {
    title: 'Klinik Mata Hasanuddin',
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoaded: true,
      users: [],
    };
  }

  public render() {
    return (
      <View style={styles.container}>
        { this.props.store.user.userRole === 'user' &&
            <CpUsers navigation={ this.props.navigation } />
        }
        { this.props.store.user.userRole === 'resepsionis' &&
            <IndexResepsionis navigation={ this.props.navigation } />
        }
        { this.props.store.user.userRole === 'apotek' &&
            <IndexApotek navigation={ this.props.navigation } />
        }
        { this.props.store.user.userRole === 'oka' &&
            <IndexKamarOperasi navigation={ this.props.navigation } />
        }
        { this.props.store.user.userRole === 'manajemen' &&
            <InputShareOfPercentage navigation={ this.props.navigation } />
        }
        { this.props.store.user.userRole === 'dokter' &&
            <IndexDokter navigation={ this.props.navigation } />
        }
        { this.props.store.user.userRole === 'sysadmin' &&
            <CpListUsers navigation={ this.props.navigation } />
        }
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
