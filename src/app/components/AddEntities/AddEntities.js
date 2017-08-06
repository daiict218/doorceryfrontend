import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import update from 'immutability-helper';
import {
  isUndefined as _isUndefined,
} from 'lodash';

import FIELD_TYPES from '../../constants/fieldTypes';
import LOOKUP_TYPES from '../../constants/lookupTypes';
import entityTypes from '../../constants/entityTypes';
import formField  from '../../common/formField';

import entityUtils from '../../../utils/entityUtils';

const CATEGORY_NAME_FIELD = {
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

class AddEntities extends React.Component {
  static propTypes = {
    router: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      fieldValueMap: {
        categoryName: '',
        subCategoryName: '',
      },
      fieldValidationMap: {},
    };
  }

  onAddCategory = () => {
    const fieldValueMap = this.state.fieldValueMap;

    if (fieldValueMap.categoryName) {
      entityUtils.addEntity({
        entityType: entityTypes.Category.name,
        entity: { name: fieldValueMap.categoryName },
      }).then(() => {
        this.props.router.push('/admin/addentities/added');
      });
    }
  };

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

  renderCategoryAdder() {
    return (
      <div>
        <div>{'Category Name'}</div>
        {formField.getFormField(CATEGORY_NAME_FIELD, {
          onChange: this.onChange,
        })}
        <button onClick={this.onAddCategory}>{'Add Category'}</button>
      </div>
    );
  }

  renderSubCategoryAdder() {
    return (
      <div>
        <div>{'Sub Category Name'}</div>
        {formField.getFormField(SUB_CATEGORY_NAME_FIELD, {
          onChange: this.onChange,
        })}
        {formField.getFormField(SUB_CATEGORY_CATEGORY_OPTIONS_FIELD, {
          onChange: this.onChange,
        })}
        <div>{'Add Sub Category'}</div>
      </div>
    );
  }

  renderItemAdder() {
    return (
      <div>
        <div>{'Items'}</div>
        <div>{'Add items'}</div>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderCategoryAdder()}
        {this.renderSubCategoryAdder()}
        {this.renderItemAdder()}
        {'Hello World'}
      </div>
    );
  }
}

export default withRouter(AddEntities);