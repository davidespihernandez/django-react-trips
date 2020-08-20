import { userDetailConstants } from '../_constants';

export function userDetail(state = {}, action) {
  switch (action.type) {
    case userDetailConstants.GET_USER_REQUEST:
      return {
        loading: true,
        id: action.id,
      };
    case userDetailConstants.GET_USER_SUCCESS:
      return {
        user: action.user
      };
    case userDetailConstants.GET_USER_FAILURE:
      return { 
        error: action.error
      };

    case userDetailConstants.UPDATE_USER_REQUEST:
      return {
        updating: true
      };
    case userDetailConstants.UPDATE_USER_SUCCESS:
      return {
        user: action.user
      };
    case userDetailConstants.UPDATE_USER_FAILURE:
      return {
        error: action.error
      };

    case userDetailConstants.DELETE_USER_REQUEST:
      return {
        deleting: true
      };
    case userDetailConstants.DELETE_USER_SUCCESS:
      return {};
    case userDetailConstants.DELETE_USER_FAILURE:
      return {
        error: action.error
      };
    default:
      return state
  }
}