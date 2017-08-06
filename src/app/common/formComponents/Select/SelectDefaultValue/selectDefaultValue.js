/**
 * Created by Ajay Gaur on 25/06/17.
 */

import React, { Component } from 'react';    // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';

import withStyles from '../../../../decorators/withStyles';
import _ from 'lodash';

import styles from './selectDefaultValue.scss';
//import 'app/assets/icons/close.svg';

class SelectValue extends Component {
  static propTypes = {
    children: PropTypes.node,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    onRemove: PropTypes.func,
    value: PropTypes.object.isRequired,
  };

  onRemoveValue = () => {
    const props = this.props;
    props.onRemove(props.value);
  };

  render() {
    //todo: Add remove icon
    return (
      <div className={styles.wrapper} title={_.get(this.props.value, 'title', '')}>
        <div className={styles.label}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default withStyles(SelectValue, styles);

