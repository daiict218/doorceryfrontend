import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Modal } from 'react-overlays';

import withStyles from '../../decorators/withStyles';

import styles from './modal.scss';

class ModalWrapper extends React.Component {

  static propTypes = {
    showModal: PropTypes.bool.isRequired,
    headerLabel: PropTypes.string,
    cancelLabel: PropTypes.string,
    submitlabel: PropTypes.string,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    disableSubmit: PropTypes.bool,
    onHide: PropTypes.func,
    className: PropTypes.string,
    footerClassName: PropTypes.string,
    submitClassName: PropTypes.string,
    footerComponent: PropTypes.node
  };

  static defaultProps = {
    showModal: false,
    headerLabel: '',
    cancelLabel: 'Cancel',
    submitlabel: 'Submit',
    onCancel: _.noop,
    onSubmit: _.noop,
    disableSubmit: false,
    onHide: _.noop
  };

  render() {
    const that = this,
      props = that.props,
      footer = props.footerComponent || that.renderFooter();

    return (
      <Modal aria-labelledby="modal-label"
        className={styles.modal}
        backdropClassName={styles.backdrop}
        show={props.showModal}
        onHide={that.onHide}>
        <div className={classNames(styles.content, props.className)}>
          {that.renderHeader()}
          {props.children}
          <div className={classNames(styles.footer, props.footerClassName)}>
            {footer}
          </div>
        </div>
      </Modal>
    );
  };

  renderHeader() {
    return (
      <div className={styles.header}>
        <span className={styles.headerLabel}>
          {this.props.headerLabel}
        </span>
      </div>
    );
  };

  renderFooter() {
    const props = this.props;

    return (
      <div className={styles.footerActions}>
        <button className={classNames(styles.cancelBtn, 'secondaryButton')}
          onClick={this.onCancel}>
          {props.cancelLabel}
        </button>
        <button className={classNames(styles.button, 'primaryButton', props.submitClassName)}
          disabled={props.disableSubmit}
          onClick={this.onSubmit}>
          {props.submitLabel}
        </button>
      </div>
    );
  };

  onCancel = () => {
    this.props.onCancel();
  };

  onSubmit = () => {
    this.props.onSubmit();
  };

  onHide = () => {
    this.props.onHide();
  };
}

export default withStyles(ModalWrapper, styles);
