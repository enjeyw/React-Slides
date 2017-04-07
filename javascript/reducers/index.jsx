import { combineReducers } from 'redux';

// Reducers
import slideReducer from './slide-reducer';

// Combine Reducers
var reducers = combineReducers({
    slidState: slideReducer
});

export default reducers;