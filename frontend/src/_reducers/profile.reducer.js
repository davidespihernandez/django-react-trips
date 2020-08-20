import { profileConstants } from '../_constants';

export function profile(state = {}, action) {
  switch (action.type) {
    case profileConstants.GET_PROFILE_REQUEST:
      return {
        loading: true,
      };
    case profileConstants.GET_PROFILE_SUCCESS:
      return {
        profile: action.profile,
      };
    case profileConstants.GET_PROFILE_FAILURE:
      return {
        error: action.error,
      };
    case profileConstants.UPDATE_PROFILE_REQUEST:
      return { ...state, updating: true, error: null };
    case profileConstants.UPDATE_PROFILE_SUCCESS:
      return {
        profile: action.profile,
      };
    case profileConstants.UPDATE_PROFILE_FAILURE:
      return {
        ...state,
        error: action.error,
        updating: false,
      };
    default:
      return state
  }
}