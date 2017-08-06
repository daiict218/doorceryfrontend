/**
 * Created by Ajay Gaur on 25/06/17.
 */

import {
  isEmpty as _isEmpty,
  isNaN as _isNaN,
  isArray as _isArray,
  isNumber as _isNumber,
  get as _get,
} from 'lodash';

const validators = {

  MANDATORY: (value) => {
    if (!_isEmpty(value) || _isNumber(value)) {
      return {
        hasError: false,
      };
    }

    return {
      hasError: true,
      errorText: 'Field cannot be empty',
    };
  },

  NUMERIC: (value) => {
    if (!_isNaN(+value) || !value) {
      return {hasError: false};
    }
    return {
      hasError: true,
      errorText: 'Field accepts only numeric characters',
    };
  },

  EMAIL: (value) => {
    const emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (emailReg(value)) {
      return {hasError: false};
    }
    return {
      hasError: true,
      errorText: 'Please enter a valid email address',
    };
  },

  //accepts a file and extension against which we need to validate the file
  FILE: (value, field) => {
    const fileName = _isArray(value) ? _get(value[0], 'name') : _get(value, 'name');
    if (fileName && fileName.split('.').pop() !== field.fileExtension) {
      return {
        hasError: true,
        errorText: `Please upload a .${field.fileExtension} file`,
      };
    }
    return {hasError: false};
  },

  START_DATE_VALIDATOR: (valueObject, field) => {
    const startDate = _get(valueObject, 'startDate');

    if (startDate < field.minDate) {
      return {
        hasError: true,
        errorText: 'Start date cannot be less then today',
      };
    }

    return {hasError: false};
  },

  END_DATE_VALIDATOR: (valueObject) => {
    const endDate = _get(valueObject, 'endDate');

    if (!endDate) {
      return {
        hasError: true,
        errorText: 'Please select an end date',
      };
    }

    return {hasError: false};
  },

  START_END_DATE_VALIDATOR: (valueObject) => {
    if (_get(valueObject, 'startDate') > _get(valueObject, 'endDate')) {
      return {
        hasError: true,
        errorText: 'Start date cannot be greater then end date',
      };
    }

    return {hasError: false};
  },
};

export default {
  ...validators,
};
