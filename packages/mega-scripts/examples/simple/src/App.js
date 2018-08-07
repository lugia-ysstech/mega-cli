import React from 'react';
import { connect } from 'dva';

@connect(mapStateToProps)
export default class App extends React.Component {
  componentDidMount() {
    setInterval(() => {
      this.props.dispatch({
        type: 'count/add',
      });
    }, 1000);
  }

  render() {
    if (process.env.contextPath) {
      return <div>contextPath: {process.env.contextPath}</div>;
    } else {
      return (
        <div>
          <div>Count: {this.props.count}</div>
        </div>
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    count: state.count,
  };
}
