import { tripDetailConstants } from '../_constants';
import { tripDetailService } from '../_services';
import { alertActions } from './';
import {history} from "../_helpers";

export const tripDetailActions = {
    get,
    update,
    delete: _delete
};

function update(trip) {
    return dispatch => {
        dispatch(request(trip));

        tripDetailService.update(trip)
            .then(
                trip => {
                    dispatch(success(trip));
                    history.push('/trips');
                    dispatch(alertActions.success('Trip info updated'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(trip) { return { type: tripDetailConstants.UPDATE_TRIP_REQUEST, trip } }
    function success(trip) { return { type: tripDetailConstants.UPDATE_TRIP_SUCCESS, trip } }
    function failure(error) { return { type: tripDetailConstants.UPDATE_TRIP_FAILURE, error } }
}

function get(id) {
    return dispatch => {
        dispatch(request(id));

        tripDetailService.get(id)
            .then(
                users => dispatch(success(users)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request(id) { return { type: tripDetailConstants.GET_TRIP_REQUEST, id } }
    function success(trip) { return { type: tripDetailConstants.GET_TRIP_SUCCESS, trip } }
    function failure(error) { return { type: tripDetailConstants.GET_TRIP_FAILURE, error } }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    return dispatch => {
        dispatch(request(id));

        tripDetailService.delete(id)
            .then(
                () => {
                    dispatch(success(id));
                    history.push('/trips');
                    dispatch(alertActions.success('Trip deleted'));
                },
                error => dispatch(failure(id, error.toString()))
            );
    };

    function request(id) { return { type: tripDetailConstants.DELETE_TRIP_REQUEST, id } }
    function success(id) { return { type: tripDetailConstants.DELETE_TRIP_SUCCESS, id } }
    function failure(id, error) { return { type: tripDetailConstants.DELETE_TRIP_FAILURE, id, error } }
}