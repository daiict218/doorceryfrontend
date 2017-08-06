/**
 * Created by Ajay Gaur on 01/07/17.
 */

import React from 'react';
import PropTypes from 'prop-types';
import {compose} from 'recompose';
import {isFunction as _isFunction, partial as _partial, omit as _omit} from 'lodash';
import cx from 'classnames';
import withStyles from '../../decorators/withStyles';
import s from './snackBar.scss';
import Snackbar from 'material-ui/Snackbar';

//todo: display these icons
//import Icon from '../Icon';
//import '../../../assets/icons/snackbar_success_clr.svg';
//import '../../../assets/icons/snackbar_error_clr.svg';
//import '../../../assets/icons/no.svg';

const
  SNACKBAR_INLINE_STYLES = {
    display: 'block',
    left: '50%',
    right: 'auto',
    bottom: 0,
    transform: 'translate3d(-50%, 100%, 0)',
    transition: 'transform 0.5s',
    visibility: 'visible',
    opacity: 1,
    zIndex: 100000, //highest z-index
  },
  SNACKBAR_BODY_INLINE_STYLES = {
    margin: 'initial',
    padding: 0,
    height: 'auto',
    lineHeight: 'inherit',
    backgroundColor: 'transparent',
    width: '100%',
  },
  getInlineStyles = (props, isOpen) => {
    const baseStyle = Object.assign({}, SNACKBAR_INLINE_STYLES);
    let translateX = '-50%', translateY = '100%', left = '50%', width = 'auto';
    if (props.stickToSides) {
      translateX = '0';
      left = 0;
      width = '100%'
    }
    if (isOpen) {
      translateY = props.stickToBottom ? '0' : '-4.8rem';
    }
    return Object.assign(baseStyle, {
      transform: `translate3d(${translateX}, ${translateY}, 0)`,
      left,
      width,
    });
  },
  AUTO_HIDE_DURATION = 5000;


class SprSnackBar extends React.PureComponent {
  static propTypes = {
    ...Snackbar.propTypes,
    type: PropTypes.oneOf(['success', 'error']),
    icon: PropTypes.string,
    iconClassName: PropTypes.string,
    closeIconClassName: PropTypes.string,
    className: PropTypes.string,
    textClassName: PropTypes.string,
    boxClassName: PropTypes.string,
    message: PropTypes.string.isRequired,
    hideOnClickAway: PropTypes.bool, // to prevent bar from closing on clickaway
    disableManualClose: PropTypes.bool, //to disable the close btn
    autoHideDuration: PropTypes.number,
    autoHide: PropTypes.bool,
    stickToBottom: PropTypes.bool, //to stick snack bar to bottom of screen(eg. in mobile)
    stickToSides: PropTypes.bool, //to span the whole width of the screen
    onClose: PropTypes.func,
  };

  static defaultProps = {
    type: 'success',
    hideOnClickAway: true,
    autoHide: true,
    open: true,
  };

  state = {
    open: false,
  };

  componentDidMount() {
    const props = this.props;
    if (props.message) {
      //needed to use set timeout, since immediately opening the snack bar after mounting did not animate the bar
      setTimeout(() => {
        this.setState({ open: true });
      }, 1);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.message && this.closeTimeout) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = undefined;
      this.setState({ open: true });
    }
  }

  handleClose = (reason) => {
    const {onClose} = this.props;
    if (_isFunction(onClose)) {
      //to show the bar animating out the screen
      this.closeTimeout = setTimeout(() => {
        onClose(reason);
        this.closeTimeout = undefined;
      }, 500);
    }
    this.pendingClose = false;
    this.setState({ open: false });
  };

  onClose = (reason) => {
    const { hideOnClickAway} = this.props,
      hovered = this.hovered;
    if ((reason !== 'clickaway' || hideOnClickAway)) {
      if (!hovered || reason === 'manualClose') {
        this.hovered = false;
        this.handleClose(reason);
      } else {
        this.pendingClose = true;
      }
    }
  };

  handleMouseEnter = () => {
    this.hovered = true;
  };

  handleMouseLeave = () => {
    this.hovered = false;
    if (this.pendingClose) {
      this.handleClose('timeout');
    }
  };

  renderMessage() {
    const props = this.props,
      {message, icon} = props,
      type = props.type.toLowerCase(),
      {disableManualClose, stickToSides} = props;

    if (message) {
      //<Icon name={icon ? icon : `snackbar_${type}_clr`}
      //  className={cx(s.icon, props.iconClassName, s[type], {[s.iconRounded]: !stickToSides})}/>
      return (
        <div className={cx(s.snackbar, props.className, 'dpr', {[s.snackbarRounded]: !stickToSides})}>
          <div className={cx(s.innerContainer, props.boxClassName)}>
            <div className={cx(s.textBox, props.textClassName)} dangerouslySetInnerHTML={{__html: message}}/>
            {//!disableManualClose && (
              //  <Icon name="no" className={cx(s.close, props.closeIconClassName, 'scp')}
              //    onClick={_partial(this.onClose, 'manualClose')}/>
              //)
            }
          </div>
        </div>
      );
    }
    return '';
  }

  render() {
    const
      props = this.props,
      open = this.state.open,
      style = getInlineStyles(props, open),
      barProps = _omit(props, ['message', 'notifTime', 'dismissTime', 'icon', 'iconClassName', 'type', 'className']);

    return (
      <Snackbar
        {...barProps}
        open={open}
        message={this.renderMessage()}
        style={style}
        onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}
        autoHideDuration={props.autoHide ? props.autoHideDuration || AUTO_HIDE_DURATION : undefined}
        bodyStyle={SNACKBAR_BODY_INLINE_STYLES} onRequestClose={this.onClose}
      />
    );
  }
}

export default withStyles(SprSnackBar, s);
