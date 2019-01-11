import 'react-native';
import * as React from 'react';
import PasienRekamMedik from '../PasienRekamMedik';
// import appStore from '../../../stores/appStore';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import { shallow, render } from 'enzyme';

describe('rendering test', () => {
  const wrapper = shallow(
    <PasienRekamMedik/>,
    // <PasienRekamMedik store={appStore}/>,
  );

  it('renders as expected', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
