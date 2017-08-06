import { combineReducers } from 'redux';

import { routerReducer as routing } from 'react-router-redux';
import entitiesState from './entityReducer';
import appState from './appReducer';

export default combineReducers({
  routing,
  entitiesState,
  appState,
});
