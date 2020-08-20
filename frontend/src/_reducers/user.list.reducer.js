import { userListConstants } from '../_constants';

export function userList(state = {}, action) {
  switch (action.type) {
    case userListConstants.GET_USER_LIST_REQUEST:
      return {
        loading: true
      };
    case userListConstants.GET_USER_LIST_SUCCESS:
      return {
        list: action.userList
      };
    case userListConstants.GET_USER_LIST_FAILURE:
      return { 
        error: action.error
      };

    case userListConstants.CREATE_USER_REQUEST:
      return {
        creating: true
      };
    case userListConstants.CREATE_USER_SUCCESS:
      return {
        user: action.user
      };
    case userListConstants.CREATE_USER_FAILURE:
      return {
        error: action.error
      };

    default:
      return state
  }
}