/**
 * Created by Ajay on 25/06/17.
 */

import React from 'react';
import PropTypes from 'prop-types';
import {
  map as _map,
  difference as _difference,
  get as _get,
  isEqual as _isEqual,
  debounce as _debounce,
  isEmpty as _isEmpty,
  uniqWith as _uniqWith,
  isObject as _isObject,
  noop as _noop,
  find as _find,
} from 'lodash';

import Select from '../Select';

import lookupApiUtils from '../../../../utils/lookupApiUtils';
import requestBuilders  from '../../../utils/requestBuilders';

const
  NO_RESULTS_TEXT = 'No results found.',
  SEARCH_TEXT = 'Start typing to select...',
  LOADING_TEXT = 'Loading...',
  EMPTY_ARRAY = [],

  parseResolvedData = (valueObject, isMulti) => {
    let valueIds;
    const value = valueObject;

    if (isMulti) {
      valueIds = _map(valueObject, (obj) => obj.value);
    } else {
      !_isEmpty(valueObject) && (valueIds = [valueObject[0].value]);
    }

    return {
      valueIds,
      value,
    };
  };

class LookupField extends React.PureComponent {

  static propTypes = {
    value: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.string,
    ]),
    type: PropTypes.string,
    className: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    isMulti: PropTypes.bool,
    fieldId: PropTypes.string.isRequired,
    isPaginated: PropTypes.bool,
    filters: PropTypes.array,
    placeholder: PropTypes.string,
    tabIndex: PropTypes.string,
    /**
     * If you want to explicitly provide the values instead of valueID's set skipResolve => true.
     * the Value then should be in the format of an array of objects in case of multi-select and an object in case of single-select.
     * Multi-select => value=[{id:'',label:''},...{id:'',label:''}]
     * Single-select => value={id:'',label:''}
     */
    skipResolve: PropTypes.bool,
    onInputChange: PropTypes.func,
  };

  static defaultProps = {
    value: EMPTY_ARRAY,
    isMulti: false,
    isPaginated: true,
    filters: EMPTY_ARRAY,
    skipResolve: false,
    onInputChange: _noop,
    options: EMPTY_ARRAY,
  };

  constructor(props) {
    super(props);
    this.page = 0;
    this.hasMoreOptions = true;
    this.fetchInputOptions = _debounce(this.fetchInputOptions, 500);
    this.state = {
      options: EMPTY_ARRAY,
      value: EMPTY_ARRAY,
      valueIds: EMPTY_ARRAY,
      query: '',
      isLoading: false,
      outerMenuText: LOADING_TEXT,
    };
  }

  componentDidMount() {
    const props = this.props,
      value = props.value;

    if (props.skipResolve) {
      const resolvedData = parseResolvedData(value, props.isMulti);

      this.setState({
        value: resolvedData.value,
        valueIds: resolvedData.valueIds,
      });
    } else {
      this.lookupById(value);
    }
  }

  componentWillReceiveProps(nextProps) {
    const that = this,
      valueIds = that.state.valueIds,
      nextValues = nextProps.value;

    if (!that.props.skipResolve) {
      !_isEmpty(_difference(nextValues, valueIds)) && that.lookupById(nextValues);
    } else {
      const resolvedData = parseResolvedData(nextValues, nextProps.isMulti);

      !_isEmpty(_difference(resolvedData.valueIds, valueIds)) && that.setState({
        value: resolvedData.value,
        valueIds: resolvedData.valueIds,
      });
    }
  }

  render() {
    return (
      <Select {...this.getRenderProps()} />
    );
  };

  onInputChange = (inputValue) => {
    this.props.onInputChange(inputValue);
    this.setState({ query: inputValue }, this.fetchInputOptions);
  };

  onValueChange = (valueArray) => {
    const props = this.props;
    let valueIds, value;

    if (props.isMulti) {
      valueIds = _map(valueArray, (object) => object.value);
      value = valueArray;
    } else {
      valueIds = !(_isEmpty(valueArray)) ? [valueArray.value] : EMPTY_ARRAY;
      value = valueArray ? [valueArray] : [];
    }

    this.setState({
      value,
      valueIds,
    }, () => props.onChange({
      value,
      valueIds,
    }, props.fieldId));
  };

  onScrollHandler = () => {
    const that = this;

    if (!that.hasMoreOptions) {
      return null;
    }

    if (!that.state.isLoading) {
      that.setState({ isLoading: true });

      that.page = that.page + 1;
      that.lookupByFieldType(that.page);
    }
  };

  fetchInputOptions = () => {
    this.lookupByFieldType(0);
  };

  lookupByFieldType = (page) => {
    const that = this,
      props = that.props,
      state = that.state,
      requestParams = {
        filters: props.filters,
        lookupType: props.type,
        pageObject: { page },
        query: state.query,
        additional: props.additional,
      };

    lookupApiUtils.lookupByDimension(requestBuilders.lookupRequestBuilder.dimensionsLookup(requestParams))
      .then(result => {
        const responseObject = _get(result.data, props.type),
          options = responseObject.result.map((option = {}) => Object.assign({}, option, {
            label: option.label,
            value: option.key,
          })),
          combinedOptions = _uniqWith([...state.options, ...options], _isEqual),
          isEmptyOptions = _isEmpty(options);

        that.hasMoreOptions = responseObject.hasMore;
        that.setState({
          options: combinedOptions,
          isLoading: false,
          outerMenuText: isEmptyOptions ? (state.query ? NO_RESULTS_TEXT : SEARCH_TEXT) : LOADING_TEXT
        });
      })
      .catch(() => {
        that.setState({
          isLoading: false,
          outerMenuText: NO_RESULTS_TEXT,
        });
      });
  };

  lookupById = (valueIds) => {
    const type = this.props.type;

    let values,
      resValueIds,
      resValue;

    if (_isEmpty(valueIds)) {
      this.setState({
        value: [],
        valueIds: [],
      });
      return null;
    }

    lookupApiUtils.lookupById(requestBuilders.lookupRequestBuilder.idLookup(type, valueIds))
      .then(({data: valuesObject}) => {
        values = Object.keys(valuesObject).map(id => {
          _isObject(valuesObject[id]) ? (resValue = { ...valuesObject[id] }) : (resValue = {
            id,
            name: valuesObject[id],
          });
          return resValue;
        }).map((option = {}) => Object.assign({}, option, {
            label: option.label,
            value: option.key,
          })
        );

        resValueIds = _map(values, (obj) => obj.value + '');

        this.setState({
          value: values,
          valueIds: resValueIds,
        });
      });
  };

  loadOnFocus = () => {
    if (_isEmpty(this.state.options)) {
      this.setState({
        isLoading: true,
        outerMenuText: SEARCH_TEXT,
      });
      this.lookupByFieldType(0);
    }
  };

  getRenderProps = () => {
    const that = this,
      {props, state} = that,
      {options, value} = state,
      renderProps = { ...props };

    if (props.isMulti) {
      renderProps.multi = true;
      renderProps.value = value;
    } else {
      renderProps.value = value[0];
    }

    renderProps.optionComponent = props.optionComponent;
    renderProps.valueComponent = props.valueComponent;

    if (props.isPaginated) {
      renderProps.onFocus = that.loadOnFocus;
      renderProps.isLoading = state.isLoading;
      renderProps.onMenuScrollToBottom = that.onScrollHandler;
    }

    Object.assign(renderProps, {
      //TODO: hack for double value in dynamic picklist - props.options will be supplied only by dynamic picklist for now which will be just a simple option according to user entered query
      options: _find(options, props.options[0]) ? options : [...props.options, ...options],
      onChange: that.onValueChange,
      clearable: true,
      onInputChange: that.onInputChange,
      noResultsText: state.outerMenuText,
      renderInvalidValues: true,
    });

    return renderProps;
  };
}

export default LookupField;
