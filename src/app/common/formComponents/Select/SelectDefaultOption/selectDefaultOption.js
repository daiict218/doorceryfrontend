import React from 'react';
import classNames from 'classnames';
import { get as _get } from 'lodash';

import withStyles from '../../../../decorators/withStyles';
import styles from './selectDefaultOption.scss';

class SelectOption extends React.Component {
  onClick = (event) => {
    event.stopPropagation();
    this.props.onSelect(this.props.option, event);
  };

  render() {
    const props = this.props,

      className = classNames(styles.wrapper, {
        [styles.isFocused]: props.isFocused,
      });

    return (
      <div
        title={_get(props.option, 'title', '')}
        className={className}
        onClick={this.onClick}
      >
        <div className={styles.content}>
          {props.children}
        </div>
      </div>
    );
  }
}

export default withStyles(SelectOption, styles);
