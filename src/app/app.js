import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Portal from 'react-overlays/lib/Portal';
import DocumentTitle from 'react-document-title';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
//import FontAwesome from 'react-fontawesome';    //todo: remove this

import SnackBar from './common/SnackBar';

import appActions from '../actions/appActions';

import 'react-select-plus/dist/react-select-plus.css';
import commonStyles from './common/common.unmod.scss';

const DOORCERY_TITLE = 'Doorcery';

class App extends React.Component {
  static childContextTypes = {
    insertCss: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.removeCommonStyles = commonStyles._insertCss();
  }

  getChildContext() {
    return {
      insertCss: styles => styles._insertCss(),
    };
  }

  componentDidMount() {
    this.props.handleResize({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    window.addEventListener('resize', this.onScreenResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onScreenResize);
    this.removeCommonStyles();
  }

  onAlertClose = () => {
    this.props.hideAlert();
  };

  onScreenResize = () => {
    this.props.handleResize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  render() {
    const that = this,
      alert = this.props.alert || {};

    return (
      <DocumentTitle title={DOORCERY_TITLE}>
        <MuiThemeProvider>
          <div>
            {alert.message && (
              <Portal container={that.domBody}>
                <SnackBar
                  message={alert.message}
                  onClose={that.onAlertClose}
                  type={alert.type}
                  hideOnClickAway
                />
              </Portal>
            )}
            {this.props.children}
          </div>
        </MuiThemeProvider>
      </DocumentTitle>
    );
  }
}

const mapStateToProps = ({appState}) => ({
  alert: appState.alert,
  dimensions: appState.dimensions,
});

export default connect(mapStateToProps, {
  ...appActions,
})(App);
