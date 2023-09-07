const info = (state = {}, action) => {
    switch (action.type) {
        case 'SET_INFO':
            return action.payload;
        case 'UNSET_INFO':
            return {}; // Return the default state when 'UNSET_INFO' is dispatched
        default:
            return state;
    }
};

export default info;
