import React, { Component } from 'react';
import Layout from '@lugia/web/layout';

import './Layout.scss';

export default class BlankLayout extends Component {
  static propTypes = {};

  static defaultProps = {};

  render() {
    const { children } = this.props;
    return (
      <Layout style={{ minHeight: '100vh' }} className="blank-layout">
        {children}
      </Layout>
    );
  }
}
