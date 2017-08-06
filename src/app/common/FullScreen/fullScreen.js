import React, { PropTypes } from 'react';
import { noop as _noop } from 'lodash';

import FullPageForm from '../FullPageForm';

class FullScreen extends React.Component {

  static propTypes = {
    onClose: PropTypes.func,
    containerProps: PropTypes.object,
    header: PropTypes.node,
    body: PropTypes.node.isRequired,
    footer: PropTypes.node,
    headerProps: PropTypes.object,
    bodyProps: PropTypes.object,
    footerProps: PropTypes.object,
  };

  static defaultProps = {
    onClose: _noop,
  };

  componentWillMount() {
    document.addEventListener('keydown', this.onEscape);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onEscape);
  }

  onEscape = (event) => {
    if (event.keyCode === 27) {
      event.preventDefault();
      this.props.onClose();
    }
  };

  render() {
    const props = this.props;

    return (
      <FullPageForm onHide={props.onClose} {...props.containerProps}>
        {!!props.header && (
          <FullPageForm.Header {...props.headerProps}>
            {props.header}
          </FullPageForm.Header>
        )}

        <FullPageForm.Body {...props.bodyProps}>
          {props.body}
        </FullPageForm.Body>

        {!!props.footer && (
          <FullPageForm.Footer {...props.footerProps}>
            {props.footer}
          </FullPageForm.Footer>
        )}
      </FullPageForm>
    );
  }
}

export default FullScreen;
