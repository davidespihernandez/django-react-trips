import { tripListConstants } from '../_constants';

export function tripList(state = {}, action) {
  switch (action.type) {
    case tripListConstants.GET_TRIP_LIST_REQUEST:
      return {
        loading: true
      };
    case tripListConstants.GET_TRIP_LIST_SUCCESS:
      return {
        list: action.tripList
      };
    case tripListConstants.GET_TRIP_LIST_FAILURE:
      return { 
        error: action.error
      };

    case tripListConstants.CREATE_TRIP_REQUEST:
      return {
        creating: true
      };
    case tripListConstants.CREATE_TRIP_SUCCESS:
      return {
        trip: action.trip
      };
    case tripListConstants.CREATE_TRIP_FAILURE:
      return {
        error: action.error
      };

    default:
      return state
  }
}