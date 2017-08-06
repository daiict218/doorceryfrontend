import React from 'react';            //todo: it will be in use when we'll have spr-svg-loader
import PropTypes from 'prop-types';
import classnames from 'classnames';

const Icon = ({
  name,
  className,
  ...props,
  }) => (
  <svg role="icon"
    className={classnames('icon', className)}
    {...props}
  >
    <use xlinkHref={`#${__iconPrefix__}-${name}`}/>
  </svg>
);

Icon.propTypes = {
  name: PropTypes.string,
  className: PropTypes.string,
  prefix: PropTypes.string,
};

export default Icon;
