import { combineReducers } from 'redux';

const info = (state = {}, action) => {
    switch (action.type) {
        case 'SET_INFO':
            return action.payload;
    }
    return state;
}

export default combineReducers({
    info
});