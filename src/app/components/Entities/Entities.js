import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import FullScreen from '../../common/FullScreen';

import entityActions  from '../../../actions/entityActions';

const ENTITY_TYPES = {
  categories: 'Category',
  subcategories: 'SubCategory',
  items: 'Items',
};

class Entities extends React.Component {
  static propTypes = {
    location: PropTypes.object,
    fetchEntities: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      entityType: this.props.location.pathname.split('/').pop(),
      showAddEntityForm: false,
    };
  }

  componentDidMount() {
    this.props.fetchEntities(ENTITY_TYPES[this.state.entityType]);
  }

  onAddEntity = () => {
    this.setState({ showAddEntityForm: true });
  };

  onCancel = () => {
    this.setState({ showAddEntityForm: false });
  };

  renderHeader() {
    return (
      <div>
        <button onClick={this.onAddEntity}>
          {`Add ${ENTITY_TYPES[this.state.entityType]}`}
        </button>
      </div>
    );
  }

  renderBody() {
    return (
      <div>
        {'Hello World'}
      </div>
    );
  }

  renderFooter() {
    return (
      <div>
        {'Render from footer'}
      </div>
    );
  }

  render() {
    const that = this;

    return (
      <div>
        {that.renderHeader()}
        {that.state.showAddEntityForm && (
          <FullScreen
            body={that.renderBody()}
            footer={that.renderFooter()}
            bodyProps={{className: 'fullPageBody'}}
            onClose={that.onCancel}
            show={that.state.showAddEntityForm}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = ({entitiesState}) => ({
  entities: entitiesState.entities,
});

const mapDispatchToProps = () => ({
  fetchEntities: entityActions.fetchEntities,
});

export default connect(mapStateToProps, mapDispatchToProps)(Entities);
