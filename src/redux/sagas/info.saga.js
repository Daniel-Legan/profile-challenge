import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

function* addInfo(action) {
    try {
        const { avatar, firstName, lastName } = action.payload;

        const formData = new FormData();
        formData.append('image', avatar);
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);

        // Send the formData to the server using a POST request
        yield axios.post('/api/profile', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        yield put({ type: 'FETCH_INFO' });
    } catch (error) {
        console.log(error);
    }
}


function* fetchInfo() {
    try {
        const response = yield axios.get(`/api/profile/`);
        yield put({
            type: 'SET_INFO',
            payload: response.data
        });
    } catch (error) {
        console.log(error);
    }
}

function* editInfo(action) {
    try {
        const { id, avatar, firstName, lastName } = action.payload;

        const formData = new FormData();
        formData.append('image', avatar);
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);

        // Send the formData to the server using a PUT request
        yield axios.put(`/api/profile/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        yield put({ type: 'FETCH_INFO' });
    } catch (error) {
        console.log(error);
    }
}

function* infoSaga() {
    yield takeLatest('ADD_INFO', addInfo);
    yield takeLatest('FETCH_INFO', fetchInfo);
    yield takeLatest('EDIT_INFO', editInfo);
}

export default infoSaga;