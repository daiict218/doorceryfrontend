/**
 * Created by ajaygaur on 17/06/17.
 */

import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import {
  canUseDOM,
} from 'fbjs/lib/ExecutionEnvironment';
import {
  noop as _noop,
  isFunction as _isFunction,
} from 'lodash';
import FontAwesome from 'react-fontawesome';

import styles from './FormContainer.scss';
import withStyles from '../../../../decorators/withStyles';

import Header from '../Header';
import Body from '../Body';
import Footer from '../Footer';
import Portal from 'react-overlays/lib/Portal';

const bodyContainer = () => canUseDOM && document.body;

class FormContainer extends React.Component {
  static propTypes = {
    className: PropTypes.string, //Form Container Class Name
    closeIcnLabel: PropTypes.string, //Close Icon Label
    onHide: PropTypes.func, //Function on close form
    renderHeader: PropTypes.bool, //Whether to render Header or not
    renderFooter: PropTypes.bool, //Whether to render Footer or not
    showCloseIcon: PropTypes.bool, //Whether to render close icon
    closeIcnClassName: PropTypes.string, //Close Icon Class Name
    closeOnEscape: PropTypes.bool, //Whether to close form on escape or not
    show: PropTypes.bool, //whether to show the form or not
  };

  static defaultProps = {
    bgDark: false,
    closeIcnLabel: 'esc',
    onHide: _noop,
    renderHeader: true,
    renderFooter: true,
    showCloseIcon: true,
    closeIcnClassName: '',
    container: bodyContainer,
    closeOnEscape: true,
    show: true,
  };

  handleCloseForm = () => {
    this.props.onHide();
  };

  renderCloseIcon() {
    const props = this.props;
    return (
      <div className={classnames(styles.closeContainer, props.closeIcnClassName, 'circular dcp dpf dtc p-x-4')}
        onClick={this.handleCloseForm}
      >
        <div className={classnames(styles.closeIconCont, 'm-b-1')}>
          <FontAwesome
            name={'close'}
            size={'2x'}
            className={styles.closeIcon}
          />
        </div>
        <div className={`${styles.closeLabel} txt-bd2`}>{props.closeIcnLabel}</div>
      </div>
    );
  }

  render() {
    const props = this.props,
      {container} = props;

    return props.show && (
        <Portal container={_isFunction(container) ? container() : container}>
          <div className={classnames(`${styles.formContainer} ${props.className} full-width full-height dpf`, {
            [styles.bgDark]: props.bgDark,
            [styles.withoutHeader]: !props.renderHeader,
            [styles.withoutFooter]: !props.renderFooter,
            [styles.withoutHeaderAndCloseButton]: !props.showCloseIcon && !props.renderHeader,
            [styles.withoutHeaderAndFooter]:!props.renderHeader && !props.renderFooter,
          })}
          >
            {props.showCloseIcon && this.renderCloseIcon()}
            {props.children}
          </div>
        </Portal>
      );
  }
}

const FormContainerHOC = withStyles(FormContainer, styles);
FormContainerHOC.Header = Header;
FormContainerHOC.Body = Body;
FormContainerHOC.Footer = Footer;

export default FormContainerHOC;
