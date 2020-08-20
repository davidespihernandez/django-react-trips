import { tripDetailConstants } from '../_constants';

export function tripDetail(state = {}, action) {
  switch (action.type) {
    case tripDetailConstants.GET_TRIP_REQUEST:
      return {
        loading: true,
        id: action.id,
      };
    case tripDetailConstants.GET_TRIP_SUCCESS:
      return {
        trip: action.trip
      };
    case tripDetailConstants.GET_TRIP_FAILURE:
      return { 
        error: action.error
      };

    case tripDetailConstants.UPDATE_TRIP_REQUEST:
      return {
        updating: true
      };
    case tripDetailConstants.UPDATE_TRIP_SUCCESS:
      return {
        trip: action.trip
      };
    case tripDetailConstants.UPDATE_TRIP_FAILURE:
      return {
        error: action.error
      };

    case tripDetailConstants.DELETE_TRIP_REQUEST:
      return {
        deleting: true
      };
    case tripDetailConstants.DELETE_TRIP_SUCCESS:
      return {};
    case tripDetailConstants.DELETE_TRIP_FAILURE:
      return {
        error: action.error
      };
    default:
      return state
  }
}