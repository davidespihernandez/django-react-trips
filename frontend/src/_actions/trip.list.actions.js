import { tripListConstants } from '../_constants';
import { tripListService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';

export const tripListActions = {
    create,
    get,
};

function create(trip) {
    return dispatch => {
        dispatch(request(trip));

        tripListService.create(trip)
            .then(
                trip => {
                    dispatch(success());
                    history.push('/trips');
                    dispatch(alertActions.success('Trip created successfully'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(trip) { return { type: tripListConstants.CREATE_TRIP_REQUEST, trip } }
    function success(trip) { return { type: tripListConstants.CREATE_TRIP_SUCCESS, trip } }
    function failure(error) { return { type: tripListConstants.CREATE_TRIP_FAILURE, error } }
}

function get(filter) {
    return dispatch => {
        dispatch(request());

        tripListService.get(filter)
            .then(
                tripList => dispatch(success(tripList)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: tripListConstants.GET_TRIP_LIST_REQUEST } }
    function success(tripList) { return { type: tripListConstants.GET_TRIP_LIST_SUCCESS, tripList } }
    function failure(error) { return { type: tripListConstants.GET_TRIP_LIST_FAILURE, error } }
}

