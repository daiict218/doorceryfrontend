/**
 * Created by ajaygaur on 17/06/17.
 */

import React from 'react';
import {
  pure,
} from 'recompose';
import classnames from 'classnames';
import s from '../FormContainer/FormContainer.scss';

export default pure(({ className, children, ...restProps }) => {
  return (
    <div {...restProps} className={classnames(s.formBody, className)}>
      {children}
    </div>
  );
});