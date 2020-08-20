import { userListConstants } from '../_constants';
import { userListService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';

export const userListActions = {
    create,
    get,
};

function create(user) {
    return dispatch => {
        dispatch(request(user));

        userListService.create(user)
            .then(
                user => { 
                    dispatch(success());
                    history.push('/users');
                    dispatch(alertActions.success('User created'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(user) { return { type: userListConstants.CREATE_USER_REQUEST, user } }
    function success(user) { return { type: userListConstants.CREATE_USER_SUCCESS, user } }
    function failure(error) { return { type: userListConstants.CREATE_USER_FAILURE, error } }
}

function get(filter) {
    return dispatch => {
        dispatch(request());

        userListService.get(filter)
            .then(
                userList => dispatch(success(userList)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: userListConstants.GET_USER_LIST_REQUEST } }
    function success(userList) { return { type: userListConstants.GET_USER_LIST_SUCCESS, userList } }
    function failure(error) { return { type: userListConstants.GET_USER_LIST_FAILURE, error } }
}
