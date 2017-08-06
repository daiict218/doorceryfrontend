import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import {
  isFunction as _isFunction,
  isEqual as _isEqual,
  get as _get,
} from 'lodash';

import SelectPlus from 'react-select-plus';
import SelectDefaultValue from './SelectDefaultValue';
import SelectDefaultOption from './SelectDefaultOption';

const
  MENU_INIT_STYLE = {
    zIndex: 9999,
    margin: 0,
    position: 'absolute',
    borderRadius: '0.4rem',
    maxHeight: 179,
    width: '100%',
  },

  BREATHING_SPACE = 3,
  SELECT_CONTROL_STYLE = { width: '100%' };

class Select extends React.Component {

  static propTypes = {
    viewport: PropTypes.shape({
      height: PropTypes.number,
    }),
  };

  static defaultProps = {
    viewport: {
      height: window.innerHeight,
    },
  };

  state = {
    menuStyle: MENU_INIT_STYLE,
  };

  componentDidMount() {
    if (this.props.focus) {
      this.focus();
    }
  }

  componentWillUpdate(nextProps) {
    if (!_isEqual(nextProps.value, this.props.value) || !_isEqual(_get(nextProps.options, 'length'), _get(this.props.options, 'length'))) {
      this.reposition = true;
    }
  }

  componentDidUpdate() {
    const that = this;

    that.opened && that.reposition && that.onRepositionMenu();
    that.reposition = false;

    if (that.props.focus) {
      that.focus();
    }
  }

  render() {
    const that = this,
      props = that.props,
      selectComponents = {
        optionComponent: props.optionComponent || SelectDefaultOption
      };

    if (props.isMulti) {
      selectComponents.valueComponent = props.valueComponent || SelectDefaultValue;
    }

    return (
      <SelectPlus {...props} {...selectComponents}
        multi={props.isMulti}
        ref="select"
        onOpen={that.onOpenMenu}
        onClose={that.onCloseMenu}
        onInputChange={that.onInputChange}
        openOnFocus={true}
        escapeClearsValue={false}
        scrollMenuIntoView={false}
        style={{...props.style, ...SELECT_CONTROL_STYLE}}
        menuContainerStyle={that.state.menuStyle}
      />
    );
  }

  onOpenMenu = (arg) => {
    const that = this,
      onOpen = that.props.onOpen;

    _isFunction(onOpen) && onOpen(arg);

    that.reposition = true;
    that.closed = false;
    that.opened = true;
    that.onRepositionMenu();
  };

  onRepositionMenu = () => {
    let selectRect, menuRect;
    const that = this,
      selectInstance = that.refs.select,
      selectEl = ReactDOM.findDOMNode(selectInstance),
      menuEl = selectInstance.menuContainer,
      menuStyle = { ...that.state.menuStyle };

    if (selectEl && menuEl) {
      selectRect = selectEl.getBoundingClientRect();
      menuRect = menuEl.getBoundingClientRect();

      (selectRect.top + selectRect.height + menuRect.height < that.props.viewport.height)
        ? (menuStyle.top = selectRect.height + BREATHING_SPACE)
        : (menuStyle.top = -menuRect.height - BREATHING_SPACE);
    }

    if ((menuRect && menuRect.top !== 0) || that.closed) {
      that.reposition = false;
    }

    that.setState({ menuStyle });
  };

  onCloseMenu = (arg) => {
    const onClose = this.props.onClose;

    _isFunction(onClose) && onClose(arg);
    this.closed = true;
  };

  onInputChange = (arg) => {
    const onInputChange = this.props.onInputChange;

    _isFunction(onInputChange) && onInputChange(arg);
    this.reposition = true;
  };

  focus = () => {
    const selectInstance = this.refs.select;
    selectInstance && selectInstance.focus();
  };
}

export default Select;
