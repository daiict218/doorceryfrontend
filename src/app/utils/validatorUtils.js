/**
 * Created by Ajay Gaur on 25/06/17.
 */

import _ from 'lodash';
import Validators from './validators.js';

let U;

const validateForm = (fields, fieldIdToValueMapping) => {
  const validatedFormConfig = {};
  let hasError = false;

  _.forEach(fields, (field, fieldId) => {
    if (!field.isDisabled) {
      validatedFormConfig[fieldId] = validateField(field.validators, fieldIdToValueMapping[fieldId], field);
      if (validatedFormConfig[fieldId].hasError) {
        hasError = true;
      }
    }
  });
  //return the validated form config
  return {
    validatedFormConfig,
    hasError
  };
};

/*
 Custom function can also be provided as validators.
 Custom function should return an object having 2 fields {hasError: '', errorText: ''}
 */

const validateField = (fieldValidators, fieldValue, field) => {
  if (field.isDisabled) {
    return {
      hasError: false,
      errorText: U
    };
  }
  let validationResult = {};

  _.forEach(fieldValidators, (validatorTypeOrMethod) => {
    let result = _.isFunction(validatorTypeOrMethod) && validatorTypeOrMethod(fieldValue, field);

    validatorTypeOrMethod = Validators[validatorTypeOrMethod];

    if (validatorTypeOrMethod) {
      result = validatorTypeOrMethod(fieldValue, field);
    }

    if (result.hasError) {
      validationResult = result;
      return false;
    }
  });

  if (!validationResult.hasError) {
    validationResult = {
      hasError: false,
      errorText: U,
    };
  }
  return validationResult;
};

export default {
  validateForm,
  validateField,
};
