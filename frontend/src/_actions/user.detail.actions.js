import { userDetailConstants } from '../_constants';
import { userDetailService } from '../_services';
import { alertActions } from './';
import {history} from "../_helpers";

export const userDetailActions = {
    get,
    update,
    delete: _delete
};

function update(user) {
    return dispatch => {
        dispatch(request(user));

        userDetailService.update(user)
            .then(
                user => {
                    dispatch(success(user));
                    history.push('/users');
                    dispatch(alertActions.success('User info updated'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(user) { return { type: userDetailConstants.UPDATE_USER_REQUEST, user } }
    function success(user) { return { type: userDetailConstants.UPDATE_USER_SUCCESS, user } }
    function failure(error) { return { type: userDetailConstants.UPDATE_USER_FAILURE, error } }
}

function get(id) {
    return dispatch => {
        dispatch(request(id));

        userDetailService.get(id)
            .then(
                users => dispatch(success(users)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request(id) { return { type: userDetailConstants.GET_USER_REQUEST, id } }
    function success(user) { return { type: userDetailConstants.GET_USER_SUCCESS, user } }
    function failure(error) { return { type: userDetailConstants.GET_USER_FAILURE, error } }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    return dispatch => {
        dispatch(request(id));

        userDetailService.delete(id)
            .then(
                () => {
                    dispatch(success(id));
                    history.push('/users');
                    dispatch(alertActions.success('User deleted'));
                },
                error => dispatch(failure(id, error.toString()))
            );
    };

    function request(id) { return { type: userDetailConstants.DELETE_USER_REQUEST, id } }
    function success(id) { return { type: userDetailConstants.DELETE_USER_SUCCESS, id } }
    function failure(id, error) { return { type: userDetailConstants.DELETE_USER_FAILURE, id, error } }
}