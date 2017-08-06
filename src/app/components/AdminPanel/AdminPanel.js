import React from 'react';
import {connect} from 'react-redux';
import {
  partial as _partial,
  isUndefined as _isUndefined,
} from 'lodash';
import update from 'immutability-helper';

import Modal from '../../common/Modal';
import SnackBar from '../../common/SnackBar';

import withStyles from '../../decorators/withStyles';
import styles from './adminPanel.scss';

import appActions from '../../../actions/appActions';
import FIELD_TYPES from '../../constants/fieldTypes';
import ALERT_TYPES from '../../constants/alertTypes';
import LOOKUP_TYPES from '../../constants/lookupTypes';
import ENTITY_TYPES from '../../constants/entityTypes';
import formField  from '../../common/formField';
import entityUtils from '../../../utils/entityUtils';

const SUBMIT_LABEL = 'Add',
  CATEGORY_NAME_FIELD = {
    id: 'categoryName',
    placeholder: 'Add Category Name',
    type: FIELD_TYPES.TEXT.type,
  },
  SUB_CATEGORY_NAME_FIELD = {
    id: 'subCategoryName',
    placeholder: 'Add SubCategory Name',
    type: FIELD_TYPES.TEXT.type,
  },
  SUB_CATEGORY_CATEGORY_OPTIONS_FIELD = {
    id: 'subCategoryOptions',
    type: FIELD_TYPES.LOOKUP_FIELD.type,
    lookupType: LOOKUP_TYPES.CATEGORY.type,
  };

class AdminPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      showSnackBar: false,
      entityType: '',
      fieldValueMap: {
        categoryName: '',
        subCategoryName: '',
      },
      fieldValidationMap: {},
    };
  }

  onAddEntityClick = (entityType) => this.setState({ showModal: true, entityType });

  onCancel = () => this.setState({ showModal: false });

  onChange = (fieldValue, fieldId, validationObject) => {
    const { state } = this;

    this.setState({
      fieldValidationMap: update(state.fieldValidationMap, {
        $merge: {
          [fieldId]: { ...validationObject },
        },
      }),
      fieldValueMap: update(state.fieldValueMap, {
        $merge: {
          [fieldId]: _isUndefined(fieldValue) ? '' : fieldValue,
        },
      }),
    });
  };

  onAddEntity = () => {
    const {state} = this,
      fieldValueMap = state.fieldValueMap;

    switch (state.entityType) {
      case ENTITY_TYPES.category.type:

        if (fieldValueMap.categoryName) {
          entityUtils.addEntity({
            entityType: ENTITY_TYPES.category.name,
            entity: { name: fieldValueMap.categoryName },
          }).then(() => {
            this.props.showAlert('Entity added successfully', ALERT_TYPES.SUCCESS.type);
            this.setState({ showModal: false, showSnackBar: true });
          });
        }
        break;

      default:
        return null;
    }
  };

  renderAddEntityForm() {
    const that = this;

    switch (this.state.entityType) {
      case ENTITY_TYPES.category.type:
        return (
          <div className={'px-5 py-5'}>
            <div className={'pb-4'}>{'Category Name'}</div>
            {formField.getFormField(CATEGORY_NAME_FIELD, { onChange: that.onChange })}
          </div>
        );

      default:
        return null;
    }
  }

  render() {
    const that = this,
      {state} = that;

    return (
      <section>
        {state.showModal && (
          <Modal
            onSubmit={this.onAddEntity}
            showModal={state.showModal}
            headerLabel={`ADD ${ENTITY_TYPES[state.entityType].name}`}
            submitLabel={SUBMIT_LABEL}
            onCancel={that.onCancel}
            onHide={that.onCancel}
            className={styles.modal}
          >
            {that.renderAddEntityForm(state.entityType)}
          </Modal>
        )}

        <div className={styles.header}>
          {'Doorcery'}
        </div>
        <div className={'container mt-4 mb-4'}>
          <div className={'row'}>
            <div className={'col-xs-12 col-md-12 col-sm-12 col-xl-4 col-lg-4 justify-content-center d-flex'}>
              <button
                className={'primaryButton'}
                onClick={_partial(that.onAddEntityClick, ENTITY_TYPES.category.type)}
                data-id={'categories'}
              >
                {'Add Category'}
              </button>
            </div>
            <div className={'col-xs-12 col-md-12 col-sm-12 col-xl-4 col-lg-4 justify-content-center d-flex'}>
              <button
                className={'primaryButton'}
                onClick={_partial(that.onAddEntityClick, ENTITY_TYPES.subcategory.type)}
              >
                {'Add Sub Category'}
              </button>
            </div>
            <div className={'col-xs-12 col-md-12 col-sm-12 col-xl-4 col-lg-4 justify-content-center d-flex'}>
              <button
                className={'primaryButton'}
                onClick={_partial(that.onAddEntityClick, ENTITY_TYPES.items.type)}
              >
                {'Add Item'}
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default withStyles(connect(undefined, {
  showAlert: appActions.showAlert,
})(AdminPanel), styles);
