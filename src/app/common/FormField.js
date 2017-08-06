/**
 * Created by Ajay on 25/06/17.
 */

import React from 'react';    // eslint-disable-line no-unused-vars
import cx from 'classnames';
import {
  partial as _partial,
  noop as _noop,
} from 'lodash';

import FIELD_TYPES from '../constants/fieldTypes';
import validatorUtils from '../utils/validatorUtils';

import LookupField from './formComponents/LookupField';

const
  EMPTY_READ_ONLY_OBJ = {},

  getErrorMarkup = (field) => field.hasError && <span className="errorText">{field.errorText}</span>,

  onFieldChange = (value, field, callBack, skipValidation) => {
    const validationObject = !skipValidation ? validatorUtils.validateField(field.validators, value, field) : {};
    callBack(value, field.id, validationObject);
  },

  focusInput = (focus, instance) => instance && focus && instance.focus(),

  TYPE_TO_GENERATOR = {

    [FIELD_TYPES.TEXT.type]: (field, params) => (
      <div className="full-width">
        <input
          {...field}
          {...params}
          type="text"
          ref={_partial(focusInput, params.focus)}
          onChange={(event) => {onFieldChange(event.target.value, field, params.onChange);}}
          className={cx((field.isDisabled || params.isDisabled) ? 'isDisabledField' : '', field.hasError ? 'hasError form-control' : 'form-control', params.className)}
        />
        {getErrorMarkup(field)}
      </div>
    ),

    /**
     * Lookup field will call onChange with value = {value, valueIds}
     */
    [FIELD_TYPES.LOOKUP_FIELD.type]: (field, params) => (
      <div className="full-width">
        <LookupField {...field} {...params}
          type={field.lookupType}
          fieldId={field.id}
          className={cx((field.isDisabled || params.isDisabled) ? 'isDisabledField' : '', field.hasError ? 'hasError form-control' : 'form-control', params.className)}
          onClose={params.onClose || _noop}
          onOpen={params.onOpen || _noop}
          onChange={(values) => {onFieldChange(values, field, params.onChange);}}
          isPaginated
        />
        {getErrorMarkup(field)}
      </div>
    ),
  };

export default {
  getFormField: (field, params = EMPTY_READ_ONLY_OBJ) => {
    let type;

    if (!field || !(type = field.type)) {
      return null;
    }

    const generator = TYPE_TO_GENERATOR[type];
    return generator && generator(field, params);
  },
};
