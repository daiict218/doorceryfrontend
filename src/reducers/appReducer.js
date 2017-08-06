export default (state = {}, action)  => {
  const appState = Object.assign({}, state),
    payload = action.data;

  switch (action.type) {
    case 'showAlert':
      appState.alert = payload;
      break;

    case 'hideAlert':
      appState.alert = null;
      break;

    case 'resizeWindow':
      appState.dimensions = payload;
      break;

    default:
      return state;
  }

  return appState;
};
