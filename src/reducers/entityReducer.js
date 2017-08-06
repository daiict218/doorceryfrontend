const INITIAL_STATE = {
  entities: []
};

export default function (state = INITIAL_STATE, action) {
  const entitiesState = Object.assign({}, state),
    payload = action.data;

  switch (action.type) {
    case 'FETCH_ENTITIES':
      entitiesState.entities = payload;
      break;

    default:
      return state;
  }

  return entitiesState;
};
