import entityUtils from '../utils/entityUtils';

export default {
  fetchEntities: (type) => {
    return (dispatch) => {
      entityUtils.fetchEntities(type)
        .then(({data}) => {
          dispatch({ type: 'FETCH_ENTITIES', data: data });
        });
    };
  }
};
